import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AdminPendingPage() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600 text-sm">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (profile?.role === 'admin' || profile?.role === 'approved') {
    return <Navigate to="/admin/products" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Access pending</h1>
        <p className="text-sm text-gray-600 mb-4">
          Your Google account ({user.email}) is not approved for the admin area yet. A request has been recorded. An
          administrator will review and approve your access. You will not be able to manage products until then.
        </p>
        <p className="text-xs text-gray-500 mb-6">
          If you need urgent access, contact your site administrator.
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full inline-flex items-center justify-center border border-gray-300 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
