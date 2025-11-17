import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from './theme/ThemeProvider';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SessionsPage from './pages/SessionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProductsPage from './pages/Admin/AdminProductsPage';
import AdminOrdersPage from './pages/Admin/AdminOrdersPage';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminSettings from './pages/Admin/AdminSettings';
import NotFoundPage from './pages/NotFoundPage';
import { loadUser } from './features/auth/authSlice';
import { getCart } from './features/cart/cartSlice';
import { getWishlist } from './features/wishlist/wishlistSlice';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Only load user if we have a token
    if (token) {
      dispatch(loadUser()).catch(() => {
        // If loadUser fails, clear auth
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, [dispatch, token]);

  useEffect(() => {
    // Load cart separately to avoid rate limiting issues
    const loadCart = async () => {
      try {
        await dispatch(getCart()).unwrap();
      } catch (error) {
        // Silently fail for cart loading
        if (error?.status !== 429) {
          console.log('Cart not available');
        }
      }
    };
    loadCart();
  }, [dispatch]);

  useEffect(() => {
    // Load wishlist if user is logged in
    if (token) {
      dispatch(getWishlist()).catch(() => {
        console.log('Wishlist not available');
      });
    }
  }, [dispatch, token]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <CssBaseline />
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
        theme={mode}
      />

      {isAdminRoute ? (
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      )}
    </ThemeProvider>
  );
}

export default App;
