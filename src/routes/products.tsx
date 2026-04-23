import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sprout, ShoppingBasket, Hammer, GraduationCap, Tractor, HeartHandshake, Calculator, ArrowRight, DollarSign, PackageOpen } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "What We Offer — Aduar Bank Loan Products" },
      { name: "description", content: "Farmer's Support Loan, Women's Market Loan, Youth Enterprise Loan and more. Simple terms, fair rates, designed for South Sudan." },
      { property: "og:title", content: "Loan Products — Aduar Bank" },
      { property: "og:description", content: "Collateral-free loans built around how you really earn." },
    ],
  }),
  component: ProductsPage,
});

const products = [
  { icon: Sprout, title: "Farmer's Support Loan", range: "$200 – $500", term: "6–12 months", desc: "Seeds, tools, irrigation, and harvest-aligned repayment.", tag: "Popular" },
  { icon: ShoppingBasket, title: "Women's Market Loan", range: "$100 – $400", term: "3–9 months", desc: "Stock for market traders, with weekly low-touch repayments.", tag: "Featured" },
  { icon: Hammer, title: "Artisan & Trades Loan", range: "$200 – $500", term: "6–12 months", desc: "Tools, machines, and workshop space for skilled artisans." },
  { icon: Tractor, title: "Group Cooperative Loan", range: "$300 – $500", term: "12 months", desc: "For 5+ member groups guaranteeing each other socially." },
  { icon: GraduationCap, title: "Youth Enterprise Loan", range: "$100 – $300", term: "6 months", desc: "First-time borrowers under 30 with a viable idea.", tag: "New" },
  { icon: HeartHandshake, title: "Emergency Bridge Loan", range: "$100 – $250", term: "3 months", desc: "For unexpected health or family hardship — fast review." },
];

function ProductsPage() {
  const { t } = useLang();
  const [amount, setAmount] = useState(250);
  const [months, setMonths] = useState(6);

  const { monthly, total } = useMemo(() => {
    // Flat 2% per month service fee
    const fee = amount * 0.02 * months;
    const totalRepay = amount + fee;
    return { monthly: Math.round(totalRepay / months), total: Math.round(totalRepay) };
  }, [amount, months]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="bg-warm text-warm-foreground hover:bg-warm">
            <DollarSign className="mr-1 h-3 w-3" /> USD Loans · $100 – $500
          </Badge>
          <h1 className="mt-3 flex items-center gap-3 font-heading text-3xl font-bold text-trust md:text-4xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warm/10 text-warm md:h-12 md:w-12">
              <PackageOpen className="h-5 w-5 md:h-6 md:w-6" />
            </span>
            {t("products.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("products.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} className="group relative flex flex-col border-border p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                {p.tag && (
                  <Badge className="absolute right-4 top-4 bg-growth text-growth-foreground hover:bg-growth">{p.tag}</Badge>
                )}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-warm/10 text-warm transition group-hover:bg-warm group-hover:text-warm-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-trust">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Amount</dt>
                    <dd className="font-medium">{p.range}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Term</dt>
                    <dd className="font-medium">{p.term}</dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Card className="overflow-hidden border-border">
            <div className="flex items-center gap-3 border-b border-border bg-trust px-6 py-4 text-trust-foreground">
              <Calculator className="h-5 w-5" />
              <h2 className="font-heading text-lg font-semibold">{t("products.calc.title")}</h2>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-medium">{t("products.calc.amount")}</label>
                  <span className="font-heading text-xl font-bold text-warm">${amount.toLocaleString()}</span>
                </div>
                <Slider
                  value={[amount]}
                  onValueChange={([v]) => setAmount(v)}
                  min={100}
                  max={500}
                  step={10}
                  className="mt-3"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>$100</span><span>$500</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-medium">{t("products.calc.months")}</label>
                  <span className="font-heading text-xl font-bold text-warm">{months} months</span>
                </div>
                <Slider
                  value={[months]}
                  onValueChange={([v]) => setMonths(v)}
                  min={3}
                  max={12}
                  step={1}
                  className="mt-3"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>3</span><span>12</span>
                </div>
              </div>

              <div className="grid gap-3 rounded-xl bg-sand p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("products.calc.monthly")}</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-trust">${monthly.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("products.calc.total")}</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-growth">${total.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{t("products.calc.note")}</p>

              <Button asChild className="w-full bg-warm text-warm-foreground hover:bg-warm/90">
                <Link to="/apply">Apply for this loan <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
