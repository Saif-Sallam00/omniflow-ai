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
import { PILLARS, PILLAR_LABELS, CONTACT_EMAIL } from "@shared/taxonomy";

export default function Contact() {
  const { t } = useI18n();
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: PILLARS[2], // "software" — pillar slug from shared/taxonomy
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) =>
      apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent — we'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong — please try again, or email us directly.",
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
              Let's talk
            </h1>
            <p className="text-xl text-slate-400">
              Tell us about your business and what's slowing it down. We'll tell you honestly if we can help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
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
                            <FormLabel className="text-slate-300">Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-orange-500/50"
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
                            <FormLabel className="text-slate-300">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@company.com"
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-orange-500/50"
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
                            <FormLabel className="text-slate-300">Phone <span className="text-slate-500 text-xs">(optional)</span></FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+20 100 000 0000"
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-orange-500/50"
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
                            <FormLabel className="text-slate-300">Company <span className="text-slate-500 text-xs">(optional)</span></FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your Company"
                                {...field}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-orange-500/50"
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
                          <FormLabel className="text-slate-300">What do you need?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-950 border-slate-800 text-white focus:border-orange-500/50">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              {PILLARS.map((p) => (
                                <SelectItem key={p} value={p}>{PILLAR_LABELS[p]}</SelectItem>
                              ))}
                              <SelectItem value="other">Other</SelectItem>
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
                          <FormLabel className="text-slate-300">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project goals..."
                              className="min-h-32 resize-none bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-orange-500/50"
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
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Sending…" : "Send message"}
                      {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-6">
                <h3 className="font-bold text-lg text-white">Contact details</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-300">Email</p>
                      <p className="text-sm text-slate-500">
                        {CONTACT_EMAIL}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-300">Phone</p>
                      <p className="text-sm text-slate-500">
                        Available on request
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-300">Response Time</p>
                      <p className="text-sm text-slate-500">
                        Within 24 hours on business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-slate-900 border border-orange-500/20 p-6 space-y-4">
                <h3 className="font-bold text-lg text-white">
                  Quick Response Guarantee
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We typically respond to all inquiries within 24 hours during
                  business days. For urgent matters, please mention it in your
                  message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}