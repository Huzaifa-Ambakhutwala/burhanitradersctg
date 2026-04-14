import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 via-white to-primary/5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-2 text-center">
            <Link to="/" className="inline-flex flex-col items-center gap-3 group" aria-label="Burhani Traders home">
              <img
                src="/BT_Logo2.png"
                alt=""
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-md ring-4 ring-white group-hover:ring-primary/10 transition-shadow"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold tracking-tight text-[#1E3A8A]">Burhani</span>
                <span className="text-xl font-extrabold tracking-tight text-[#D4AF37]">Traders</span>
              </span>
            </Link>
            <h1 className="mt-8 text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-2 text-sm text-gray-500">Use your Google account to continue.</p>
          </div>

          <div className="px-8 pb-10 pt-4">
            {(err || profileError) && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-800">
                {err || profileError}
              </div>
            )}
            <button
              type="button"
              disabled={busy || loading}
              onClick={handleGoogle}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 disabled:opacity-60 transition-colors min-h-[52px]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
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

        <p className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-primary hover:text-primary-dark hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
