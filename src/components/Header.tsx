import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Home, PiggyBank, FileEdit, Building2, Phone, Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/aduar-logo.jpg";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", labelKey: "nav.home" as const, icon: Home },
  { to: "/products", labelKey: "nav.products" as const, icon: PiggyBank },
  { to: "/apply", labelKey: "nav.apply" as const, icon: FileEdit },
  { to: "/about", labelKey: "nav.about" as const, icon: Building2 },
  { to: "/contact", labelKey: "nav.contact" as const, icon: Phone },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Aduar Bank" className="h-10 w-10 rounded-full object-contain" />
            <div className="leading-tight">
              <div className="font-heading text-base font-bold text-trust">Aduar Bank</div>
              <div className="text-[10px] text-muted-foreground">Microfinance & Community</div>
            </div>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.to !== "/" && location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition",
                    active ? "bg-trust text-trust-foreground" : "text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button asChild className="bg-warm text-warm-foreground hover:bg-warm/90">
              <Link to="/apply">
                Apply Now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar — half screen */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-1/2 min-w-55 flex-col bg-sidebar text-sidebar-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-sidebar-border p-4">
              <div className="flex items-center gap-2">
                <img src={logo} alt="" className="h-8 w-8 rounded-full bg-white object-contain" />
                <span className="font-heading text-sm font-bold">Aduar Bank</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded p-1 hover:bg-sidebar-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.to !== "/" && location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-sidebar-border p-3">
              <Button asChild className="w-full bg-warm text-warm-foreground hover:bg-warm/90">
                <Link to="/apply" onClick={() => setOpen(false)}>
                  Apply Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
