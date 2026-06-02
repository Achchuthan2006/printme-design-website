# PrintMe Brand System Docs

This folder documents the current PrintMe brand system and the UI rules that support it.

Use these files before making visual, copy, or component changes:

- [master-platform-architecture.md](./master-platform-architecture.md): unified product vision, platform domains, operating model, B2B/AI/tenant strategy, and phased roadmap
- [unified-master-platform-architecture.md](./unified-master-platform-architecture.md): canonical top-level blueprint that unifies storefront, catalog, design, ordering, operations, analytics, B2B, AI, automation, and tenant expansion into one roadmap
- [platform-operating-system-blueprint.md](./platform-operating-system-blueprint.md): API-first composable target architecture, service boundaries, governance, and modernization strategy
- [api-first-composable-platform-architecture.md](./api-first-composable-platform-architecture.md): implementation-facing operating model, module boundaries, shared services, API families, data ownership, and modernization sequencing
- [brand-style-guide.md](./brand-style-guide.md): brand identity, logo usage, palette, typography, iconography, and voice
- [design-system.md](./design-system.md): tokens, layout rules, motion principles, CTA logic, forms, trust sections, and dashboard patterns
- [component-library.md](./component-library.md): shared component guidance, variants, states, and usage rules
- [backend-architecture.md](./backend-architecture.md): workflow model, persistence boundaries, notifications, admin operations, and Stripe/upload architecture
- [ai-intelligence-audit.md](./ai-intelligence-audit.md): ranked AI opportunities, guardrails, explainable recommendation strategy, and workflow-intelligence implementation
- [multi-tenant-expansion-architecture.md](./multi-tenant-expansion-architecture.md): franchise, white-label, reseller, multi-location, and tenant-governance architecture
- [multi-location-franchise-white-label-blueprint.md](./multi-location-franchise-white-label-blueprint.md): implementation-facing expansion model for franchise systems, white-label storefronts, reseller networks, location routing, provisioning, and layered analytics
- [post-launch-optimization-operating-system.md](./post-launch-optimization-operating-system.md): CRO framework, evidence model, funnel optimization, experimentation backlog, and weekly optimization loop
- [scaling-automation-roadmap.md](./scaling-automation-roadmap.md): business-systems scaling audit, automation priorities, integration strategy, team scaling model, and phased operational growth roadmap
- [launch-readiness.md](./launch-readiness.md): deployment checklist, admin gating rules, env setup, Stripe/Supabase readiness, and release expectations

Recommended order:

1. Read the master platform architecture for overall product direction.
2. Read the brand style guide for visual and voice direction.
3. Read the design system for implementation rules.
4. Use the component library when building or editing UI.

Maintenance notes:

- Treat the official `PrintMe` wordmark in [public/printme-logo.svg](/C:/Users/Achch/Desktop/PrintMe/public/printme-logo.svg) as the brand source of truth.
- Prefer updating shared tokens and shared components before introducing page-level one-off styles.
- If a new UI pattern repeats across more than one surface, document it here and move it into a shared component or utility class.
