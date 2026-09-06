import { LogOut } from 'lucide-react'
import Card from '../components/common/Card'
import Field from '../components/common/Field'
import { ServiceStatusIndicator, useServiceStatus } from '../components/layout/ServiceStatus'
import { useAuth } from '../hooks/useAuth'
import { BASE_URL } from '../services/api'
import { clearRoadNetwork } from '../services/roadNetwork'

export default function SettingsPage() {
  const { username, role, signOut } = useAuth()
  const status = useServiceStatus()

  const handleSignOut = () => {
    clearRoadNetwork()
    signOut()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
        <p className="mt-0.5 text-sm text-slate-600">Your account and the service this app is using.</p>
      </div>

      <Card title="Your account">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Field label="Signed in as">{username ?? 'Unknown'}</Field>
          {/* Role comes from the backend, in the token it issued at sign-in. */}
          <Field label="Account type">{role ?? 'Not specified'}</Field>
        </dl>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </Card>

      <Card title="Service">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <ServiceStatusIndicator status={status} />
          </Field>
          <Field label="Connected to" hint="Set with VITE_API_BASE_URL">
            <span className="break-all">{BASE_URL}</span>
          </Field>
        </dl>
      </Card>

      <Card title="Map data">
        <p className="text-sm text-slate-700">
          Background maps come from OpenStreetMap. Road outlines, conditions and incident reports come
          from the PRAVAH service.
        </p>
        <button
          type="button"
          onClick={() => {
            clearRoadNetwork()
            window.location.reload()
          }}
          className="mt-4 inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Reload road information
        </button>
        <p className="mt-2 text-xs text-slate-500">
          Road outlines are downloaded once per session. Reload them if roads look out of date.
        </p>
      </Card>
    </div>
  )
}
