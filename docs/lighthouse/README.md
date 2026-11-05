# Lighthouse reports

The Lighthouse reports are intentionally not fabricated. Capture them yourself on the deployed
URL after the first successful deploy.

## How to capture before/after

1. Open the live URL in Chrome **incognito** (no extensions, no warm profile).
2. Open DevTools → **Lighthouse**.
3. Select **Mobile** and the **Performance**, **Accessibility**, **Best Practices** and **SEO**
   categories. Run the audit.
4. Save the HTML report as `docs/lighthouse/mobile-before.html` (or a PDF/PNG screenshot).
5. Make one measurable optimization (for example, lazy-load below-the-fold images or split a
   route), deploy again, and repeat exactly the same steps on the same URL and device preset.
6. Save the second report as `docs/lighthouse/mobile-after.html`.
7. Copy the four category scores into `REPORT.md` (before and after).

## Notes

- Do not compare scores from different presets (desktop vs mobile) or different network
  conditions.
- DummyJSON latency affects the score; repeat the audit once to check stability.
- The CORE build is not required to ship a Lighthouse optimization. If you add one as a FULL
  extra, document the before/after numbers honestly.
