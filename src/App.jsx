import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import HomePage from '@/components/pages/HomePage';
import CategoryPage from '@/components/pages/CategoryPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CartPage from '@/components/pages/CartPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import OrderConfirmationPage from '@/components/pages/OrderConfirmationPage';
import SearchPage from '@/components/pages/SearchPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;