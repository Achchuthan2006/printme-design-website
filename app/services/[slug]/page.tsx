import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { getServicePageBySlug } from "@/data/services";
import { ServiceCard } from "@/components/sections/service-card";
import { services } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePageBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePageBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.heroTitle}
        description={service.heroDescription}
        eyebrow="Service"
        ctaLabel={service.primaryCta}
        ctaHref="/quote-request"
        highlights={service.proofPoints}
      />
      <section className="section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="surface-card p-6">
            <h2 className="text-2xl font-black text-ink">When to use this service</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate">
              {service.useCases.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <aside className="surface-card p-6">
            <h2 className="text-xl font-black text-ink">Related paths</h2>
            <div className="mt-4 grid gap-3">
              {services.slice(0, 3).map((item) => (
                <ServiceCard key={item.slug} service={item} />
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
