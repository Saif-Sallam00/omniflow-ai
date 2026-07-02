import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Project } from "@shared/schema";
import { useLocation, Link } from "wouter";
import { ObjectUploader } from "@/components/ObjectUploader";
import { CATEGORIES, CATEGORY_LABELS } from "@shared/taxonomy";
import { onImageError } from "@/lib/placeholder";
import { useDocumentTitle } from "@/hooks/use-document-title";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

// Icons
import { Plus, Edit, Trash2, LogOut, LayoutGrid, CheckCircle2, Star, Zap, Eye, Code } from "lucide-react";

// --- FORM SCHEMA ---
const projectFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  client: z.string().min(2, "Client name is required"),
  category: z.enum(CATEGORIES),
  description: z.string().min(10, "Short description is required"),
  challenge: z.string().min(10, "Challenge details are required"),
  solution: z.string().min(10, "Solution details are required"),
  resultsString: z.string().min(5, "Add at least one result (one per line)"),
  technologiesString: z.string().min(2, "Add tech stack (one per line)"),
  image: z.string().min(1, "Upload an image or provide a URL"),
  isFeatured: z.boolean().default(false),
  isServiceShowcase: z.boolean().default(false),
  showOnServicePage: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function Dashboard() {
  useDocumentTitle("Admin — Portfolio");
  const { user, logout } = useUser();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- FETCH PROJECTS ---
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // --- FORM SETUP ---
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      client: "",
      category: CATEGORIES[0],
      description: "",
      challenge: "",
      solution: "",
      resultsString: "",
      technologiesString: "",
      image: "",
      isFeatured: false,
      isServiceShowcase: false,
      showOnServicePage: false,
    },
  });

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const payload = {
        ...data,
        results: data.resultsString.split('\n').filter(line => line.trim() !== ""),
        technologies: data.technologiesString.split('\n').filter(line => line.trim() !== ""),
      };
      const { resultsString, technologiesString, ...cleanPayload } = payload;
      return await apiRequest("POST", "/api/projects", cleanPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project added to portfolio" });
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProjectFormValues }) => {
      const payload = {
        ...data,
        results: data.resultsString.split('\n').filter(line => line.trim() !== ""),
        technologies: data.technologiesString.split('\n').filter(line => line.trim() !== ""),
      };
      const { resultsString, technologiesString, ...cleanPayload } = payload;
      return await apiRequest("PATCH", `/api/projects/${id}`, cleanPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Updated", description: "Project details updated successfully" });
      setIsDialogOpen(false);
      setEditingProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Deleted", description: "Project removed from portfolio" });
      setDeletingId(null);
    },
  });

  // --- HANDLERS ---
  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      form.reset({
        title: project.title,
        client: project.client,
        category: project.category,
        description: project.description,
        challenge: project.challenge,
        solution: project.solution,
        image: project.image,
        resultsString: project.results.join('\n'),
        technologiesString: project.technologies.join('\n'),
        isFeatured: project.isFeatured || false,
        isServiceShowcase: project.isServiceShowcase || false,
        showOnServicePage: project.showOnServicePage || false,
      });
    } else {
      setEditingProject(null);
      form.reset({
        title: "",
        client: "",
        category: CATEGORIES[0],
        description: "",
        challenge: "",
        solution: "",
        resultsString: "",
        technologiesString: "",
        image: "",
        isFeatured: false,
        isServiceShowcase: false,
        showOnServicePage: false,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6 shadow-sm">
        <h1 className="text-xl font-bold font-display">Omniflow<span className="text-amber-500">CMS</span></h1>
        <nav className="hidden sm:flex items-center gap-1 ml-4">
          <Link href="/admin/dashboard">
            <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-900 cursor-pointer">Portfolio</span>
          </Link>
          <Link href="/admin/leads">
            <span className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer">Leads</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Portfolio</h2>
          <Button onClick={() => handleOpenDialog()} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Card key={project.id} className="group overflow-hidden">
                <div className="aspect-video relative bg-slate-100 overflow-hidden">
                   <img
                     src={project.image}
                     alt={project.title}
                     loading="lazy"
                     decoding="async"
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                     onError={onImageError}
                   />
                   <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                     {project.isFeatured && <Badge className="bg-amber-500 text-white"><Star className="w-3 h-3 mr-1" /> Featured</Badge>}
                     {project.isServiceShowcase && <Badge className="bg-orange-500 text-white"><Zap className="w-3 h-3 mr-1" /> Showcase</Badge>}
                     {project.showOnServicePage && <Badge className="bg-blue-500 text-white"><Eye className="w-3 h-3 mr-1" /> Service Page</Badge>}
                   </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleOpenDialog(project)}>Edit</Button>
                    <Button variant="destructive" size="icon" onClick={() => setDeletingId(project.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* === VISIBILITY TOGGLES === */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Home Page Featured */}
                <div className="border border-amber-100 bg-amber-50/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-amber-900 flex items-center gap-2"><Star className="w-4 h-4" /> Featured</div>
                    <FormField control={form.control} name="isFeatured" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>
                  <p className="text-xs text-amber-700/70">Show on Home Page "Recent Work"</p>
                </div>

                {/* 2. Service Showcase */}
                <div className="border border-orange-100 bg-orange-50/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-orange-900 flex items-center gap-2"><Zap className="w-4 h-4" /> Showcase</div>
                    <FormField control={form.control} name="isServiceShowcase" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>
                  <p className="text-xs text-orange-700/70">The main hero project on Services page (Max 1 per category)</p>
                </div>

                {/* 3. Show on Service Page */}
                <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-blue-900 flex items-center gap-2"><Eye className="w-4 h-4" /> Detail Page</div>
                    <FormField control={form.control} name="showOnServicePage" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>
                  <p className="text-xs text-blue-700/70">List this project in "Our Work" section of the service detail page</p>
                </div>
              </div>

              {/* === BASIC INFO === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input placeholder="Luxury Website" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="client" render={({ field }) => (
                  <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="Client Co." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="image" render={({ field }) => (
                   <FormItem><FormLabel>Image</FormLabel><FormControl><ObjectUploader currentImage={field.value} onUploadComplete={field.onChange} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="challenge" render={({ field }) => (
                    <FormItem><FormLabel>Challenge</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="solution" render={({ field }) => (
                    <FormItem><FormLabel>Solution</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="resultsString" render={({ field }) => (
                  <FormItem><FormLabel>Results (one per line)</FormLabel><FormControl><Textarea rows={4} className="font-mono" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="technologiesString" render={({ field }) => (
                  <FormItem><FormLabel>Technologies (one per line)</FormLabel><FormControl><Textarea rows={4} className="font-mono" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-amber-500 text-slate-900">{createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Project"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this project.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}