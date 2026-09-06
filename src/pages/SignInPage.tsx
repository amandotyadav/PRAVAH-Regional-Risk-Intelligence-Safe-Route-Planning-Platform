import { useState, type FormEvent } from 'react'
import { LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { toUserMessage } from '../services/errors'
import { ErrorState } from '../components/common/StateViews'
import BrandMark from '../components/common/BrandMark'

export default function SignInPage() {
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await signIn(username.trim(), password)
    } catch (cause) {
      setError(toUserMessage(cause, 'Could not sign in. Please check your details and try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <BrandMark size={40} className="mx-auto" />
          <h1 className="mt-2.5 text-xl font-semibold tracking-tight text-slate-900">PRAVAH</h1>
          <p className="mt-1 text-sm text-slate-600">
            Road conditions and safer routes for the Northeast Region
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900">Sign in</h2>
          <p className="mt-0.5 text-sm text-slate-600">Use the account provided to you.</p>

          <form className="mt-4 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-900">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            {error && <ErrorState message={error} />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Road risk information is indicative. Follow instructions from local authorities.
        </p>
      </div>
    </div>
  )
}
