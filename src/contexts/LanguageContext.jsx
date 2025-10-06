import React, { createContext, useContext, useState, useEffect } from 'react';

// Language translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    pricing: 'Pricing',
    dashboard: 'Dashboard',
    bookAppointment: 'Book Appointment',
    videoCall: 'Video Call',
    aiAssistant: 'AI Assistant',
    myAppointments: 'My Appointments',
    myPatients: 'My Patients',
    profileSetup: 'Profile Setup',
    
    // Authentication
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    welcomeBack: 'Welcome back',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    emailAddress: 'Email address',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    dontHaveAccount: "Don't have an account?",
    signupFree: 'Sign up for free',
    orContinueWith: 'Or continue with',
    googleSignIn: 'Continue with Google',
    emailRequired: 'Email is required',
    validEmail: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    
    // Appointments
    pending: 'Pending',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    completed: 'Completed',
    cancelled: 'Cancelled',
    approve: 'Approve',
    reject: 'Reject',
    appointmentRequests: 'Appointment Requests',
    
    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark All Read',
    refresh: 'Refresh',
    noNotifications: 'No notifications yet',
    
    // Status Messages
    appointmentApproved: 'Appointment approved! Patient has been notified.',
    appointmentRejected: 'Appointment rejected. Patient has been notified.',
    waitingApproval: 'Waiting for doctor\'s approval',
    appointmentConfirmed: 'Appointment confirmed! See you soon.',
    requestDeclined: 'Request declined. Please book another slot.',
    
    // Dashboard
    welcomeUser: 'Welcome',
    quickActions: 'Quick Actions',
    recentAppointments: 'Recent Appointments',
    upcomingAppointments: 'Upcoming Appointments',
    appointmentHistory: 'Appointment History',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'Your Digital Healthcare Platform'
  },
  
  hi: {
    // Navigation
    home: 'होम',
    pricing: 'मूल्य निर्धारण',
    dashboard: 'डैशबोर्ड',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    videoCall: 'वीडियो कॉल',
    aiAssistant: 'AI सहायक',
    myAppointments: 'मेरे अपॉइंटमेंट',
    myPatients: 'मेरे मरीज़',
    profileSetup: 'प्रोफाइल सेटअप',
    
    // Authentication
    login: 'लॉगिन',
    signup: 'साइन अप',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    welcomeBack: 'वापसी पर स्वागत है',
    signIn: 'साइन इन करें',
    signingIn: 'साइन इन हो रहे हैं...',
    emailAddress: 'ईमेल पता',
    enterEmail: 'अपना ईमेल दर्ज करें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    rememberMe: 'मुझे याद रखें',
    dontHaveAccount: "खाता नहीं है?",
    signupFree: 'मुफ्त साइन अप करें',
    orContinueWith: 'या जारी रखें',
    googleSignIn: 'Google के साथ जारी रखें',
    emailRequired: 'ईमेल आवश्यक है',
    validEmail: 'कृपया वैध ईमेल दर्ज करें',
    passwordRequired: 'पासवर्ड आवश्यक है',
    passwordMinLength: 'पासवर्ड कम से कम 6 वर्ण का होना चाहिए',
    
    // Common
    loading: 'लोड हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    delete: 'मिटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फिल्टर',
    
    // Appointments
    pending: 'लंबित',
    confirmed: 'पुष्ट',
    rejected: 'अस्वीकृत',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    approve: 'स्वीकृत करें',
    reject: 'अस्वीकार करें',
    appointmentRequests: 'अपॉइंटमेंट अनुरोध',
    
    // Notifications
    notifications: 'सूचनाएं',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    refresh: 'रीफ्रेश करें',
    noNotifications: 'अभी तक कोई सूचना नहीं',
    
    // Dashboard
    welcomeUser: 'स्वागत है',
    quickActions: 'त्वरित कार्य',
    recentAppointments: 'हाल की अपॉइंटमेंट',
    upcomingAppointments: 'आगामी अपॉइंटमेंट',
    appointmentHistory: 'अपॉइंटमेंट इतिहास',
    today: 'आज',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'आपका डिजिटल स्वास्थ्य सेवा प्लेटफॉर्म'
  },
  
  mr: {
    // Navigation
    home: 'मुख्यपृष्ठ',
    pricing: 'किंमत',
    dashboard: 'डॅशबोर्ड',
    bookAppointment: 'अपॉइंटमेंट बुक करा',
    videoCall: 'व्हिडिओ कॉल',
    aiAssistant: 'AI सहाय्यक',
    myAppointments: 'माझी अपॉइंटमेंट',
    myPatients: 'माझे पेशंट',
    profileSetup: 'प्रोफाइल सेटअप',
    
    // Authentication
    login: 'लॉगिन',
    signup: 'साइन अप',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड विसरलात?',
    welcomeBack: 'परत स्वागत आहे',
    signIn: 'साइन इन करा',
    signingIn: 'साइन इन होत आहे...',
    emailAddress: 'ईमेल पत्ता',
    enterEmail: 'तुमचा ईमेल टाका',
    enterPassword: 'तुमचा पासवर्ड टाका',
    rememberMe: 'मला लक्षात ठेवा',
    dontHaveAccount: "खाते नाही?",
    signupFree: 'मोफत साइन अप करा',
    orContinueWith: 'किंवा पुढे चला',
    googleSignIn: 'Google सह चालू ठेवा',
    
    // Common
    loading: 'लोड होत आहे...',
    save: 'सेव्ह करा',
    cancel: 'रद्द करा',
    confirm: 'पुष्टी करा',
    delete: 'डिलीट करा',
    edit: 'संपादित करा',
    view: 'पहा',
    search: 'शोधा',
    filter: 'फिल्टर',
    
    // Appointments
    pending: 'प्रलंबित',
    confirmed: 'पुष्ट',
    rejected: 'नाकारले',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    approve: 'मंजूर करा',
    reject: 'नाकारा',
    
    // Dashboard
    welcomeUser: 'स्वागत आहे',
    quickActions: 'जलद कृती',
    recentAppointments: 'अलीकडील अपॉइंटमेंट',
    upcomingAppointments: 'येणाऱ्या अपॉइंटमेंट',
    today: 'आज',
    thisWeek: 'या आठवड्यात',
    thisMonth: 'या महिन्यात',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'तुमचा डिजिटल आरोग्य सेवा प्लॅटफॉर्म'
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    pricing: 'Precios',
    dashboard: 'Panel',
    bookAppointment: 'Reservar Cita',
    videoCall: 'Videollamada',
    aiAssistant: 'Asistente IA',
    myAppointments: 'Mis Citas',
    myPatients: 'Mis Pacientes',
    profileSetup: 'Configuración',
    
    // Authentication
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Correo',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste la contraseña?',
    welcomeBack: 'Bienvenido de vuelta',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando sesión...',
    emailAddress: 'Correo electrónico',
    enterEmail: 'Ingresa tu correo',
    enterPassword: 'Ingresa tu contraseña',
    rememberMe: 'Recordarme',
    dontHaveAccount: '¿No tienes cuenta?',
    signupFree: 'Regístrate gratis',
    orContinueWith: 'O continúa con',
    googleSignIn: 'Continuar con Google',
    emailRequired: 'El correo es requerido',
    validEmail: 'Por favor ingresa un correo válido',
    passwordRequired: 'La contraseña es requerida',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    
    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    search: 'Buscar',
    filter: 'Filtrar',
    
    // Appointments
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    rejected: 'Rechazada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    approve: 'Aprobar',
    reject: 'Rechazar',
    appointmentRequests: 'Solicitudes de Citas',
    
    // Notifications
    notifications: 'Notificaciones',
    markAllRead: 'Marcar Todo Leído',
    refresh: 'Actualizar',
    noNotifications: 'No hay notificaciones',
    
    // Status Messages
    appointmentApproved: '¡Cita aprobada! El paciente ha sido notificado.',
    appointmentRejected: 'Cita rechazada. El paciente ha sido notificado.',
    waitingApproval: 'Esperando aprobación del doctor',
    appointmentConfirmed: '¡Cita confirmada! Te vemos pronto.',
    requestDeclined: 'Solicitud rechazada. Por favor reserva otro horario.',
    
    // Dashboard
    welcomeUser: 'Bienvenido',
    quickActions: 'Acciones Rápidas',
    recentAppointments: 'Citas Recientes',
    upcomingAppointments: 'Próximas Citas',
    appointmentHistory: 'Historial de Citas',
    today: 'Hoy',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'Tu Plataforma Digital de Salud'
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    pricing: 'Tarifs',
    dashboard: 'Tableau de Bord',
    bookAppointment: 'Réserver RDV',
    videoCall: 'Appel Vidéo',
    aiAssistant: 'Assistant IA',
    myAppointments: 'Mes RDV',
    myPatients: 'Mes Patients',
    profileSetup: 'Configuration',
    
    // Authentication
    login: 'Connexion',
    signup: 'S\'inscrire',
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié?',
    welcomeBack: 'Bon retour',
    signIn: 'Se connecter',
    signingIn: 'Connexion...',
    emailAddress: 'Adresse email',
    enterEmail: 'Entrez votre email',
    enterPassword: 'Entrez votre mot de passe',
    rememberMe: 'Se souvenir de moi',
    dontHaveAccount: 'Pas de compte?',
    signupFree: 'Inscription gratuite',
    orContinueWith: 'Ou continuer avec',
    googleSignIn: 'Continuer avec Google',
    emailRequired: 'Email requis',
    validEmail: 'Veuillez entrer un email valide',
    passwordRequired: 'Mot de passe requis',
    passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
    
    // Common
    loading: 'Chargement...',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    
    // Appointments
    pending: 'En Attente',
    confirmed: 'Confirmé',
    rejected: 'Rejeté',
    completed: 'Terminé',
    cancelled: 'Annulé',
    approve: 'Approuver',
    reject: 'Rejeter',
    appointmentRequests: 'Demandes de RDV',
    
    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Tout Marquer Lu',
    refresh: 'Actualiser',
    noNotifications: 'Aucune notification',
    
    // Status Messages
    appointmentApproved: 'RDV approuvé! Le patient a été notifié.',
    appointmentRejected: 'RDV rejeté. Le patient a été notifié.',
    waitingApproval: 'En attente d\'approbation du médecin',
    appointmentConfirmed: 'RDV confirmé! À bientôt.',
    requestDeclined: 'Demande refusée. Veuillez réserver un autre créneau.',
    
    // Dashboard
    welcomeUser: 'Bienvenue',
    quickActions: 'Actions Rapides',
    recentAppointments: 'RDV Récents',
    upcomingAppointments: 'Prochains RDV',
    appointmentHistory: 'Historique des RDV',
    today: 'Aujourd\'hui',
    thisWeek: 'Cette Semaine',
    thisMonth: 'Ce Mois',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'Votre Plateforme de Santé Numérique'
  },
  
  ta: {
    // Navigation - Tamil
    home: 'முகப்பு',
    pricing: 'விலை',
    dashboard: 'பிரதான பக்கம்',
    bookAppointment: 'சந்திப்பு பதிவு',
    videoCall: 'வீடியோ அழைப்பு',
    aiAssistant: 'AI உதவியாளர்',
    myAppointments: 'என் சந்திப்புகள்',
    myPatients: 'என் நோயாளிகள்',
    profileSetup: 'சுயவிவர அமைப்பு',
    
    // Authentication
    login: 'உள்நுழைவு',
    signup: 'பதிவு செய்யவும்',
    logout: 'வெளியேறு',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    
    // Common
    loading: 'ஏற்றுகிறது...',
    save: 'சேமிக்கவும்',
    cancel: 'ரத்து செய்',
    confirm: 'உறுதிப்படுத்து',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    view: 'பார்',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    
    // Appointments
    pending: 'நிலுவையில்',
    confirmed: 'உறுதிப்படுத்தப்பட்டது',
    rejected: 'நிராகரிக்கப்பட்டது',
    completed: 'முடிந்தது',
    cancelled: 'ரத்து செய்யப்பட்டது',
    approve: 'ஒப்புதல்',
    reject: 'நிராகரி',
    
    // Dashboard
    welcomeUser: 'வரவேற்கிறோம்',
    quickActions: 'விரைவு செயல்கள்',
    today: 'இன்று',
    thisWeek: 'இந்த வாரம்',
    thisMonth: 'இந்த மாதம்',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'உங்கள் டிஜிட்டல் சுகாதார தளம்'
  },
  
  te: {
    // Navigation - Telugu
    home: 'హోమ్',
    pricing: 'ధర',
    dashboard: 'డాష్‌బోర్డ్',
    bookAppointment: 'అపాయింట్మెంట్ బుక్ చేయండి',
    videoCall: 'వీడియో కాల్',
    aiAssistant: 'AI సహాయకుడు',
    myAppointments: 'నా అపాయింట్మెంట్లు',
    myPatients: 'నా రోగులు',
    profileSetup: 'ప్రొఫైల్ సెటప్',
    
    // Authentication
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    logout: 'లాగౌట్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    welcomeBack: 'తిరిగి స్వాగతం',
    
    // Common
    loading: 'లోడ్ అవుతోంది...',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    confirm: 'నిర్ధారించండి',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    view: 'చూడండి',
    search: 'వెతకండి',
    filter: 'ఫిల్టర్',
    
    // Appointments
    pending: 'పెండింగ్',
    confirmed: 'నిర్ధారించబడింది',
    rejected: 'తిరస్కరించబడింది',
    completed: 'పూర్తైంది',
    cancelled: 'రద్దు చేయబడింది',
    approve: 'ఆమోదించండి',
    reject: 'తిరస్కరించండి',
    
    // Dashboard
    welcomeUser: 'స్వాగతం',
    quickActions: 'త్వరిత చర్యలు',
    today: 'ఈరోజు',
    thisWeek: 'ఈ వారం',
    thisMonth: 'ఈ నెల',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'మీ డిజిటల్ ఆరోగ్య వేదిక'
  },
  
  bn: {
    // Navigation - Bengali
    home: 'হোম',
    pricing: 'মূল্য',
    dashboard: 'ড্যাশবোর্ড',
    bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
    videoCall: 'ভিডিও কল',
    aiAssistant: 'AI সহায়ক',
    myAppointments: 'আমার অ্যাপয়েন্টমেন্ট',
    myPatients: 'আমার রোগীরা',
    profileSetup: 'প্রোফাইল সেটআপ',
    
    // Authentication
    login: 'লগইন',
    signup: 'সাইন আপ',
    logout: 'লগআউট',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    welcomeBack: 'ফিরে আসার স্বাগতম',
    
    // Common
    loading: 'লোড হচ্ছে...',
    save: 'সেভ করুন',
    cancel: 'বাতিল করুন',
    confirm: 'নিশ্চিত করুন',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা করুন',
    view: 'দেখুন',
    search: 'খুঁজুন',
    filter: 'ফিল্টার',
    
    // Appointments
    pending: 'অপেক্ষমাণ',
    confirmed: 'নিশ্চিত',
    rejected: 'প্রত্যাখ্যাত',
    completed: 'সম্পন্ন',
    cancelled: 'বাতিল',
    approve: 'অনুমোদন',
    reject: 'প্রত্যাখ্যান',
    
    // Dashboard
    welcomeUser: 'স্বাগতম',
    quickActions: 'দ্রুত কর্ম',
    today: 'আজ',
    thisWeek: 'এই সপ্তাহে',
    thisMonth: 'এই মাসে',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'আপনার ডিজিটাল স্বাস্থ্য সেবা প্ল্যাটফর্ম'
  },
  
  gu: {
    // Navigation - Gujarati
    home: 'હોમ',
    pricing: 'કિંમત',
    dashboard: 'ડેશબોર્ડ',
    bookAppointment: 'એપોઇન્ટમેન્ટ બુક કરો',
    videoCall: 'વિડિયો કોલ',
    aiAssistant: 'AI સહાયક',
    myAppointments: 'મારી એપોઇન્ટમેન્ટ',
    myPatients: 'મારા દર્દીઓ',
    profileSetup: 'પ્રોફાઇલ સેટઅપ',
    
    // Authentication
    login: 'લોગિન',
    signup: 'સાઇન અપ',
    logout: 'લોગઆઉટ',
    email: 'ઇમેઇલ',
    password: 'પાસવર્ડ',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
    welcomeBack: 'પાછા આવવા બદલ સ્વાગત',
    
    // Common
    loading: 'લોડ થઈ રહ્યું છે...',
    save: 'સેવ કરો',
    cancel: 'રદ કરો',
    confirm: 'પુષ્ટિ કરો',
    delete: 'ડિલીટ કરો',
    edit: 'એડિટ કરો',
    view: 'જુઓ',
    search: 'શોધો',
    filter: 'ફિલ્ટર',
    
    // Appointments
    pending: 'પેન્ડિંગ',
    confirmed: 'પુષ્ટિ થયેલ',
    rejected: 'નકારવામાં આવેલ',
    completed: 'પૂર્ણ',
    cancelled: 'કેન્સલ',
    approve: 'મંજૂરી આપો',
    reject: 'નકારો',
    
    // Dashboard
    welcomeUser: 'સ્વાગત',
    quickActions: 'ઝડપી ક્રિયાઓ',
    today: 'આજે',
    thisWeek: 'આ અઠવાડિયે',
    thisMonth: 'આ મહિને',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'તમારું ડિજિટલ આરોગ્ય સેવા પ્લેટફોર્મ'
  },
  
  pa: {
    // Navigation - Punjabi
    home: 'ਘਰ',
    pricing: 'ਕੀਮਤ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    bookAppointment: 'ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ',
    videoCall: 'ਵੀਡੀਓ ਕਾਲ',
    aiAssistant: 'AI ਸਹਾਇਕ',
    myAppointments: 'ਮੇਰੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ',
    myPatients: 'ਮੇਰੇ ਮਰੀਜ਼',
    profileSetup: 'ਪ੍ਰੋਫਾਇਲ ਸੈਟਅਪ',
    
    // Authentication
    login: 'ਲਾੱਗਇਨ',
    signup: 'ਸਾਇਨ ਅਪ',
    logout: 'ਲਾੱਗਆਊਟ',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    welcomeBack: 'ਵਾਪਸ ਆਉਣ ਦੀ ਮੁਬਾਰਕ',
    
    // Common
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    delete: 'ਮਿਟਾਓ',
    edit: 'ਸੰਪਾਦਨ ਕਰੋ',
    view: 'ਵੇਖੋ',
    search: 'ਖੋਜੋ',
    filter: 'ਫਿਲਟਰ',
    
    // Appointments
    pending: 'ਬਕਾਇਆ',
    confirmed: 'ਪੁਸ਼ਟੀ ਕੀਤੀ',
    rejected: 'ਰੱਦ ਕੀਤੀ',
    completed: 'ਪੂਰੀ',
    cancelled: 'ਰੱਦ',
    approve: 'ਮਨਜ਼ੂਰੀ ਦਿਓ',
    reject: 'ਰੱਦ ਕਰੋ',
    
    // Dashboard
    welcomeUser: 'ਸਵਾਗਤ',
    quickActions: 'ਤਤਕਾਲ ਕਿਰਿਆਵਾਂ',
    today: 'ਅੱਜ',
    thisWeek: 'ਇਸ ਹਫ਼ਤੇ',
    thisMonth: 'ਇਸ ਮਹੀਨੇ',
    
    // Branding
    appName: 'HealthBridge',
    tagline: 'ਤੁਹਾਡਾ ਡਿਜਿਟਲ ਸਿਹਤ ਸੇਵਾ ਪਲੇਟਫਾਰਮ'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('healthbridge-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('healthbridge-language', langCode);
    }
  };

  const t = (key) => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};