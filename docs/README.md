# PrintMe Brand System Docs

This folder documents the current PrintMe brand system and the UI rules that support it.

Use these files before making visual, copy, or component changes:

- [brand-style-guide.md](./brand-style-guide.md): brand identity, logo usage, palette, typography, iconography, and voice
- [design-system.md](./design-system.md): tokens, layout rules, motion principles, CTA logic, forms, trust sections, and dashboard patterns
- [component-library.md](./component-library.md): shared component guidance, variants, states, and usage rules
- [backend-architecture.md](./backend-architecture.md): workflow model, persistence boundaries, notifications, admin operations, and Stripe/upload architecture
- [launch-readiness.md](./launch-readiness.md): deployment checklist, admin gating rules, env setup, Stripe/Supabase readiness, and release expectations

Recommended order:

1. Read the brand style guide for overall direction.
2. Read the design system for implementation rules.
3. Use the component library when building or editing UI.

Maintenance notes:

- Treat the official `PrintMe` wordmark in [public/printme-logo.svg](/C:/Users/Achch/Desktop/PrintMe/public/printme-logo.svg) as the brand source of truth.
- Prefer updating shared tokens and shared components before introducing page-level one-off styles.
- If a new UI pattern repeats across more than one surface, document it here and move it into a shared component or utility class.
