import { Link } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-700">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          Go to catalog
        </Link>
      </div>
    </PageContainer>
  )
}
