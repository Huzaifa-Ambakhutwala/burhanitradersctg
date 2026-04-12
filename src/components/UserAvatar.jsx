import { useEffect, useState } from 'react'

/**
 * Google (and some other) avatar URLs may 403 if a cross-origin Referer is sent.
 * referrerPolicy="no-referrer" avoids that; onError falls back to initials.
 */
export default function UserAvatar({ user, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false)
  const url = user?.photoURL?.trim()
  const initial = (user?.displayName || user?.email || '?').charAt(0).toUpperCase()

  useEffect(() => {
    setImgFailed(false)
  }, [url])

  if (!url || imgFailed) {
    return (
      <div
        className={`rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 ${className}`}
      >
        {initial}
      </div>
    )
  }

  return (
    <img
      src={url}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={`rounded-full shrink-0 object-cover ${className}`}
    />
  )
}
