import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MagnifyingGlassIcon, PlusIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash/debounce';

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
  const { isAuthenticated, token, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchRequests = useCallback(async (searchParams = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(searchParams.category || selectedCategory ? { category: searchParams.category || selectedCategory } : {}),
        ...(searchParams.search ? { search: searchParams.search } : {}),
        ...(searchParams.location ? { location: searchParams.location } : {})
      });

      const headers = {};
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(
        `http://localhost:8000/api/requests/?${params}`,
        { headers }
      );
      console.log('Current user:', user);
      console.log('Requests data:', response.data);
      setRequests(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to fetch requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, isAuthenticated, token, user]);

  // Create memoized debounced search functions
  const debouncedSearch = useCallback(
    debounce((term) => {
      fetchRequests({ search: term });
    }, 500),
    [fetchRequests]
  );

  const debouncedLocationSearch = useCallback(
    debounce((term) => {
      fetchRequests({ location: term });
    }, 500),
    [fetchRequests]
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

  // Handle category change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    fetchRequests({ category: value });
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedLocationSearch.cancel();
    };
  }, [debouncedSearch, debouncedLocationSearch]);

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

  const handleCreateRequest = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await axios.delete(`${API_BASE_URL}/requests/${requestId}/`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      // Remove the deleted request from the state
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error.response || error);
      if (error.response?.status === 403) {
        setError('You do not have permission to delete this request');
      } else {
        setError('Failed to delete request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleContactRequester = (request) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Navigate to the community page with the requester's ID and request details
    navigate('/community', { 
      state: { 
        requesterId: request.user.id,
        requestTitle: request.title,
        requestId: request.id,
        type: 'request'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-10">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Requests</h1>
          <p className="text-lg text-green-100">Find and fulfill requests from your community</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Search and Create Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center bg-white rounded-xl shadow-lg px-4 py-3">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-700 text-lg"
                placeholder="Search requests..."
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
            onClick={handleCreateRequest}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 w-full md:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5" />
            Create Request
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
              <option value="food">Food</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="toys">Toys</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          /* Requests Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{request.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {request.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center text-gray-500 text-sm">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {request.location}
                    </span>
                    <span className="flex items-center text-gray-500 text-sm">
                      <TagIcon className="w-4 h-4 mr-1" />
                      {request.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Posted: {new Date(request.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {user && request.user && request.user.id === user.user_id && (
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      )}
                      <button
                        onClick={() => handleContactRequester(request)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Contact Requester
                      </button>
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
              To create requests or view details, please sign in or create an account.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-center transition-colors"
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