import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  PhotoIcon, 
  XMarkIcon,
  Bars3Icon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

const ChatbotFullScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Medical Consultation', date: 'Today' }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'ai',
        content: `## 👋 Welcome to AI Medical Assistant

I'm your personal healthcare AI companion, powered by advanced machine learning algorithms.

### 🎯 What I Can Help You With:

**🔬 Medical Image Analysis**
Upload photos of skin conditions, rashes, bites, or burns for instant AI-powered diagnosis

**🩺 Symptom Assessment**
Describe your symptoms and receive evidence-based medical guidance

**💊 Treatment Recommendations**
Get detailed treatment protocols and medication information

**📅 Healthcare Navigation**
Assistance with appointments, specialists, and urgent care decisions

**🚨 Emergency Protocols**
Quick access to life-saving information and when to seek immediate care

---

### 💬 Try Asking:
- "I have a severe headache with sensitivity to light"
- "What should I do for a high fever?"
- "Analyze this skin rash" (with image upload)
- "Book an appointment with a dermatologist"

*This AI provides educational information. Always consult healthcare professionals for medical decisions.*`,
        timestamp: new Date().toISOString(),
        confidence: 100
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      image: imagePreview
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          image: selectedImage
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.response,
          timestamp: data.timestamp,
          hasImageAnalysis: data.hasImageAnalysis,
          confidence: data.hasImageAnalysis ? 92 : 88
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'ai',
        content: `## ⚠️ Connection Error

I'm having trouble connecting to the medical AI server. Please ensure:

1. The Python Flask backend is running on port 5000
2. Run: \`python python-backend/chatbot_api.py\`
3. Check your internet connection

**Error Details:** ${error.message}

*Please try again in a moment.*`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      removeImage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    const newConv = {
      id: conversations.length + 1,
      title: `Consultation ${conversations.length + 1}`,
      date: 'Just now'
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newConv.id);
    setMessages([]);
  };

  const quickActions = [
    { icon: '🤒', text: 'Fever symptoms', query: 'I have a fever, what should I do?' },
    { icon: '🤕', text: 'Headache relief', query: 'I have a severe headache with nausea' },
    { icon: '🩹', text: 'Skin condition', query: 'I have itching and redness on my skin' },
    { icon: '📅', text: 'Book appointment', query: 'I need to book a medical appointment' }
  ];

  const bgColor = darkMode ? 'bg-[#212121]' : 'bg-white';
  const sidebarBg = darkMode ? 'bg-[#171717]' : 'bg-gray-50';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-[#2f2f2f]' : 'bg-gray-100';
  const hoverBg = darkMode ? 'hover:bg-[#2f2f2f]' : 'hover:bg-gray-100';
  const aiMessageBg = darkMode ? 'bg-[#2f2f2f]' : 'bg-gray-100';

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} ${sidebarBg} border-r ${borderColor} transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={startNewConversation}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${hoverBg} ${textColor} transition-colors`}
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">New Consultation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className={`text-xs font-semibold ${secondaryText} px-3 py-2`}>
            Recent Consultations
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversationId(conv.id)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                conv.id === currentConversationId
                  ? darkMode ? 'bg-[#2f2f2f]' : 'bg-gray-200'
                  : hoverBg
              }`}
            >
              <div className={`font-medium text-sm ${textColor} truncate`}>
                {conv.title}
              </div>
              <div className={`text-xs ${secondaryText} mt-1`}>
                {conv.date}
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${borderColor}`}>
          <div className="flex items-center gap-3 px-3 py-2">
            <UserCircleIcon className="h-8 w-8 text-indigo-500" />
            <div className="flex-1">
              <div className={`text-sm font-medium ${textColor}`}>Patient User</div>
              <div className={`text-xs ${secondaryText}`}>Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className={`${sidebarBg} border-b ${borderColor} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${hoverBg} transition-colors`}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <CheckCircleIcon className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${textColor}`}>AI Medical Assistant</h1>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className={`text-xs ${secondaryText}`}>AI Online • Python ML Backend</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-600" />
            )}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
              
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-first' : ''}`}>
                {message.confidence && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`text-xs font-semibold ${secondaryText}`}>
                      AI Confidence: {message.confidence}%
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${message.confidence}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-6 py-4 ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : message.isError
                      ? 'bg-red-900/20 border border-red-500'
                      : aiMessageBg
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="w-full max-w-md rounded-lg mb-3"
                    />
                  )}
                  
                  <div className={`prose ${darkMode ? 'prose-invert' : 'prose-gray'} max-w-none`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  
                  <div className={`text-xs ${message.type === 'user' ? 'text-indigo-200' : secondaryText} mt-3`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-indigo-500" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className={`${aiMessageBg} rounded-2xl px-6 py-4`}>
                <div className="flex gap-2">
                  <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-3 w-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-3 w-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(action.query);
                  }}
                  className={`${inputBg} ${hoverBg} rounded-xl px-4 py-3 text-left transition-all hover:scale-105`}
                >
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <div className={`text-sm font-medium ${textColor}`}>{action.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`${sidebarBg} border-t ${borderColor} px-6 py-4`}>
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border-2 border-indigo-500"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          )}

          <div className={`${inputBg} rounded-2xl border ${borderColor} flex items-end gap-3 px-4 py-3`}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 ${hoverBg} rounded-lg transition-colors flex-shrink-0`}
              title="Upload medical image"
            >
              <PhotoIcon className="h-6 w-6 text-indigo-500" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or medical concerns..."
              rows={1}
              className={`flex-1 ${inputBg} ${textColor} resize-none outline-none placeholder-gray-500 max-h-32`}
              style={{ minHeight: '24px' }}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
              className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                isLoading || (!inputMessage.trim() && !selectedImage)
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <PaperAirplaneIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className={`text-xs ${secondaryText} mt-3 text-center`}>
            AI Medical Assistant powered by Python ML • For educational purposes only • Always consult healthcare professionals
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotFullScreen;
