import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FreeProducts from './pages/FreeProducts';
import DiscountProducts from './pages/DiscountProducts';
import Food from './pages/Food';
import Community from './pages/Community';
import Request from './pages/Request';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Profile from './pages/Profile';
import ListProduct from './pages/ListProduct';
import ListFreeProduct from './pages/ListFreeProduct';
import ListDiscountProduct from './pages/ListDiscountProduct';
import ListFood from './pages/ListFood';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Payment from './pages/Payment';
import Notifications from './pages/Notifications';
import AboutPage from './pages/AboutPage';

// Import AuthProvider and CartProvider
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// New component to handle conditional Navbar rendering and routes
const AppContent = () => {
  const location = useLocation();
  // Define paths where the Navbar should be hidden
  const hideNavbar = [
    '/signup',
    '/login',
    '/forgot-password',
    '/reset-password',
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordConfirm />} />
          
          {/* Public content routes */}
          <Route path="/free-products" element={<FreeProducts />} />
          <Route path="/discount-products" element={<DiscountProducts />} />
          <Route path="/food" element={<Food />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Protected routes - accessible only if authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/request" element={<Request />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/list-product" element={<ListProduct />} />
            <Route path="/list-free-product" element={<ListFreeProduct />} />
            <Route path="/list-discount-product" element={<ListDiscountProduct />} />
            <Route path="/list-food" element={<ListFood />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
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
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 