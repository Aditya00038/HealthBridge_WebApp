import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  LockClosedIcon,
  StarIcon,
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  HeartIcon,
  BeakerIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const AIAssistantPro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [hasPremium, setHasPremium] = useState(false); // TODO: Connect to actual subscription service
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Predefined health questions with categories
  const predefinedQuestions = [
    {
      category: '🏥 Common Health Issues',
      icon: HeartIcon,
      color: 'from-red-500 to-pink-500',
      questions: [
        { q: 'What are the symptoms of common cold vs flu?', icon: '🤒' },
        { q: 'How to manage high blood pressure naturally?', icon: '💓' },
        { q: 'What foods help boost immunity?', icon: '🥗' },
        { q: 'How much water should I drink daily?', icon: '💧' },
        { q: 'Understanding diabetes: Types and management', icon: '🩺' },
        { q: 'Headache types and when to see a doctor', icon: '🤕' }
      ]
    },
    {
      category: '💊 Medications & Treatments',
      icon: BeakerIcon,
      color: 'from-blue-500 to-cyan-500',
      questions: [
        { q: 'When should I take antibiotics?', icon: '💊' },
        { q: 'What are common side effects of pain relievers?', icon: '⚕️' },
        { q: 'How to properly store medications?', icon: '🏪' },
        { q: 'Can I take vitamins with other medicines?', icon: '💊' },
        { q: 'Understanding prescription labels and dosage', icon: '📋' },
        { q: 'Over-the-counter vs prescription medications', icon: '🏥' }
      ]
    },
    {
      category: '🧘 Mental Health & Wellness',
      icon: SparklesIcon,
      color: 'from-purple-500 to-indigo-500',
      questions: [
        { q: 'Tips for managing stress and anxiety', icon: '🧘' },
        { q: 'How to improve sleep quality?', icon: '😴' },
        { q: 'Signs of depression to watch for', icon: '🌧️' },
        { q: 'Meditation techniques for beginners', icon: '🕉️' },
        { q: 'Work-life balance strategies', icon: '⚖️' },
        { q: 'Coping with grief and loss', icon: '💔' }
      ]
    },
    {
      category: '🏃 Fitness & Exercise',
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500',
      questions: [
        { q: 'Best exercises for weight loss', icon: '🏃' },
        { q: 'How to build muscle at home?', icon: '💪' },
        { q: 'Benefits of daily walking', icon: '🚶' },
        { q: 'Pre and post workout nutrition', icon: '🥤' },
        { q: 'Yoga poses for flexibility', icon: '🧘‍♀️' },
        { q: 'Cardio vs strength training benefits', icon: '🏋️' }
      ]
    },
    {
      category: '🍎 Nutrition & Diet',
      icon: HomeIcon,
      color: 'from-orange-500 to-yellow-500',
      questions: [
        { q: 'Balanced diet plan for adults', icon: '🍎' },
        { q: 'Foods to avoid for diabetes', icon: '🍬' },
        { q: 'Benefits of Mediterranean diet', icon: '🥙' },
        { q: 'Healthy snack alternatives', icon: '🥜' },
        { q: 'Intermittent fasting explained', icon: '⏰' },
        { q: 'Superfoods and their benefits', icon: '🥗' }
      ]
    },
    {
      category: '👶 Maternal & Child Health',
      icon: ShieldCheckIcon,
      color: 'from-pink-500 to-rose-500',
      questions: [
        { q: 'Prenatal care and nutrition tips', icon: '🤰' },
        { q: 'Vaccination schedule for children', icon: '💉' },
        { q: 'Managing childhood fever at home', icon: '🌡️' },
        { q: 'Breastfeeding tips for new mothers', icon: '👶' },
        { q: 'Child development milestones', icon: '👣' },
        { q: 'Postpartum care and recovery', icon: '🤱' }
      ]
    }
  ];

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'ai',
        content: `## 👋 Welcome to AI Health Assistant

**Get instant, on-point health answers.**

**Free:** Select any question below for immediate answers
**Premium:** Ask custom questions + unlimited chat

*Note: Responses are educational only. Consult a doctor for medical advice.*

**👇 Choose a category or question to start!**`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    // Only scroll to bottom if there are actual user/AI conversation messages (more than just welcome)
    // This prevents auto-scroll on initial load and when browsing questions
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    // Scroll to bottom of chat messages smoothly
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuestionClick = async (question) => {
    // Add user message
    const userMessage = {
      type: 'user',
      content: question.q,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: generateResponse(question.q),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleCustomMessage = (e) => {
    e.preventDefault();
    
    if (!hasPremium) {
      setShowSubscriptionModal(true);
      toast.error('Premium subscription required for custom chat');
      return;
    }

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: generateResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (question) => {
    // Concise, on-point responses based on question type
    const lowerQ = question.toLowerCase();
    
    // Common Health Issues
    if (lowerQ.includes('cold') && lowerQ.includes('flu')) {
      return `**Common Cold vs Flu:**

Cold: Gradual onset, mild fever, runny nose, sneezing, sore throat. Lasts 7-10 days.

Flu: Sudden onset, high fever (100-104°F), body aches, severe fatigue, dry cough. Lasts 1-2 weeks.

**When to see doctor:** High fever >103°F, difficulty breathing, chest pain, symptoms >10 days.`;
    }
    
    if (lowerQ.includes('blood pressure')) {
      return `**Managing High Blood Pressure:**

• Reduce sodium (<2,300mg/day)
• Exercise 30 min daily
• Maintain healthy weight
• Limit alcohol
• Manage stress
• Monitor BP regularly

**Target:** Below 120/80 mmHg
**Check with doctor if:** BP consistently >140/90`;
    }
    
    if (lowerQ.includes('boost immunity') || lowerQ.includes('immune')) {
      return `**Foods That Boost Immunity:**

🥦 Vitamin C: Citrus fruits, bell peppers, broccoli
🥕 Vitamin A: Carrots, sweet potatoes, spinach
🥜 Zinc: Nuts, seeds, legumes
🐟 Omega-3: Fatty fish, walnuts
🍄 Vitamin D: Mushrooms, fortified foods
🧄 Natural boosters: Garlic, ginger, turmeric`;
    }
    
    if (lowerQ.includes('water') && lowerQ.includes('drink')) {
      return `**Daily Water Intake:**

• Men: 3.7 liters (15.5 cups)
• Women: 2.7 liters (11.5 cups)

**Adjust for:**
+ Exercise: Add 1.5-2.5 cups
+ Hot weather: Add 2-4 cups
+ Pregnancy: Add 2-3 cups

**Signs of dehydration:** Dark urine, dry mouth, fatigue, dizziness.`;
    }
    
    if (lowerQ.includes('diabetes')) {
      return `**Diabetes Types:**

**Type 1:** Body doesn't produce insulin. Requires daily insulin injections. Usually diagnosed in children/young adults.

**Type 2:** Body doesn't use insulin properly. Managed with diet, exercise, oral medications. Most common (90-95%).

**Management:**
• Monitor blood sugar
• Healthy diet (low carbs, high fiber)
• Regular exercise
• Take medications as prescribed

**Target blood sugar:** 80-130 mg/dL (fasting)`;
    }
    
    if (lowerQ.includes('headache')) {
      return `**Headache Types:**

**Tension:** Band-like pressure, both sides. Cause: Stress, poor posture.

**Migraine:** Throbbing, one side, nausea, light sensitivity. Lasts 4-72 hours.

**Cluster:** Severe pain around one eye. Occurs in clusters.

**See doctor if:**
• Sudden severe headache
• Headache with fever/stiff neck
• After head injury
• Vision changes
• Weakness/numbness`;
    }
    
    // Medications
    if (lowerQ.includes('antibiotic')) {
      return `**When to Take Antibiotics:**

✅ **Use for:**
• Bacterial infections (strep throat, UTI, pneumonia)
• As prescribed by doctor

❌ **Don't use for:**
• Viral infections (cold, flu, COVID)
• Prevention (without doctor advice)

**Important:**
• Complete full course
• Take at same time daily
• Don't share with others
• Report side effects to doctor`;
    }
    
    if (lowerQ.includes('pain reliever') || lowerQ.includes('painkiller')) {
      return `**Common Pain Reliever Side Effects:**

**Acetaminophen (Paracetamol):**
• Liver damage (high doses)
• Max: 4,000mg/day

**Ibuprofen (Advil):**
• Stomach upset
• Increased bleeding risk
• Take with food

**Aspirin:**
• Stomach irritation
• Increased bleeding
• Not for children <12

**When to call doctor:** Severe stomach pain, black stools, allergic reaction.`;
    }
    
    if (lowerQ.includes('store medication') || lowerQ.includes('storage')) {
      return `**Medication Storage:**

📦 **General Rules:**
• Cool, dry place (68-77°F)
• Away from moisture (not bathroom)
• Original container with label
• Out of reach of children

❄️ **Refrigerate:** Insulin, some antibiotics (check label)

☀️ **Avoid:** Direct sunlight, heat, humidity

**Check expiration dates monthly. Dispose expired meds at pharmacy.**`;
    }
    
    if (lowerQ.includes('vitamin') && lowerQ.includes('medicine')) {
      return `**Vitamins with Other Medicines:**

⚠️ **Possible Interactions:**
• Vitamin K with blood thinners
• Calcium with antibiotics
• Iron with thyroid meds

✅ **Safe Practice:**
• Take vitamins 2-3 hours apart from medications
• Inform doctor of all supplements
• Don't exceed recommended doses

**Always consult pharmacist or doctor before combining vitamins with medications.**`;
    }
    
    // Mental Health
    if (lowerQ.includes('stress') || lowerQ.includes('anxiety')) {
      return `**Managing Stress & Anxiety:**

🧘 **Quick Relief:**
• Deep breathing (4-7-8 technique)
• Progressive muscle relaxation
• 5-minute walk

📅 **Daily Habits:**
• Regular exercise (30 min)
• Adequate sleep (7-9 hours)
• Limit caffeine/alcohol
• Practice mindfulness

**Seek help if:** Persistent worry, panic attacks, impacts daily life.`;
    }
    
    if (lowerQ.includes('sleep')) {
      return `**Improve Sleep Quality:**

🌙 **Sleep Hygiene:**
• Consistent sleep schedule (same time daily)
• Dark, cool room (65-68°F)
• No screens 1 hour before bed
• Avoid caffeine after 2 PM

⏰ **Bedtime Routine:**
1. Warm shower
2. Light reading
3. Relaxation breathing
4. Lights out

**See doctor if:** Can't sleep >2 weeks, snoring, daytime fatigue.`;
    }
    
    if (lowerQ.includes('depression')) {
      return `**Signs of Depression:**

**Emotional:**
• Persistent sadness
• Loss of interest in activities
• Feelings of worthlessness
• Difficulty concentrating

**Physical:**
• Changes in appetite/weight
• Sleep problems
• Fatigue
• Unexplained aches

**⚠️ Seek immediate help if:** Thoughts of self-harm, suicide ideation.

**Treatment:** Therapy, medication, lifestyle changes. Recovery is possible.`;
    }
    
    if (lowerQ.includes('meditation')) {
      return `**Meditation for Beginners:**

**Simple 5-Minute Practice:**
1. Sit comfortably, back straight
2. Close eyes, breathe naturally
3. Focus on breath in/out
4. When mind wanders, gently return focus
5. Start with 5 min, increase gradually

**Apps:** Headspace, Calm, Insight Timer

**Benefits:** Reduced stress, better focus, emotional balance. Practice daily for best results.`;
    }
    
    // Fitness
    if (lowerQ.includes('exercise') || lowerQ.includes('workout')) {
      return `**Exercise Recommendations:**

**Adults (18-64):**
• 150 min moderate cardio/week
• Or 75 min vigorous cardio/week
• Strength training 2x/week

**Types:**
🏃 Cardio: Walking, jogging, cycling
💪 Strength: Weights, resistance bands
🧘 Flexibility: Yoga, stretching

**Start slowly, increase gradually. Consult doctor if health conditions exist.**`;
    }
    
    // Nutrition
    if (lowerQ.includes('diet') || lowerQ.includes('nutrition')) {
      return `**Healthy Eating Basics:**

🥗 **Balanced Plate:**
• 50% vegetables/fruits
• 25% lean protein
• 25% whole grains
• Healthy fats (nuts, olive oil)

**Daily Goals:**
• 5 servings fruits/vegetables
• 8 glasses water
• Limit sugar, salt, processed foods

**Meal Timing:** Eat every 3-4 hours. Don't skip breakfast.`;
    }
    
    // Default response for other questions
    return `**Answer:**

Based on your question about "${question}", here's the key information:

This is a general health query. For specific, detailed answers:
• **Free users:** Select from predefined questions above
• **Premium users:** Get personalized AI responses

**For medical concerns:** Always consult with a qualified healthcare provider for diagnosis and treatment.

💡 Tip: Browse predefined questions by category for instant, detailed answers on specific health topics.`;
  };

  const SubscriptionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowSubscriptionModal(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-3 sm:mb-4">
            <StarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-sm sm:text-base text-gray-600">Unlock unlimited AI-powered health assistance</p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Custom Health Questions</h3>
              <p className="text-xs sm:text-sm text-gray-600">Ask anything in your own words, get personalized answers</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Image Analysis</h3>
              <p className="text-xs sm:text-sm text-gray-600">Upload medical images for AI-powered insights</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Unlimited Conversations</h3>
              <p className="text-xs sm:text-sm text-gray-600">No limits on questions or chat history</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Priority Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">Faster, more detailed responses</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Health Tracking</h3>
              <p className="text-xs sm:text-sm text-gray-600">Advanced monitoring and personalized insights</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">₹400/month</h3>
            <span className="text-xs sm:text-sm text-gray-600">or ₹4,400/year (save 8%)</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">7-day free trial • Cancel anytime</p>
        </div>

        <button
          onClick={() => navigate('/pricing')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 sm:py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          Upgrade to Premium
          <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-xl font-bold text-gray-900">AI Health Assistant</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Powered by Advanced AI Technology</p>
              </div>
            </div>
            {!hasPremium && (
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-lg text-xs sm:text-base"
              >
                <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
                <span className="sm:hidden">Upgrade</span>
              </button>
            )}
            {hasPremium && (
              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-md text-xs sm:text-base">
                <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Premium Member</span>
                <span className="sm:hidden">Pro</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Sidebar - Categories (Hidden on mobile, horizontal scroll on tablet) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LightBulbIcon className="w-5 h-5 text-purple-600" />
                Health Topics
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="w-5 h-5" />
                    <span className="font-medium">All Categories</span>
                  </div>
                </button>
                {predefinedQuestions.map((cat, idx) => {
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === idx
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium text-sm">{cat.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Category Filter - Horizontal Scroll */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-xl shadow-md p-3 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {predefinedQuestions.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(idx)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                      selectedCategory === idx
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat.category.split(' ')[0]} {/* Show only emoji and first word on mobile */}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Chat Messages */}
            <div className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-6">
              <div className="h-[400px] sm:h-[500px] lg:h-[600px] overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 py-3 sm:px-6 sm:py-4 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none text-sm sm:text-base">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-2 sm:p-4">
                {!hasPremium && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Custom chat is locked</p>
                        <p className="text-xs sm:text-sm text-gray-600">Upgrade to Premium to ask custom questions</p>
                      </div>
                      <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                )}
                <form onSubmit={handleCustomMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={hasPremium ? "Ask any health question..." : "🔒 Upgrade for custom chat"}
                    disabled={!hasPremium}
                    className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      !hasPremium ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!hasPremium || !inputMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 sm:p-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Predefined Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                {selectedCategory === null
                  ? '💡 Popular Health Questions'
                  : predefinedQuestions[selectedCategory].category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {(selectedCategory === null
                  ? predefinedQuestions.flatMap(cat => cat.questions).slice(0, 12)
                  : predefinedQuestions[selectedCategory].questions
                ).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(q)}
                    className="text-left p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border-2 border-transparent hover:border-purple-200 transition-all group"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{q.icon}</span>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-purple-700">
                        {q.q}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && <SubscriptionModal />}
    </div>
  );
};

export default AIAssistantPro;
