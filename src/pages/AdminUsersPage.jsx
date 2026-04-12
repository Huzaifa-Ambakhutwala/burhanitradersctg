import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../lib/firebase'

export default function AdminUsersPage() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'pending'))
      const snap = await getDocs(q)
      setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (e) {
      setError(e.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (uid) => {
    setBusyId(uid)
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: 'approved',
        approvedAt: serverTimestamp(),
      })
      await load()
    } catch (e) {
      setError(e.message || 'Approve failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/admin" className="text-sm text-primary hover:underline mb-4 inline-block">
          ← Admin home
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pending approvals</h1>
        <p className="text-sm text-gray-600 mb-6">Approve Google accounts that should access the admin area.</p>

        {loading && <p className="text-sm text-gray-600">Loading…</p>}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        {!loading && pending.length === 0 && (
          <p className="text-sm text-gray-600">No pending requests.</p>
        )}

        <ul className="space-y-3">
          {pending.map((u) => (
            <li
              key={u.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="font-medium text-gray-900">{u.displayName || '—'}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <button
                type="button"
                disabled={busyId === u.id}
                onClick={() => approve(u.id)}
                className="shrink-0 inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
              >
                {busyId === u.id ? 'Approving…' : 'Approve'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
