import { Navigate } from 'react-router-dom'

/** Legacy hand-tool sub-routes merged into the main hand-tools category. */
export default function HandToolsCategoryPage() {
  return <Navigate to="/products/category/hand-tools" replace />
}
