# Handover

Last updated: 2026-03-19 IST
Project: `d:\Claude1703`

## Current Direction

The site needs stabilization before redesign.

The main working order is:
1. navigation and IA simplification
2. homepage structural compression
3. route-family cleanup
4. motion polish
5. Tailwind v4 cleanup after visual approval

## Current User Preferences

- direct communication
- no fluff
- small visual misalignments matter
- one disciplined color system
- one font family
- less text
- stronger hero
- no cheap gradients
- subtle but alive motion
- footer marquee must stay

## Active Constraints

- do not break `/products/*`
- do not push unless explicitly told
- do not redesign the whole site in one pass
- do not change the footer marquee
- use section-by-section approval

## Current Site Problems

### Navigation

The header is too dense.

Current causes:
- too many top-level destinations
- repeated support links in the utility row
- crowded desktop width budget

Recommended direction:
- reduce top nav to a smaller core
- merge `Projects` and `Portfolio` route family
- move `Trusted by` out of primary nav
- treat `Configurator` as a planning/support route unless it proves top-level value

### Homepage

The homepage repeats the same sales job too many times.

Repeated surfaces:
- projects
- testimonials
- trust
- process
- contact
- FAQ

Recommended direction:
- keep one proof band
- keep one process-to-conversion sequence
- stop repeating trust in multiple sections

## Files Added for Planning

- [2026-03-19-full-site-stabilization-plan.md](/d:/Claude1703/docs/ops/2026-03-19-full-site-stabilization-plan.md)

## Current Implementation Notes

- hero is currently full-width again
- hero motion uses the safe image pan only
- reveal wrappers were previously removed from the homepage because they caused blank-content states
- navbar still needs IA reduction, not just spacing fixes
- footer marquee stays unchanged

## Open Decisions

- final top-nav set
- whether `Portfolio` remains separate from `Projects`
- whether `Configurator` stays top-level
- which homepage proof sections get merged
- whether FAQ remains as a full standalone homepage section

## Recommended Next Task

Work only on navigation and IA next.

Concrete next step:
- approve the reduced top-nav set
- then implement the header changes before touching more homepage sections

## Resume Checklist

- [ ] Read [2026-03-19-full-site-stabilization-plan.md](/d:/Claude1703/docs/ops/2026-03-19-full-site-stabilization-plan.md)
- [ ] Run `git status`
- [ ] Verify current homepage/header screenshots
- [ ] Make the nav reduction decision
- [ ] Implement one approved section at a time
