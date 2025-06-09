import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-orange-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">Share & Save</h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-2.5 text-gray-500 hover:text-orange-500">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/free-products" className="text-white hover:text-orange-200">
              Free Products
            </Link>
            <Link to="/discount-products" className="text-white hover:text-orange-200">
              Discount Products
            </Link>
            <Link to="/food" className="text-white hover:text-orange-200">
              Food
            </Link>
            <Link to="/community" className="text-white hover:text-orange-200">
              Community
            </Link>
            {user && (
              <Link to="/request" className="text-white hover:text-orange-200">
                Request
              </Link>
            )}
            {user ? (
              <>
                <Link to="/cart" className="text-white hover:text-orange-200 flex items-center relative">
                  <FaShoppingCart className="mr-1" />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-white hover:text-orange-200 flex items-center">
                  <FaUser className="mr-1" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-orange-200 px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-orange-200 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-orange-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/free-products"
              className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
            >
              Free Products
            </Link>
            <Link
              to="/discount-products"
              className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
            >
              Discount Products
            </Link>
            <Link
              to="/food"
              className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
            >
              Food
            </Link>
            <Link
              to="/community"
              className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
            >
              Community
            </Link>
            {user && (
              <Link
                to="/request"
                className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
              >
                Request
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
                >
                  Cart ({cartItemsCount})
                </Link>
                <Link
                  to="/profile"
                  className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white hover:bg-orange-500 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-white hover:bg-orange-500 px-3 py-2 rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 