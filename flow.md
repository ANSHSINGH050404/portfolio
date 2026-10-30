# Portfolio Redesign Plan

This document outlines the bottom-up redesign of the portfolio, inspired by the minimalist, high-performance aesthetic of `boat.dev`.

## Objective
To create a fast, modern, and engaging portfolio that showcases projects with refined micro-animations, clear typography, and a cohesive design system, while maintaining high performance.

## Design Language (Inspired by `boat.dev`)
*   **Aesthetic:** Minimalist, high-contrast, professional, "agent-focused."
*   **Motion:** Subtle, performant micro-interactions (using Framer Motion).
*   **Typography:** Clean, readable sans-serif fonts.
*   **Responsiveness:** Mobile-first approach.

## Technical Roadmap

### Phase 1: Setup & Design System
- [ ] Initialize/Audit Tailwind configuration for consistent spacing, colors, and typography.
- [ ] Install `framer-motion` for advanced animation capabilities.
- [ ] Define the core color palette and font hierarchy in `tailwind.config.js`.

### Phase 2: Component Library & Animation Strategy
- [ ] Create a `components/ui` library (Button, Card, Section).
- [ ] Implement reusable animation wrappers (`FadeIn`, `SlideUp`, `HoverScale`) using Framer Motion.
- [ ] Establish consistent hover and transition states.

### Phase 3: Layout Reconstruction
- [ ] **Navigation:** Build a minimalist header with smooth scroll behavior.
- [ ] **Hero Section:** Redesign the hero to be impactful, with a clear value proposition.
- [ ] **Projects Section:** Create a high-performance grid layout for project cards with interactive hover effects.
- [ ] **About/Contact:** Modernize layout to match the refined design language.

### Phase 4: Content Migration & Polishing
- [ ] Migrate existing project content from `public/projects`.
- [ ] Optimize images for speed.
- [ ] Performance audit and final animation tuning.

## Next Steps
1. Review current `package.json` to plan dependencies (`framer-motion` installation).
2. Start Phase 1: Tailwind/Animation setup.
