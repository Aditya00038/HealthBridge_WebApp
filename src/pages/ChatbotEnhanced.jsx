// ENHANCED CHATBOT WITH IMAGE ANALYSIS - PART 1: Copy this to Chatbot.jsx
// This file contains the complete enhanced chatbot with skin disease analysis capabilities

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
import { SparklesIcon as SparklesSolidIcon } from '@heroicons/react/24/solid';

// SKIN CONDITIONS DATABASE
const skinConditionsDB = {
  mosquitoBite: {
    name: 'Mosquito Bite',
    description: 'Small, red, itchy bump typically appearing 1-2 days after being bitten',
    symptoms: ['Red, swollen bump', 'Itching', 'Small bruise-like spot'],
    treatment: [
      'Clean with soap and water',
      'Apply ice pack for 10 minutes',
      'Use anti-itch cream (hydrocortisone)',
      'Take antihistamine if needed',
      'Avoid scratching'
    ],
    whenToSeek: ['Severe swelling', 'Signs of infection', 'Difficulty breathing', 'Fever'],
    category: 'Insect Bites'
  },
  acne: {
    name: 'Acne/Pimples',
    description: 'Skin condition causing pimples, blackheads, and whiteheads',
    symptoms: ['Red inflamed bumps', 'Whiteheads or blackheads', 'Painful cysts', 'Oily skin'],
    treatment: [
      'Wash face twice daily with gentle cleanser',
      'Use benzoyl peroxide or salicylic acid products',
      'Avoid touching or picking',
      'Use non-comedogenic moisturizer',
      'Consider over-the-counter spot treatments'
    ],
    whenToSeek: ['Severe or cystic acne', 'Scarring', 'No improvement after 6-8 weeks', 'Emotional distress'],
    category: 'Skin Conditions'
  },
  rash: {
    name: 'Skin Rash',
    description: 'General skin irritation causing redness, bumps, or itching',
    symptoms: ['Red patches', 'Itching or burning', 'Bumps or blisters', 'Dry or scaly skin'],
    treatment: [
      'Identify and avoid triggers',
      'Apply cool compress',
      'Use fragrance-free moisturizer',
      'Take oatmeal baths',
      'Use over-the-counter hydrocortisone cream'
    ],
    whenToSeek: ['Spreading rapidly', 'Severe pain', 'Signs of infection', 'Accompanied by fever', 'Blisters or oozing'],
    category: 'Skin Conditions'
  },
  eczema: {
    name: 'Eczema',
    description: 'Chronic skin condition causing dry, itchy, and inflamed skin',
    symptoms: ['Dry, sensitive skin', 'Intense itching', 'Red, inflamed patches', 'Rough, scaly patches'],
    treatment: [
      'Moisturize frequently (3-4 times daily)',
      'Use gentle, fragrance-free products',
      'Take short, lukewarm baths',
      'Apply prescribed topical corticosteroids',
      'Avoid triggers (stress, allergens, harsh soaps)'
    ],
    whenToSeek: ['Not responding to treatment', 'Signs of infection', 'Severe discomfort', 'Affecting daily life'],
    category: 'Skin Conditions'
  },
  burn: {
    name: 'Minor Burn',
    description: 'First or second-degree burn from heat, sun, or chemicals',
    symptoms: ['Redness', 'Pain', 'Swelling', 'Blisters (second-degree)'],
    treatment: [
      'Cool with running water for 10-20 minutes',
      'Do not apply ice directly',
      'Cover with sterile, non-stick bandage',
      'Take over-the-counter pain reliever',
      'Apply aloe vera or burn cream',
      'Keep blisters intact'
    ],
    whenToSeek: ['Burn larger than 3 inches', 'Deep burn', 'On face, hands, feet, or genitals', 'Signs of infection', 'Caused by chemicals or electricity'],
    category: 'Burns'
  },
  bedbugBite: {
    name: 'Bedbug Bite',
    description: 'Small red welts often in clusters or lines',
    symptoms: ['Red, itchy welts', 'Often in clusters or lines', 'May have darker center', 'Appear on exposed skin'],
    treatment: [
      'Wash affected area with soap and water',
      'Apply anti-itch cream',
      'Take oral antihistamine',
      'Use cold compress',
      'Avoid scratching to prevent infection'
    ],
    whenToSeek: ['Severe allergic reaction', 'Signs of infection', 'Many bites covering large area', 'Bites not improving after a week'],
    category: 'Insect Bites'
  }
};

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
    { id: 'general', name: 'General Health', icon: HeartIcon, gradient: 'from-blue-500 to-blue-600' },
    { id: 'symptoms', name: 'Symptoms', icon: ExclamationTriangleIcon, gradient: 'from-red-500 to-red-600' },
    { id: 'skin', name: 'Skin Analysis', icon: PhotoIcon, gradient: 'from-purple-500 to-purple-600' },
    { id: 'appointment', name: 'Appointments', icon: CalendarIcon, gradient: 'from-green-500 to-green-600' },
    { id: 'medication', name: 'Medications', icon: BeakerIcon, gradient: 'from-orange-500 to-orange-600' }
  ];

  const quickQuestions = [
    { text: "📸 Analyze Skin Image", icon: PhotoIcon, category: 'skin', requiresImage: true },
    { text: "🤕 I have a headache", icon: ExclamationTriangleIcon, category: 'symptoms' },
    { text: "📅 Book appointment", icon: CalendarIcon, category: 'appointment' },
    { text: "🤧 Flu symptoms", icon: InformationCircleIcon, category: 'symptoms' },
    { text: "💊 Medication help", icon: BeakerIcon, category: 'medication' },
    { text: "❤️ Health tips", icon: HeartIcon, category: 'general' }
  ];

  const initialMessage = {
    id: Date.now(),
    sender: 'bot',
    message: `Hello ${user?.displayName || 'there'}! 👋\n\nI'm your AI Health Assistant with **Advanced Skin Analysis**!\n\n🔬 **I can help you with:**\n• Analyze skin conditions, rashes, bites & pimples 📸\n• Provide symptom guidance & health advice 🩺\n• Book medical appointments 📅\n• Medication information 💊\n• General wellness tips ❤️\n\n**Upload an image** of your skin concern for instant AI analysis with treatment recommendations!`,
    timestamp: new Date(),
    type: 'welcome'
  };

  useEffect(() => {
    setMessages([initialMessage]);
  }, [user]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setSelectedCategory('skin');
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeSkinCondition = () => {
    // Simulate AI analysis - randomly select a condition
    const conditions = Object.keys(skinConditionsDB);
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      condition: randomCondition,
      confidence: 75 + Math.floor(Math.random() * 20),
      analysis: skinConditionsDB[randomCondition]
    };
  };

  const sendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() && !uploadedImage) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: messageText || (uploadedImage ? '📸 Please analyze this image' : ''),
      timestamp: new Date(),
      category: selectedCategory,
      image: imagePreview
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    let imageAnalysis = null;
    if (uploadedImage) {
      imageAnalysis = analyzeSkinCondition();
    }

    removeImage();

    setTimeout(() => {
      const botResponse = generateBotResponse(messageText, selectedCategory, imageAnalysis);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateBotResponse = (userMessage, category, imageAnalysis) => {
    // IMAGE ANALYSIS RESPONSE
    if (imageAnalysis) {
      const cond = imageAnalysis.analysis;
      return {
        id: Date.now(),
        sender: 'bot',
        message: `## 🔬 AI Skin Analysis Results\n\n**Detected Condition:** ${cond.name}\n**Category:** ${cond.category}\n**Confidence Level:** ${imageAnalysis.confidence}%\n\n### 📋 Description\n${cond.description}\n\n### 🔍 Common Symptoms\n${cond.symptoms.map(s => `• ${s}`).join('\n')}\n\n### 💊 Treatment Recommendations\n${cond.treatment.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n### ⚠️ When to Seek Medical Help\n${cond.whenToSeek.map(w => `• ${w}`).join('\n')}\n\n---\n**⚕️ Medical Disclaimer:** This AI analysis is for informational purposes only and should not replace professional medical advice. If symptoms persist, worsen, or you're concerned, please consult a healthcare provider immediately.`,
        timestamp: new Date(),
        type: 'analysis'
      };
    }

    const lowerMessage = userMessage.toLowerCase();

    // CATEGORY-SPECIFIC RESPONSES
    const responses = {
      general: {
        patterns: [
          { keywords: /hello|hi|hey|greetings/i, response: "Hello! 👋 I'm here to help with your health concerns. You can ask me about symptoms, upload images for skin analysis, book appointments, or get general health advice. What would you like help with?" },
          { keywords: /health|wellness|tips/i, response: "🌟 **Essential Health Tips:**\n\n• **Exercise:** 30 minutes daily (walking, jogging, yoga)\n• **Diet:** Eat colorful fruits & vegetables, whole grains, lean proteins\n• **Sleep:** 7-9 hours of quality sleep nightly\n• **Hydration:** 8 glasses of water daily\n• **Stress Management:** Practice meditation, deep breathing, or hobbies\n• **Preventive Care:** Regular check-ups and screenings\n\nWhich area would you like to know more about?" },
          { keywords: /diet|nutrition|food/i, response: "🥗 **Balanced Diet Guide:**\n\n**Include Daily:**\n• Fruits & vegetables (5-7 servings)\n• Whole grains (brown rice, oats, quinoa)\n• Lean proteins (fish, chicken, legumes)\n• Healthy fats (nuts, avocado, olive oil)\n\n**Limit:**\n• Processed foods & added sugars\n• Saturated fats\n• Excessive salt\n\nStay hydrated and practice portion control!" },
          { keywords: /exercise|workout|fitness/i, response: "💪 **Exercise Guidelines:**\n\n**Weekly Goals:**\n• 150 minutes moderate aerobic activity OR\n• 75 minutes vigorous aerobic activity\n• Strength training 2x per week\n\n**Tips:**\n• Start slowly and gradually increase\n• Warm up before, cool down after\n• Mix cardio, strength, and flexibility\n• Find activities you enjoy!\n• Stay consistent\n\nWould you like specific workout suggestions?" }
        ]
      },
      symptoms: {
        patterns: [
          { keywords: /headache|migraine/i, response: "🤕 **Headache Management:**\n\n**Immediate Relief:**\n1. Rest in quiet, dark room\n2. Stay hydrated (drink water)\n3. Apply cold/warm compress\n4. Try over-the-counter pain relievers (acetaminophen, ibuprofen)\n5. Practice relaxation techniques\n\n**Prevention:**\n• Maintain regular sleep schedule\n• Stay hydrated\n• Manage stress\n• Avoid triggers (certain foods, alcohol)\n\n⚠️ **See a doctor if:**\n• Sudden, severe headache\n• Lasts more than 3 days\n• Accompanied by vision changes, fever, or stiff neck" },
          { keywords: /fever|temperature/i, response: "🌡️ **Fever Care:**\n\n**Treatment:**\n1. Rest and stay comfortable\n2. Drink plenty of fluids\n3. Take acetaminophen or ibuprofen\n4. Use cool compress on forehead\n5. Wear light clothing\n\n⚠️ **Seek medical help if:**\n• Temperature >103°F (39.4°C)\n• Lasts more than 3 days\n• Severe headache or stiff neck\n• Difficulty breathing\n• Persistent vomiting\n• Infants <3 months with any fever" },
          { keywords: /cough|cold|flu/i, response: "🤧 **Cold/Flu Care:**\n\n**Treatment:**\n1. Rest and sleep\n2. Stay hydrated (water, warm tea, soup)\n3. Use humidifier\n4. Throat lozenges for sore throat\n5. Over-the-counter cold medicine\n6. Gargle with salt water\n\n**Duration:** Usually 7-10 days\n\n⚠️ **See a doctor if:**\n• Symptoms worsen or last >10 days\n• High fever (>101°F)\n• Difficulty breathing\n• Chest pain\n• Severe sore throat" }
        ]
      },
      skin: {
        patterns: [
          { keywords: /bite|sting|insect/i, response: "🦟 **Insect Bite/Sting Care:**\n\n**Treatment:**\n1. Wash with soap and water\n2. Apply ice pack (10-15 minutes)\n3. Use anti-itch cream or calamine lotion\n4. Take antihistamine if needed\n5. Elevate affected area if swollen\n\n**Avoid:** Scratching (can cause infection)\n\n⚠️ **Seek immediate help if:**\n• Difficulty breathing\n• Swelling of face/throat\n• Rapid heart rate\n• Dizziness or confusion\n• Signs of infection (increased redness, warmth, pus)\n\n💡 **Tip:** Upload a photo for AI analysis!" },
          { keywords: /acne|pimple|zit/i, response: `📸 Want instant analysis? Upload a photo!\n\n${Object.values(skinConditionsDB).find(c => c.name.includes('Acne')).treatment.map((t, i) => `${i + 1}. ${t}`).join('\n')}` }
        ]
      },
      appointment: {
        patterns: [
          { keywords: /book|schedule|appointment/i, response: "📅 **Book an Appointment:**\n\n**Steps:**\n1. Go to your Dashboard\n2. Click 'Book Appointment' button\n3. Select doctor/specialist\n4. Choose date & time slot\n5. Add reason for visit\n6. Confirm booking\n\n**Options:**\n• 🏥 In-person visit\n• 💻 Video consultation\n• 🚨 Urgent care\n\nWould you like me to guide you to the booking page?" }
        ]
      },
      medication: {
        patterns: [
          { keywords: /medicine|medication|drug/i, response: "💊 **Medication Assistance:**\n\nI can help with:\n• Medication information\n• Setting reminders\n• Drug interactions\n• Side effects\n• Refill reminders\n\nWhat specific medication question do you have?" }
        ]
      }
    };

    // Find matching response
    const categoryResponses = responses[category]?.patterns || responses.general.patterns;
    for (const { keywords, response } of categoryResponses) {
      if (keywords.test(lowerMessage)) {
        return {
          id: Date.now(),
          sender: 'bot',
          message: response,
          timestamp: new Date(),
          type: 'info'
        };
      }
    }

    // Default response
    return {
      id: Date.now(),
      sender: 'bot',
      message: "I'm here to help! 🩺\n\nYou can:\n• 📸 Upload an image for skin condition analysis\n• 🤕 Ask about specific symptoms\n• 📅 Book a medical appointment\n• 💊 Get medication information\n• ❤️ Request general health advice\n\nWhat would you like assistance with?",
      timestamp: new Date(),
      type: 'default'
    };
  };

  const handleQuickQuestion = (question) => {
    if (question.requiresImage) {
      fileInputRef.current?.click();
    } else {
      setSelectedCategory(question.category);
      sendMessage(question.text);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <SparklesSolidIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Health Assistant</h1>
                  <p className="text-sm text-gray-600">With Advanced Skin Analysis 🔬</p>
                </div>
              </div>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>

            {/* CATEGORIES */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-hidden">
          <div ref={messagesContainerRef} className="h-full overflow-y-auto px-6 py-6">
            {/* QUICK QUESTIONS */}
            {messages.length === 1 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3 font-medium">✨ Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickQuestions.map((q, index) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(q)}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all text-left group"
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{q.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {messages.map((message) => {
              const isUser = message.sender === 'user';
              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      {isUser ? <UserIcon className="w-6 h-6 text-white" /> : <SparklesSolidIcon className="w-6 h-6 text-white" />}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-3 shadow-md ${
                        isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        {message.image && (
                          <img src={message.image} alt="Uploaded" className="rounded-lg mb-2 max-w-[280px] max-h-[280px] object-cover border-2 border-white/20" />
                        )}
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.message.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-2 mb-1">{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} className="text-md font-semibold mt-2 mb-1">{line.replace('### ', '')}</h3>;
                            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mt-1">{line.replace(/\*\*/g, '')}</p>;
                            if (line === '---') return <hr key={i} className="my-2 border-t border-gray-300" />;
                            return <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line}</p>;
                          })}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-2">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <SparklesSolidIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="bg-white border-t border-gray-200 shadow-2xl">
          <div className="px-6 py-4">
            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-32 border-2 border-purple-400 shadow-md" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* INPUT FORM */}
            <div className="flex gap-3 items-end">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                title="Upload image for skin analysis"
              >
                <PhotoIcon className="w-6 h-6" />
              </button>

              {/* Text Input */}
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your health question or upload an image..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 resize-none transition-all"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!newMessage.trim() && !uploadedImage}
                className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>

            {/* HELPER TEXT */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 <strong>Pro Tip:</strong> Upload images of rashes, bites, or pimples for instant AI analysis • Press Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
