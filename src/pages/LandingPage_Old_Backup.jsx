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
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  
  const [isVisible, setIsVisible] = useState({
    features: false,
    testimonials: false,
    pricing: false,
    cta: false
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

    const sections = ['features', 'testimonials', 'pricing', 'cta'];
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
      description: 'Book in-person consultations with verified doctors in your area. See ratings, availability, and distances.',
      badge: 'Free',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      icon: VideoCameraIcon,
      title: 'Video Consultations',
      description: 'Secure HD video calls with certified healthcare professionals from anywhere, anytime.',
      badge: 'Premium',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Health Assistant',
      description: 'Multi-language AI chatbot for instant health queries, symptom analysis, and medical guidance.',
      badge: 'Premium',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Medicine Delivery',
      description: 'Order prescribed medicines with home delivery from our network of verified pharmacies.',
      badge: 'Available',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      icon: CalendarIcon,
      title: 'Smart Scheduling',
      description: 'Intelligent appointment booking with automated reminders and rescheduling options.',
      badge: 'Free',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Health Records',
      description: 'Secure access to your complete medical history, test results, and prescriptions on any device.',
      badge: 'Included',
      badgeColor: 'bg-teal-100 text-teal-800'
    }
  ];

  const benefits = [
    { icon: ClockIcon, text: 'Save 2+ hours per visit' },
    { icon: GlobeAltIcon, text: 'Access healthcare anywhere' },
    { icon: ShieldCheckIcon, text: 'HIPAA compliant & secure' },
    { icon: UserGroupIcon, text: '50,000+ verified doctors' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Working Mother',
      content: 'CareConnect saved me so much time! I can consult with my doctor during lunch breaks without leaving work.',
      avatar: '/api/placeholder/64/64',
      rating: 5,
      location: 'San Francisco, CA'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      content: 'This platform helps me reach more patients while maintaining the quality of care. The video quality is excellent.',
      avatar: '/api/placeholder/64/64',
      rating: 5,
      location: 'New York, NY'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Senior Patient',
      content: 'The Spanish-speaking AI assistant understood my concerns perfectly. Finally, healthcare that speaks my language!',
      avatar: '/api/placeholder/64/64',
      rating: 5,
      location: 'Miami, FL'
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
      buttonStyle: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
      popular: false
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
        'Health analytics'
      ],
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-emerald-600 text-white hover:bg-emerald-700',
      popular: true
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
      buttonStyle: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
      popular: false
    }
  ];

  const stats = [
    { number: '50K+', label: 'Verified Doctors' },
    { number: '500K+', label: 'Happy Patients' },
    { number: '1M+', label: 'Consultations' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 to-teal-100/30"></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Healthcare
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Without Limits</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Connect with verified doctors instantly. Book appointments, get video consultations, 
                and access AI-powered health assistance - all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/signup"
                  className="group bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  Start Free Trial
                  <ArrowRightIcon className="inline-block h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-300 text-center"
                >
                  View Pricing
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                        <IconComponent className="h-6 w-6 text-emerald-600" />
                      </div>
                      <span className="text-sm text-gray-600">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                    <HeartIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Health Dashboard</h3>
                    <p className="text-gray-600">Your complete health overview</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center">
                      <VideoCameraIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-gray-800">Next Video Call</span>
                    </div>
                    <span className="text-blue-600 font-semibold">Today 3:00 PM</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-800">Health Score</span>
                    </div>
                    <span className="text-green-600 font-semibold">92/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-gray-800">Medicines</span>
                    </div>
                    <span className="text-purple-600 font-semibold">2 Active</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20"
              ></motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="text-emerald-600"> Complete Healthcare</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From finding the right doctor to managing your medications, 
              CareConnect provides a comprehensive healthcare ecosystem.
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
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <IconComponent className="h-7 w-7 text-emerald-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what patients and healthcare providers are saying about their CareConnect experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.pricing ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your healthcare needs. Start free and upgrade anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.pricing ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-8 shadow-lg relative ${
                  plan.popular ? 'ring-2 ring-emerald-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== 'Free' && (
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === 'Basic' ? '/signup' : `/signup?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-600 relative overflow-hidden" id="cta">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-teal-700/20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Join thousands of patients and healthcare providers who are already experiencing 
              the future of healthcare with CareConnect.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="group bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Your Free Trial
                <ArrowRightIcon className="inline-block h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300"
              >
                Schedule a Demo
              </Link>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-emerald-100">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                30-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;