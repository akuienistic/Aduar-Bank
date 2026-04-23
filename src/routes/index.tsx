import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, MapPinned, Users, ArrowRight, Quote, Phone, Sprout, ShoppingBasket, Hammer, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Loader } from "@/components/Loader";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import marketImg from "@/assets/juba-market.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aduar Bank — Investing in South Sudan's Entrepreneurs" },
      { name: "description", content: "Collateral-free microfinance loans for rural farmers, market women, and small business owners across South Sudan." },
      { property: "og:title", content: "Aduar Bank — Microfinance for South Sudan" },
      { property: "og:description", content: "Built on trust, not paperwork. Apply for a loan or partner with us today." },
    ],
  }),
  component: HomePage,
});

const stories = [
  { name: "Mary Achol", business: "Vegetable Trader", quote: "With my first loan, I doubled my stall in Konyokonyo Market. Now I employ my sister.", icon: ShoppingBasket },
  { name: "Peter Deng", business: "Sorghum Farmer", quote: "Aduar believed in me when no one else would. My harvest fed three villages this season.", icon: Sprout },
  { name: "Grace Nyandeng", business: "Tailor & Trainer", quote: "I bought a second sewing machine and now train four young women each year.", icon: Hammer },
];

const officers = [
  { region: "Juba (Central Equatoria)", name: "John Lado", phone: "+211 920 100 001" },
  { region: "Wau (Western Bahr el Ghazal)", name: "Rebecca Akon", phone: "+211 920 100 002" },
  { region: "Bor (Jonglei)", name: "Daniel Majok", phone: "+211 920 100 003" },
  { region: "Yambio (Western Equatoria)", name: "Esther Poni", phone: "+211 920 100 004" },
];

function HomePage() {
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [storyIdx, setStoryIdx] = useState(0);

  useEffect(() => {
    const tm = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (loading) return;
    const id = setInterval(() => setStoryIdx((i) => (i + 1) % stories.length), 5000);
    return () => clearInterval(id);
  }, [loading]);

  if (loading) return <SiteLayout><Loader /></SiteLayout>;

  const story = stories[storyIdx];
  const StoryIcon = story.icon;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="border-b border-border bg-trust">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <Badge className="bg-warm text-warm-foreground hover:bg-warm">
              <Sparkles className="mr-1 h-3 w-3" /> {t("hero.tag")}
            </Badge>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-trust-foreground md:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-trust-foreground/85 md:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-warm text-warm-foreground hover:bg-warm/90">
                <Link to="/apply">{t("hero.cta1")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
                <Link to="/contact">{t("hero.cta2")}</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/10 text-trust-foreground hover:bg-white/15">$100 – $500 loans</Badge>
              <Badge variant="secondary" className="bg-white/10 text-trust-foreground hover:bg-white/15">Collateral-free</Badge>
              <Badge variant="secondary" className="bg-white/10 text-trust-foreground hover:bg-white/15">Rural focus</Badge>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
              <img
                src={marketImg}
                alt="Vendors at a local market in Juba, South Sudan"
                loading="lazy"
                className="aspect-4/5 w-full object-cover lg:aspect-4/5"
              />
            </div>
            <div className="absolute -bottom-3 -left-3 hidden rounded-xl bg-warm px-4 py-2 text-warm-foreground shadow-lg md:block">
              <p className="font-heading text-xs uppercase tracking-wider">Konyokonyo Market</p>
              <p className="text-sm font-semibold">Juba, South Sudan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-trust md:text-3xl">{t("diff.title")}</h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-warm" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: t("diff.1.title"), desc: t("diff.1.desc"), color: "bg-growth/10 text-growth" },
            { icon: MapPinned, title: t("diff.2.title"), desc: t("diff.2.desc"), color: "bg-warm/10 text-warm" },
            { icon: Users, title: t("diff.3.title"), desc: t("diff.3.desc"), color: "bg-trust/10 text-trust" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} className="border-border p-6 transition hover:shadow-(--shadow-soft)">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Impact stories */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-trust md:text-3xl">{t("impact.title")}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{t("impact.subtitle")}</p>
          </div>

          <Card className="mx-auto mt-10 max-w-3xl overflow-hidden border-border">
            <div className="grid md:grid-cols-[180px_1fr]">
              <div className="flex aspect-square items-center justify-center bg-linear-to-br from-warm/20 to-sun/30 md:aspect-auto">
                <div className="rounded-full bg-white/80 p-6 shadow-md">
                  <StoryIcon className="h-12 w-12 text-warm" />
                </div>
              </div>
              <div className="p-6 md:p-8">
                <Quote className="h-6 w-6 text-warm" />
                <p className="mt-3 font-heading text-lg leading-relaxed text-foreground">"{story.quote}"</p>
                <div className="mt-5">
                  <p className="font-semibold text-trust">{story.name}</p>
                  <p className="text-sm text-muted-foreground">{story.business}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-5 flex justify-center gap-2">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setStoryIdx(i)}
                aria-label={`Story ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === storyIdx ? "w-8 bg-warm" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Field officers */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-trust md:text-3xl">{t("officers.title")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{t("officers.subtitle")}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {officers.map((o) => (
            <Card key={o.region} className="border-border p-4 transition hover:border-warm">
              <div className="flex items-start gap-2">
                <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-warm" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{o.region}</p>
                  <p className="mt-1 font-heading font-semibold text-trust">{o.name}</p>
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-foreground hover:text-warm">
                    <Phone className="h-3.5 w-3.5" /> {o.phone}
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
