import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Mail, Phone, MessageSquare, Send, MapPin, CheckCircle2, AlertCircle, Clock, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { sendContactMessage } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aduar Bank" },
      { name: "description", content: "Reach Aduar Bank for loans, partnerships, or media inquiries. We respond within 2 working days." },
      { property: "og:title", content: "Contact Aduar Bank" },
      { property: "og:description", content: "Get in touch — we respond within 2 working days." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z.string().trim().min(7, "Phone is too short").max(20).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Subject is too short").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});
type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const { t } = useLang();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await sendContactMessage(values);
      toast.success("Message sent! We'll be in touch within 2 working days.", {
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      form.reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send message. Please try again.", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const onInvalid = () => {
    toast.error("Please fix the highlighted fields", {
      icon: <AlertCircle className="h-4 w-4" />,
    });
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40 py-12">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Badge className="bg-warm text-warm-foreground hover:bg-warm">
            <Sparkles className="mr-1 h-3 w-3" /> We're here to help
          </Badge>
          <h1 className="mt-3 font-heading text-3xl font-bold text-trust md:text-4xl">{t("contact.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="grid gap-6 md:grid-cols-5">
          {/* Info — 2 cols */}
          <div className="space-y-4 md:col-span-2">
            <Card className="border-border p-5">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm/10 text-warm">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Head Office</p>
                  <p className="mt-1 font-medium">Virginia, United States</p>
                  <p className="text-sm text-muted-foreground">Hampton Roads</p>
                </div>
              </div>
            </Card>
            <Card className="border-border p-5">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm/10 text-warm">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                  <a href="tel:+1 (202) 494-5114" className="mt-1 block font-medium hover:text-warm">+1 (202) 494-5114</a>
                </div>
              </div>
            </Card>
            <Card className="border-border p-5">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm/10 text-warm">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <a href="mailto:akuienatem80@gmail.com" className="mt-1 block font-medium hover:text-warm">akuienatem80@gmail.com</a>
                </div>
              </div>
            </Card>
            <Card className="border-border bg-trust p-5 text-trust-foreground">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80">Response time</p>
                  <p className="mt-1 font-medium">Within 2 working days</p>
                  <p className="text-sm opacity-80">Mon – Fri, 8:00 – 17:00 EAT</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Form — 3 cols */}
          <Card className="border-border p-6 md:col-span-3 md:p-8">
            <div className="mb-6 border-b border-border pb-4">
              <h2 className="font-heading text-xl font-semibold text-trust">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fill in the form and we'll get back to you shortly.</p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Your name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...form.register("name")} placeholder="Mary Achol" className="pl-9" />
                  </div>
                  {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" {...form.register("email")} placeholder="example@gmail.com" className="pl-9" />
                  </div>
                  {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="tel" {...form.register("phone")} placeholder="+211 920 000 000" className="pl-9" />
                  </div>
                  {form.formState.errors.phone && <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>}
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Subject</Label>
                  <div className="relative">
                    <MessageSquare className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...form.register("subject")} placeholder="Partnership inquiry" className="pl-9" />
                  </div>
                  {form.formState.errors.subject && <p className="mt-1 text-xs text-destructive">{form.formState.errors.subject.message}</p>}
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium">Message</Label>
                <Textarea rows={5} {...form.register("message")} placeholder="Tell us how we can help..." />
                {form.formState.errors.message && <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>}
              </div>

              <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                <Button type="submit" className="bg-warm text-warm-foreground hover:bg-warm/90">
                  <Send className="mr-2 h-4 w-4" /> Send message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
