import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, PlusIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const DiscountProducts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [distance, setDistance] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Example products with price
  const products = [
    {
      id: 1,
      title: 'Brand New Laptop',
      desc: 'Latest model with great specs.',
      price: 799.99,
      distance: '2 miles away',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
    {
      id: 2,
      title: "Smartphone",
      desc: "Latest model with 128GB storage.",
      price: 499.99,
      distance: "5 miles away",
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 3,
      title: "Wireless Headphones",
      desc: "Noise cancelling with 30-hour battery life.",
      price: 149.99,
      distance: "1 mile away",
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
  ];

  const handleListProduct = () => {
    if (isAuthenticated) {
      navigate('/list-discount-product');
    } else {
      setShowAuthModal(true);
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
          <form className="flex-1 flex items-center bg-white rounded-xl shadow-lg px-4 py-3 max-w-xl" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-700 text-lg"
              placeholder="Search discount products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="text-blue-600 hover:text-blue-700 p-2 transition-colors">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </form>
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
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
            <select 
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              value={priceRange} 
              onChange={e => setPriceRange(e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500+">$500+</option>
            </select>
            <select 
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              value={distance} 
              onChange={e => setDistance(e.target.value)}
            >
              <option value="">Any Distance</option>
              <option value="1">Within 1 mile</option>
              <option value="2">Within 2 miles</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow transition-all transform hover:scale-105 w-full md:w-auto">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ${product.price}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-4">{product.desc}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center text-gray-500 text-sm">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {product.distance}
                  </span>
                  <span className="flex items-center text-gray-500 text-sm">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                    {product.price}
                  </span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sign in to List Products</h3>
            <p className="text-gray-600 mb-6">
              To list products and help others in your community, please sign in or create an account.
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