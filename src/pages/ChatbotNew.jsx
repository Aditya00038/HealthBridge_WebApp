import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  PhotoIcon, 
  XMarkIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  CodeBracketIcon,
  BookOpenIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

const ChatbotNew = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'ai',
        content: `# 👋 Welcome to HealthBridge Health Assistant!

I'm your **medical and health advisor**. I can help you with health-related questions only.

## � What I Can Help With:

- 🩺 **Symptoms & Diagnosis** - Fever, headache, pain, cold, flu
- � **Treatments & Medications** - Dosages, over-the-counter meds
- 🚨 **Emergency Guidance** - When to call 911 or visit ER
- 🏃 **Wellness & Prevention** - Exercise, nutrition, sleep
- 🧠 **Mental Health** - Stress, anxiety, depression support
- 👶 **Family Health** - Children, pregnancy, elderly care

**⚠️ I ONLY answer health & medical questions. For other topics, please consult appropriate resources.**

**Ask me about any health concern!** 💚`,
        timestamp: new Date().toISOString()
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

  // Intelligent response generator - HEALTH ONLY
  const generateIntelligentResponse = (question) => {
    const q = question.toLowerCase();
    
    // Greetings
    if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/)) {
      return "Hello! 👋 I'm your health assistant. Ask me any health or medical question!";
    }
    
    // EMERGENCY MEDICAL
    if (q.match(/broken|fracture|bone|severe injury|bleeding|unconscious|chest pain|heart attack|stroke|seizure|can't breathe|choking/i)) {
      return `## 🚨 EMERGENCY - Call 911 Now\n\n**Immediate Actions:**\n1. **Call 911** or go to ER immediately\n2. Don't move the injured area\n3. Apply ice wrapped in cloth (for injuries)\n4. Keep the person still and calm\n5. Monitor breathing and pulse\n\n**This is a medical emergency. Get professional help NOW.**`;
    }
    
    // Health - Fever
    if (q.match(/fever|temperature|hot|chills/i)) {
      return `## 🌡️ Fever Treatment\n\n**What to do:**\n1. Take **Acetaminophen 500-1000mg** or **Ibuprofen 400-600mg**\n2. Drink lots of water (8-10 glasses/day)\n3. Rest in bed\n4. Use cool compress on forehead\n5. Wear light clothing\n\n**See a doctor if:** Fever >103°F (39.4°C), lasts >3 days, or severe symptoms appear.`;
    }
    
    // Health - Headache
    if (q.match(/headache|migraine|head hurt/i)) {
      return `## 🤕 Headache Relief\n\n**Quick relief:**\n1. Take **Ibuprofen 400mg** or **Acetaminophen 500mg**\n2. Drink 2 glasses of water\n3. Lie down in a dark, quiet room\n4. Apply cold compress to forehead\n5. Massage temples gently\n\n**See a doctor if:** Sudden severe headache, vision changes, or doesn't improve with medication.`;
    }
    
    // Health - Cold/Flu
    if (q.match(/cold|flu|cough|sore throat|runny nose|congestion/i)) {
      return `## 🤧 Cold/Flu Treatment\n\n**What to do:**\n1. Rest 8-10 hours/day\n2. Drink lots of fluids (water, tea, soup)\n3. Take Ibuprofen for pain/fever\n4. Gargle salt water for sore throat\n5. Use humidifier\n6. Vitamin C and zinc supplements\n\n**Duration:** 7-10 days normally\n**See a doctor if:** Symptoms >10 days or difficulty breathing.`;
    }
    
    // Health - Stomach issues
    if (q.match(/stomach|nausea|vomit|diarrhea|constipation|indigestion|upset stomach/i)) {
      return `## 🤢 Stomach Issues\n\n**What to do:**\n1. Stop eating for 4-6 hours\n2. Sip water slowly\n3. BRAT diet: Bananas, Rice, Applesauce, Toast\n4. Take Pepto-Bismol or Tums\n5. Avoid dairy, fatty foods, caffeine\n6. Ginger tea helps nausea\n\n**See a doctor if:** Blood in vomit/stool, severe pain, can't keep down liquids for 24hrs.`;
    }
    
    // Health - Pain (general)
    if (q.match(/pain|hurt|ache|sore|swelling/i) && !q.match(/broken|fracture/)) {
      return `## 💊 Pain Relief\n\n**For general pain:**\n1. Take **Ibuprofen 400-600mg** every 6-8 hours\n2. Apply ice pack (first 48 hours)\n3. Rest the affected area\n4. Elevate if swollen\n5. After 48 hours: use heat (warm compress)\n6. Gentle stretching\n\n**See a doctor if:** Pain severe (8+/10), lasts >1 week, or gets worse.`;
    }
    
    // Mental Health
    if (q.match(/anxiety|stress|depression|sad|worried|panic|mental health/i)) {
      return `## 🧠 Mental Health Support\n\n**Immediate help:**\n1. Deep breathing: 4 counts in, 4 counts out\n2. Talk to someone you trust\n3. Exercise 20-30 minutes daily\n4. Get 7-8 hours sleep\n5. Limit caffeine and alcohol\n6. Consider therapy/counseling\n\n**Crisis hotline:** 988 (Suicide & Crisis Lifeline)\n**Text:** Text "HELLO" to 741741\n\n**You're not alone. Professional help is available.**`;
    }
    
    // Nutrition/Diet
    if (q.match(/diet|nutrition|eat|food|vitamin|weight loss|healthy eating/i)) {
      return `## 🥗 Nutrition & Diet\n\n**Healthy eating basics:**\n1. Eat 5-6 servings fruits/vegetables daily\n2. Drink 8 glasses water\n3. Limit processed foods, sugar, salt\n4. Include protein (lean meat, fish, beans)\n5. Whole grains over refined\n6. Healthy fats (nuts, avocado, olive oil)\n\n**Weight loss:** Calorie deficit, portion control, exercise\n**Consult:** Nutritionist for personalized diet plan`;
    }
    
    // Exercise/Fitness
    if (q.match(/exercise|workout|fitness|gym|running|cardio|strength/i)) {
      return `## 🏃 Exercise & Fitness\n\n**Recommended activity:**\n1. **Cardio:** 150 mins/week (walking, running, cycling)\n2. **Strength:** 2 days/week (weights, resistance)\n3. **Flexibility:** Daily stretching\n\n**Start slow:**\n- Walk 20-30 mins daily\n- Gradually increase intensity\n- Stay hydrated\n- Warm up & cool down\n\n**Consult doctor:** Before starting if you have health conditions`;
    }
    
    // Sleep issues
    if (q.match(/sleep|insomnia|tired|fatigue|exhausted|can't sleep/i)) {
      return `## � Sleep Problems\n\n**Better sleep tips:**\n1. Go to bed same time daily\n2. No screens 1 hour before bed\n3. Dark, cool, quiet room\n4. No caffeine after 2pm\n5. Exercise, but not before bed\n6. Try melatonin 3-5mg\n7. Relaxation techniques\n\n**Need:** 7-9 hours for adults\n**See doctor if:** Insomnia lasts >2 weeks`;
    }
    
    // Pregnancy
    if (q.match(/pregnancy|pregnant|baby|prenatal/i)) {
      return `## 👶 Pregnancy Health\n\n**Important steps:**\n1. See OB/GYN for prenatal care\n2. Take prenatal vitamins with folic acid\n3. Eat balanced diet\n4. Avoid alcohol, smoking, drugs\n5. Stay hydrated\n6. Gentle exercise (with doctor approval)\n\n**Warning signs:** Bleeding, severe pain, vision changes, swelling → Call doctor immediately`;
    }
    
    // Diabetes
    if (q.match(/diabetes|blood sugar|insulin|glucose/i)) {
      return `## 🩸 Diabetes Management\n\n**Blood sugar control:**\n1. Monitor glucose regularly\n2. Take medications as prescribed\n3. Low-carb, high-fiber diet\n4. Exercise 30 mins daily\n5. Maintain healthy weight\n6. Regular doctor checkups\n\n**Target:** 80-130 mg/dL before meals\n**Emergency:** <70 or >300 mg/dL → Seek help`;
    }
    
    // Allergies
    if (q.match(/allergy|allergies|allergic|itchy|rash|hives/i)) {
      return `## 🤧 Allergy Management\n\n**Allergy relief:**\n1. Antihistamines: Benadryl, Claritin, Zyrtec\n2. Avoid triggers (pollen, dust, pets)\n3. Use air purifiers\n4. Keep windows closed during high pollen\n5. Shower after being outside\n6. Consider allergy shots\n\n**Severe reaction (anaphylaxis):** EpiPen + Call 911`;
    }
    
    // Blood Pressure
    if (q.match(/blood pressure|hypertension|high pressure|bp/i)) {
      return `## ❤️ Blood Pressure\n\n**Healthy BP management:**\n1. Reduce salt intake (<2300mg/day)\n2. Exercise regularly\n3. Maintain healthy weight\n4. Limit alcohol\n5. Manage stress\n6. Take medications as prescribed\n\n**Normal:** <120/80 mmHg\n**High:** ≥130/80 mmHg\n**Emergency:** >180/120 → Seek immediate care`;
    }
    
    // Vaccination
    if (q.match(/vaccine|vaccination|immunization|shot/i)) {
      return `## 💉 Vaccinations\n\n**Important vaccines:**\n1. **Flu:** Annual\n2. **COVID-19:** As recommended\n3. **Tetanus:** Every 10 years\n4. **Pneumonia:** Age 65+\n5. **Shingles:** Age 50+\n\n**For children:** Follow CDC schedule\n**Consult:** Your doctor for personalized vaccine plan`;
    }
    
    // General health keywords
    if (q.match(/health|medical|doctor|sick|symptom|medicine|medication|treatment|wellness|checkup/i)) {
      return `## 🏥 Medical Advice\n\n**Your question:** "${question}"\n\n**General approach:**\n1. Assess severity (rate pain 1-10, check temperature)\n2. Try OTC medication (Ibuprofen/Acetaminophen)\n3. Rest & hydrate (8+ hours sleep, 8+ glasses water)\n4. Monitor symptoms\n\n**See a doctor if:** Symptoms last >3 days, severe pain, high fever (>103°F), or rapid worsening.\n\n**Emergency (Call 911):** Chest pain, difficulty breathing, severe bleeding, loss of consciousness.`;
    }
    
    // NON-HEALTH TOPICS - REFUSE TO ANSWER
    return `## ⚠️ Health Topics Only\n\n**I'm a health assistant** and can only answer questions about:\n- 🩺 Medical symptoms & conditions\n- 💊 Medications & treatments\n- 🏋️ Exercise & fitness\n- 🥗 Nutrition & diet\n- 🧠 Mental health\n- 👶 Pregnancy & child health\n- 🚨 Emergency medical situations\n\n**Your question:** "${question}"\n\n**This doesn't appear to be health-related.** Please ask me about health, medical, or wellness topics!\n\n**Example questions:**\n- "I have a fever, what should I do?"\n- "How to manage high blood pressure?"\n- "Best exercises for beginners?"\n- "What foods help with digestion?"`;
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
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const aiMessage = {
        type: 'ai',
        content: generateIntelligentResponse(currentMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'ai',
        content: `## ⚠️ Oops!\n\nSomething went wrong. Please try again!`,
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

  const quickActions = [
    { 
      icon: HeartIcon, 
      text: 'Symptoms', 
      query: 'I have a headache and fever, what should I do?',
      gradient: 'from-rose-500 to-pink-500',
      color: 'rose'
    },
    { 
      icon: BeakerIcon, 
      text: 'Medications', 
      query: 'What medication should I take for stomach pain?',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue'
    },
    { 
      icon: HeartIcon, 
      text: 'Wellness', 
      query: 'How can I improve my sleep quality?',
      gradient: 'from-purple-500 to-pink-500',
      color: 'purple'
    },
    { 
      icon: HeartIcon, 
      text: 'Nutrition', 
      query: 'What foods are good for heart health?',
      gradient: 'from-emerald-500 to-teal-500',
      color: 'emerald'
    }
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      
      {/* Sidebar */}
      {sidebarOpen && (
        <div className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col shadow-2xl`}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Chat History
            </h2>
            <button className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              + New Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">
              Today
            </div>
            {['General Questions', 'Health Inquiry', 'Programming Help', 'Science Discussion'].map((title, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">{title}</div>
                <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border-b px-6 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                  <SparklesIcon className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Assistant Pro
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-600 font-medium">Always Online • Instant Answers</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-600" />
            )}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <SparklesIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`flex-1 max-w-2xl ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-6 py-4 shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white ml-auto'
                        : message.isError
                        ? 'bg-red-50 border-2 border-red-500 text-red-900'
                        : darkMode 
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="w-full max-w-md rounded-lg mb-3"
                      />
                    )}
                    
                    <div className={`prose ${darkMode ? 'prose-invert' : 'prose-gray'} max-w-none ${message.type === 'user' ? 'prose-invert' : ''}`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    
                    <div className={`text-xs mt-3 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl px-6 py-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
                  <div className="flex gap-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-3 w-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-3 w-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-sm font-semibold text-gray-700 mb-4 text-center">
                ✨ Try asking about...
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(action.query)}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-6 text-left transition-all hover:scale-105 hover:shadow-2xl`}
                  >
                    <action.icon className="h-10 w-10 text-white mb-3 transform group-hover:scale-110 transition-transform" />
                    <div className="text-base font-bold text-white">{action.text}</div>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border-t px-6 py-5 shadow-2xl`}>
          <div className="max-w-4xl mx-auto">
            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-xl border-2 border-purple-500 shadow-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-7 w-7 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  <XMarkIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex items-end gap-3 px-5 py-4 shadow-lg hover:border-purple-400 focus-within:border-purple-500 transition-all`}>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 flex-shrink-0"
                title="Upload image"
              >
                <PhotoIcon className="h-6 w-6 text-purple-600" />
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
                placeholder="Ask me anything... Health, coding, science, advice, or just chat! ✨"
                rows={1}
                className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} resize-none outline-none placeholder-gray-400 max-h-32 text-base`}
                style={{ minHeight: '28px' }}
              />

              <button
                onClick={sendMessage}
                disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  isLoading || (!inputMessage.trim() && !selectedImage)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                <PaperAirplaneIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-3 text-center font-medium">
              🤖 AI Assistant Pro • Instant Answers 24/7 • Direct & Helpful Responses
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatbotNew;
