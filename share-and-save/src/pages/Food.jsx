import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Food = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8000/api/food/';
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (showFreeOnly) {
        params.append('free_only', 'true');
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axios.get(url);
      console.log('Fetched food items:', response.data); // Debug log
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to load food items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, [selectedCategory, showFreeOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoodItems();
  };

  const handleAddToCart = (item) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    addToCart({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image_url,
      category: item.category,
      location: item.location,
      price: item.is_free ? 0 : item.price,
      expiry_date: item.expiry_date,
      type: 'food'
    });
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Food Items</h1>
          {user && (
            <Link
              to="/list-food"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              List Food Item
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          <button 
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
                Search
          </button>
        </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
            <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Categories</option>
              <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat & Seafood</option>
                <option value="baked">Baked Goods</option>
              <option value="canned">Canned Goods</option>
              <option value="other">Other</option>
            </select>
            </div>

            {/* Free Items Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="freeOnly"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="freeOnly" className="ml-2 block text-sm text-gray-900">
                Show Free Items Only
              </label>
            </div>
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foodItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={item.image_url || 'https://via.placeholder.com/300x200'}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{item.category}</span>
                  <span className="text-sm text-gray-500">{item.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-600">
                    {item.is_free ? 'Free' : `$${item.price}`}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

        {/* No Results */}
        {foodItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No food items found matching your criteria.</p>
          </div>
        )}
        </div>
    </div>
  );
};

export default Food; 