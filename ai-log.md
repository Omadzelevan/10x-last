# AI log — 10X Shop

Honest, short notes about the main AI-assisted steps. No timestamps or scores were invented.

## Setup

- Asked the coding agent to read the PRD, Appendix A and the master prompt and to resolve their
  contradictions using the provided D1–D15 decisions.
- Generated the Vite + React + TypeScript scaffold and installed Tailwind CSS v4 through
  `@tailwindcss/vite`.
- Rejected adding FULL dependencies (Formik, Yup, state libraries, UI kits) because the scope was
  CORE only.

## Implementation

- Used AI drafts for typed models, API functions, utilities, contexts, components and pages.
- Kept the architecture from the specification: `api/`, `types/`, `context/`, `components/`,
  `pages/`, `routes/`, `utils/`.
- Insisted on `unknown` + type guards for API JSON and `localStorage` instead of `any` or unsafe
  casts.
- Made the cart context update immutably and persist to `shop_cart`.

## Verification

- AI proposed and ran the typecheck probe that exposed a gate which checked no files.
- AI wrote headless Chromium smoke tests (kept outside the repository) that found a real login
  redirect race.
- Rejected "disable the rule" fixes for lint warnings; the code was restructured instead.
- Error Boundary was tested by temporarily throwing in a page and then reverting the change.

## Documentation

- README, PLAN, REPORT, DEBUG-LOG and COMPATIBILITY were drafted with AI assistance from the real
  work performed in this session.
- Items that require the student (Lighthouse, Firefox checks, deployed URL, commit links, hours)
  were left as `TODO(student)` on purpose.
