import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminOnlyRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">
        Loading…
      </div>
    )
  }

  if (!user || profile?.role === 'pending') {
    return <Navigate to="/admin/login" replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/admin/products" replace />
  }

  return children
}
