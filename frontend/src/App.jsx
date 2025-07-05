import { Routes, Route, Link } from "react-router-dom"
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import SupplierPage from './pages/SupplierPage'
import TransactionPage from './pages/TransactionPage'
import Navbar from "./components/Navbar";
import TransactionDetailPage from "./pages/TransactionDetailPage";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/transaction-details" element={<TransactionDetailPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Routes>
      </div>
    </>
  )
}
