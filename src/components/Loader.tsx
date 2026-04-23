import logo from "@/assets/aduar-logo.jpg";

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-20 w-20 animate-pulse rounded-full bg-sand p-2 shadow-(--shadow-soft)">
          <img src={logo} alt="Aduar Bank" className="h-full w-full rounded-full object-contain" />
        </div>
        <div className="absolute inset-0 -m-2 animate-spin rounded-full border-2 border-transparent border-t-warm border-r-trust" />
      </div>
      <p className="font-heading text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
