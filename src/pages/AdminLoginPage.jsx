import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { user, profile, loading, profileError, signInWithGoogle, isStaff, isPending } = useAuth()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user || !profile) return
    if (isPending) navigate('/admin/pending', { replace: true })
    else if (isStaff) navigate('/admin/products', { replace: true })
  }, [loading, user, profile, isPending, isStaff, navigate])

  const handleGoogle = async () => {
    setErr('')
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setErr(e.message || 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Admin sign-in</h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign in with Google to manage products and photos. The first account becomes the administrator; others must be
          approved.
        </p>
        {(err || profileError) && (
          <div className="mb-4 text-sm text-red-600">{err || profileError}</div>
        )}
        <button
          type="button"
          disabled={busy || loading}
          onClick={handleGoogle}
          className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {busy || loading ? 'Signing in…' : 'Continue with Google'}
        </button>
      </div>
    </div>
  )
}
