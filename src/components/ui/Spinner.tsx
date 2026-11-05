export function Spinner() {
  return (
    <span className="inline-flex items-center gap-2 text-slate-600" role="status">
      <svg
        className="h-5 w-5 animate-spin text-slate-500"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          d="M4 12a8 8 0 0 1 8-8"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-75"
        />
      </svg>
      <span>Loading…</span>
    </span>
  )
}
