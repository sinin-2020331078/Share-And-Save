import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', error);
    }
  };

  // Example stats and listings
  const stats = {
    listed: 12,
    sold: 8,
    given: 5,
    rating: 4.8,
  };
  const listings = [
    {
      id: 1,
      title: 'Smartphone',
      desc: "Last year's model, excellent condition",
      price: 50,
      image: '',
    },
  ];

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6 md:w-1/4">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-400 text-sm">
              <span>Profile Picture</span>
            </div>
            <h2 className="text-xl font-bold mb-1">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded mb-2 w-full"
            >
              Edit Profile
            </button>
            <button className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 rounded w-full">View Activity</button>
          </div>
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4 text-gray-700">Quick Stats</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Items Listed</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">{stats.listed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Items Sold</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">{stats.sold}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Items Given</span>
                <span className="bg-yellow-400 text-white px-2 py-1 rounded text-xs font-bold">{stats.given}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rating</span>
                <span className="bg-yellow-400 text-white px-2 py-1 rounded text-xs font-bold">{stats.rating}/5</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow p-4 flex gap-6 mb-2">
            <button onClick={() => setActiveTab('listings')} className={`font-semibold px-4 py-2 rounded ${activeTab === 'listings' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>Listings</button>
            <button onClick={() => setActiveTab('orders')} className={`font-semibold px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>Orders</button>
            <button onClick={() => setActiveTab('requests')} className={`font-semibold px-4 py-2 rounded ${activeTab === 'requests' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>My Requests</button>
            <button onClick={() => setActiveTab('settings')} className={`font-semibold px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>Settings</button>
          </div>
          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Listing Card */}
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm mb-2 md:mb-0">
                  <span>Product Image</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{listing.title}</h3>
                  <p className="text-gray-600 mb-2">{listing.desc}</p>
                  <span className="text-green-600 font-bold text-lg">${listing.price}</span>
                </div>
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:ml-4">
                  <button className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-4 py-1 rounded mb-2 md:mb-0 md:mr-2">Edit</button>
                  <button className="border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold px-4 py-1 rounded">Remove</button>
                </div>
              </div>
            ))}
            {/* Add New Listing Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[140px]">
              <PlusIcon className="w-10 h-10 text-gray-400 mb-2" />
              <div className="text-lg font-semibold text-gray-700 mb-2">Add New Listing</div>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded">List Item</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 