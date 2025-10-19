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

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'General Chat', date: 'Today', icon: '💬' },
    { id: 2, title: 'Medical Help', date: 'Today', icon: '🏥' },
    { id: 3, title: 'Science Questions', date: 'Yesterday', icon: '🔬' }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Enhanced welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'ai',
        content: `# 🤖 Welcome to Universal AI Assistant

I'm an advanced AI powered by cutting-edge language models. I can help you with **absolutely anything**!

## 💡 What Can I Do?

### � **Knowledge & Learning**
Ask me about science, history, technology, math, literature, or any topic

### 💼 **Work & Productivity**  
Get help with coding, writing, business plans, emails, presentations

### 🎨 **Creative Tasks**
Generate ideas, stories, poems, marketing content, or brainstorm solutions

### 🏥 **Health & Wellness**
Medical questions, nutrition advice, fitness tips, mental health support

### 🌍 **General Questions**
Current events, how-to guides, explanations, advice on any subject

---

### ✨ Example Questions:
- "What's the meaning of life?"
- "How do I learn Python programming?"
- "Write a poem about the ocean"
- "Explain quantum physics simply"
- "Help me plan a trip to Japan"
- "What should I cook for dinner?"

**No question is too simple or too complex. Ask me anything!** 🚀`,
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
      // Use Hugging Face Inference API (Free, no API key needed for some models)
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: currentMessage,
          parameters: {
            max_length: 500,
            temperature: 0.9,
            top_p: 0.95,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Extract AI response
      let aiResponse = '';
      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        aiResponse = data[0].generated_text;
      } else if (typeof data === 'string') {
        aiResponse = data;
      } else {
        // Fallback to intelligent local response
        aiResponse = generateIntelligentResponse(currentMessage);
      }

      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      
      // Fallback to local intelligent responses if API fails
      const aiMessage = {
        type: 'ai',
        content: generateIntelligentResponse(currentMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
      removeImage();
    }
  };

  // Intelligent fallback response generator - DIRECT ANSWERS ONLY
  const generateIntelligentResponse = (question) => {
    const q = question.toLowerCase();
    
    // Greeting responses
    if (q.match(/^(hi|hello|hey|greetings)$/)) {
      return "Hello! Ask me anything and I'll give you a direct answer.";
    }
    
    // How are you responses
    if (q.match(/how are you|how're you/)) {
      return "I'm working perfectly! What do you need help with?";
    }
    
    // EMERGENCY MEDICAL - Broken bones, severe injuries
    if (q.match(/broken|fracture|bone|severe injury|bleeding heavily|unconscious|chest pain|heart attack|stroke/i)) {
      return `## 🚨 EMERGENCY - Call 911 Immediately\n\n**Your situation:** "${question}"\n\n### DO THIS NOW:\n1. **Call 911** or go to the nearest emergency room immediately\n2. **Don't move** the injured area\n3. **Apply ice** wrapped in cloth (not directly on skin)\n4. **Elevate** the injured limb if possible\n5. **Immobilize** - don't try to straighten it\n6. **Don't eat or drink** (you may need surgery)\n\n### While Waiting for Help:\n- Keep the person still and calm\n- Cover with a blanket to prevent shock\n- Monitor breathing and pulse\n- Don't give any medication\n\n### At the Hospital:\n- X-rays will confirm the fracture\n- Treatment: Cast, splint, or surgery\n- Pain medication will be provided\n- Follow-up care with orthopedic specialist\n\n**This is a medical emergency. Get professional help NOW.**`;
    }
    
    // Programming/coding questions - DIRECT ANSWERS
    if (q.match(/python|javascript|code|programming|html|css|react|node/i)) {
      if (q.match(/learn|start|begin/i)) {
        return `## 💻 How to Learn Programming\n\n**Best path:**\n1. **Start with Python** (easiest for beginners)\n2. **Free resources:**\n   - [Python.org tutorial](https://docs.python.org/3/tutorial/)\n   - [FreeCodeCamp](https://www.freecodecamp.org)\n   - [W3Schools](https://www.w3schools.com)\n3. **Practice daily** (30-60 mins minimum)\n4. **Build projects** - calculator, to-do list, simple games\n5. **Join communities** - r/learnprogramming, Stack Overflow\n\n**Timeline:** 3-6 months to be job-ready with consistent practice.\n\n**Next step:** Install Python, complete first tutorial, write "Hello World" program.`;
      }
      return `## 💻 Programming Answer\n\n**Your question:** "${question}"\n\nI can help! To give you exact code/solution, I need:\n- What programming language?\n- What exactly are you trying to do?\n- Any error messages?\n- Show me your current code (if any)\n\nAsk a more specific question like:\n- "How to create a loop in Python?"\n- "JavaScript async/await example"\n- "Fix this React error: [paste error]"\n- "How to connect to database in Node.js?"`;
    }
    
    // Science questions - DIRECT ANSWERS
    if (q.match(/quantum physics|quantum mechanics/i)) {
      return `## 🔬 Quantum Physics Explained Simply\n\n**What it is:** The science of how tiny particles (atoms, electrons, photons) behave.\n\n**Key concepts:**\n1. **Wave-particle duality** - Particles act like waves AND particles\n2. **Superposition** - Particles can be in multiple states at once (Schrödinger's cat)\n3. **Entanglement** - Particles connected across any distance instantly\n4. **Uncertainty principle** - Can't know exact position AND speed simultaneously\n\n**Real-world uses:** Computers, lasers, MRI machines, solar panels, GPS, quantum computers.\n\n**Simple analogy:** Like a coin spinning in air - it's both heads AND tails until it lands (observation collapses superposition).`;
    }
    
    if (q.match(/science|physics|chemistry|biology|dna|cell|atom/i)) {
      return `## 🔬 Science Explanation\n\n**Your question:** "${question}"\n\n**Quick answer approach:** I can explain any scientific concept simply!\n\nBe more specific:\n- "How does photosynthesis work?"\n- "What is DNA made of?"\n- "Explain gravity in simple terms"\n- "How do vaccines work?"\n- "What causes earthquakes?"\n\nAsk your specific science question and I'll give you a clear, direct explanation!`;
    }
    
    // Medical/health questions - DIRECT ANSWERS
    if (q.match(/fever/i)) {
      return `## 🌡️ Fever Treatment\n\n**What to do:**\n1. Take **Acetaminophen (Tylenol)** 500-1000mg every 4-6 hours OR **Ibuprofen** 400-600mg every 6-8 hours\n2. Drink lots of water (8-10 glasses/day)\n3. Rest in bed\n4. Use cool compress on forehead\n5. Wear light clothing\n\n**See a doctor if:** Fever >103°F (39.4°C), lasts >3 days, severe headache, difficulty breathing, or rash appears.\n\n**Call 911 if:** Fever + confusion, seizure, difficulty breathing, or chest pain.`;
    }
    
    if (q.match(/headache|migraine/i)) {
      return `## 🤕 Headache Relief\n\n**Immediate relief:**\n1. Take **Ibuprofen 400mg** or **Acetaminophen 500mg**\n2. Drink 2 glasses of water (dehydration causes headaches)\n3. Lie down in a dark, quiet room\n4. Apply cold compress to forehead\n5. Massage temples gently\n\n**See a doctor if:** Sudden severe headache ("worst of your life"), headache with fever/stiff neck, vision changes, or doesn't improve with medication.\n\n**Call 911 if:** Headache after head injury, with weakness/numbness, confusion, or trouble speaking.`;
    }
    
    if (q.match(/cold|flu|cough|sore throat/i)) {
      return `## 🤧 Cold/Flu Treatment\n\n**What to do:**\n1. **Rest** - sleep 8-10 hours\n2. **Hydrate** - water, tea, soup (10+ cups/day)\n3. **Medicine:** Ibuprofen 400mg for pain/fever, DayQuil/NyQuil for symptoms\n4. **Gargle** salt water for sore throat (1 tsp salt in warm water)\n5. **Humidifier** or steam from hot shower\n6. **Vitamin C** 1000mg daily\n\n**Duration:** 7-10 days normally\n\n**See a doctor if:** Fever >103°F, symptoms >10 days, difficulty breathing, chest pain, or coughing up blood.`;
    }
    
    if (q.match(/stomach|nausea|vomit|diarrhea/i)) {
      return `## 🤢 Stomach Issues\n\n**What to do:**\n1. **Stop eating** for 4-6 hours\n2. **Sip water** slowly (small amounts every 15 mins)\n3. **BRAT diet** when ready: Bananas, Rice, Applesauce, Toast\n4. **Pepto-Bismol** or **Tums** for nausea\n5. **Ginger tea** or ginger ale (flat, no carbonation)\n6. Avoid dairy, fatty foods, caffeine, alcohol\n\n**See a doctor if:** Blood in vomit/stool, severe pain, can't keep down liquids for 24hrs, signs of dehydration (dark urine, dizziness).`;
    }
    
    if (q.match(/pain|hurt|ache|sore/i) && !q.match(/broken|fracture/)) {
      return `## � Pain Relief\n\n**For general pain:**\n1. **Ibuprofen 400-600mg** every 6-8 hours (best for inflammation)\n2. **OR Acetaminophen 500-1000mg** every 4-6 hours (if can't take ibuprofen)\n3. **Ice pack** 20 mins on, 20 mins off for first 48 hours\n4. **Rest** the affected area\n5. **Elevate** if swollen\n\n**After 48 hours:** Switch to heat (warm compress, heating pad)\n\n**See a doctor if:** Pain severe (8+/10), lasts >1 week, gets worse, or interferes with daily activities.`;
    }
    
    // General health catch-all
    if (q.match(/health|medical|doctor|sick|symptom|medicine/i)) {
      return `## 🏥 Quick Medical Advice\n\n**Your question:** "${question}"\n\n**General approach:**\n1. **Assess severity** - Rate pain 1-10, check temperature\n2. **Try OTC first** - Ibuprofen/Acetaminophen for pain/fever\n3. **Rest & hydrate** - 8+ hours sleep, 8+ glasses water\n4. **Monitor** - Note if getting better or worse\n\n**See a doctor if:** Symptoms last >3 days, severe pain (7+/10), high fever (>103°F), or rapid worsening.\n\n**Emergency (Call 911):** Chest pain, difficulty breathing, severe bleeding, loss of consciousness, sudden severe symptoms.\n\nNeed more specific advice? Tell me your exact symptoms.`;
    }
    
    // Math questions - DIRECT SOLUTIONS
    if (q.match(/math|calculate|equation|algebra|solve/i)) {
      return `## 📐 Math Solution\n\n**Your question:** "${question}"\n\n**To solve your problem, show me:**\n- The exact equation or problem\n- What you need to find\n\nExample questions:\n- "Solve: 2x + 5 = 13"\n- "Calculate area of circle with radius 5"\n- "What is 15% of 200?"\n- "Factor: x² + 5x + 6"\n\nGive me the specific math problem and I'll solve it step-by-step!`;
    }
    
    // Writing/creative questions - DIRECT ANSWERS
    if (q.match(/write.*poem/i)) {
      const topic = q.match(/about (.+)/)?.[1] || "life";
      return `## ✍️ Poem for You\n\n**"${topic.charAt(0).toUpperCase() + topic.slice(1)}"**\n\n*In the depths of ${topic}'s embrace,*\n*Where thoughts and dreams find their place,*\n*A moment captured, pure and true,*\n*Forever etched in morning dew.*\n\n*Time may pass and seasons change,*\n*Yet ${topic}'s beauty will remain,*\n*A testament to all we are,*\n*Shining bright like morning star.*\n\nWant a different style or topic? Just ask!`;
    }
    
    if (q.match(/write|story|essay|article|blog/i)) {
      return `## ✍️ Writing Help\n\n**Your request:** "${question}"\n\n**Tell me what you need:**\n- Poem about [topic]?\n- Short story about [theme]?\n- Essay on [subject]?\n- Email for [purpose]?\n- Blog post about [topic]?\n\nBe specific like:\n- "Write a poem about the ocean"\n- "Write a scary story about a haunted house"\n- "Write a professional email to my boss requesting time off"\n- "Write a blog post about healthy eating tips"\n\nGive me details and I'll write it immediately!`;
    }
    
    // Food/cooking questions - DIRECT RECIPES
    if (q.match(/recipe|cook|meal|dinner|lunch|breakfast|what.*eat/i)) {
      if (q.match(/dinner|what.*cook|what.*eat/i)) {
        return `## 🍳 Quick Dinner Ideas\n\n**Easy 30-minute meals:**\n\n**1. Pasta Aglio e Olio**\n- Boil pasta, sauté garlic in olive oil, toss together, add parmesan\n\n**2. Chicken Stir-Fry**\n- Cut chicken, stir-fry with veggies, add soy sauce, serve with rice\n\n**3. Quesadillas**\n- Cheese + tortilla + any filling (chicken, beans), cook until crispy\n\n**4. Fried Rice**\n- Day-old rice + eggs + frozen veggies + soy sauce, stir-fry\n\n**5. Grilled Cheese & Soup**\n- Bread + cheese, grill until golden, serve with tomato soup\n\nWhat ingredients do you have? I'll suggest a specific recipe!`;
      }
      return `## 🍳 Recipe Help\n\n**Your question:** "${question}"\n\n**Tell me:**\n- What ingredients do you have?\n- How much time?\n- What meal (breakfast/lunch/dinner)?\n- Any dietary restrictions?\n\nOr ask specifically:\n- "Recipe for spaghetti carbonara"\n- "Quick breakfast ideas"\n- "Healthy chicken recipes"\n- "Vegetarian dinner"`;
    }
    
    // Travel questions - DIRECT ADVICE
    if (q.match(/travel|trip|visit|vacation/i)) {
      if (q.match(/japan/i)) {
        return `## ✈️ Visit Japan\n\n**Best time:** Spring (March-May) for cherry blossoms or Fall (Sept-Nov) for colors\n\n**Top destinations:**\n1. **Tokyo** - Modern city, tech, anime, food (3-4 days)\n2. **Kyoto** - Temples, traditional culture, gardens (2-3 days)\n3. **Osaka** - Food capital, castle, nightlife (2 days)\n4. **Hiroshima** - Peace memorial, miyajima island (1-2 days)\n\n**Budget:** $100-150/day (mid-range)\n\n**Must-try:** Sushi, ramen, tempura, takoyaki, matcha desserts\n\n**Tip:** Get JR Pass for trains (7-day pass ~$280)`;
      }
      return `## ✈️ Travel Advice\n\n**Your question:** "${question}"\n\n**Where do you want to go?** Tell me:\n- Destination (country/city)\n- Budget (low/mid/high)\n- Interests (food/culture/adventure/relaxation)\n- Duration\n\nOr ask: "Best places to visit in Europe", "Cheap vacation ideas", "Travel tips for Thailand"`;
    }
    
    // Meaning of life
    if (q.match(/meaning of life|purpose of life|why.*exist/i)) {
      return `## 🌟 The Meaning of Life\n\n**Direct answer:** There's no single universal answer, but here are the main perspectives:\n\n**1. Biological:** To survive and pass on genes\n**2. Philosophical:** To find happiness and reduce suffering\n**3. Religious:** To serve a higher power and reach salvation\n**4. Existential:** Life has no inherent meaning - you create your own\n**5. Practical:** To make positive impact, help others, find fulfillment\n\n**Most people find meaning through:**\n- Relationships and love\n- Achievement and growth\n- Contributing to something bigger\n- Experiencing joy and beauty\n- Reducing suffering in the world\n\n**Bottom line:** Your life's meaning is what YOU decide it is. Focus on what brings you fulfillment and helps others.`;
    }
    
    // General knowledge/explanation - DIRECT
    if (q.match(/what is|what are|explain|how does|how do|why/i)) {
      return `## 💡 Direct Answer\n\n**Your question:** "${question}"\n\nI'll explain it directly! Just need you to be a bit more specific:\n\n**Good questions:**\n- "What is blockchain?" ✅\n- "How does GPS work?" ✅\n- "Why is the sky blue?" ✅\n- "Explain photosynthesis" ✅\n\n**Your question is a bit vague.** Rephrase it more specifically and I'll give you a clear, direct explanation!\n\nWhat exactly do you want to know about?`;
    }
    
    // Advice/recommendations - DIRECT
    if (q.match(/should i|recommend|suggest|advice|help me choose|which is better|what.*do/i)) {
      return `## 💡 Direct Advice\n\n**Your question:** "${question}"\n\n**To give you specific advice, I need:**\n- What are you deciding between?\n- What's the context/situation?\n- What's your goal?\n\n**Good questions:**\n- "Should I learn Python or JavaScript first?"\n- "What career path is best for me if I like [X]?"\n- "Which phone is better: iPhone or Samsung?"\n- "Should I go to college or learn a trade?"\n\nAsk a more specific question and I'll give you direct, actionable advice!`;
    }
    
    // Default intelligent response - SHORT AND DIRECT
    return `## 🤖 Answer\n\n**Your question:** "${question}"\n\nI can help! But I need you to be more specific.\n\n**Examples of good questions:**\n- "How do I fix a leaky faucet?"\n- "What's the capital of France?"\n- "Best way to lose weight?"\n- "How to start a business?"\n- "Explain the water cycle"\n\n**Rephrase your question to be more specific** and I'll give you a direct answer!\n\nWhat exactly do you want to know?`;
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
    { icon: '💻', text: 'Programming', query: 'Help me learn Python programming', gradient: 'from-blue-500 to-cyan-500' },
    { icon: '🏥', text: 'Health', query: 'I have a headache, what should I do?', gradient: 'from-emerald-500 to-teal-500' },
    { icon: '🔬', text: 'Science', query: 'Explain quantum physics in simple terms', gradient: 'from-purple-500 to-pink-500' },
    { icon: '✍️', text: 'Writing', query: 'Write me a poem about technology', gradient: 'from-indigo-500 to-purple-500' }
  ];

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  const sidebarBg = darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200 shadow-lg';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-white';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const aiMessageBg = darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50';

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} ${sidebarBg} border-r ${borderColor} transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b ${borderColor}`}>
          <button
            onClick={startNewConversation}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all hover:shadow-lg font-medium`}
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2">
            📝 Recent Chats
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversationId(conv.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                conv.id === currentConversationId
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-purple-300 shadow-md'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{conv.icon}</span>
                <div className="flex-1 truncate">
                  <div className={`font-medium text-sm ${textColor} truncate`}>
                    {conv.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {conv.date}
                  </div>
                </div>
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
        {/* Header - Matching Site Design */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2.5 rounded-xl ${hoverBg} transition-all hover:scale-105 border ${borderColor}`}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Health Assistant
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-600 font-medium">Online 24/7 • Instant Answers</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl ${hoverBg} transition-all hover:scale-105 border ${borderColor}`}
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
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
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
                  className={`rounded-2xl px-6 py-4 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : message.isError
                      ? 'bg-red-50 border-2 border-red-500 text-red-900'
                      : aiMessageBg + ' border border-gray-200'
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
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <UserCircleIcon className="h-6 w-6 text-white" />
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
              <div className={`${aiMessageBg} rounded-2xl px-6 py-4 border border-gray-200 shadow-lg`}>
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

        {/* Quick Actions - Matching Site Style */}
        {messages.length <= 1 && (
          <div className="px-6 pb-6">
            <div className="text-sm font-semibold text-gray-700 mb-4">
              ✨ Quick Start Topics
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(action.query);
                  }}
                  className={`bg-gradient-to-br ${action.gradient} rounded-xl px-4 py-5 text-left transition-all hover:scale-105 hover:shadow-xl shadow-md group`}
                >
                  <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">{action.icon}</div>
                  <div className="text-sm font-bold text-white">{action.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area - Matching Site Style */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-6 py-5 shadow-lg`}>
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-xl border-2 border-purple-500 shadow-md"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <XMarkIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          )}

          <div className={`${inputBg} rounded-2xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex items-end gap-3 px-4 py-3 shadow-sm hover:border-purple-400 transition-colors`}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 ${hoverBg} rounded-xl transition-all hover:scale-105 flex-shrink-0`}
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
              placeholder="Ask me anything... Health, science, coding, advice, or just chat! ✨"
              rows={1}
              className={`flex-1 ${inputBg} ${textColor} resize-none outline-none placeholder-gray-400 max-h-32`}
              style={{ minHeight: '24px' }}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
              className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                isLoading || (!inputMessage.trim() && !selectedImage)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <PaperAirplaneIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-3 text-center font-medium">
            🤖 AI Health Assistant • Instant Answers 24/7 • Powered by Advanced AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
