import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { contactFormSchema, type ContactFormData } from "@shared/schema";
import { CONTACT_SERVICES, CONTACT_EMAIL, type ContactService } from "@shared/taxonomy";
import { useDocumentTitle } from "@/hooks/use-document-title";

/**
 * `?service=<id>` — set by the per-solution CTAs on the Solutions page so the
 * lead record carries which card produced the enquiry instead of it having to
 * be inferred from the message.
 *
 * Anything absent or unrecognised falls back to "not-sure". §6's rule stands:
 * the form must never pre-select a service on its own, because that silently
 * biases every lead. This only honours a choice the visitor actually made by
 * clicking a specific solution.
 */
function requestedService(): ContactService {
  if (typeof window === "undefined") return "not-sure";
  const param = new URLSearchParams(window.location.search).get("service");
  return CONTACT_SERVICES.includes(param as ContactService)
    ? (param as ContactService)
    : "not-sure";
}

export default function Contact() {
  const { t } = useI18n();
  useDocumentTitle("Contact");
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: requestedService(),
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) =>
      apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: t("contact.toast.success"),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t("contact.toast.error"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">
      <section className="py-20 md:py-24 relative">
        {/* Background Effect */}
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-orange-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6 text-white">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-slate-400">
              {t("contact.sub")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-8 shadow-card">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">{t("contact.name")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("contact.ph.name")}
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-brand-500/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">{t("contact.email")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t("contact.ph.email")}
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-brand-500/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">{t("contact.phone")} <span className="text-slate-500 text-xs">{t("contact.optional")}</span></FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder={t("contact.ph.phone")}
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-brand-500/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">{t("contact.company")} <span className="text-slate-500 text-xs">{t("contact.optional")}</span></FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("contact.ph.company")}
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-brand-500/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">{t("contact.service")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-950 border-slate-800 text-white focus:border-brand-500/50">
                                <SelectValue placeholder={t("contact.ph.service")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              {CONTACT_SERVICES.map((s) => (
                                <SelectItem key={s} value={s}>{t(`serviceOpt.${s}`)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">{t("contact.message")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("contact.ph.message")}
                              className="min-h-32 resize-none bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-brand-500/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary text-primary-foreground font-semibold"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? t("contact.submitting") : t("contact.submit")}
                      {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6 space-y-6 shadow-card">
                <h3 className="font-bold text-lg text-white">{t("contact.info")}</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-brand-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-300">{t("contact.emailLabel")}</p>
                      <p className="text-sm text-slate-400">
                        {CONTACT_EMAIL}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-brand-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-300">{t("contact.phoneLabel")}</p>
                      <p className="text-sm text-slate-400">
                        {t("contact.phoneVal")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-300">{t("contact.responseLabel")}</p>
                      <p className="text-sm text-slate-400">
                        {t("contact.responseVal")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-brand-500/10 to-slate-900 border border-brand-500/20 p-6 space-y-4 shadow-card">
                <h3 className="font-bold text-lg text-white">
                  {t("contact.quick.title")}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t("contact.quick.body")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}