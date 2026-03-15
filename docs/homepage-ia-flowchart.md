# Homepage IA Flowchart

## Purpose
This flowchart documents the current intended homepage information architecture after the Process 1 cleanup. It exists so layout, copy, and conversion decisions are explicit instead of spread across components.

## Flowchart
```mermaid
flowchart TD
    A[Header and Search] --> B[Hero]
    B --> C[AFC Partnership Banner]
    C --> D[Collections]
    D --> E[Recent Deliveries]
    E --> F[Process]
    F --> G[Merged Contact Section]
    G --> H[Trust and KPI Strip]
    H --> I[Footer]

    B --> B1[Primary message and two top-level actions]
    C --> C1[Credibility without long proof copy]
    D --> D1[Route users into canonical product categories]
    E --> E1[Show real work with sector and company only]
    F --> F1[Explain execution in four fast cards]
    G --> G1[Collect a brief and offer WhatsApp or phone]
    H --> H1[Close with scale proof before footer]
    I --> I1[Keep legal and informational navigation separate from homepage conversion]
```

## Layout Rationale
- `Hero`: first message only. It should not carry extra proof clutter.
- `AFC Partnership Banner`: early credibility anchor. Strong because it is compact and visually distinct.
- `Collections`: first discovery layer. This must use live canonical category routes only.
- `Recent Deliveries`: proof by real work, not by extra copy. Cards should show sector and company name only.
- `Process`: operational reassurance after discovery and proof.
- `Merged Contact Section`: one closing conversion surface, not multiple competing asks.
- `Trust and KPI Strip`: late-stage proof, moved near the footer so it supports the close instead of interrupting discovery.
- `Footer`: informational close only, not another homepage sales panel.

## Component Ownership
- `app/page.tsx`: section order only
- `data/site/homepage.ts`: homepage content truth
- `components/home/*`: section rendering
- `components/shared/ContactTeaser.tsx`: homepage closing conversion surface
- `components/site/Footer.tsx`: footer-only information
- `components/ui/WhatsAppCTA.tsx`: route-aware floating quick contact

## Current Guardrails
- No homepage card should use stale `?category=` routing.
- No homepage project card should show city/state.
- Homepage quick contact should not use email as a primary action.
- Footer contact metadata must not become a second homepage CTA section.
