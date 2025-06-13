import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, PlusIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import debounce from 'lodash/debounce';

const DiscountProducts = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const [search, setSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [distance, setDistance] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const fetchProducts = async (searchParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchParams.category || category ? { category: searchParams.category || category } : {}),
        ...(searchParams.priceRange || priceRange ? { price_range: searchParams.priceRange || priceRange } : {}),
        ...(searchParams.search ? { search: searchParams.search } : {}),
        ...(searchParams.location ? { location: searchParams.location } : {})
      });

      const headers = {};
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(
        `http://localhost:8000/api/discount-products/?${params}`,
        { headers }
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search functions
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      fetchProducts({ search: searchTerm });
    }, 500),
    [category, priceRange]
  );

  const debouncedLocationSearch = useCallback(
    debounce((locationTerm) => {
      fetchProducts({ location: locationTerm });
    }, 500),
    [category, priceRange]
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleLocationSearchChange = (e) => {
    const value = e.target.value;
    setLocationSearch(value);
    debouncedLocationSearch(value);
  };

  // Handle category and price range changes
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    fetchProducts({ category: value });
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    fetchProducts({ priceRange: value });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleListProduct = () => {
    if (isAuthenticated) {
      navigate('/list-discount-product');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        console.error('Product not found:', productId);
        return;
      }

      addToCart({
        id: product.id,
        title: product.title,
        description: product.description,
        image_url: product.image_url || (product.image ? `http://localhost:8000${product.image}` : null),
        category: product.category,
        condition: product.condition,
        location: product.location,
        price: Math.floor(product.discount_price),
        original_price: Math.floor(product.original_price),
        discount_percentage: product.discount_percentage,
        type: 'discount'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleContactSeller = (product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to the community page with the seller's user ID
    if (product.user_id) {
      navigate('/community', { state: { userId: product.user_id } });
    } else {
      alert('Seller information not available.');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/discount-products/${productId}/`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      // Remove the deleted product from the state
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-10">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discount Products</h1>
          <p className="text-lg text-blue-100">Find great deals in your community</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Search and List Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center bg-white rounded-xl shadow-lg px-4 py-3">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-700 text-lg"
                placeholder="Search discount products..."
                value={search}
                onChange={handleSearchChange}
              />
              <MagnifyingGlassIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 flex items-center bg-white rounded-xl shadow-lg px-4 py-3">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-700 text-lg"
                placeholder="Search by location..."
                value={locationSearch}
                onChange={handleLocationSearchChange}
              />
              <MapPinIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <button 
            onClick={handleListProduct}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 w-full md:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5" />
            List Discount Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <select 
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              value={category} 
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="toys">Toys</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="home">Home & Garden</option>
              <option value="other">Other</option>
            </select>
            <select 
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              value={priceRange} 
              onChange={handlePriceRangeChange}
            >
              <option value="">All Price Ranges</option>
              <option value="0-10">$0 - $10</option>
              <option value="10-25">$10 - $25</option>
              <option value="25-50">$25 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Product Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden group">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {product.discount_percentage}% OFF
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm truncate">{product.title}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center text-gray-500 text-sm">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {product.location}
                    </span>
                    <span className="flex items-center text-gray-500 text-sm">
                      <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                      <span className="line-through text-gray-400 mr-2">{Math.floor(product.original_price)} taka</span>
                      <span className="text-green-600 font-bold">{Math.floor(product.discount_price)} taka</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleContactSeller(product)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                      >
                        Contact Seller
                      </button>
                      {isAuthenticated && product.user === user?.email && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-3 text-red-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sign in to Continue</h3>
            <p className="text-gray-600 mb-6">
              To list products, add items to cart, or contact sellers, please sign in or create an account.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-center transition-colors"
                onClick={() => setShowAuthModal(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg text-center transition-colors"
                onClick={() => setShowAuthModal(false)}
              >
                Create Account
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountProducts; 