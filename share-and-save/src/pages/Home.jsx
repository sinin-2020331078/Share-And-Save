import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTag, FaUtensils, FaUsers, FaHandPaper } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Categories Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link to="/free-products" className="flex flex-col items-center p-4 hover:bg-orange-50 rounded-lg transition-colors">
              <FaShoppingBag className="text-3xl text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Free Products</span>
            </Link>
            <Link to="/discount-products" className="flex flex-col items-center p-4 hover:bg-orange-50 rounded-lg transition-colors">
              <FaTag className="text-3xl text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Discount Products</span>
            </Link>
            <Link to="/food" className="flex flex-col items-center p-4 hover:bg-orange-50 rounded-lg transition-colors">
              <FaUtensils className="text-3xl text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Food</span>
            </Link>
            <Link to="/community" className="flex flex-col items-center p-4 hover:bg-orange-50 rounded-lg transition-colors">
              <FaUsers className="text-3xl text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Community</span>
            </Link>
            <Link to="/request" className="flex flex-col items-center p-4 hover:bg-orange-50 rounded-lg transition-colors">
              <FaHandPaper className="text-3xl text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Request</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Product Card Template */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative pb-[100%]">
              <img
                src="https://via.placeholder.com/300"
                alt="Product"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Name</h3>
              <div className="flex items-center justify-between">
                <span className="text-orange-500 font-bold">$99.99</span>
                <span className="text-gray-500 line-through">$129.99</span>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(120)</span>
              </div>
            </div>
          </div>
          {/* Repeat product card for more items */}
        </div>
      </div>

      {/* Flash Sale Section */}
      <div className="bg-orange-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Flash Sale</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Ends in:</span>
              <div className="flex space-x-1">
                <div className="bg-orange-500 text-white px-2 py-1 rounded">12</div>
                <span className="text-orange-500">:</span>
                <div className="bg-orange-500 text-white px-2 py-1 rounded">45</div>
                <span className="text-orange-500">:</span>
                <div className="bg-orange-500 text-white px-2 py-1 rounded">30</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Flash Sale Product Card Template */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative pb-[100%]">
                <img
                  src="https://via.placeholder.com/300"
                  alt="Flash Sale Product"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  -50%
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Flash Sale Product</h3>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold">$49.99</span>
                  <span className="text-gray-500 line-through">$99.99</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">70% sold</p>
                </div>
              </div>
            </div>
            {/* Repeat flash sale product card for more items */}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Fashion', 'Home & Living', 'Beauty'].map((category) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              <p className="text-sm text-gray-500 mt-2">Shop Now →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 