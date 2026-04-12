import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { slugify } from '../lib/slugify'
import defaultCategories from '../data/categories.json'

const CategoriesContext = createContext(null)

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'categories'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        list.sort((a, b) => {
          const ao = a.sortOrder ?? 0
          const bo = b.sortOrder ?? 0
          if (ao !== bo) return ao - bo
          return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
        })
        setCategories(list)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(err)
        setError(err.message || 'Failed to load categories')
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const byId = useMemo(() => {
    const m = new Map()
    for (const c of categories) m.set(c.id, c)
    return m
  }, [categories])

  const bySlug = useMemo(() => {
    const m = new Map()
    for (const c of categories) m.set(c.slug, c)
    return m
  }, [categories])

  const getCategoryById = useCallback((id) => (id ? byId.get(id) : undefined), [byId])
  const getCategoryBySlug = useCallback((slug) => (slug ? bySlug.get(slug) : undefined), [bySlug])

  const countProductsInCategory = useCallback(
    async (categoryId) => {
      const q = query(collection(db, 'products'), where('categoryId', '==', categoryId))
      const snap = await getDocs(q)
      return snap.size
    },
    []
  )

  const importDefaultCategories = useCallback(async () => {
    const batch = writeBatch(db)
    defaultCategories.forEach((c, i) => {
      const ref = doc(db, 'categories', c.id)
      batch.set(
        ref,
        {
          name: c.name,
          slug: c.slug,
          sortOrder: i,
          image: c.image || '',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    })
    await batch.commit()
  }, [])

  const createCategory = useCallback(async ({ name, slug: slugInput, image = '', sortOrder }) => {
    const slug = slugify(slugInput || name)
    const existing = categories.find((c) => c.slug === slug)
    if (existing) throw new Error('A category with this slug already exists.')
    const id = doc(collection(db, 'categories')).id
    const nextOrder =
      sortOrder != null ? sortOrder : categories.reduce((m, c) => Math.max(m, c.sortOrder ?? 0), 0) + 1
    await setDoc(doc(db, 'categories', id), {
      name: name.trim(),
      slug,
      image: image || '',
      sortOrder: nextOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return id
  }, [categories])

  const updateCategory = useCallback(async (id, { name, slug: slugInput, image, sortOrder }) => {
    const payload = { updatedAt: serverTimestamp() }
    if (name != null) payload.name = name.trim()
    if (slugInput != null) {
      const s = slugify(slugInput)
      const taken = categories.some((c) => c.slug === s && c.id !== id)
      if (taken) throw new Error('That slug is already used.')
      payload.slug = s
    }
    if (image !== undefined) payload.image = image
    if (sortOrder != null) payload.sortOrder = sortOrder
    await setDoc(doc(db, 'categories', id), payload, { merge: true })
  }, [categories])

  const deleteCategory = useCallback(
    async (id) => {
      const n = await countProductsInCategory(id)
      if (n > 0) throw new Error(`Cannot delete: ${n} product(s) still use this category.`)
      await deleteDoc(doc(db, 'categories', id))
    },
    [countProductsInCategory]
  )

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      getCategoryById,
      getCategoryBySlug,
      importDefaultCategories,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      categories,
      loading,
      error,
      getCategoryById,
      getCategoryBySlug,
      importDefaultCategories,
      createCategory,
      updateCategory,
      deleteCategory,
    ]
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export function useCategories() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider')
  return ctx
}
