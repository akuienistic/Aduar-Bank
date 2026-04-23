import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Home, PiggyBank, FileEdit, Building2, ChevronRight } from "lucide-react";
import logo from "@/assets/aduar-logo.jpg";
import { useLang } from "@/lib/i18n";

const quickLinks = [
  { to: "/", labelKey: "nav.home" as const, icon: Home },
  { to: "/products", labelKey: "nav.products" as const, icon: PiggyBank },
  { to: "/apply", labelKey: "nav.apply" as const, icon: FileEdit },
  { to: "/about", labelKey: "nav.about" as const, icon: Building2 },
  { to: "/contact", labelKey: "nav.contact" as const, icon: Phone },
] as const;

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-trust text-trust-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Aduar Bank"
              className="h-12 w-12 rounded-full bg-white object-contain p-1"
            />
            <div>
              <div className="font-heading text-lg font-bold">Aduar Bank</div>
              <div className="text-xs opacity-80">Microfinance & Community Development</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed opacity-90">{t("footer.about")}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
            {t("footer.quick")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.to}>
                  <Link
                    to={q.to}
                    className="group inline-flex items-center gap-2 opacity-90 transition hover:opacity-100 hover:no-underline"
                  >
                    <Icon className="h-4 w-4 stroke-[2.5] text-white" />
                    <span>{t(q.labelKey)}</span>
                    <ChevronRight className="h-3 w-3 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
            {t("footer.connect")}
          </h3>
          <p className="mt-4 text-sm opacity-90">Follow our work and stories from the field.</p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://web.facebook.com/profile.php?id=61570645412095"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="rounded-full bg-white/10 p-2 transition hover:bg-warm"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="rounded-full bg-white/10 p-2 transition hover:bg-warm"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs opacity-90 md:flex-row md:px-6">
          <p>
            © {year} Aduar Bank. {t("footer.rights")}
          </p>
          <p>
            {t("footer.built")}{" "}
            <a
              href="https://www.linkedin.com/in/simon-akuien-atem-710895290/"
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-warm underline-offset-2 hover:underline"
            >
              Simon Star Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
