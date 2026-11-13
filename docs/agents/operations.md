# Operating within free tiers

Prefer the free plans and leave usage-based billing, automatic credit reload, and paid add-ons off. Keep provider protections and quotas intact. Free allowances and burst limits are separate constraints; no configuration guarantees unlimited traffic. Check each provider's usage dashboard before increasing traffic or adding background work.

## CodeRabbit

The repository configuration in `.coderabbit.yaml` keeps review requests manual: automatic reviews, push-triggered incremental reviews, description/label triggers, unsolicited chat replies, and finishing-touch code changes are disabled. Generated output, copied shadcn primitives, and the Bun lockfile are excluded; authored code, tests, configuration, and documentation remain reviewable.

Install the GitHub app for this repository only. In the CodeRabbit dashboard, leave automatic reviews and usage-based reviews disabled, and verify the repository configuration is loaded before opening the first PR. A file alone does not install the app or change account billing settings.

Run the repository's verification script before requesting review. Batch coherent edits, push once ready, then request one incremental review with `@coderabbitai review`. Reserve `@coderabbitai full review` for cases that need a fresh whole-PR pass. Repeated full reviews, empty pushes, and repeated mentions spend allowance without improving evidence. Honor rate-limit feedback and wait for allowance to refill instead of repeatedly retriggering.

The Free plan currently provides PR summaries rather than detailed PR reviews; free CLI/IDE review access remains available. Eligible open-source projects receive a separate free review tier. Do not change repository visibility merely to obtain that tier: application and family data need their own privacy decision. Check the active plan after any trial ends. [Plans](https://docs.coderabbit.ai/management/plans), [review limits](https://docs.coderabbit.ai/management/rate-limits), [automatic review controls](https://docs.coderabbit.ai/configuration/auto-review), [configuration schema](https://coderabbit.ai/integrations/schema.v2.json).

## Clerk

Use the SDK's session and token management. Verify sessions locally using the provider's supported verification path; fetch full user records from the Backend API only when the operation actually needs them. Do not add a user lookup on every request, poll authentication state, or force token refresh on every reactive update. Preserve provider token caching and refresh only when requested by the Convex auth adapter.

Keep email-code resends user initiated and preserve the provider widget's cooldown. A `429` response includes `Retry-After`; respect it. Development instances and production instances have different API limits, so a development burst is not a capacity benchmark. Hobby currently has a 50,000 monthly retained user limit per app; it is not an unlimited request allowance. [Pricing](https://clerk.com/pricing), [rate limits](https://clerk.com/docs/guides/how-clerk-works/system-limits).

## Convex

Create one client per browser application, scope subscriptions to mounted consumers, and skip protected queries until authentication is ready. Prefer a live subscription when the UI needs live data; use a one-shot query when it does not. Avoid timer polling, duplicate server/client fetches for the same initial view, presence heartbeats, scheduled jobs, and automatic health queries unless a feature requires them.

Use selective indexes and bounded or paginated results. Return only the data the UI needs. Keep authentication checks in every protected server function; client-side query skipping saves requests but does not authorize access. Use Convex's normal query caching and transactional behavior rather than a second cache that can serve another user's data.

Free currently includes 1,000,000 function calls per month, 0.5 GB database storage, and 1 GB database I/O per month. Subscription updates and scheduled executions also count as calls. The Free plan has hard resource caps; paid Starter can incur usage charges. Review actual usage before enabling file storage, search, or background actions, which have their own allowances. [Limits and usage accounting](https://docs.convex.dev/production/state/limits), [query best practices](https://docs.convex.dev/understanding/best-practices).

## Vercel

Hobby is intended for personal, non-commercial use. Establish eligibility before deploying a commercial service; keeping traffic small does not remove that restriction. Keep the configured Vercel adapter, but revisit the hosting plan or provider if the product's use changes. [Terms, Hobby plan](https://vercel.com/legal/terms), [Hobby limits](https://vercel.com/docs/plans/hobby).

Serve static assets through the normal build output. Prerender genuinely public static routes when they contain no user-specific data; keep authenticated responses private. Send browser data subscriptions directly to Convex rather than proxying them through Vercel functions. Avoid cron jobs, keep-alive requests, paid observability add-ons, and redundant preview deployments. Enable available usage notifications and review usage after meaningful traffic changes. Do not automatically upgrade plans or enable paid capacity.

Provider facts checked on 2026-11-13; follow the linked live limits when making a capacity decision.

CI runs one verification job per push to main or pull request and cancels superseded runs for the same ref. It uses the local verification command and a fully redacted history scan. No automatic deploys, dependency bots, review requests, or scheduled workflows are configured.
