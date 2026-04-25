import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  MapPin,
  Coins,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Loan — Aduar Bank" },
      {
        name: "description",
        content:
          "Four short steps. No documents needed today. Apply for a collateral-free loan with Aduar Bank.",
      },
      { property: "og:title", content: "Apply for a Loan — Aduar Bank" },
      { property: "og:description", content: "Simple, mobile-friendly loan application." },
    ],
  }),
  component: ApplyPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z.string().trim().min(7, "Phone number is too short").max(20),
  village: z.string().trim().min(2, "Please enter your village").max(80),
  region: z.string().trim().min(2, "Please enter your region").max(80),
  amount: z.coerce.number().min(100, "Minimum $100").max(500, "Maximum $500"),
  loanType: z.string().trim().min(2, "Please choose a loan type").max(60),
  purpose: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(500),
});

type FormValues = z.infer<typeof schema>;

const steps = [
  { title: "Who are you?", icon: User, fields: ["fullName", "phone"] as const },
  { title: "Where do you live?", icon: MapPin, fields: ["village", "region"] as const },
  { title: "How much do you need?", icon: Coins, fields: ["amount", "loanType"] as const },
  { title: "What is it for?", icon: Briefcase, fields: ["purpose"] as const },
];

function ApplyPage() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      village: "",
      region: "",
      amount: 250,
      loanType: "Farmer's Support Loan",
      purpose: "",
    },
  });

  const next = async () => {
    const fields = steps[step].fields;
    const ok = await form.trigger(fields);
    if (!ok) {
      toast.error("Please fix the highlighted fields", { icon: <Sparkles className="h-4 w-4" /> });
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = (values: FormValues) => {
    console.log("Loan application:", values);
    setDone(true);
    toast.success("Application received! A field officer will call you within 2 working days.", {
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-20 md:px-6">
          <Card className="border-border p-8 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-growth/15 text-growth">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold text-trust">
              Thank you, {form.getValues("fullName").split(" ")[0]}!
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your application has been received. A field officer will call{" "}
              <strong>{form.getValues("phone")}</strong> within 2 working days.
            </p>
            <Button
              onClick={() => {
                setDone(false);
                setStep(0);
                form.reset();
              }}
              className="mt-6 bg-warm text-warm-foreground hover:bg-warm/90"
            >
              Submit another application
            </Button>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  const Icon = steps[step].icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40 py-10">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <h1 className="font-heading text-3xl font-bold text-trust md:text-4xl">
            {t("apply.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("apply.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-warm transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Card className="border-border p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-trust/10 text-trust">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-semibold">{steps[step].title}</h2>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 0 && (
              <>
                <Field label="Full name" error={form.formState.errors.fullName?.message}>
                  <Input {...form.register("fullName")} placeholder="e.g. Mary Achol Deng" />
                </Field>
                <Field label="Phone number" error={form.formState.errors.phone?.message}>
                  <Input
                    type="tel"
                    {...form.register("phone")}
                    placeholder="e.g. +211 920 000 000"
                  />
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Village or town" error={form.formState.errors.village?.message}>
                  <Input {...form.register("village")} placeholder="e.g. Konyokonyo" />
                </Field>
                <Field label="Region or state" error={form.formState.errors.region?.message}>
                  <Input {...form.register("region")} placeholder="e.g. Central Equatoria" />
                </Field>
              </>
            )}
            {step === 2 && (
              <>
                <Field
                  label="Loan amount needed (USD, $100 – $500)"
                  error={form.formState.errors.amount?.message}
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={100}
                    max={500}
                    {...form.register("amount")}
                  />
                </Field>
                <Field label="Loan type" error={form.formState.errors.loanType?.message}>
                  <select
                    {...form.register("loanType")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>Farmer's Support Loan</option>
                    <option>Women's Market Loan</option>
                    <option>Artisan & Trades Loan</option>
                    <option>Group Cooperative Loan</option>
                    <option>Youth Enterprise Loan</option>
                    <option>Emergency Bridge Loan</option>
                  </select>
                </Field>
              </>
            )}
            {step === 3 && (
              <Field label="Business purpose" error={form.formState.errors.purpose?.message}>
                <Textarea
                  rows={5}
                  {...form.register("purpose")}
                  placeholder="Briefly describe how you will use this loan..."
                />
              </Field>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>

              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="bg-trust text-trust-foreground hover:opacity-90"
                >
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-warm text-warm-foreground hover:bg-warm/90">
                  Submit application <CheckCircle2 className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prefer to talk? Field officer contact is yet to be assigned:{" "}
          <span className="text-warm">
            <Phone className="mr-1 inline h-3 w-3" />
            Yet to be assigned
          </span>
        </p>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
