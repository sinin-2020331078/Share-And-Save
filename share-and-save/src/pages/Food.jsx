import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { MagnifyingGlassIcon, PlusIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash/debounce';

const Food = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const { addToCart } = useCart();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchFoodItems = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchParams.category || selectedCategory ? { category: searchParams.category || selectedCategory } : {}),
        ...(searchParams.freeOnly || showFreeOnly ? { free_only: true } : {}),
        ...(searchParams.search ? { search: searchParams.search } : {}),
        ...(searchParams.location ? { location: searchParams.location } : {})
      });

      const headers = {};
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(
        `http://localhost:8000/api/food/?${params}`,
        { headers }
      );
      setFoodItems(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to fetch food items. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, showFreeOnly, isAuthenticated, token]);

  // Create memoized debounced search functions
  const debouncedSearch = useCallback(
    debounce((term) => {
      fetchFoodItems({ search: term });
    }, 500),
    [fetchFoodItems]
  );

  const debouncedLocationSearch = useCallback(
    debounce((term) => {
      fetchFoodItems({ location: term });
    }, 500),
    [fetchFoodItems]
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleLocationSearchChange = (e) => {
    const value = e.target.value;
    setLocationSearch(value);
    debouncedLocationSearch(value);
  };

  // Handle category and free only changes
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    fetchFoodItems({ category: value });
  };

  const handleFreeOnlyChange = (e) => {
    const value = e.target.checked;
    setShowFreeOnly(value);
    fetchFoodItems({ freeOnly: value });
  };

  // Initial fetch
  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedLocationSearch.cancel();
    };
  }, [debouncedSearch, debouncedLocationSearch]);

  const handleAddToCart = (item) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    addToCart({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url || (item.image ? `http://localhost:8000${item.image}` : null),
      category: item.category,
      location: item.location,
      price: item.is_free ? 0 : Math.floor(item.price),
      expiry_date: item.expiry_date,
      type: 'food'
    });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/food/${itemId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Remove the deleted item from the state
      setFoodItems(foodItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting food item:', error);
      alert('Failed to delete food item. Please try again.');
    }
  };

  const handleContactSeller = (item) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to the community page with the seller's user ID
    if (item.user_id) {
      navigate('/community', { state: { userId: item.user_id } });
    } else {
      alert('Seller information not available.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={fetchFoodItems}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-10">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Food Items</h1>
          <p className="text-lg text-green-100">Share and find food items in your community</p>
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
                placeholder="Search food items..."
                value={searchTerm}
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
            onClick={() => navigate('/list-food')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 w-full md:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5" />
            List Food Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <select 
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="bakery">Bakery</option>
              <option value="canned">Canned Goods</option>
              <option value="snacks">Snacks</option>
              <option value="beverages">Beverages</option>
              <option value="other">Other</option>
            </select>
            <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                checked={showFreeOnly}
                onChange={handleFreeOnlyChange}
              />
              <span className="text-gray-700">Show Free Items Only</span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden group">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  {/* Title Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xl font-bold text-center px-4">{item.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                    {item.is_free && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>
                  {!item.is_free && (
                    <div className="text-lg font-bold text-green-600 mb-3">
                      ${item.price}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex-grow"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleContactSeller(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex-grow"
                    >
                      Contact Seller
                    </button>
                    {isAuthenticated && item.user === user?.email && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-red-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Delete food item"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Food; 