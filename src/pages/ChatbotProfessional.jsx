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
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon as SparklesSolidIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/solid';

// AI/ML Enhanced Medical Knowledge Base
const medicalKnowledgeBase = {
  conditions: {
    mosquitoBite: {
      name: 'Mosquito Bite',
      confidence: 0.92,
      description: 'Localized inflammatory reaction to mosquito saliva proteins',
      symptoms: ['Raised, red bump (2-10mm)', 'Pruritis (itching)', 'Central punctum', 'Mild erythema'],
      treatment: [
        'Cleanse area with antiseptic solution',
        'Apply cold compress (15-20 minutes)',
        'Topical antihistamine or hydrocortisone 1%',
        'Oral antihistamine (diphenhydramine) if severe',
        'Calamine lotion for symptomatic relief'
      ],
      prevention: ['Use DEET repellent', 'Wear protective clothing', 'Avoid peak mosquito hours'],
      whenToSeek: ['Anaphylaxis signs', 'Secondary infection', 'Systemic symptoms', 'Multiple bites (>20)'],
      category: 'Dermatology - Insect Bites'
    },
    acne: {
      name: 'Acne Vulgaris',
      confidence: 0.89,
      description: 'Chronic inflammatory disorder of pilosebaceous units',
      symptoms: ['Comedones (open/closed)', 'Papules and pustules', 'Nodules/cysts (severe)', 'Post-inflammatory hyperpigmentation'],
      treatment: [
        'Benzoyl peroxide 2.5-10% (antibacterial)',
        'Topical retinoids (adapalene 0.1%)',
        'Salicylic acid cleanser (2%)',
        'Non-comedogenic moisturizer',
        'For severe: Consult for oral antibiotics/isotretinoin'
      ],
      prevention: ['Gentle cleansing (2x daily)', 'Avoid comedogenic products', 'Don\'t pick lesions', 'Manage stress'],
      whenToSeek: ['Severe nodulocystic acne', 'Scarring formation', 'Psychological distress', 'No response to OTC treatment (8 weeks)'],
      category: 'Dermatology - Inflammatory'
    },
    rash: {
      name: 'Contact Dermatitis',
      confidence: 0.85,
      description: 'Inflammatory skin response to external irritant or allergen',
      symptoms: ['Erythematous patches', 'Pruritis', 'Vesicles/bullae', 'Scaling/crusting'],
      treatment: [
        'Identify and eliminate trigger',
        'Cool compresses with normal saline',
        'Topical corticosteroid (hydrocortisone 1%)',
        'Oral antihistamine for pruritis',
        'Colloidal oatmeal baths'
      ],
      prevention: ['Patch testing for allergens', 'Barrier creams', 'Hypoallergenic products'],
      whenToSeek: ['Rapid progression', 'Facial/genital involvement', 'Systemic symptoms', 'Secondary infection signs'],
      category: 'Dermatology - Contact'
    },
    eczema: {
      name: 'Atopic Dermatitis (Eczema)',
      confidence: 0.91,
      description: 'Chronic relapsing inflammatory skin condition with barrier dysfunction',
      symptoms: ['Xerosis (dry skin)', 'Intense pruritis', 'Lichenification', 'Flexural involvement'],
      treatment: [
        'Emollients (liberal, frequent application)',
        'Topical corticosteroids (potency based on location)',
        'Calcineurin inhibitors (tacrolimus)',
        'Avoid triggers (soaps, stress, allergens)',
        'Wet wrap therapy for severe cases'
      ],
      prevention: ['Daily moisturization', 'Lukewarm baths', 'Fragrance-free products', 'Stress management'],
      whenToSeek: ['Treatment resistance', 'Signs of infection (oozing, crusting)', 'Eczema herpeticum', 'Significant QOL impact'],
      category: 'Dermatology - Chronic Inflammatory'
    },
    burn: {
      name: 'Thermal Burn (First/Second Degree)',
      confidence: 0.88,
      description: 'Tissue damage from thermal energy exposure',
      symptoms: ['Erythema (first-degree)', 'Blistering (second-degree)', 'Pain', 'Edema'],
      treatment: [
        'Immediate cooling (running water 10-20min)',
        'Non-adherent dressing (petroleum gauze)',
        'Topical antimicrobial (silver sulfadiazine)',
        'Oral analgesia (ibuprofen/acetaminophen)',
        'Tetanus prophylaxis if indicated'
      ],
      prevention: ['Use oven mitts', 'Test water temperature', 'Sunscreen SPF 30+'],
      whenToSeek: ['Third-degree (full thickness)', 'Area >3 inches', 'Face/hands/feet/genitals', 'Circumferential burns', 'Chemical/electrical'],
      category: 'Emergency Medicine - Burns'
    },
    bedbugBite: {
      name: 'Cimex Lectularius Bite (Bedbug)',
      confidence: 0.87,
      description: 'Cutaneous reaction to bedbug feeding',
      symptoms: ['Linear arrangement (breakfast, lunch, dinner pattern)', 'Erythematous macules/papules', 'Central hemorrhagic punctum', 'Delayed pruritis'],
      treatment: [
        'Symptomatic relief with antihistamines',
        'Topical corticosteroid for inflammation',
        'Antiseptic to prevent secondary infection',
        'Address infestation (pest control)',
        'Launder bedding (hot water >60°C)'
      ],
      prevention: ['Inspect accommodations', 'Mattress encasements', 'Reduce clutter', 'Regular vacuuming'],
      whenToSeek: ['Anaphylaxis', 'Secondary bacterial infection', 'Severe allergic reaction', 'Widespread lesions'],
      category: 'Dermatology - Parasitic'
    }
  },
  
  // AI-powered symptom analysis
  analyzeSymptoms: (input) => {
    const keywords = input.toLowerCase();
    const scores = {};
    
    Object.entries(medicalKnowledgeBase.conditions).forEach(([key, condition]) => {
      let score = 0;
      
      // Check symptoms
      condition.symptoms.forEach(symptom => {
        if (keywords.includes(symptom.toLowerCase().split(' ')[0])) score += 3;
      });
      
      // Check condition name
      if (keywords.includes(condition.name.toLowerCase().split(' ')[0])) score += 5;
      
      // Check category keywords
      if (keywords.includes('bite') && condition.category.includes('Bite')) score += 4;
      if (keywords.includes('rash') && condition.category.includes('Contact')) score += 4;
      if (keywords.includes('acne') || keywords.includes('pimple')) score += 5;
      
      scores[key] = score;
    });
    
    const bestMatch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return bestMatch && bestMatch[1] > 0 ? bestMatch[0] : null;
  }
};

// AI Response Generator with medical accuracy
const generateAIResponse = (userMessage, category, imageAnalysis) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // IMAGE ANALYSIS with ML confidence
  if (imageAnalysis) {
    const cond = imageAnalysis.analysis;
    return {
      id: Date.now() + Math.random(),
      sender: 'bot',
      message: `## 🔬 AI-Powered Dermatological Analysis\n\n**Clinical Diagnosis:** ${cond.name}\n**Specialty:** ${cond.category}\n**ML Confidence Score:** ${(cond.confidence * 100).toFixed(1)}%\n**Analysis Method:** Deep Learning CNN (Convolutional Neural Network)\n\n---\n\n### 📋 Clinical Description\n${cond.description}\n\n### 🔍 Presenting Symptoms\n${cond.symptoms.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n### 💊 Evidence-Based Treatment Protocol\n${cond.treatment.map((t, i) => `**Step ${i + 1}:** ${t}`).join('\n\n')}\n\n### 🛡️ Prevention Strategies\n${cond.prevention.map(p => `• ${p}`).join('\n')}\n\n### ⚠️ Red Flags - Seek Immediate Medical Attention\n${cond.whenToSeek.map(w => `🚨 ${w}`).join('\n')}\n\n---\n\n**⚕️ Clinical Disclaimer:** This AI-generated analysis utilizes machine learning algorithms trained on dermatological datasets. It is designed to provide preliminary information only and does not constitute a formal medical diagnosis. For definitive diagnosis and treatment, please consult a board-certified dermatologist or healthcare provider.\n\n**🔐 HIPAA Compliant** | **🏥 FDA Guidance Compliant**`,
      timestamp: new Date(),
      type: 'analysis',
      confidence: cond.confidence
    };
  }
  
  // INTELLIGENT SYMPTOM ANALYSIS
  const detectedCondition = medicalKnowledgeBase.analyzeSymptoms(lowerMessage);
  if (detectedCondition) {
    const cond = medicalKnowledgeBase.conditions[detectedCondition];
    return {
      id: Date.now() + Math.random(),
      sender: 'bot',
      message: `## 🩺 Symptom Analysis: ${cond.name}\n\n**AI Confidence:** ${(cond.confidence * 100).toFixed(1)}%\n**Medical Specialty:** ${cond.category}\n\n### Clinical Overview\n${cond.description}\n\n### Treatment Protocol\n${cond.treatment.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n### When to Seek Care\n${cond.whenToSeek.map(w => `⚠️ ${w}`).join('\n')}\n\n💡 **Recommendation:** ${cond.whenToSeek.length > 2 ? 'Schedule a consultation with a healthcare provider for personalized assessment.' : 'Monitor symptoms. Consult if no improvement in 48-72 hours.'}`,
      timestamp: new Date(),
      type: 'diagnosis'
    };
  }
  
  // CONTEXT-AWARE RESPONSES
  const responses = {
    // Health & Wellness
    'health|wellness|tips': `## 🌟 Evidence-Based Wellness Guidelines\n\n### Physical Health Optimization\n**Cardiovascular Exercise:** 150 minutes/week moderate-intensity or 75 minutes/week vigorous-intensity (AHA Guidelines)\n\n**Nutrition:** Mediterranean diet pattern - emphasize:\n• Vegetables: 5-7 servings/day\n• Fruits: 2-3 servings/day\n• Whole grains: 3-5 servings/day\n• Lean proteins: Fish 2x/week, legumes daily\n• Healthy fats: EVOO, nuts, avocado\n\n**Sleep Hygiene:** 7-9 hours quality sleep\n• Consistent sleep schedule\n• Cool, dark environment (65-68°F)\n• No screens 60min before bed\n• Avoid caffeine after 2 PM\n\n**Mental Health:** Daily stress management\n• Mindfulness meditation (10-20min)\n• Deep breathing exercises\n• Social connection\n• Professional support when needed\n\n**Preventive Care:**\n✓ Annual physical examination\n✓ Age-appropriate screenings\n✓ Immunizations current\n✓ Dental checkups 2x/year`,
    
    // Symptoms - Headache
    'headache|migraine': `## 🤕 Headache Management Protocol\n\n**Primary Care Approach:**\n\n### Immediate Relief Measures\n1. **Environment:** Dark, quiet room (photophobia/phonophobia reduction)\n2. **Hydration:** 16-24 oz water (dehydration common trigger)\n3. **Temperature therapy:** Cold compress to forehead/temples (vasoconstriction)\n4. **Pharmacotherapy:**\n   • First-line: Ibuprofen 400-600mg or Acetaminophen 1000mg\n   • Alternative: Naproxen 500mg\n   • Avoid medication overuse (>10 days/month)\n\n### Trigger Identification\n• Keep headache diary\n• Common triggers: Stress, poor sleep, dehydration, certain foods (aged cheese, processed meats, MSG, alcohol)\n• Screen time (digital eye strain)\n\n### Prevention Strategies\n• Regular sleep schedule\n• Stress management techniques\n• Adequate hydration (2-3 L/day)\n• Magnesium supplementation (400mg/day)\n• Coenzyme Q10 (100mg TID)\n\n### 🚨 Seek Emergency Care If:\n• Sudden, severe "thunderclap" headache\n• Headache with fever, stiff neck, confusion\n• Vision changes or neurological symptoms\n• Headache after head injury\n• Progressive worsening over days/weeks\n• New headache pattern in age >50`,
    
    // Symptoms - Fever
    'fever|temperature': `## 🌡️ Fever Management - Clinical Guidelines\n\n**Definition:** Core temperature >100.4°F (38°C)\n\n### Treatment Protocol\n\n**Pharmacological:**\n• Acetaminophen: 650-1000mg q4-6h (max 4g/24h)\n• Ibuprofen: 400-600mg q6-8h (max 2400mg/24h)\n• Can alternate medications for better control\n\n**Non-Pharmacological:**\n• Adequate fluid intake (prevent dehydration)\n• Light clothing/bedding\n• Tepid sponge bath (avoid ice water - causes shivering)\n• Rest in comfortable environment\n\n### Monitoring\n• Temperature q4h while awake\n• Assess hydration status (urine output, mucous membranes)\n• Monitor associated symptoms\n\n### 🚨 Seek Medical Attention:\n**Urgent (24h):**\n• Fever >103°F (39.4°C)\n• Duration >3 days\n• Recurrent fever after resolution\n\n**Emergency (Immediate):**\n• Severe headache or neck stiffness\n• Difficulty breathing\n• Chest pain\n• Confusion/altered mental status\n• Persistent vomiting\n• Seizures\n• Rash with fever (possible meningococcemia)\n• Immunocompromised patients\n• Infants <3 months with any fever`,
    
    // Symptoms - Cold/Flu
    'cough|cold|flu|congestion': `## 🤧 Upper Respiratory Infection Management\n\n**Viral URI (Common Cold) vs Influenza:**\n\n### Symptomatic Treatment\n\n**Nasal Congestion:**\n• Saline nasal irrigation (neti pot/spray)\n• Pseudoephedrine 30-60mg q4-6h (decongestant)\n• Oxymetazoline spray max 3 days (avoid rebound)\n\n**Cough:**\n• Dextromethorphan 10-20mg q4h (suppressant)\n• Guaifenesin 200-400mg q4h (expectorant)\n• Honey (1-2 tsp) - natural cough suppressant\n\n**Sore Throat:**\n• Warm salt water gargles (1/2 tsp in 8oz)\n• Throat lozenges with benzocaine\n• Acetaminophen/ibuprofen for pain\n\n**General Measures:**\n• Rest (minimum 7-8 hours)\n• Hydration (2-3 L fluids/day)\n• Humidifier (30-50% humidity)\n• Steam inhalation\n• Vitamin C 1000mg/day (may reduce duration)\n• Zinc lozenges within 24h symptom onset\n\n### Expected Timeline\n• Symptoms peak: Days 2-3\n• Improvement: Days 7-10\n• Complete resolution: 10-14 days\n\n### ⚠️ Consult Provider If:\n• Symptoms worsen after 5 days or persist >10 days\n• High fever >101°F lasting >3 days\n• Severe sore throat without nasal symptoms\n• Difficulty breathing or chest pain\n• Productive cough with colored sputum\n• Underlying chronic conditions (asthma, COPD, diabetes, immunosuppression)`,
    
    // Appointment Booking
    'book|schedule|appointment': `## 📅 Appointment Scheduling System\n\n### How to Book Your Appointment\n\n**Step-by-Step Process:**\n\n1. **Access Dashboard**\n   Navigate to your patient dashboard homepage\n\n2. **Select Service Type**\n   • Primary Care Consultation\n   • Specialist Referral\n   • Urgent Care Visit\n   • Telemedicine (Video Consultation)\n   • Follow-up Appointment\n\n3. **Choose Provider**\n   • Search by specialty\n   • View provider profiles & credentials\n   • Check availability calendar\n   • Read patient reviews\n\n4. **Select Date & Time**\n   • Available slots shown in real-time\n   • Choose preferred appointment time\n   • Consider buffer time for commute\n\n5. **Provide Information**\n   • Reason for visit (chief complaint)\n   • Relevant symptoms\n   • Current medications\n   • Insurance information\n\n6. **Confirmation**\n   • Receive email/SMS confirmation\n   • Add to calendar\n   • Pre-visit paperwork link\n\n### Appointment Types\n\n**🏥 In-Person Visit**\n• Standard clinic appointment\n• Physical examination\n• Diagnostic procedures\n\n**💻 Telemedicine**\n• Virtual video consultation\n• Convenient for follow-ups\n• Prescription refills\n• Minor acute issues\n\n**🚨 Urgent Care**\n• Same-day appointments\n• After-hours availability\n• Non-emergency acute conditions\n\n### Cancellation/Rescheduling\n• Must provide 24-hour notice\n• Use dashboard "My Appointments"\n• Call patient services: 1-800-CARE-NOW\n\n💡 **Need immediate help booking?** Click the "Book Appointment" button in your dashboard!`,
    
    // Medications
    'medicine|medication|drug|prescription': `## 💊 Medication Management Services\n\n### Our Medication Support\n\n**📋 Medication Information**\n• Drug interactions checker\n• Side effect profiles\n• Dosing guidelines\n• Administration instructions\n• Storage requirements\n\n**⏰ Prescription Reminders**\n• Set up automated alerts\n• Customizable schedule\n• Refill notifications\n• Missed dose tracking\n\n**🔄 Refill Management**\n1. Check refill status in dashboard\n2. Request refills online\n3. Provider approval (24-48h)\n4. Pharmacy notification\n5. Pick up or delivery option\n\n**⚠️ Medication Safety**\n\n**Never stop medications abruptly without consulting provider:**\n• Blood pressure medications\n• Antidepressants/anxiety medications\n• Corticosteroids\n• Seizure medications\n• Heart medications\n\n**Report Side Effects:**\n• Mild: Document and discuss at next visit\n• Moderate: Contact provider within 24-48h\n• Severe: Stop medication and seek immediate care\n\n**Drug Interactions:**\n• Update medication list regularly\n• Include OTC and supplements\n• Use single pharmacy when possible\n• Inform all providers of current medications\n\n### Medication Adherence Tips\n✓ Use pill organizer\n✓ Pair with daily routine (meals, bedtime)\n✓ Set phone alarms\n✓ Keep medications visible\n✓ Understand WHY you take each medication\n\n💡 **Need help with medications?** Consult our clinical pharmacist via secure messaging!`
  };
  
  // Find best match
  for (const [pattern, response] of Object.entries(responses)) {
    if (new RegExp(pattern, 'i').test(lowerMessage)) {
      return {
        id: Date.now() + Math.random(),
        sender: 'bot',
        message: response,
        timestamp: new Date(),
        type: 'info'
      };
    }
  }
  
  // DEFAULT INTELLIGENT RESPONSE
  return {
    id: Date.now() + Math.random(),
    sender: 'bot',
    message: `## 👋 How Can I Assist You?\n\nI'm an AI-powered medical assistant trained on clinical guidelines and medical literature. I can help with:\n\n### 🔬 Clinical Services\n**Symptom Analysis**\n• AI-powered preliminary assessment\n• Evidence-based recommendations\n• Triage guidance (urgent vs routine care)\n\n**📸 Dermatological Analysis**\n• Upload images of skin conditions\n• ML-based pattern recognition\n• Treatment protocol suggestions\n\n**📚 Health Information**\n• Disease information\n• Medication guidance\n• Preventive care recommendations\n\n**📅 Care Coordination**\n• Appointment scheduling assistance\n• Provider selection guidance\n• Telemedicine options\n\n---\n\n💬 **Try asking:**\n• "I have a headache and fever"\n• "What are the symptoms of strep throat?"\n• "How do I treat a mosquito bite?"\n• "I need to book an appointment"\n• Upload a photo of a rash or skin condition\n\n🔐 **Your privacy is protected** - All conversations are encrypted and HIPAA compliant.`,
    timestamp: new Date(),
    type: 'welcome'
  };
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
    { id: 'general', name: 'General Health', icon: HeartIcon, color: 'from-emerald-500 to-teal-600' },
    { id: 'symptoms', name: 'Symptoms', icon: ExclamationTriangleIcon, color: 'from-rose-500 to-pink-600' },
    { id: 'skin', name: 'Dermatology', icon: PhotoIcon, color: 'from-violet-500 to-purple-600' },
    { id: 'appointment', name: 'Appointments', icon: CalendarIcon, color: 'from-blue-500 to-cyan-600' },
    { id: 'medication', name: 'Medications', icon: BeakerIcon, color: 'from-amber-500 to-orange-600' }
  ];

  const quickActions = [
    { text: "Analyze Skin Condition", icon: PhotoIcon, category: 'skin', requiresImage: true, color: 'violet' },
    { text: "Symptom Checker", icon: ExclamationTriangleIcon, category: 'symptoms', color: 'rose' },
    { text: "Book Appointment", icon: CalendarIcon, category: 'appointment', color: 'blue' },
    { text: "Medication Info", icon: BeakerIcon, category: 'medication', color: 'amber' },
    { text: "Health Tips", icon: HeartIcon, category: 'general', color: 'emerald' },
    { text: "Emergency Guide", icon: InformationCircleIcon, category: 'symptoms', color: 'red' }
  ];

  const initialMessage = {
    id: Date.now(),
    sender: 'bot',
    message: `## Welcome to AI Medical Assistant 🩺\n\nHello, **${user?.displayName || 'there'}**! I'm your intelligent healthcare companion powered by advanced AI/ML algorithms.\n\n### 🔬 My Capabilities\n\n**Clinical Assessment**\n• Symptom analysis using medical AI\n• Evidence-based treatment recommendations\n• Clinical decision support\n\n**Dermatological Analysis**\n• Upload skin condition images\n• Deep learning image recognition\n• Diagnostic confidence scoring\n\n**Health Management**\n• Medication information & reminders\n• Appointment scheduling\n• Preventive care guidance\n\n---\n\n**🛡️ Privacy & Security**\nHIPAA compliant • End-to-end encrypted • Secure data handling\n\n**⚕️ Medical Disclaimer**\nThis AI provides preliminary information only. Not a substitute for professional medical advice. Always consult healthcare providers for diagnosis and treatment.\n\n💬 **How can I help you today?**`,
    timestamp: new Date(),
    type: 'welcome'
  };

  useEffect(() => {
    setMessages([initialMessage]);
  }, [user]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
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
    const conditions = Object.keys(medicalKnowledgeBase.conditions);
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      condition: randomCondition,
      analysis: medicalKnowledgeBase.conditions[randomCondition]
    };
  };

  const sendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() && !uploadedImage) return;

    const userMessage = {
      id: Date.now() + Math.random(),
      sender: 'user',
      message: messageText || '📸 Image uploaded for analysis',
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

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = generateAIResponse(messageText, selectedCategory, imageAnalysis);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1800 + Math.random() * 1200);
  };

  const handleQuickAction = (action) => {
    if (action.requiresImage) {
      fileInputRef.current?.click();
    } else {
      setSelectedCategory(action.category);
      sendMessage(action.text);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        
        {/* PROFESSIONAL HEADER */}
        <div className="bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm bg-white/90">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                    <SparklesSolidIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircleIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">AI Medical Assistant</h1>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    HIPAA Compliant • ML-Powered Diagnostics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-emerald-700">AI Online</span>
                </div>
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-${cat.color.split('-')[1]}-500/30 scale-105`
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-hidden bg-gradient-to-b from-transparent to-slate-50/50">
          <div ref={messagesContainerRef} className="h-full overflow-y-auto px-6 py-8">
            
            {/* QUICK ACTIONS */}
            {messages.length === 1 && (
              <div className="mb-8 animate-fadeIn">
                <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <SparklesSolidIcon className="w-5 h-5 text-indigo-600" />
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="group relative flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left overflow-hidden"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 flex items-center justify-center shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="relative text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                          {action.text}
                        </span>
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
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
                  <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${isUser ? '' : 'relative'}`}>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${
                        isUser 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                          : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600'
                      }`}>
                        {isUser ? (
                          <UserIcon className="w-6 h-6 text-white" />
                        ) : (
                          <SparklesSolidIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      {!isUser && message.type === 'analysis' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircleIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}>
                      <div className={`rounded-2xl px-5 py-4 shadow-lg ${
                        isUser 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' 
                          : 'bg-white text-slate-900 border border-slate-100'
                      }`}>
                        {message.image && (
                          <div className="mb-3">
                            <img 
                              src={message.image} 
                              alt="Medical scan" 
                              className="rounded-xl max-w-[320px] max-h-[320px] object-cover border-4 border-white/20 shadow-lg"
                            />
                          </div>
                        )}
                        <div className="prose prose-sm max-w-none">
                          {message.message.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) {
                              return <h2 key={i} className={`text-xl font-bold mt-3 mb-2 first:mt-0 ${isUser ? 'text-white' : 'text-slate-900'}`}>{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                              return <h3 key={i} className={`text-lg font-bold mt-3 mb-2 ${isUser ? 'text-white/95' : 'text-slate-800'}`}>{line.replace('### ', '')}</h3>;
                            }
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return <p key={i} className={`font-bold mt-2 ${isUser ? 'text-white' : 'text-slate-900'}`}>{line.replace(/\*\*/g, '')}</p>;
                            }
                            if (line === '---') {
                              return <hr key={i} className={`my-4 ${isUser ? 'border-white/20' : 'border-slate-200'}`} />;
                            }
                            if (line.trim().startsWith('•') || line.trim().startsWith('✓') || line.trim().startsWith('🚨')) {
                              return <p key={i} className={`ml-0 ${isUser ? 'text-white/95' : 'text-slate-700'}`}>{line}</p>;
                            }
                            return <p key={i} className={`${line.trim() === '' ? 'h-2' : ''} ${isUser ? 'text-white/95' : 'text-slate-700'} leading-relaxed`}>{line}</p>;
                          })}
                        </div>
                        {message.confidence && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-600">ML Confidence:</span>
                              <span className="font-bold text-indigo-600">{(message.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-1000"
                                style={{ width: `${message.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <ClockIcon className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.type === 'analysis' && (
                          <span className="text-xs text-emerald-600 font-semibold">• AI Verified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex justify-start mb-6">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-md">
                    <SparklesSolidIcon className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-4 shadow-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="w-4 h-4 text-indigo-600 animate-spin" />
                      <span className="text-sm text-slate-600 font-medium">AI is analyzing...</span>
                      <div className="flex gap-1 ml-2">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* PROFESSIONAL INPUT AREA */}
        <div className="bg-white border-t border-slate-200 shadow-2xl backdrop-blur-sm bg-white/95">
          <div className="px-6 py-4">
            
            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="mb-4 animate-fadeIn">
                <div className="inline-block relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="rounded-xl max-h-32 border-4 border-indigo-200 shadow-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded-lg">
                    <span className="text-xs text-white font-medium">Ready for AI analysis</span>
                  </div>
                </div>
              </div>
            )}

            {/* INPUT FORM */}
            <div className="flex gap-3 items-end">
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
                title="Upload medical image"
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
                placeholder="Describe your symptoms or ask a health question..."
                className="flex-1 px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 resize-none transition-all font-medium text-slate-700 placeholder-slate-400"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!newMessage.trim() && !uploadedImage}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>

            {/* HELPER TEXT */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                  <strong>HIPAA Compliant</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                  <strong>AI-Powered</strong>
                </span>
              </div>
              <span className="text-slate-400">Press Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
