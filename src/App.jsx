import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import AdminStaffRoute from './components/AdminStaffRoute'
import AdminOnlyRoute from './components/AdminOnlyRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import HandToolsPage from './pages/HandToolsPage'
import HandToolsCategoryPage from './pages/HandToolsCategoryPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPendingPage from './pages/AdminPendingPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminProductEditPage from './pages/AdminProductEditPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import BrandsPage from './pages/BrandsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/pending" element={<AdminPendingPage />} />

      <Route
        path="/admin"
        element={
          <AdminStaffRoute>
            <AdminLayout />
          </AdminStaffRoute>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductEditPage />} />
        <Route path="products/:productId" element={<AdminProductEditPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route
          path="users"
          element={
            <AdminOnlyRoute>
              <AdminUsersPage />
            </AdminOnlyRoute>
          }
        />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/category/:slug" element={<CategoryPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="hand-tools" element={<HandToolsPage />} />
        <Route path="hand-tools/:subcategoryId" element={<HandToolsCategoryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
