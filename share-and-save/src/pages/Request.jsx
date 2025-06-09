import React, { useState, useEffect } from 'react';
import { PlusIcon, MapPinIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  Active: 'bg-blue-100 text-blue-600',
  Fulfilled: 'bg-green-100 text-green-600',
};

const categoryColors = {
  Furniture: 'bg-orange-100 text-orange-600',
  Clothing: 'bg-purple-100 text-purple-600',
  Books: 'bg-yellow-100 text-yellow-600',
  Other: 'bg-gray-100 text-gray-600',
};

const API_BASE_URL = 'http://localhost:8000/api';

const Request = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/requests/`);
      console.log('Fetched requests:', response.data);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error.response || error);
      setError('Failed to fetch requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isAuthenticated || !token) {
        setError('Please log in to create a request');
        navigate('/login');
        return;
      }

      // Validate form data
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }
      if (!formData.description.trim()) {
        setError('Description is required');
        return;
      }
      if (!formData.category) {
        setError('Please select a category');
        return;
      }
      if (!formData.location.trim()) {
        setError('Location is required');
        return;
      }

      console.log('Submitting request:', formData);
      const response = await axios.post(`${API_BASE_URL}/requests/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      console.log('Request created:', response.data);

      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
      });
      await fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error.response || error);
      if (error.response?.status === 401) {
        setError('Please log in to create a request');
        navigate('/login');
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle validation errors
        const errorMessages = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError('Failed to create request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (!isAuthenticated || !token) {
      setError('Please log in to create a request');
      navigate('/login');
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Community Requests</h1>
          <button 
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Request
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl whitespace-pre-line">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(req => (
              <div 
                key={req.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${req.user.username}&background=0D8ABC&color=fff`}
                        alt={req.user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{req.title}</h3>
                        <div className="text-sm text-gray-500">Posted by {req.user.username}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{req.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[req.category]}`}>
                      {req.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <ClockIcon className="w-4 h-4" />
                      {req.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <MapPinIcon className="w-4 h-4" />
                      {req.location}
                    </span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all transform hover:scale-[1.02]">
                    Contact Requester
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Request</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm whitespace-pre-line">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="What are you looking for?"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  rows="4"
                  placeholder="Provide more details about your request..."
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your location"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request; 