import Image from "next/image";
import Link from "next/link";
import { Button, Card, Icon, PageSection } from "@/components/ui";
import { brandVisuals } from "@/data/brand-visuals";
import { siteConfig } from "@/lib/site";

const trustItems = [
  "File review before print",
  "Turnaround confirmed",
  "Scarborough pickup",
  "Secure checkout",
];

const jobPaths = [
  {
    title: "Business Cards",
    copy: "Cards and basic stationery.",
    href: "/products/business-cards",
    icon: "card",
  },
  {
    title: "Flyers",
    copy: "Promotions, menus, and handouts.",
    href: "/products/flyers",
    icon: "flyer",
  },
  {
    title: "Signs & Posters",
    copy: "Large-format visibility.",
    href: "/products/signs",
    icon: "sign",
  },
  {
    title: "Document Printing",
    copy: "Reports, manuals, and forms.",
    href: "/products/document-printing",
    icon: "document",
  },
  {
    title: "Packaging & Labels",
    copy: "Retail and product print.",
    href: "/products/category/labels-packaging",
    icon: "sticker",
  },
  {
    title: "Custom Quote",
    copy: "Rush, non-standard, or unclear jobs.",
    href: "/quote-request",
    icon: "custom",
  },
];

const processSteps = [
  "Choose a product or request a quote.",
  "Upload files or confirm details.",
  "Approve and print.",
];

function JobPathCard({
  title,
  copy,
  href,
  icon,
}: {
  title: string;
  copy: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href} className="group">
      <Card variant="surface" interactive className="h-full p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-brand/15 bg-brand-soft text-brand">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <h2 className="mt-5 text-[1.3rem] font-black leading-[1.04] text-ink transition group-hover:text-brand">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate">{copy}</p>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-brand">Open path</p>
      </Card>
    </Link>
  );
}

export function HomeHero() {
  return (
    <PageSection spacing="hero" className="overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.12),transparent_24rem),linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.7))]"
        aria-hidden="true"
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_28rem] xl:items-center">
        <div className="max-w-2xl">
          <h1 className="display-title text-balance text-[3.15rem] font-semibold leading-[0.9] sm:text-[4.3rem] lg:text-[5rem]">
            Order standard print online. Quote custom jobs fast.
          </h1>
          <p className="mt-6 max-w-xl text-[1rem] leading-8 text-slate sm:text-[1.05rem]">
            PrintMe Design gives you a clear next step whether you need a simple product order, a custom quote, or file help before print.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/products" size="lg" trailingIcon={<Icon name="arrow" className="h-4 w-4" />}>
              Shop Products
            </Button>
            <Button href="/quote-request" variant="secondary" size="lg">
              Request a Quote
            </Button>
            <Button href="/artwork-guidelines" variant="ghost" size="lg">
              Get File Help
            </Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[1.1rem] border border-line/70 bg-white/88 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold leading-5 text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <Card variant="surface" className="overflow-hidden p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-line/70 bg-[#f5efe8]">
            <div className="relative aspect-[4/3]">
              <Image
                src={brandVisuals.rangeHero.src}
                alt={brandVisuals.rangeHero.alt}
                fill
                priority
                sizes="(min-width: 1280px) 28rem, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,14,12,0.42)] via-transparent to-white/8" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(18,17,16,0.14)] backdrop-blur-sm">
              <p className="text-sm font-black text-ink">Standard products can be ordered online.</p>
              <p className="mt-2 text-sm leading-6 text-slate">
                Use the quote path for custom sizes, rush work, specialty finishing, or file-sensitive jobs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageSection>
  );
}

export function HomeJobPaths() {
  return (
    <PageSection tone="white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[2.1rem] font-semibold leading-[0.96] text-ink sm:text-[2.7rem]">Start with a common job.</h2>
          <p className="mt-3 text-sm leading-7 text-slate">Most customers can begin here without reading through categories or service pages.</p>
        </div>
        <Button href="/products" variant="secondary" className="self-start sm:self-auto">
          Browse Full Catalog
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobPaths.map((path) => (
          <JobPathCard key={path.title} {...path} />
        ))}
      </div>
    </PageSection>
  );
}

export function HomeSupportSection() {
  return (
    <PageSection tone="band">
      <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
        <Card variant="surface" className="p-6 sm:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate">How it works</p>
          <div className="mt-5 space-y-4">
            {processSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 border-b border-black/5 pb-4 last:border-b-0 last:pb-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-7 text-ink">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="dark" className="p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-light">Need help before you order?</p>
          <h2 className="mt-4 max-w-2xl text-[2rem] font-black leading-[0.98] text-white sm:text-[2.35rem]">
            Call PrintMe or send a quote request.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
            Best for custom jobs, rush timing, unclear specs, finishing questions, or files that need review.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55">Address</p>
              <p className="mt-2 text-sm leading-7 text-white">{siteConfig.address}</p>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55">Phone</p>
              <a href={siteConfig.phoneHref} className="mt-2 block text-sm font-bold text-white transition hover:text-brand-light">
                {siteConfig.phone}
              </a>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55">Hours</p>
              <div className="mt-2 space-y-1 text-sm leading-7 text-white">
                {siteConfig.hours.map((hours) => (
                  <p key={hours}>{hours}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55">Pickup</p>
              <p className="mt-2 text-sm leading-7 text-white">Approved orders can be picked up at our Markham Road shop.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/quote-request">Request a Quote</Button>
            <Button href={siteConfig.phoneHref} variant="secondary" leadingIcon={<Icon name="phone" className="h-4 w-4" />}>
              Call PrintMe
            </Button>
          </div>
        </Card>
      </div>
    </PageSection>
  );
}
