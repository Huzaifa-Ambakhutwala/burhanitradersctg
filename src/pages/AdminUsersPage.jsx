import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import UserAvatar from '../components/UserAvatar'

const ROLE_ORDER = { pending: 0, admin: 1, approved: 2 }

function roleBadgeClass(role) {
  switch (role) {
    case 'admin':
      return 'bg-violet-100 text-violet-900'
    case 'approved':
      return 'bg-emerald-100 text-emerald-900'
    case 'pending':
      return 'bg-amber-100 text-amber-900'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatRole(role) {
  if (!role) return '—'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const snap = await getDocs(collection(db, 'users'))
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => {
        const ra = ROLE_ORDER[a.role] ?? 99
        const rb = ROLE_ORDER[b.role] ?? 99
        if (ra !== rb) return ra - rb
        return (a.email || '').localeCompare(b.email || '', undefined, { sensitivity: 'base' })
      })
      setUsers(list)
    } catch (e) {
      setError(e.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const pendingCount = useMemo(() => users.filter((u) => u.role === 'pending').length, [users])

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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600 mt-1">
          Everyone with a Google sign-in on the portal. Pending users can be approved to access products and uploads.
        </p>
        {!loading && pendingCount > 0 && (
          <p className="text-sm font-medium text-amber-800 mt-2">{pendingCount} pending approval</p>
        )}

        {loading && <p className="text-sm text-gray-600 mt-6">Loading users…</p>}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        {!loading && users.length === 0 && (
          <p className="text-sm text-gray-600 mt-6">No users found.</p>
        )}

        {!loading && users.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:px-5 sm:py-4 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <UserAvatar
                      user={{
                        photoURL: u.photoURL || '',
                        displayName: u.displayName || '',
                        email: u.email || '',
                      }}
                      className="w-12 h-12 text-base shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 truncate">{u.displayName || '—'}</div>
                      <div className="text-sm text-gray-600 truncate">{u.email || '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end shrink-0 pl-16 sm:pl-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadgeClass(u.role)}`}
                    >
                      {formatRole(u.role)}
                    </span>
                    {u.role === 'pending' && (
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => approve(u.id)}
                        className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 min-h-[40px]"
                      >
                        {busyId === u.id ? 'Approving…' : 'Approve'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
