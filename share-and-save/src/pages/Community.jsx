import React, { useState, useEffect } from 'react';
import { PhoneIcon, PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Community = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we have incoming state from another page
    if (location.state) {
      const { sellerId, itemTitle, itemId, type } = location.state;
      
      // Create a new conversation for this item
      const newConversation = {
        id: Date.now(), // Temporary ID
        name: 'Seller', // Will be replaced with actual seller name
        preview: `About ${itemTitle}...`,
        time: 'Just now',
        avatar: 'https://ui-avatars.com/api/?name=Seller&background=0D8ABC&color=fff',
        messages: [
          { 
            fromMe: true, 
            text: `Hi! I'm interested in your ${type} item: ${itemTitle}.`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        sellerId,
        itemId,
        type
      };

      setConversations(prev => [newConversation, ...prev]);
      setActiveConv(newConversation);
    }

    // Clear the state after using it
    navigate(location.pathname, { replace: true });
  }, [location.state, navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    if (!activeConv) return;

    const newMessage = {
      fromMe: true,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update the active conversation with the new message
    setActiveConv(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      preview: message,
      time: 'Just now'
    }));

    // Update the conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConv.id 
          ? { ...conv, messages: [...conv.messages, newMessage], preview: message, time: 'Just now' }
          : conv
      )
    );

    setMessage('');

    // TODO: Send message to backend
    try {
      // Here you would implement the actual message sending to your backend
      console.log('Sending message:', {
        to: activeConv.sellerId,
        message: message,
        itemId: activeConv.itemId,
        type: activeConv.type
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access messages</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Community Messages</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Conversations List */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold px-6 py-4">
                Conversations
              </div>
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No conversations yet. Start by contacting a seller!
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer border-b last:border-b-0 transition-colors ${
                      activeConv?.id === conv.id 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveConv(conv)}
                  >
                    <img 
                      src={conv.avatar} 
                      alt={conv.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${
                        activeConv?.id === conv.id ? 'text-blue-600' : 'text-gray-800'
                      }`}>
                        {conv.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{conv.preview}</div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">{conv.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:w-2/3 w-full">
            {activeConv ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center gap-4">
                  <img 
                    src={activeConv.avatar} 
                    alt={activeConv.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{activeConv.name}</h3>
                    <p className="text-sm text-gray-500">{activeConv.preview}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
                  {activeConv.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <UserCircleIcon className="w-16 h-16 mb-4" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    activeConv.messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                        {!msg.fromMe && (
                          <img 
                            src={activeConv.avatar} 
                            alt={activeConv.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <div className={`rounded-2xl px-4 py-2 max-w-xs ${
                          msg.fromMe 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}>
                          {msg.text}
                          <div className={`text-xs mt-1 ${
                            msg.fromMe ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="flex items-center gap-3 p-4 border-t bg-white rounded-b-2xl">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Type your message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-3 rounded-xl transition-all transform hover:scale-105"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 