import React, { useState } from 'react';
import { PlusIcon, MapPinIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const requests = [
  {
    id: 1,
    title: 'Looking for a Desk',
    user: 'John Doe',
    time: '2 hours ago',
    desc: 'Need a small desk for my home office. Preferably wooden and in good condition.',
    location: 'Downtown',
    status: 'Active',
    category: 'Furniture',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
  },
  {
    id: 2,
    title: 'Need Winter Clothes',
    user: 'Jane Smith',
    time: '5 hours ago',
    desc: 'Looking for winter jackets and warm clothes for my children. Sizes 6-8.',
    location: 'Westside',
    status: 'Active',
    category: 'Clothing',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF6B6B&color=fff',
  },
  {
    id: 3,
    title: 'Books for School',
    user: 'Mike Johnson',
    time: '1 day ago',
    desc: 'Looking for high school textbooks. Willing to pay a small amount.',
    location: 'Eastside',
    status: 'Fulfilled',
    category: 'Books',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=4CAF50&color=fff',
  },
];

const statusColors = {
  Active: 'bg-blue-100 text-blue-600',
  Fulfilled: 'bg-green-100 text-green-600',
};

const categoryColors = {
  Furniture: 'bg-orange-100 text-orange-600',
  Clothing: 'bg-purple-100 text-purple-600',
  Books: 'bg-yellow-100 text-yellow-600',
};

const Request = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Community Requests</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Request
          </button>
        </div>

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
                      src={req.avatar} 
                      alt={req.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{req.title}</h3>
                      <div className="text-sm text-gray-500">Posted by {req.user}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{req.desc}</p>

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
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Request</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="What are you looking for?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  rows="4"
                  placeholder="Provide more details about your request..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select a category</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your location"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl"
                >
                  Create Request
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