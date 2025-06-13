import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path) => {
    const baseClasses = "text-white hover:text-orange-200";
    const activeClasses = "text-green-300 font-semibold";
    return `${baseClasses} ${isActive(path) ? activeClasses : ''}`;
  };

  // Function to get mobile link classes based on active state
  const getMobileLinkClasses = (path) => {
    const baseClasses = "block text-white hover:bg-orange-500 px-3 py-2 rounded-md";
    const activeClasses = "bg-green-600 text-white font-semibold";
    return `${baseClasses} ${isActive(path) ? activeClasses : ''}`;
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const unreadCount = response.data.filter(n => !n.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    if (token) {
      fetchUnreadCount();
      // Set up polling every minute to check for new notifications
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

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
            <Link to="/free-products" className={getLinkClasses('/free-products')}>
              Free Products
            </Link>
            <Link to="/discount-products" className={getLinkClasses('/discount-products')}>
              Discount Products
            </Link>
            <Link to="/food" className={getLinkClasses('/food')}>
              Food
            </Link>
            <Link to="/community" className={getLinkClasses('/community')}>
              Community
            </Link>
            {user && (
              <Link to="/request" className={getLinkClasses('/request')}>
                Request
              </Link>
            )}
            {user ? (
              <>
                <Link to="/notifications" className={`${getLinkClasses('/notifications')} flex items-center relative`}>
                  <FaBell className="mr-1" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className={`${getLinkClasses('/cart')} flex items-center relative`}>
                  <FaShoppingCart className="mr-1" />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className={`${getLinkClasses('/profile')} flex items-center`}>
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
                  className={`${getLinkClasses('/login')} px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors`}
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
              className={getMobileLinkClasses('/free-products')}
            >
              Free Products
            </Link>
            <Link
              to="/discount-products"
              className={getMobileLinkClasses('/discount-products')}
            >
              Discount Products
            </Link>
            <Link
              to="/food"
              className={getMobileLinkClasses('/food')}
            >
              Food
            </Link>
            <Link
              to="/community"
              className={getMobileLinkClasses('/community')}
            >
              Community
            </Link>
            {user && (
              <Link
                to="/request"
                className={getMobileLinkClasses('/request')}
              >
                Request
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className={getMobileLinkClasses('/notifications')}
                >
                  Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
                </Link>
                <Link
                  to="/cart"
                  className={getMobileLinkClasses('/cart')}
                >
                  Cart ({cartItemsCount})
                </Link>
                <Link
                  to="/profile"
                  className={getMobileLinkClasses('/profile')}
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
                  className={getMobileLinkClasses('/login')}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={getMobileLinkClasses('/signup')}
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