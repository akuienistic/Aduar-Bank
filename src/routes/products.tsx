import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sprout,
  ShoppingBasket,
  Hammer,
  GraduationCap,
  Tractor,
  HeartHandshake,
  ArrowRight,
  DollarSign,
  PackageOpen,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "What We Offer. Aduar Bank Loan Products" },
      {
        name: "description",
        content:
          "Collateral-free loans built around how you really earn. Flexible terms for every market",
      },
      { property: "og:title", content: "Loan Products. Aduar Bank" },
      {
        property: "og:description",
        content: "Collateral-free loans built around how you really earn.",
      },
    ],
  }),
  component: ProductsPage,
});

const products = [
  {
    icon: Sprout,
    title: "Farmer's Support Loan",
    range: "Coming soon",
    term: "Coming soon",
    desc: "Grow your farm with working capital for seeds, tools, and irrigation, plus a repayment plan timed to your harvest cycle.",
    tag: "Popular",
  },
  {
    icon: ShoppingBasket,
    title: "Women's Market Loan",
    range: "Coming soon",
    term: "Coming soon",
    desc: "Stock inventory for market traders, improve cash flow, and build a more reliable business with weekly low-touch repayments.",
    tag: "Featured",
  },
  {
    icon: Hammer,
    title: "Artisan & Trades Loan",
    range: "Coming soon",
    term: "Coming soon",
    desc: "Invest in tools, machinery, or workshop space to scale your craftsmanship and serve more customers with confidence.",
  },
  {
    icon: Tractor,
    title: "Group Cooperative Loan",
    range: "Coming soon",
    term: "Coming soon",
    desc: "Support group-led enterprises with credit that rewards social guarantees and shared commitment across 5+ members.",
  },
  {
    icon: GraduationCap,
    title: "Youth Enterprise Loan",
    range: "Coming soon",
    term: "Coming soon",
    desc: "Empower young entrepreneurs under 30 with startup capital for a viable business idea and mentorship-ready terms.",
    tag: "New",
  },
  {
    icon: HeartHandshake,
    title: "Emergency Bridge Loan",
    range: "Coming soon",
    term: "Coming soon",
    desc: "Access fast funding for urgent health or family hardship, with a simplified application and quick review process.",
  },
];

function ProductsPage() {
  const { t } = useLang();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="bg-warm text-warm-foreground hover:bg-warm">
            <DollarSign className="mr-1 h-3 w-3" /> Range of the Loans · Coming Soon
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
              <Card
                key={p.title}
                className="group relative flex flex-col border-border p-6 transition hover:-translate-y-0.5 hover:shadow-(--shadow-soft)"
              >
                {p.tag && (
                  <Badge className="absolute right-4 top-4 bg-growth text-growth-foreground hover:bg-growth">
                    {p.tag}
                  </Badge>
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
                    <dt className="text-muted-foreground">Term of Repayment</dt>
                    <dd className="font-medium">{p.term}</dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Card className="border-border p-10 text-center">
            <h2 className="font-heading text-2xl font-semibold text-trust">
              Loan Calculator Coming Soon
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our loan calculator is under development and will be available soon to help you
              estimate monthly payments and total repayment.
            </p>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
