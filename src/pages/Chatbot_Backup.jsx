import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon,
  PhotoIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HeartIcon,
  CalendarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon as SparklesSolidIcon 
} from '@heroicons/react/24/solid';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'general', name: 'General Health', icon: HeartIcon, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
    { id: 'symptoms', name: 'Symptoms', icon: ExclamationTriangleIcon, color: 'red', gradient: 'from-red-500 to-red-600' },
    { id: 'skin', name: 'Skin Analysis', icon: PhotoIcon, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
    { id: 'appointment', name: 'Appointments', icon: CalendarIcon, color: 'green', gradient: 'from-green-500 to-green-600' },
    { id: 'medication', name: 'Medications', icon: BeakerIcon, color: 'orange', gradient: 'from-orange-500 to-orange-600' }
  ];

  const quickQuestions = [
    { text: "Analyze skin condition", icon: PhotoIcon, category: 'skin', requiresImage: true },
    { text: "I have a headache", icon: ExclamationTriangleIcon, category: 'symptoms' },
    { text: "Book an appointment", icon: CalendarIcon, category: 'appointment' },
    { text: "Flu symptoms check", icon: InformationCircleIcon, category: 'symptoms' },
    { text: "Medication reminders", icon: BeakerIcon, category: 'medication' },
    { text: "General health tips", icon: HeartIcon, category: 'general' }
  ];

  const initialMessage = {
    id: Date.now(),
    sender: 'bot',
    message: `Hello ${user?.displayName || 'there'}! 👋 I'm your AI Health Assistant. I'm here to help you with health questions, symptom guidance, appointment booking, and general medical information. How can I assist you today?`,
    timestamp: new Date(),
    type: 'welcome'
  };

  useEffect(() => {
    setMessages([initialMessage]);
  }, [user]);

  useEffect(() => {
    // Only auto-scroll if user is near the bottom (within 100px)
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: messageText,
      timestamp: new Date(),
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText, selectedCategory);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateBotResponse = (userMessage, category) => {
    const responses = {
      general: {
        greeting: "I'm here to help with your health concerns! Feel free to ask me about symptoms, treatments, or general health advice.",
        default: "That's a great question about general health! Based on what you've told me, I'd recommend consulting with a healthcare professional for personalized advice. In the meantime, maintaining a healthy lifestyle with proper diet, exercise, and adequate sleep is always beneficial."
      },
      symptoms: {
        headache: "For headaches, try these steps: 1) Stay hydrated 2) Rest in a quiet, dark room 3) Apply a cold or warm compress 4) Consider over-the-counter pain relievers. If headaches persist or worsen, please consult a doctor.",
        flu: "Common flu symptoms include fever, body aches, fatigue, cough, and congestion. Rest, fluids, and symptom management are key. Seek medical attention if symptoms are severe or persist beyond a week.",
        anxiety: "Feeling anxious is normal, but persistent anxiety should be addressed. Try deep breathing exercises, regular exercise, and adequate sleep. If anxiety interferes with daily life, consider speaking with a mental health professional.",
        default: "I understand you're experiencing symptoms. While I can provide general guidance, it's important to consult with a healthcare provider for proper diagnosis and treatment, especially if symptoms persist or worsen."
      },
      appointment: {
        booking: "To book an appointment: 1) Click 'Book Appointment' in your dashboard 2) Select a doctor and specialization 3) Choose your preferred date and time 4) Provide reason for visit. You can also call our clinic directly!",
        preparation: "To prepare for your appointment: 1) List your symptoms and when they started 2) Bring current medications 3) Prepare questions for your doctor 4) Arrive 15 minutes early 5) Bring insurance information.",
        default: "I can help you with appointment-related questions! Whether you need to book, reschedule, or prepare for an appointment, I'm here to guide you through the process."
      },
      medication: {
        reminders: "For medication reminders, I can help you set up a schedule! Consider using pill organizers, phone alarms, or medication apps. Always take medications as prescribed by your doctor.",
        interactions: "Drug interactions can be serious. Always inform your doctor and pharmacist about all medications, supplements, and herbal products you're taking. Never stop prescribed medications without consulting your healthcare provider.",
        default: "Medication questions are important for your safety. While I can provide general information, always consult your doctor or pharmacist for specific medication advice."
      }
    };

    const categoryResponses = responses[category] || responses.general;
    const lowerMessage = userMessage.toLowerCase();

    // Match specific keywords to responses
    if (lowerMessage.includes('headache')) {
      return createBotMessage(responses.symptoms.headache, 'symptom-advice');
    } else if (lowerMessage.includes('flu') || lowerMessage.includes('fever')) {
      return createBotMessage(responses.symptoms.flu, 'symptom-advice');
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return createBotMessage(responses.symptoms.anxiety, 'mental-health');
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
      return createBotMessage(responses.appointment.booking, 'appointment-help');
    } else if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      return createBotMessage(responses.medication.reminders, 'medication-help');
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return createBotMessage(categoryResponses.greeting || categoryResponses.default, 'greeting');
    }

    return createBotMessage(categoryResponses.default, 'general-advice');
  };

  const createBotMessage = (message, type = 'response') => ({
    id: Date.now() + Math.random(),
    sender: 'bot',
    message,
    timestamp: new Date(),
    type
  });

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'symptom-advice':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'appointment-help':
        return <CalendarIcon className="h-4 w-4 text-green-500" />;
      case 'medication-help':
        return <InformationCircleIcon className="h-4 w-4 text-purple-500" />;
      case 'mental-health':
        return <HeartSolidIcon className="h-4 w-4 text-pink-500" />;
      default:
        return <SparklesSolidIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesSolidIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Health Assistant</h1>
              <p className="text-sm text-gray-500">Your 24/7 healthcare companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category.id
                    ? `bg-${category.color}-100 text-${category.color}-700 border-${category.color}-200`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }
                  `}>
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <SparklesSolidIcon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">AI Assistant</span>
                        {message.type && getMessageIcon(message.type)}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <SparklesSolidIcon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">AI Assistant</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about symptoms, appointments, medications, or general health..."
                  rows={1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ minHeight: '50px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!newMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                Send
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Press Enter to send, Shift + Enter for new line</span>
              </div>
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-3 w-3" />
                <span>For emergencies, call 911 or visit your nearest emergency room</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-t border-red-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>This AI assistant provides general information only and is not a substitute for professional medical advice.</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm">
              <PhoneIcon className="h-3 w-3" />
              Emergency: 911
            </button>
            <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">
              <CalendarIcon className="h-3 w-3" />
              Book Real Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;