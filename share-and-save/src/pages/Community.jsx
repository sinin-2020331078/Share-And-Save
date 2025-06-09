import React, { useState } from 'react';
import { PhoneIcon, PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const conversations = [
  {
    id: 1,
    name: 'John Doe',
    preview: 'About the wooden chair...',
    time: '3 mins ago',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
    messages: [
      { fromMe: false, text: `Hi! I'm interested in the wooden chair you listed.`, time: '10:30 AM' },
      { fromMe: true, text: `Hello! Yes, it's still available. Would you like to see it?`, time: '10:32 AM' },
      { fromMe: false, text: `Yes, that would be great! When are you available?`, time: '10:33 AM' },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    preview: 'Regarding the vegetables...',
    time: '1 hour ago',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF6B6B&color=fff',
    messages: [],
  },
  {
    id: 3,
    name: 'Mike Johnson',
    preview: 'About the smartphone...',
    time: '2 hours ago',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=4CAF50&color=fff',
    messages: [],
  },
];

const Community = () => {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      // In a real app, you would update the conversation state here
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Community Messages</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Conversations List */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold px-6 py-4">
                Conversations
              </div>
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer border-b last:border-b-0 transition-colors ${
                    activeConv.id === conv.id 
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
                      activeConv.id === conv.id ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {conv.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{conv.preview}</div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">{conv.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white flex items-center justify-between px-6 py-4 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeConv.avatar} 
                    alt={activeConv.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="font-bold">{activeConv.name}</div>
                    <div className="text-xs text-blue-100">Online</div>
                  </div>
                </div>
                <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 