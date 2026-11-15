# Portrait recovery period: evidence and tradeoffs

Research checked 2026-11-14. Decision support only; no duration or provider selected.

## Conclusion

**Thirty days is a defensible provisional choice, not a proven optimum.** Relative to seven days, it allows recovery for another 23 days and retains about 4.29 times as much historical image data under constant churn. Relative to 90 days, it stores one third as much history but loses the opportunity to recover mistakes discovered during days 30–90. Whether those opportunities matter requires evidence from this app's families. No usage, restore-delay distribution, optimized-image measurements, selected provider, or validated free-tier capacity exists.

Judgment: if a temporary choice is needed, 30 days balances a longer chance to notice mistakes against finite retention, has a first-party photo-product precedent, and matches the separately approved whole-tree Trash duration. Those are reasons to consider it, not proof that families revisit within a month. Keep the portrait decision open until the product owner accepts that tradeoff or measurements resolve it. Immediate deletion and indefinite retention are comparison endpoints outside the already approved time-limited recovery policy.

## Scope held fixed

The agreed product direction has one optional optimized portrait per person, preview and optional captions; browser-local trees need no account, while cloud trees have permissioned anonymous viewer/editor links. Current portraits never age out. Replacing/removing a portrait starts its historical-byte recovery window; attributed textual photo events remain while the tree exists after those bytes expire. This is distinct from the separately approved 30-day whole-cloud-tree Trash recovery. Their interaction still needs specification; this report does not authorize restarting portrait expiry when a tree enters Trash.

Independent tree copies and downloaded backups preserve their stored current portraits. Source deletion cannot retract those copies. The model below excludes them; it does not assume shared blobs or any provider deduplication. These are supplied product constraints, not findings from provider documentation.

## What primary sources establish

- **Convex:** files can be deleted with `storage.delete()`; its API reference says previously generated file URLs then return 404. Direct file URLs allow anyone holding the URL to fetch without further app authentication. Convex recommends HTTP actions when each request needs authorization. **Implication:** keeping old bytes for recovery must not keep them accessible through a revoked tree link. Authorizing URL issuance alone does not meet that requirement. This is a constraint for later design, not a provider selection. [Deletion](https://docs.convex.dev/file-storage/delete-files), [API contract](https://docs.convex.dev/api/interfaces/server.StorageActionWriter), [serving and security](https://docs.convex.dev/file-storage/serve-files).
- **R2:** lifecycle rules can expire objects by age or date and filter by prefix. Removal typically occurs within 24 hours of `x-amz-expiration`; rule changes for existing objects can take longer. **Implication:** a recovery deadline and completed byte deletion are separate events. Do not promise exact-time erasure from lifecycle rules, or apply an upload-age rule to current portraits. The relevant product clock begins at replacement/removal, potentially years after upload. [Object lifecycles](https://developers.cloudflare.com/r2/buckets/object-lifecycles/).
- **Access expiry is not retention:** R2 presigned URLs authorize whoever holds them until expiry (supported timeout: one second to seven days). **Implication:** seven days is a URL limit, not evidence for seven-day portrait retention; URL expiry neither deletes bytes nor retracts downloaded copies. A still-valid bearer URL alone does not enforce an intervening permission revocation. [Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/).
- **Local browser storage:** IndexedDB is subject to browser-specific quotas; default storage is best effort and can be evicted. Persistence can be requested, but browsers may deny it and users can clear stored data. **Implication:** a local recovery window expresses eligibility while data survives; it cannot guarantee availability after browser eviction. Cleanup while the app is closed also needs validation before making a deletion-time promise. [MDN storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- **Product precedent:** Apple Photos documents 30 days in Recently Deleted, followed by permanent deletion and no recovery through that feature. This concerns deleted photos, not collaborative portrait replacement, and reports no restore-delay distribution or comparison showing 30 days is optimal. It supports familiarity only. [Apple recovery guidance](https://support.apple.com/en-us/124460).

These sources describe service behavior, not universal physical backup-erasure guarantees. No jurisdiction, legal retention requirement, or provider backup-purge schedule is assumed. Cloudflare and Convex documentation was queried through Context7, then decisive claims checked on the official pages; MDN was likewise checked through Context7 and its live page.

## Options compared

| Window     | Objective implication                                                                       | Judgment / missing evidence                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Immediate  | No historical bytes after deletion completes; no later image recovery. Text events survive. | Smallest historical storage and shortest retained exposure; gives no chance to repair a later-discovered mistake. Conflicts with approved recovery.        |
| 7 days     | One week of eligible changes; about 23% of 30-day steady-state history bytes.               | Prefer if almost all valuable restores occur within a week or measured capacity/privacy pressure outweighs later recovery. Weekly discovery is unmeasured. |
| 30 days    | Adds days 7–30 versus seven days; finite expiry; same duration as approved tree Trash.      | Reasonable candidate if those extra restores matter and storage fits. No evidence yet that a month covers family review habits.                            |
| 90 days    | Adds days 30–90; three times 30-day steady-state history bytes.                             | Prefer if valuable delayed discoveries are common and the longer exposure/storage is acceptable. Seasonal family use is a hypothesis.                      |
| Indefinite | No expiry-based loss of recovery; history grows with cumulative changes.                    | Strongest archival opportunity, longest exposure and unbounded growth under continued churn. Conflicts with approved expiry.                               |

Longer retention increases the duration for which sensitive former portraits remain stored; actual exposure depends on access controls. It does not grant anonymous viewers/editors a new right to historical images. Recovery permissions remain a separate product decision.

## Reproducible illustrative storage model — hypothetical, not measured

Assume an aggregate 10,000 current portraits, each exactly 200 kB (200,000 bytes), and 300 replacements per 30-day modeling month: 10 retired versions/day. Every replacement retains one old version and supplies one equally sized current version, so current count stays fixed. Repeated replacement of one person counts repeatedly. Removals would also produce retired versions but reduce current count; they are not included in this fixed-count example.

Current footprint = `10,000 × 200,000` = **2,000 MB = 2.000 GB**. At constant churn, retained history is `10 × 200,000 × W` bytes after a finite W-day window fills. From an empty history at age t days, substitute `min(t, W)`. Indefinite history is `10 × 200,000 × t`, with no finite steady state.

| Policy                     | Historical increment | Current + history |
| -------------------------- | -------------------: | ----------------: |
| Immediate                  |                 0 MB |          2.000 GB |
| 7 days, filled window      |                14 MB |          2.014 GB |
| 30 days, filled window     |                60 MB |          2.060 GB |
| 90 days, filled window     |               180 MB |          2.180 GB |
| Indefinite, after 365 days |               730 MB |          2.730 GB |

Thirty instead of seven days adds **46 MB** here; 90 instead of 30 adds **120 MB**. These are logical image payload bytes, not a bill or a free-tier fit claim. Units are decimal: kB = 1,000 bytes, MB = 1,000,000, GB = 1,000,000,000. Excluded: metadata, captions, textual events, separate preview/thumbnail files, originals, independent copies, downloaded backups, whole-tree Trash, transfer/cache/provider replication overhead, deletion lag and abandoned uploads. No deduplication savings assumed.

Initial import into empty portrait slots adds current bytes, not history. Replacing all 10,000 portraits in one session instead adds **2,000 MB** of history immediately for any positive window, on top of ordinary churn, until expiry. Arbitrarily many same-day edits can create arbitrarily many historical versions. A time window bounds eligible age, **not hard byte usage under bursts**. Delayed deletion can extend stored age and occupancy beyond the logical window.

Run this standalone Python 3 snippet; it reproduces the table and checks the incremental arithmetic:

```python
people, image_bytes = 10_000, 200_000
changes_per_month, month_days = 300, 30
daily_bytes = changes_per_month * image_bytes // month_days
current_bytes = people * image_bytes
print(f"current: {current_bytes / 1_000_000:.0f} MB")
for label, days in [("immediate", 0), ("7d", 7), ("30d", 30),
                    ("90d", 90), ("indefinite at 365d", 365)]:
    history = daily_bytes * days
    print(f"{label}: +{history / 1_000_000:.0f} MB; "
          f"total {(current_bytes + history) / 1_000_000_000:.3f} GB")
assert daily_bytes * (30 - 7) == 46_000_000
assert daily_bytes * (90 - 30) == 120_000_000
print(f"all-portrait replacement burst: +{current_bytes / 1_000_000:.0f} MB")
```

This is deterministic arithmetic, not a benchmark: no sampling spread or performance limiter was measured. Doubling image size or retirement rate doubles history; doubling current count doubles current storage and, only if churn scales with count, history. The byte inflow and window set the modeled occupancy. Actual quota headroom also depends on excluded categories and bursts.

## Evidence that would change the choice

Before gathering data, agree what recovery benefit justifies the extra retained bytes and exposure. Define the restore delay from replacement/removal to a genuine attempt to restore, including attempts after expiry; successful restores alone hide unmet demand. Compare valuable attempts in days 0–7, 7–30, 30–90 and beyond, with counts, observation duration and uncertainty. A short pilot cannot establish a 90-day tail; a small sample with no late attempts does not prove none occur.

- **Shorten toward seven days** if a sufficiently observed cohort shows negligible valuable requests after day seven under the agreed benefit threshold, or measured storage/privacy constraints outweigh those requests.
- **Lengthen toward 90 days** if meaningful requests fall in days 30–90, and users accept longer retention with verified headroom. Indefinite retention would require reopening the approved expiry decision.
- **Measure feasibility independently:** optimized-image size distribution, portrait counts, retirements per day and peak session, deletion backlog/lag, local quota/eviction behavior, and all storage outside this model. Compare with the selected provider's current limits and actual dashboard usage before claiming capacity. For constant churn only, history headroom H implies `W <= H / (retirements_per_day × mean_retired_bytes)`; reserve burst and deletion-lag headroom separately.

Experience First keeps mistaken family-photo edits, delayed discovery and clear expiry expectations central. Explain the Number keeps the scenario hypothetical and makes its assumptions/sensitivity explicit. Prove It Works and Build the Lever require checking official claims and executing the embedded calculation. None supplies the missing demand evidence needed to prove 30 days best.

## Verification and handoff

Executed the embedded Python directly from this report: all table values, both difference assertions and the 2,000 MB burst matched. All seven cited URLs returned HTTP 200; decisive source statements were read directly. Repository `bun run verify` passed type checks (zero errors/warnings), formatting, ESLint, stylesheet policy, all 35 tests and production build. This verifies the document and existing scaffold, not an implemented portrait lifecycle. Remaining work: product selection of duration, demand/size measurements and later lifecycle/access-control validation. Only this report changes; map, tickets, glossary and spec remain untouched.
