import React, { useState, useEffect } from 'react';
import { PhoneIcon, PaperAirplaneIcon, UserCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
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
    if (location.state?.userId) {
      handleStartChat(location.state.userId);
    }
    // Clear the state after using it
    navigate(location.pathname, { replace: true });
  }, [location.state, navigate]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat/rooms/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched conversations:', response.data);
      
      // Ensure no duplicate conversations
      const uniqueConversations = response.data.filter((conv, index, self) =>
        index === self.findIndex((c) => c.id === conv.id)
      );
      
      // Log each conversation's participants
      uniqueConversations.forEach(conv => {
        console.log(`Conversation ${conv.id} participants:`, conv.participants);
      });
      
      setConversations(uniqueConversations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants || !Array.isArray(conversation.participants)) {
      console.log('Invalid conversation data:', conversation);
      return null;
    }
    
    // First try to use other_participant if available
    if (conversation.other_participant) {
      return conversation.other_participant;
    }
    
    // Fallback to finding the participant that is not the current user
    const otherParticipant = conversation.participants.find(p => p.id !== user.id);
    if (!otherParticipant) {
      console.log('No other participant found in conversation:', conversation);
      return null;
    }
    
    console.log('Other participant:', otherParticipant);
    return otherParticipant;
  };

  const getUserDisplayName = (user) => {
    if (!user) {
      console.log('No user provided to getUserDisplayName');
      return '';
    }
    
    console.log('Getting display name for user:', user);
    
    // First try to use full_name
    if (user.full_name) {
      return user.full_name;
    }
    
    // Then try first_name + last_name
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    // Finally fallback to email username
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    console.log('No name found for user:', user);
    return 'Unknown User';
  };

  const handleStartChat = async (userId) => {
    try {
      // First check if we already have a conversation with this user
      const existingConv = conversations.find(conv => {
        const otherParticipant = getOtherParticipant(conv);
        return otherParticipant && otherParticipant.id === userId;
      });

      if (existingConv) {
        // If conversation exists, just select it
        console.log('Found existing conversation:', existingConv);
        const messages = await fetchMessages(existingConv.id);
        setActiveConv({ ...existingConv, messages });
        return;
      }

      // If no existing conversation, create a new one
      const response = await axios.post(
        'http://localhost:8000/api/chat/rooms/get_or_create_chat/',
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Created/retrieved chat:', response.data);
      
      // Add the new conversation to the list if it doesn't exist
      if (!conversations.find(conv => conv.id === response.data.id)) {
        setConversations(prev => [response.data, ...prev]);
      }
      
      // Fetch messages for the chat
      const messages = await fetchMessages(response.data.id);
      setActiveConv({ ...response.data, messages });
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat');
    }
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/messages/?chat_room=${chatRoomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      return [];
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      const messages = await fetchMessages(conversation.id);
      setActiveConv({ ...conversation, messages });
    } catch (error) {
      console.error('Error selecting conversation:', error);
      setError('Failed to load conversation');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() === '' || !activeConv) return;

    try {
      const response = await axios.post(
        'http://localhost:8000/api/chat/messages/',
        {
          chat_room: activeConv.id,
          content: message
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the active conversation with the new message
      setActiveConv(prev => ({
        ...prev,
        messages: [...(prev.messages || []), response.data],
        last_message: response.data
      }));

      // Update the conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConv.id 
            ? { ...conv, last_message: response.data }
            : conv
        )
      );

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation(); // Prevent triggering the conversation selection
    if (!window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/chat/rooms/${conversationId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the conversation from the list
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If the deleted conversation was active, clear it
      if (activeConv?.id === conversationId) {
        setActiveConv(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
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
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No conversations yet. Start by contacting a seller!
                </div>
              ) : (
                conversations.map(conv => {
                  const otherUser = getOtherParticipant(conv);
                  if (!otherUser) return null;
                  
                  return (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-4 px-6 py-4 cursor-pointer border-b last:border-b-0 transition-colors ${
                        activeConv?.id === conv.id 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <img 
                        src={`https://ui-avatars.com/api/?name=${getUserDisplayName(otherUser)}&background=0D8ABC&color=fff`}
                        alt={getUserDisplayName(otherUser)}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold truncate ${
                          activeConv?.id === conv.id ? 'text-blue-600' : 'text-gray-800'
                        }`}>
                          {getUserDisplayName(otherUser)}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {conv.last_message?.content || 'No messages yet'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {conv.last_message?.created_at ? new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                        <button
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete conversation"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:w-2/3 w-full">
            {activeConv ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center gap-4">
                  {(() => {
                    const otherUser = getOtherParticipant(activeConv);
                    if (!otherUser) return null;
                    
                    return (
                      <>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${getUserDisplayName(otherUser)}&background=0D8ABC&color=fff`}
                          alt={getUserDisplayName(otherUser)}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {getUserDisplayName(otherUser)}
                          </h3>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
                  {!activeConv.messages || activeConv.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <UserCircleIcon className="w-16 h-16 mb-4" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    activeConv.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender.id === user.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender.id !== user.id && (
                          <img 
                            src={`https://ui-avatars.com/api/?name=${getUserDisplayName(msg.sender)}&background=0D8ABC&color=fff`}
                            alt={getUserDisplayName(msg.sender)}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <div className={`flex flex-col ${msg.sender.id === user.id ? 'items-end' : 'items-start'}`}>
                          {msg.sender.id !== user.id && (
                            <span className="text-xs text-gray-500 mb-1">
                              {msg.sender_name || getUserDisplayName(msg.sender)}
                            </span>
                          )}
                          <div className={`rounded-2xl px-4 py-2 max-w-xs ${
                            msg.sender.id === user.id 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}>
                            {msg.content}
                            <div className={`text-xs mt-1 ${
                              msg.sender.id === user.id ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
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