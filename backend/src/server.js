import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { all, get, run } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      // Allow localhost on any port (for development)
      if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
        return callback(null, true)
      }
      // Allow production frontend URL if set
      const allowedOrigin = process.env.FRONTEND_URL
      if (allowedOrigin && origin === allowedOrigin) {
        return callback(null, true)
      }
      callback(null, true) // Allow all for now - restrict in production
    },
    credentials: true,
  })
)
app.use(express.json())

// Serve uploaded files
const uploadsRoot = path.join(__dirname, '..', 'uploads')
const productUploadsRoot = path.join(uploadsRoot, 'products')
fs.mkdirSync(productUploadsRoot, { recursive: true })
app.use('/uploads', express.static(uploadsRoot))

// Multer storage for product photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productId = req.params.id
    const dest = path.join(productUploadsRoot, productId)
    fs.mkdirSync(dest, { recursive: true })
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, safeName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WEBP images are allowed'))
    }
    cb(null, true)
  },
})

// Simple auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Normalize photo URL (fix legacy double /uploads/uploads/ -> /uploads/)
function normalizePhotoUrl(url) {
  if (!url || typeof url !== 'string') return url
  return url.replace(/^\/uploads\/uploads\//, '/uploads/')
}

// Load products JSON (shared from frontend)
const productsPath = path.join(__dirname, '..', '..', 'src', 'data', 'products.json')
// Lazy-load on demand to pick up changes if you edit JSON
function loadProducts() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const raw = fs.readFileSync(productsPath, 'utf-8')
  return JSON.parse(raw)
}

// Auth routes
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }
  try {
    const user = await get('SELECT * FROM admin_users WHERE username = ?', [username])
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    await run('UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id])
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' })
    return res.json({ token })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Login error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/admin/me', authMiddleware, async (req, res) => {
  try {
    const user = await get('SELECT id, username, created_at, last_login_at FROM admin_users WHERE id = ?', [req.user.id])
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.json(user)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Me error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin products list (from JSON)
app.get('/api/admin/products', authMiddleware, (req, res) => {
  try {
    const products = loadProducts()
    const q = (req.query.q || '').toString().toLowerCase()
    const filtered = q
      ? products.filter((p) => p.name.toLowerCase().includes(q) || (p.id || '').toLowerCase().includes(q))
      : products
    return res.json(filtered)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Products error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin get product details + photos
app.get('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const products = loadProducts()
    const product = products.find((p) => p.id === req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    const rows = await all('SELECT * FROM photos WHERE product_id = ? ORDER BY is_primary DESC, created_at DESC', [
      product.id,
    ])
    const photos = rows.map((p) => ({ ...p, url: normalizePhotoUrl(p.url) }))
    return res.json({ product, photos })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Product detail error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin upload photo for a product
app.post('/api/admin/products/:id/photos', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' })
  }
  try {
    const products = loadProducts()
    const product = products.find((p) => p.id === req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    // File lives at uploadsRoot/products/:id/filename; serve at /uploads/products/:id/filename
    const relPath = path.relative(uploadsRoot, req.file.path)
    const url = `/uploads/${relPath.split(path.sep).join('/')}`
    const caption = (req.body.caption || '').toString()
    await run(
      'INSERT INTO photos (product_id, url, status, uploaded_by, is_primary, caption) VALUES (?, ?, ?, ?, ?, ?)',
      [product.id, url, 'approved', req.user.id, 0, caption || null]
    )
    const photo = await get('SELECT * FROM photos WHERE id = last_insert_rowid()')
    if (photo) photo.url = normalizePhotoUrl(photo.url)
    return res.status(201).json(photo)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Upload error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin delete photo
app.delete('/api/admin/photos/:photoId', authMiddleware, async (req, res) => {
  try {
    const photo = await get('SELECT * FROM photos WHERE id = ?', [req.params.photoId])
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    const normalizedUrl = normalizePhotoUrl(photo.url)
    const filePath = path.join(uploadsRoot, normalizedUrl.replace(/^\/uploads\//, ''))
    try {
      fs.unlinkSync(filePath)
    } catch {
      // ignore missing file
    }
    await run('DELETE FROM photos WHERE id = ?', [photo.id])
    return res.json({ success: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Delete photo error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin mark photo as primary
app.patch('/api/admin/photos/:photoId', authMiddleware, async (req, res) => {
  try {
    const photo = await get('SELECT * FROM photos WHERE id = ?', [req.params.photoId])
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    await run('UPDATE photos SET is_primary = 0 WHERE product_id = ?', [photo.product_id])
    await run('UPDATE photos SET is_primary = 1 WHERE id = ?', [photo.id])
    const updated = await get('SELECT * FROM photos WHERE id = ?', [photo.id])
    if (updated) updated.url = normalizePhotoUrl(updated.url)
    return res.json(updated)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Primary photo error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Public endpoint: get product photos
app.get('/api/products/:id/photos', async (req, res) => {
  try {
    const rows = await all(
      'SELECT id, product_id, url, is_primary, caption FROM photos WHERE product_id = ? AND status = ? ORDER BY is_primary DESC, created_at DESC',
      [req.params.id, 'approved']
    )
    const photos = rows.map((p) => ({ ...p, url: normalizePhotoUrl(p.url) }))
    return res.json(photos)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Public photos error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server listening on http://localhost:${PORT}`)
})

