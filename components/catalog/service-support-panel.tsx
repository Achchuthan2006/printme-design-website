import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";
import { PrintProduct } from "@/types";

function buildPrimaryAction(product: PrintProduct) {
  if (product.ctaMode === "direct-order") {
    return { label: "Start My Order", href: "#order-builder" };
  }

  if (product.ctaMode === "upload-first") {
    return { label: "Upload My Artwork", href: `/quote-request?service=${product.slug}#upload` };
  }

  if (product.ctaMode === "contact") {
    return { label: "Call PrintMe", href: siteConfig.phoneHref };
  }

  return { label: "Request a Quote", href: `/quote-request?service=${product.slug}` };
}

export function ServiceSupportPanel({ product }: { product: PrintProduct }) {
  const primaryAction = buildPrimaryAction(product);

  return (
    <section className="surface-card p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Need help choosing the right path?</p>
      <h2 className="mt-2 text-2xl font-black text-ink">We can help before the order feels risky.</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        If the specs are still unclear, the file needs review, or the timing is tight, PrintMe can point you to the safest next step before production starts.
      </p>

      <div className="mt-5 grid gap-3">
        {[
          {
            icon: "document",
            title: "Quote support",
            detail: "Best for custom sizes, specialty materials, campaign bundles, design help, and jobs that still need a conversation.",
          },
          {
            icon: "upload",
            title: "Artwork support",
            detail: "Best when you have files ready but still want PrintMe to review bleed, size, colour, or print-fit before production.",
          },
          {
            icon: "phone",
            title: "Rush or pickup help",
            detail: "Best when your deadline is moving, pickup matters, or you need a fast local answer from the Scarborough shop.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-[1.2rem] border border-line bg-canvas p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand/15 bg-white text-brand">
                <Icon name={item.icon} className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button href={primaryAction.href} className="w-full">
          {primaryAction.label}
        </Button>
        <Button href={siteConfig.phoneHref} variant="secondary" className="w-full">
          Call {siteConfig.phone}
        </Button>
      </div>

      <div className="mt-4 rounded-[1.2rem] border border-line bg-canvas px-4 py-4 text-xs leading-5 text-slate">
        <p className="font-black text-ink">{siteConfig.shortAddress}</p>
        <p className="mt-1">Pickup, local support, and in-person print questions at the Scarborough shop.</p>
      </div>
    </section>
  );
}
