import { useEffect, useMemo, useState } from 'react'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { defaultHero } from '../lib/defaultHeroSlides'
import { uploadHeroImage } from '../lib/heroImages'
import { slugify } from '../lib/slugify'

function normalizeHero(data) {
  const autoAdvanceMs = Number(data?.autoAdvanceMs) || defaultHero.autoAdvanceMs
  const slides = Array.isArray(data?.slides) && data.slides.length ? data.slides : defaultHero.slides
  return {
    autoAdvanceMs,
    slides: slides.map((s) => ({
      title: s?.title ?? '',
      subtitle: s?.subtitle ?? '',
      ctaLabel: s?.ctaLabel ?? s?.cta ?? 'Shop Now',
      ctaHref: s?.ctaHref ?? '/products',
      imageUrl: s?.imageUrl ?? '',
      imagePath: s?.imagePath ?? '',
      bg: s?.bg ?? '',
    })),
  }
}

export default function AdminHeroPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [hero, setHero] = useState(defaultHero)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      setMsg('')
      try {
        const snap = await getDoc(doc(db, 'settings', 'hero'))
        if (cancelled) return
        if (!snap.exists()) {
          setHero(defaultHero)
        } else {
          setHero(normalizeHero(snap.data()))
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load hero settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const slideCount = hero.slides.length

  const setSlide = (idx, patch) => {
    setHero((h) => ({
      ...h,
      slides: h.slides.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    }))
  }

  const addSlide = () => {
    setHero((h) => ({
      ...h,
      slides: [
        ...h.slides,
        {
          title: 'New slide',
          subtitle: 'Edit this text in admin.',
          ctaLabel: 'Shop Now',
          ctaHref: '/products',
          imageUrl: '',
          imagePath: '',
          bg: defaultHero.slides[h.slides.length % defaultHero.slides.length].bg,
        },
      ],
    }))
  }

  const removeSlide = (idx) => {
    if (slideCount <= 1) return
    setHero((h) => ({ ...h, slides: h.slides.filter((_, i) => i !== idx) }))
  }

  const moveSlide = (from, to) => {
    setHero((h) => {
      const next = [...h.slides]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return { ...h, slides: next }
    })
  }

  const handleUpload = async (idx, file) => {
    if (!user || !file) return
    setError('')
    setMsg('')
    try {
      const { downloadURL, storagePath } = await uploadHeroImage(file, user.uid)
      setSlide(idx, { imageUrl: downloadURL, imagePath: storagePath })
      setMsg('Image uploaded (not saved yet). Click Save changes to publish.')
    } catch (e) {
      setError(e.message || 'Upload failed')
    }
  }

  const save = async () => {
    setSaving(true)
    setError('')
    setMsg('')
    try {
      const autoAdvanceMs = Math.max(1000, Number(hero.autoAdvanceMs) || defaultHero.autoAdvanceMs)
      const slides = hero.slides.map((s) => ({
        title: String(s.title || '').trim(),
        subtitle: String(s.subtitle || '').trim(),
        ctaLabel: String(s.ctaLabel || 'Shop Now').trim(),
        ctaHref: String(s.ctaHref || '/products').trim() || '/products',
        imageUrl: String(s.imageUrl || '').trim(),
        imagePath: String(s.imagePath || '').trim(),
        bg: String(s.bg || '').trim(),
      }))
      // keep a stable slug-ish href if someone pastes raw brand/category names
      for (const s of slides) {
        if (s.ctaHref.startsWith('/products?brand=')) {
          const brand = s.ctaHref.split('brand=')[1]
          if (brand) s.ctaHref = `/products?brand=${encodeURIComponent(slugify(decodeURIComponent(brand)))}` // normalize
        }
      }

      await setDoc(
        doc(db, 'settings', 'hero'),
        {
          autoAdvanceMs,
          slides,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setMsg('Hero carousel updated.')
    } catch (e) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">Loading hero…</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hero carousel</h1>
          <p className="text-sm text-gray-600 mt-1">
            Edit slides, upload images, and update the text overlay. Changes go live after you save.
          </p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>}
        {msg && <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm">{msg}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Auto-advance (ms)</label>
              <input
                type="number"
                min={1000}
                step={500}
                value={hero.autoAdvanceMs}
                onChange={(e) => setHero((h) => ({ ...h, autoAdvanceMs: e.target.value }))}
                className="mt-1 w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addSlide}
                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50"
              >
                + Add slide
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {hero.slides.map((s, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Slide {idx + 1}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Image + overlay text</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveSlide(idx, Math.max(0, idx - 1))}
                    disabled={idx === 0}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(idx, Math.min(slideCount - 1, idx + 1))}
                    disabled={idx === slideCount - 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    ↓ Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(idx)}
                    disabled={slideCount <= 1}
                    className="px-3 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                    {s.imageUrl ? (
                      <>
                        <img src={s.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      </>
                    ) : (
                      <div className="absolute inset-0" style={{ background: s.bg || defaultHero.slides[idx % defaultHero.slides.length].bg }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                      <div className="text-white">
                        <div className="font-bold text-lg leading-tight">{s.title || 'Title'}</div>
                        <div className="text-white/90 text-sm mt-1">{s.subtitle || 'Subtitle'}</div>
                      </div>
                    </div>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mt-3">Upload image (optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleUpload(idx, e.target.files?.[0])}
                    className="mt-1 block w-full text-sm file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:text-xs file:font-semibold"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If no image is uploaded, the slide uses a gradient background.
                  </p>
                </div>

                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => setSlide(idx, { title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <textarea
                      rows={3}
                      value={s.subtitle}
                      onChange={(e) => setSlide(idx, { subtitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CTA label</label>
                      <input
                        type="text"
                        value={s.ctaLabel}
                        onChange={(e) => setSlide(idx, { ctaLabel: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CTA link</label>
                      <input
                        type="text"
                        value={s.ctaHref}
                        onChange={(e) => setSlide(idx, { ctaHref: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                        placeholder="/products"
                      />
                      <p className="text-xs text-gray-500 mt-1">Example: <span className="font-mono">/products</span> or <span className="font-mono">/products?brand=makita</span></p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gradient background (optional)</label>
                    <input
                      type="text"
                      value={s.bg}
                      onChange={(e) => setSlide(idx, { bg: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                      placeholder={defaultHero.slides[idx % defaultHero.slides.length].bg}
                    />
                    <p className="text-xs text-gray-500 mt-1">Used when no image is uploaded. Leave blank to use the default.</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

