# Domain Docs

How engineering skills consume this repo's domain documentation.

## Before exploring, read these

- `GLOSSARY.md` at the repo root.
- ADRs in `docs/adr/` that touch the area you're about to work in.

If these files don't exist, proceed silently. The domain-modeling skill creates them lazily when terms or decisions get resolved.

## File structure

This repo uses a single-context layout: one root `GLOSSARY.md` and root `docs/adr/`, with ADRs numbered `0001-<decision>.md`, `0002-<decision>.md`, and so on.

## Use the glossary's vocabulary

When output names a domain concept (in an issue title, refactor proposal, hypothesis, or test name), use the term defined in `GLOSSARY.md`. Avoid synonyms the glossary explicitly excludes.

If a concept is missing, reconsider whether it belongs to the project or note the gap for domain-modeling.

## Flag ADR conflicts

If output contradicts an existing ADR, surface the conflict explicitly and explain why the decision should be reopened.
