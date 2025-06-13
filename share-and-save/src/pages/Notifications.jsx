import React, { useState, useEffect } from 'react';
import { FaBell, FaUtensils, FaCheck, FaCheckDouble } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchNotifications();
    // Set up polling to check for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Fetched notifications:', response.data); // Debug log
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8000/api/notifications/${notificationId}/mark_read/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('http://localhost:8000/api/notifications/mark_all_read/', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                <FaCheckDouble />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <FaBell className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.read ? 'bg-white' : 'bg-orange-50'
                  } border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <FaUtensils className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-gray-800">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimestamp(notification.created_at)}
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 