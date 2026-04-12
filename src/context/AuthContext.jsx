import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setProfileError(null)
      if (!firebaseUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }
      setUser(firebaseUser)
      setLoading(true)
      try {
        const role = await ensureUserProfile(firebaseUser)
        setProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role,
        })
      } catch (e) {
        console.error(e)
        setProfileError(e.message || 'Failed to load profile')
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileError,
      signInWithGoogle: async () => {
        setProfileError(null)
        await signInWithPopup(auth, googleProvider)
      },
      signOut: () => firebaseSignOut(auth),
      isStaff: profile?.role === 'admin' || profile?.role === 'approved',
      isAdmin: profile?.role === 'admin',
      isPending: profile?.role === 'pending',
      refreshProfile: async () => {
        const u = auth.currentUser
        if (!u) return
        const snap = await getDoc(doc(db, 'users', u.uid))
        if (snap.exists()) {
          setProfile((prev) => ({
            ...prev,
            role: snap.data().role,
          }))
        }
      },
    }),
    [user, profile, loading, profileError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/**
 * First Google user becomes admin via settings/bootstrap (first writer wins).
 * Later users get role pending until an admin approves them.
 *
 * Bootstrap and user docs are written in separate transactions so Firestore
 * rules can see a committed bootstrap doc before evaluating user create (rules
 * do not see uncommitted writes from the same transaction).
 */
async function ensureUserProfile(user) {
  const bootstrapRef = doc(db, 'settings', 'bootstrap')
  const userRef = doc(db, 'users', user.uid)

  const existingUser = await getDoc(userRef)
  if (existingUser.exists()) {
    return existingUser.data().role
  }

  await runTransaction(db, async (transaction) => {
    const b = await transaction.get(bootstrapRef)
    if (!b.exists()) {
      transaction.set(bootstrapRef, {
        firstAdminUid: user.uid,
        createdAt: serverTimestamp(),
      })
    }
  })

  const bAfter = await getDoc(bootstrapRef)
  if (!bAfter.exists() || !bAfter.data().firstAdminUid) {
    throw new Error('Could not initialize app settings')
  }

  const role = bAfter.data().firstAdminUid === user.uid ? 'admin' : 'pending'

  await runTransaction(db, async (transaction) => {
    const u = await transaction.get(userRef)
    if (u.exists()) return
    transaction.set(userRef, {
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role,
      createdAt: serverTimestamp(),
    })
  })

  const final = await getDoc(userRef)
  if (!final.exists()) {
    throw new Error('Could not create user profile')
  }
  return final.data().role
}
