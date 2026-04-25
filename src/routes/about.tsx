import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  Target,
  Eye,
  Heart,
  FileText,
  Linkedin,
  Mail,
  Award,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ayuen from "@/assets/The Founder.jpg";
import david from "@/assets/The Manager.jpg";
import simon from "@/assets/Simon The Developer.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Transparency — Aduar Bank" },
      {
        name: "description",
        content:
          "Our mission, leadership, and annual reports. Aduar Bank serves rural South Sudan with collateral-free microfinance.",
      },
      { property: "og:title", content: "About Aduar Bank — Mission, Team, Reports" },
      {
        property: "og:description",
        content: "Meet the leadership and download our annual reports.",
      },
    ],
  }),
  component: AboutPage,
});

const team = [
  {
    name: "Ayuen Garang Ajok",
    role: "Founder & CEO",
    photo: ayuen,
    location: "Virginia, USA",
    icon: GraduationCap,
    tag: "Founder",
    bio: "A 'Lost Boy of Sudan' turned economist. MPA from Cornell, former World Bank analyst, and co-founder of Sawa Sawa Network.",
    linkedin: "",
  },
  {
    name: "David Nhial Kuol Garang",
    role: "Co-Founder & General Manager",
    photo: david,
    location: "Cairo, Egypt",
    icon: Briefcase,
    tag: "Operations",
    bio: "Leads day-to-day operations and field officers across South Sudan, ensuring loans truly serve rural communities.",
    linkedin: "",
  },
  {
    name: "Simon Akuien Atem",
    role: "Lead Developer & Digital Strategist",
    photo: simon,
    location: "Addis Ababa, Ethiopia",
    icon: Code2,
    tag: "Technology",
    bio: "Builds the bank's digital platforms, blending software engineering, branding, and strategy to widen access to finance.",
    linkedin: "https://www.linkedin.com/in/simon-akuien-atem-710895290/",
  },
];

const reports = [
  { year: "2024", title: "Annual Impact Report 2024", size: "2.1 MB" },
  { year: "2023", title: "Annual Impact Report 2023", size: "1.8 MB" },
  { year: "2022", title: "Annual Impact Report 2022", size: "1.6 MB" },
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* Mission */}
      <section className="relative overflow-hidden border-b-4 border-warm bg-trust">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <Badge className="bg-warm text-warm-foreground hover:bg-warm">
            <ShieldCheck className="mr-1 h-3 w-3" /> Our Mission
          </Badge>
          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-trust-foreground md:text-5xl">
            Banking that believes in people first.
          </h1>
          <p className="mt-4 max-w-2xl text-trust-foreground/85">
            Aduar Bank exists to unlock the economic potential of South Sudan's rural communities
            through ethical microfinance, training, and grassroots partnership.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-warm">
                About Aduar Bank
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-trust md:text-4xl">
                A values-driven rural finance partner for South Sudan.
              </h2>
            </div>
            <div className="rounded-full bg-warm/10 px-4 py-2 text-sm font-semibold text-warm">
              Founded 20 March, 2026
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
            Aduar Bank was founded to bring ethical, collateral-free microfinance to underserved
            communities in South Sudan. We combine local field experience, financial education, and
            digital access so rural entrepreneurs can grow businesses, build resilience, and connect
            to formal markets without sacrificing dignity.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Mission",
              text: "Provide collateral-free microfinance and training to vulnerable rural entrepreneurs across South Sudan.",
            },
            {
              icon: Eye,
              title: "Vision",
              text: "A South Sudan where every entrepreneur — regardless of geography or gender — can access dignified capital.",
            },
            {
              icon: Heart,
              title: "Values",
              text: "Trust, transparency, community, resilience, and the long view. Always.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.title} className="border-border p-6">
                <Icon className="h-6 w-6 text-warm" />
                <h3 className="mt-3 font-heading text-lg font-semibold text-trust">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-heading text-2xl font-bold text-trust md:text-3xl">Leadership</h2>
          <p className="mt-2 text-muted-foreground">The master minds behind Aduar Bank.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((m) => {
              const RoleIcon = m.icon;
              return (
                <Card
                  key={m.name}
                  className="group flex flex-col overflow-hidden border-border p-0 transition hover:-translate-y-1 hover:shadow-(--shadow-soft)"
                >
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-sand">
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge className="bg-warm text-warm-foreground hover:bg-warm">
                        <Award className="mr-1 h-3 w-3" /> {m.tag}
                      </Badge>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-trust/95 via-trust/60 to-transparent p-4">
                      <h3 className="font-heading text-lg font-bold text-trust-foreground">
                        {m.name}
                      </h3>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-trust-foreground/90">
                        <RoleIcon className="h-3.5 w-3.5" /> {m.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-warm" /> {m.location}
                    </p>
                    <p className="mt-3 line-clamp-4 min-h-20 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {m.bio}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <Badge variant="secondary" className="text-[10px]">
                        <Users className="mr-1 h-3 w-3" /> Leadership Team
                      </Badge>
                      <div className="flex items-center gap-2">
                        <a
                          href={m.linkedin || undefined}
                          target={m.linkedin ? "_blank" : undefined}
                          rel={m.linkedin ? "noreferrer" : undefined}
                          aria-label={`${m.name} on LinkedIn`}
                          onClick={(e) => {
                            if (!m.linkedin) e.preventDefault();
                          }}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-trust/10 text-trust transition ${m.linkedin ? "hover:bg-trust hover:text-trust-foreground" : "cursor-not-allowed opacity-60"}`}
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          aria-label={`Email ${m.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-warm/10 text-warm transition hover:bg-warm hover:text-warm-foreground"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <h2 className="font-heading text-2xl font-bold text-trust md:text-3xl">Annual Reports</h2>
        <p className="mt-2 text-muted-foreground">Transparency for our partners and donors.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reports.map((r) => (
            <Card
              key={r.year}
              className="flex items-start gap-4 border-border p-5 transition hover:border-warm"
            >
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warm/10 text-warm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {r.year}
                </p>
                <h3 className="font-heading font-semibold text-trust">{r.title}</h3>
                <p className="text-xs text-muted-foreground">PDF · {r.size}</p>
                <Button size="sm" variant="outline" className="mt-3" asChild>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Download className="mr-1 h-3.5 w-3.5" /> Download
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
