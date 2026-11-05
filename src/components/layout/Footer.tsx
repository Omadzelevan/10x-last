const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {currentYear} 10X Shop</p>
        <p>
          Built with React, TypeScript and Tailwind CSS. Product data from{' '}
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center font-medium text-slate-900 underline underline-offset-2 hover:text-slate-700"
          >
            DummyJSON
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
