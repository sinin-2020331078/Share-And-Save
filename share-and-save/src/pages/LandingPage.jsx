import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTag, FaUtensils, FaUsers, FaHandPaper } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Share & Save
            </h1>
            <p className="mt-4 text-xl text-orange-100">
              Your community marketplace for sharing and saving
            </p>
          </div>
        </div>
      </div>

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

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src={require('../assets/team-member-1.jpg')}
                alt="Ehsanul Haque Sinin"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Ehsanul Haque Sinin</h3>
            <p className="text-gray-600 mt-2">Full-stack developer</p>
          </div>
          <div className="text-center">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src={require('../assets/team-member-2.jpg')}
                alt="Amit Biswas"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Amit Biswas</h3>
            <p className="text-gray-600 mt-2">Full-stack developer</p>
          </div>
          <div className="text-center">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src={require('../assets/team-member-3.jpg')}
                alt="Tazbir Hossain Akash"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Tazbir Hossain Akash</h3>
            <p className="text-gray-600 mt-2">Full-stack developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 