import nodemailer from 'nodemailer'

const MAX_LEN = { name: 200, email: 320, message: 8000 }

function isConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO
  )
}

function validate(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!name || name.length > MAX_LEN.name) return { error: 'Invalid name' }
  if (!email || email.length > MAX_LEN.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Invalid email' }
  }
  if (message.length > MAX_LEN.message) return { error: 'Message too long' }
  return { name, email, message }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isConfigured()) {
    return res.status(503).json({ error: 'not_configured' })
  }

  let body = {}
  try {
    if (req.body == null) {
      body = {}
    } else if (typeof req.body === 'string') {
      body = JSON.parse(req.body || '{}')
    } else if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      body = req.body
    }
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const parsed = validate(body)
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error })
  }

  const { name, email, message } = parsed
  const siteName = process.env.CONTACT_SITE_NAME || 'Website'

  const port = Number(process.env.SMTP_PORT || 587)
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const from = process.env.CONTACT_FROM || process.env.SMTP_USER

  try {
    await transporter.sendMail({
      from: `"${siteName} enquiry" <${from}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `Website enquiry — ${name}`,
      text: [`From: ${name} <${email}>`, '', message || '(no message)'].join('\n'),
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message || '(no message)').replace(/\n/g, '<br/>')}</p>`,
    })
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('contact mail error', e.message)
    return res.status(500).json({ error: 'send_failed' })
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
