import { useRef, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ARTICLE_LANGUAGES,
  ARTICLE_SOLUTIONS,
  type Article,
  type ArticleCard,
  type Project,
} from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";
import { onImageError } from "@/lib/placeholder";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { AdminNav } from "@/components/AdminNav";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, LogOut, ExternalLink, ImagePlus } from "lucide-react";

// Admin pages are intentionally English-only — internal tooling.

const NONE = "none"; // Select cannot hold "" as a value.

const articleFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase words separated by hyphens"),
  excerpt: z.string().min(20, "Excerpt is required — it is the LinkedIn preview text"),
  coverImage: z.string().min(1, "A cover image is required"),
  body: z.string().min(1, "Body is required"),
  language: z.enum(ARTICLE_LANGUAGES),
  published: z.boolean().default(false),
  relatedProjectId: z.string().default(NONE),
  relatedSolution: z.string().default(NONE),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

/** Title → URL slug. Editable afterwards; only auto-filled while creating. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const EMPTY: ArticleFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  body: "",
  language: "en",
  published: false,
  relatedProjectId: NONE,
  relatedSolution: NONE,
};

export default function AdminArticles() {
  useDocumentTitle("Admin — Articles");
  const { logout } = useUser();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleCard | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: articles, isLoading } = useQuery<ArticleCard[]>({
    queryKey: ["/api/articles/all"],
  });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: EMPTY,
  });

  const toPayload = (data: ArticleFormValues) => ({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    body: data.body,
    language: data.language,
    published: data.published,
    relatedProjectId: data.relatedProjectId === NONE ? null : Number(data.relatedProjectId),
    relatedSolution: data.relatedSolution === NONE ? null : data.relatedSolution,
  });

  // Plain fetch rather than apiRequest: apiRequest throws `"409: {json}"` on a
  // non-2xx, which would put a raw status line and a JSON blob in the toast.
  // A duplicate slug is an ordinary, explainable mistake and should read like
  // one.
  const send = async (method: "POST" | "PATCH", url: string, data: ArticleFormValues) => {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(toPayload(data)),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Request failed");
    }
    return res.json();
  };

  const onError = (err: Error) =>
    toast({ variant: "destructive", title: "Error", description: err.message });

  const createMutation = useMutation({
    mutationFn: (data: ArticleFormValues) => send("POST", "/api/articles", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Saved", description: "Article created" });
      setIsDialogOpen(false);
    },
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArticleFormValues }) =>
      send("PATCH", `/api/articles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Updated", description: "Article saved" });
      setIsDialogOpen(false);
      setEditing(null);
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Deleted", description: "Article removed" });
      setDeletingId(null);
    },
    onError,
  });

  const handleOpen = async (card?: ArticleCard) => {
    if (!card) {
      setEditing(null);
      form.reset(EMPTY);
      setIsDialogOpen(true);
      return;
    }
    // The list deliberately excludes `body`, so editing fetches the full row.
    const res = await fetch(`/api/articles/${card.slug}`, { credentials: "include" });
    if (!res.ok) return onError(new Error("Could not load that article"));
    const full: Article = await res.json();
    setEditing(card);
    form.reset({
      title: full.title,
      slug: full.slug,
      excerpt: full.excerpt,
      coverImage: full.coverImage,
      body: full.body,
      language: full.language,
      published: full.published,
      relatedProjectId: full.relatedProjectId ? String(full.relatedProjectId) : NONE,
      relatedSolution: full.relatedSolution ?? NONE,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ArticleFormValues) =>
    editing
      ? updateMutation.mutate({ id: editing.id, data })
      : createMutation.mutate(data);

  /** Inserts image markdown at the cursor so the base64 URI is never pasted
   *  by hand. Uses the same upload endpoint as project images. */
  const insertImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/objects/upload", { method: "POST", body, credentials: "include" });
    if (!res.ok) return onError(new Error("Upload failed"));
    const { url } = await res.json();

    const el = bodyRef.current;
    const current = form.getValues("body");
    const at = el?.selectionStart ?? current.length;
    const snippet = `\n\n![](${url})\n\n`;
    form.setValue("body", current.slice(0, at) + snippet + current.slice(at), {
      shouldDirty: true,
    });
  };

  const inputClass = "bg-slate-900 border-slate-800 text-white placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-slate-800 bg-[#0a0a0b]/90 px-6 backdrop-blur-sm">
        <h1 className="font-display text-xl font-bold text-white">
          Omniflow<span className="text-primary">CMS</span>
        </h1>
        <AdminNav active="articles" />
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => logout()} className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Articles</h2>
          <Button onClick={() => handleOpen()}>
            <Plus className="mr-2 h-4 w-4" /> New article
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-900" />)}
          </div>
        ) : !articles?.length ? (
          <p className="text-slate-400">No articles yet. Create the first one.</p>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <Card key={article.id} className="border-slate-800 bg-slate-950 text-white">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <img
                    src={article.coverImage}
                    alt=""
                    onError={onImageError}
                    className="h-16 w-28 flex-none rounded-md border border-slate-800 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-white">{article.title}</p>
                      <Badge variant={article.published ? "default" : "outline"} className={article.published ? "" : "border-slate-700 text-slate-400"}>
                        {article.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 uppercase text-slate-400">
                        {article.language}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500">/articles/{article.slug}</p>
                  </div>
                  <div className="flex flex-none gap-2">
                    <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button variant="outline" size="icon" onClick={() => handleOpen(article)} className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeletingId(article.id)} className="border-slate-700 bg-transparent text-slate-300 hover:bg-red-950 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* --- EDITOR --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit article" : "New article"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Body is Markdown. A YouTube link on its own line becomes an embed.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Title</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClass}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Only auto-fill while creating: changing a live URL
                        // discards whatever ranking and links it has earned.
                        if (!editing) form.setValue("slug", slugify(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">URL slug</FormLabel>
                  <FormControl><Input className={`${inputClass} font-mono`} {...field} /></FormControl>
                  <FormDescription className="text-slate-500">
                    /articles/{field.value || "…"} — avoid changing this once the article is live.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Excerpt</FormLabel>
                  <FormControl><Textarea rows={2} className={inputClass} {...field} /></FormControl>
                  <FormDescription className="text-slate-500">
                    Shown on the index card and used as the meta description and LinkedIn preview text. Keep it under ~155 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="coverImage" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Cover image</FormLabel>
                  <FormControl><ObjectUploader currentImage={field.value} onUploadComplete={field.onChange} /></FormControl>
                  <FormDescription className="text-slate-500">Also used as the LinkedIn preview image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="body" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-slate-300">Body (Markdown)</FormLabel>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-slate-400 hover:text-white">
                      <ImagePlus className="h-3.5 w-3.5" /> Insert image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) insertImage(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <FormControl>
                    <Textarea
                      rows={16}
                      className={`${inputClass} font-mono text-sm`}
                      {...field}
                      ref={(el) => {
                        field.ref(el);
                        bodyRef.current = el;
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    Link internally with relative paths — /services, /portfolio/3, /articles/other-post — so they stay in-app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="language" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className={inputClass}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="border-slate-800 bg-slate-900 text-white">
                        <SelectItem value="en" className="text-white focus:bg-slate-800 focus:text-white">English</SelectItem>
                        <SelectItem value="ar" className="text-white focus:bg-slate-800 focus:text-white">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-500">Shown only to readers on that language.</FormDescription>
                  </FormItem>
                )} />

                <FormField control={form.control} name="published" render={({ field }) => (
                  <FormItem className="flex flex-col justify-center">
                    <FormLabel className="text-slate-300">Published</FormLabel>
                    <FormControl>
                      <div className="flex h-10 items-center gap-3">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm text-slate-400">{field.value ? "Live" : "Draft"}</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-2">
                <FormField control={form.control} name="relatedProjectId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Next step — case study</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className={inputClass}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="border-slate-800 bg-slate-900 text-white">
                        <SelectItem value={NONE} className="text-white focus:bg-slate-800 focus:text-white">None</SelectItem>
                        {projects?.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)} className="text-white focus:bg-slate-800 focus:text-white">
                            {p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="relatedSolution" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Next step — solution</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className={inputClass}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="border-slate-800 bg-slate-900 text-white">
                        <SelectItem value={NONE} className="text-white focus:bg-slate-800 focus:text-white">None</SelectItem>
                        {ARTICLE_SOLUTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="text-white focus:bg-slate-800 focus:text-white">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? "Save changes" : "Create article"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="border-slate-800 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This cannot be undone. Any link you have already shared to it will 404.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
