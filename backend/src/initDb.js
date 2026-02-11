import bcrypt from 'bcryptjs'
import { run } from './db.js'

async function init() {
  await run(
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    );`
  )

  await run(
    `CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      uploaded_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_primary INTEGER DEFAULT 0,
      caption TEXT,
      FOREIGN KEY (uploaded_by) REFERENCES admin_users(id)
    );`
  )

  const defaultUsername = process.env.ADMIN_USERNAME || 'admin'
  const defaultPassword = process.env.ADMIN_PASSWORD || 'changeme'

  const passwordHash = await bcrypt.hash(defaultPassword, 10)

  await run(
    `INSERT OR IGNORE INTO admin_users (username, password_hash)
     VALUES (?, ?);`,
    [defaultUsername, passwordHash]
  )

  // eslint-disable-next-line no-console
  console.log('Database initialized. Default admin:', defaultUsername)
}

init().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error initializing DB', err)
  process.exit(1)
})

