import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReputationBadge from '../components/ReputationBadge';
import UserBadges from '../components/UserBadges';
import TrustScore from '../components/TrustScore';
import { FaTrophy, FaGift, FaHandshake, FaHistory } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reputationHistory, setReputationHistory] = useState([]);
  const [reputationSummary, setReputationSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    fetchReputationData();
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
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
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        phone_number: response.data.phone_number || '',
        address: response.data.address || '',
      });
    } catch (error) {
      setError('Failed to fetch profile data');
    }
  };

  const fetchReputationData = async () => {
    try {
      const [historyResponse, summaryResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/users/reputation/', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:8000/api/users/reputation/summary/', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setReputationHistory(historyResponse.data);
      setReputationSummary(summaryResponse.data);
    } catch (error) {
      console.error('Error fetching reputation data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.patch(
        'http://localhost:8000/api/users/profile/',
        {
          phone_number: formData.phone_number,
          address: formData.address,
          user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'item_shared':
        return <FaGift className="text-green-500" />;
      case 'transaction_completed':
        return <FaHandshake className="text-blue-500" />;
      case 'first_listing':
        return <FaTrophy className="text-yellow-500" />;
      default:
        return <FaHistory className="text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transition-transform hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user.first_name ? user.first_name[0] : user.email[0]}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.email}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                <ReputationBadge level={user.reputation_level} points={user.reputation_points} />
                {reputationSummary && <TrustScore score={reputationSummary.trust_score} />}
                <UserBadges badges={user.reputation_badges} size="md" />
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-orange-600 hover:to-pink-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {reputationSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <FaGift className="text-3xl text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{reputationSummary.total_items_shared}</h3>
              <p className="text-gray-600">Items Shared</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <FaTrophy className="text-3xl text-yellow-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{reputationSummary.reputation_points}</h3>
              <p className="text-gray-600">Reputation Points</p>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'profile'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('reputation')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'reputation'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reputation History
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'profile' && (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    {success}
                  </div>
                )}
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:from-orange-600 hover:to-pink-600 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                        <p className="mt-1 text-gray-900">{user.first_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                        <p className="mt-1 text-gray-900">{user.last_name || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-gray-900">{user.phone_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1 text-gray-900">{user.address || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'reputation' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Reputation History</h3>
                {reputationHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 italic">
                    No reputation history yet. Start sharing items to earn reputation points!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reputationHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          {getActionIcon(entry.action)}
                          <div>
                            <p className="font-medium text-gray-800">{entry.description}</p>
                            <p className="text-sm text-gray-500">{formatDate(entry.created_at)}</p>
                          </div>
                        </div>
                        <span
                          className={`font-semibold ${
                            entry.points_earned > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {entry.points_earned > 0 ? '+' : ''}
                          {entry.points_earned} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;