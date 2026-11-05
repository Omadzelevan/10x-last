import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PageContainer } from '../components/ui/PageContainer'
import { useAuth } from '../context/useAuth'
import type { LoginFormValues } from '../types/user'
import { getRedirectPath } from '../utils/navigation'
import { validateLogin } from '../utils/validation'
import type { LoginErrors } from '../utils/validation'

const initialValues: LoginFormValues = { username: '', password: '' }

export function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = getRedirectPath(location.state)

  if (user && !hasSubmitted) {
    return <Navigate to="/" replace />
  }

  function updateField(field: keyof LoginFormValues, value: string): void {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const nextErrors = validateLogin(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    login(values.username.trim())
    setHasSubmitted(true)
    navigate(from ?? '/', { replace: true })
  }

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Log in</h1>
        <p className="mt-2 text-sm text-slate-600">
          This is a local demo login; no data is sent to a server.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-800">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={values.username}
              onChange={(event) => updateField('username', event.target.value)}
              aria-invalid={errors.username ? true : undefined}
              aria-describedby={errors.username ? 'username-error' : undefined}
              className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            />
            {errors.username ? (
              <p id="username-error" className="mt-1 text-sm text-red-700">
                {errors.username}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            />
            {errors.password ? (
              <p id="password-error" className="mt-1 text-sm text-red-700">
                {errors.password}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="mt-2 w-full">
            Log In
          </Button>
        </form>

        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
        >
          ← Back to catalog
        </Link>
      </div>
    </PageContainer>
  )
}
