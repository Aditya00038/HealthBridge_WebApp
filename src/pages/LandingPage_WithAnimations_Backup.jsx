import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HeartIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  BoltIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [isVisible, setIsVisible] = useState({
    features: false,
    testimonials: false,
    pricing: false,
    cta: false,
    stats: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = ['features', 'testimonials', 'pricing', 'cta', 'stats'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: MapPinIcon,
      title: 'Find Nearby Doctors',
      description: 'Book in-person consultations with verified doctors in your area. See real-time availability, ratings, and distances.',
      badge: 'Free',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      icon: VideoCameraIcon,
      title: 'Video Consultations',
      description: 'HD video calls with certified healthcare professionals. Secure, encrypted, and available 24/7.',
      badge: 'Premium',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Health Assistant',
      description: 'Multi-language AI chatbot powered by advanced ML. Get instant health insights and symptom analysis.',
      badge: 'AI-Powered',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Medicine Delivery',
      description: 'Order prescribed medicines with same-day delivery. Track your orders in real-time.',
      badge: 'Fast',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      icon: CalendarIcon,
      title: 'Smart Scheduling',
      description: 'AI-powered appointment booking with automated reminders, rescheduling, and calendar sync.',
      badge: 'Smart',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Digital Health Records',
      description: 'Secure cloud storage for all your medical data. Access anywhere, share with authorized providers.',
      badge: 'Secure',
      gradient: 'from-teal-500 to-emerald-500',
      bgGradient: 'from-teal-50 to-emerald-50'
    }
  ];

  const benefits = [
    { icon: ClockIcon, text: 'Save 2+ hours per visit', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: GlobeAltIcon, text: 'Access healthcare anywhere', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: ShieldCheckIcon, text: 'HIPAA compliant & secure', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: UserGroupIcon, text: '50,000+ verified doctors', color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Working Mother',
      content: 'CareConnect is a game-changer! I can consult with my doctor during lunch breaks without leaving work. The AI assistant even helps me track my family\'s health!',
      avatar: 'SJ',
      rating: 5,
      location: 'San Francisco, CA',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      content: 'This platform revolutionized my practice. I can now reach more patients while maintaining exceptional care quality. The video system is phenomenal!',
      avatar: 'MC',
      rating: 5,
      location: 'New York, NY',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Senior Patient',
      content: 'Finally, healthcare that speaks my language! The Spanish-speaking AI assistant understood all my concerns. This is the future of healthcare!',
      avatar: 'MR',
      rating: 5,
      location: 'Miami, FL',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for occasional healthcare needs',
      features: [
        'Find nearby doctors',
        'Book appointments',
        'Basic health records',
        'Appointment reminders',
        'Community support'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      name: 'Premium',
      price: '$29',
      period: 'per month',
      description: 'Complete healthcare solution for individuals',
      features: [
        'Everything in Basic',
        'Unlimited video consultations',
        'AI health assistant',
        'Priority booking',
        '24/7 support',
        'Medicine delivery',
        'Health analytics dashboard'
      ],
      buttonText: 'Start Free Trial',
      popular: true,
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      name: 'Family',
      price: '$79',
      period: 'per month',
      description: 'Healthcare for the whole family',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Family health dashboard',
        'Pediatric specialists',
        'Family medicine delivery',
        'Shared medical records',
        'Emergency contacts'
      ],
      buttonText: 'Choose Family Plan',
      popular: false,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Verified Doctors', icon: UserGroupIcon, gradient: 'from-blue-500 to-cyan-500' },
    { number: '500K+', label: 'Happy Patients', icon: HeartIconSolid, gradient: 'from-pink-500 to-rose-500' },
    { number: '1M+', label: 'Consultations', icon: VideoCameraIcon, gradient: 'from-purple-500 to-indigo-500' },
    { number: '99.9%', label: 'Uptime', icon: BoltIcon, gradient: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Ultra Modern Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-mesh opacity-40"></div>
        
        {/* Floating Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        
        <div className="container-app relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft mb-8"
              >
                <SparklesIcon className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-semibold gradient-text">AI-Powered Healthcare Platform</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 mb-6 leading-tight">
                Healthcare
                <br />
                <span className="gradient-text">Without Limits</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                Connect with verified doctors instantly. Book appointments, get video consultations, 
                and access AI-powered health assistance—all in one revolutionary platform.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/signup"
                  className="btn-primary btn-lg group"
                >
                  Start Free Trial
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/pricing"
                  className="btn-outline btn-lg"
                >
                  View Pricing
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft hover-lift"
                    >
                      <div className={`w-12 h-12 ${benefit.bg} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 text-center">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Hero Visual - Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="card-glass p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="avatar avatar-md">
                    <HeartIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Health Dashboard</h3>
                    <p className="text-slate-600 text-sm">Your complete health overview</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <VideoCameraIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-800 font-medium">Next Video Call</span>
                    </div>
                    <span className="text-blue-600 font-bold">Today 3:00 PM</span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-800 font-medium">Health Score</span>
                    </div>
                    <span className="text-green-600 font-bold text-lg">92/100</span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <ShoppingBagIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-800 font-medium">Prescriptions</span>
                    </div>
                    <span className="text-purple-600 font-bold">2 Active</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Floating elements with animations */}
              <motion.div
                className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [90, 0, 90],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Animated Stats Section */}
      <section className="section-sm bg-white" id="stats">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className={`w-8 h-8 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Ultra Modern Cards */}
      <section className="section bg-gradient-to-b from-slate-50 to-white" id="features">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <BeakerIcon className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600">Revolutionary Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6">
              Everything You Need for<br />
              <span className="gradient-text">Complete Healthcare</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From finding the right doctor to managing your medications, 
              CareConnect provides a comprehensive healthcare ecosystem powered by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="card-hover h-full bg-gradient-to-br from-white to-slate-50/50 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.bgGradient} rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                      </div>
                      <span className={`badge badge-${feature.badge === 'Free' ? 'success' : feature.badge === 'Premium' ? 'primary' : 'accent'}`}>
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Design */}
      <section className="section bg-white" id="testimonials">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 rounded-full mb-6">
              <HeartIconSolid className="w-5 h-5 text-secondary-600" />
              <span className="text-sm font-semibold text-secondary-600">Loved by Thousands</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6">
              Trusted by Patients <br className="hidden md:block" />
              <span className="gradient-text">& Healthcare Providers</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what real users are saying about their transformative CareConnect experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card-hover bg-gradient-to-br from-slate-50 to-white p-8 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`avatar avatar-lg bg-gradient-to-br ${testimonial.gradient}`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                      <div className="text-slate-600">{testimonial.role}</div>
                      <div className="text-sm text-slate-500">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Design */}
      <section className="section bg-gradient-to-b from-slate-50 to-white" id="pricing">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.pricing ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6">
              <BoltIcon className="w-5 h-5 text-accent-600" />
              <span className="text-sm font-semibold text-accent-600">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6">
              Choose Your <span className="gradient-text">Perfect Plan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. Start free and upgrade anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.pricing ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`card h-full p-8 ${plan.popular ? 'ring-2 ring-primary-500 shadow-glow' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      {plan.price !== 'Free' && (
                        <span className="text-slate-600 ml-2">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-slate-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircleIcon className={`w-5 h-5 ${plan.popular ? 'text-primary-500' : 'text-secondary-500'} flex-shrink-0 mt-0.5`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.name === 'Basic' ? '/signup' : `/signup?plan=${plan.name.toLowerCase()}`}
                    className={`block w-full text-center ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Stunning Gradient Design */}
      <section className="section relative overflow-hidden bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500" id="cta">
        <div className="absolute inset-0 bg-animated opacity-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="container-app relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Ready to Transform Your<br />
              Healthcare Experience?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers who are already experiencing 
              the future of healthcare with CareConnect.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/signup"
                className="group bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2"
              >
                Start Your Free Trial
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-primary-600 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Schedule a Demo
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
