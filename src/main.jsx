import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import RouteScrollToTop from './components/RouteScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { CategoriesProvider } from './context/CategoriesContext'
import { ProductsProvider } from './context/ProductsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteScrollToTop />
      <AuthProvider>
        <CategoriesProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </CategoriesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
