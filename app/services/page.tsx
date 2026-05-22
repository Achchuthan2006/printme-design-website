import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import { buildMetadata } from "@/lib/metadata";
import { services } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Print Services",
  description: "Explore business cards, flyers, brochures, posters, signs, stickers, document printing, and custom print services at PrintMe Design.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Print services for daily business needs and custom local orders"
        description="We offer dependable print and design support for branded materials, event graphics, storefront signage, passport photos, and practical everyday printing."
      />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Service overview"
            title="Clean, professional print products with room for custom requests"
            description="Every project starts with clear specs, realistic turnaround, and practical advice on quantity, size, finish, and file readiness."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
