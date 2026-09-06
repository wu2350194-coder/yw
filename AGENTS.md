# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
User design direction: 奶油色恋爱手账风. Warm cream paper, restrained blush accents, supplied hand-holding photo as cover, rain/bookstore/everyday photo memories, interactive letter. User rejected deep-sea cinematic style. Mobile-friendly personal anniversary website. Image generation was blocked by local sandbox; user chose written fallback direction. Do not invent personal names or anniversary dates. Letter and captions are editable draft copy, not factual recollections supplied by the user.

Long-term direction: This is an ongoing shared-life journal, not a one-off anniversary page. Site name is 我们的日常; 1000-day Douyin spark is the current theme. Keep permanent identity separate from theme content in src/content.js. Maintain readable Chinese sans typography, warm paper backgrounds and subdued rose accents; preserve supplied photos, videos and particle interactions. Do not schedule autonomous edits based on the phrase 持续优化 alone.

Album direction: thematic scrapbook chapters, consistent photo framing, remove photo 16 (starry game image). Enrich cream backgrounds with quiet paper grain, floral silhouettes and blush/sage light. Preserve readable content and rounded corners.
