import { Icon } from "@/components/ui/icon";

export function SpecList({
  title,
  items,
  icon = "check",
  muted = false,
}: {
  title: string;
  items: string[];
  icon?: string;
  muted?: boolean;
}) {
  return (
    <section>
      <h2 className="text-3xl font-black text-ink">{title}</h2>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div key={item} className={muted ? "flex gap-3 rounded-lg border border-line bg-canvas p-4" : "flex gap-3 rounded-lg border border-line bg-white p-4 shadow-soft"}>
            <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="text-sm leading-6 text-slate">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
