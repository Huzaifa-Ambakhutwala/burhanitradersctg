import { Navigate } from 'react-router-dom'

/** Legacy URL: same catalog as Firestore category `hand-tools` when present. */
export default function HandToolsPage() {
  return <Navigate to="/products/category/hand-tools" replace />
}
