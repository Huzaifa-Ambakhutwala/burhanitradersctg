import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminStaffRoute({ children }) {
  const { user, profile, loading, profileError } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">
        Loading…
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-600 text-sm">{profileError}</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (profile?.role === 'pending') {
    return <Navigate to="/admin/pending" replace />
  }

  if (profile?.role !== 'admin' && profile?.role !== 'approved') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
