import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Loan — Aduar Bank" },
      {
        name: "description",
        content:
          "Loan applications are launching soon. In the meantime, contact Aduar Bank and we’ll guide you through next steps.",
      },
      { property: "og:title", content: "Apply for a Loan — Aduar Bank" },
      { property: "og:description", content: "Coming soon — a simple, mobile-friendly loan application." },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { t } = useLang();

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-secondary/40 py-12">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-warm/20 blur-3xl" />
          <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-trust/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 md:px-6">
          <Badge className="bg-warm text-warm-foreground hover:bg-warm">
            <Sparkles className="mr-1 h-3 w-3" /> Coming soon
          </Badge>
          <h1 className="mt-3 font-heading text-3xl font-bold text-trust md:text-4xl">
            {t("apply.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            We’re polishing a simple, mobile-first loan application. Until it’s live, contact us and we’ll guide you
            through the next steps.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="bg-warm text-warm-foreground hover:bg-warm/90">
              <Link to="/contact">
                Contact us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products">Explore our offers</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="grid gap-6 md:grid-cols-5">
          <Card className="border-border p-6 md:col-span-3 md:p-8">
            <div className="mb-6 border-b border-border pb-4">
              <h2 className="font-heading text-xl font-semibold text-trust">What to expect</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A clean, short flow designed for speed and clarity.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Feature
                title="Fewer steps"
                description="A short application with clear prompts and helpful validation."
              />
              <Feature title="Mobile-first" description="Optimized for low-bandwidth and small screens." />
              <Feature title="Fast follow-up" description="Get contacted by our team with next steps." />
              <Feature title="Secure by design" description="Your information is handled with care." />
            </div>

            <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-trust/10 text-trust">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-heading font-semibold text-trust">Launching soon</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We’re doing final checks for a smooth experience before we open applications.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4 md:col-span-2">
            <Card className="border-border bg-trust p-6 text-trust-foreground">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80">Guidance</p>
                  <p className="mt-1 font-medium">Need help right now?</p>
                  <p className="mt-2 text-sm opacity-80">
                    Reach out and we’ll advise you on the best loan product and requirements.
                  </p>
                  <div className="mt-4">
                    <Button asChild className="bg-warm text-warm-foreground hover:bg-warm/90">
                      <Link to="/contact">
                        Message us <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border p-6">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm/10 text-warm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Button asChild variant="outline" className="w-full">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warm/10 text-warm">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <div className="font-heading font-semibold text-trust">{title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
