# Workstream Structure

## Purpose

This file says where major kinds of work belong.

## Live App

- `app/`
- `components/`
- `data/`
- `hooks/`
- `lib/`
- `public/`

## Structured Content

- user-facing site copy should move toward `data/site/*`

## Platform

- `scripts/`
- `supabase/`
- integration helpers in `lib/`

## Recovery

- `codex-recovery/`

Main recovery control files:
- `WORLD-CLASS-PLAN.md`
- `NEXT-PLAN.md`
- `RECOVERY-CHECKLIST.md`

## Preserved History

- `archive/`

## Salvage

- `unused/`

Rule:
- do not use `unused/` as a trash folder

## Artifacts

- `output/`
- `reports/`

## Simple Rule

- live app code stays in active source folders
- recovery truth stays in `codex-recovery/`
- preserved history stays in `archive/`
- salvage stays in `unused/`
