import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import HandToolsPage from './pages/HandToolsPage'
import HandToolsCategoryPage from './pages/HandToolsCategoryPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/category/:slug" element={<CategoryPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="hand-tools" element={<HandToolsPage />} />
        <Route path="hand-tools/:subcategoryId" element={<HandToolsCategoryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
