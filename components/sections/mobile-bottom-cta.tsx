import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function MobileBottomCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(20,20,20,0.1)] backdrop-blur transition-transform duration-300 md:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <Button href="/quote-request" className="flex-1 px-4 py-3">
          Quote
        </Button>
        <Button href={siteConfig.phoneHref} variant="secondary" className="flex-1 px-4 py-3">
          Call Now
        </Button>
      </div>
    </div>
  );
}
