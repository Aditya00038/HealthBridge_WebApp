import React from 'react';
import { Link } from 'react-router-dom';
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
      content: 'HealthBridge is a game-changer! I can consult with my doctor during lunch breaks without leaving work. The AI assistant even helps me track my family\'s health!',
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
      gradient: 'from-blue-500 to-teal-500'
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6">
                <SparklesIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">AI-Powered Healthcare Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Healthcare
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Without Limits</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
                Connect with verified doctors instantly. Book appointments, get video consultations, 
                and access AI-powered health assistance—all in one revolutionary platform.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  View Pricing
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm">
                      <div className={`w-10 h-10 ${benefit.bg} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Health Dashboard</h3>
                    <p className="text-gray-600 text-sm">Your complete health overview</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <VideoCameraIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">Next Video Call</span>
                    </div>
                    <span className="text-blue-600 font-bold">Today 3:00 PM</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">Health Score</span>
                    </div>
                    <span className="text-green-600 font-bold text-lg">92/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <ShoppingBagIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">Prescriptions</span>
                    </div>
                    <span className="text-purple-600 font-bold">2 Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-3">
                    <IconComponent className={`w-7 h-7 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <BeakerIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Revolutionary Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for<br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Complete Healthcare</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From finding the right doctor to managing your medications, 
              HealthBridge provides a comprehensive healthcare ecosystem powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.bgGradient} rounded-xl flex items-center justify-center`}>
                      <IconComponent className={`w-7 h-7 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      feature.badge === 'Free' ? 'bg-green-100 text-green-700' :
                      feature.badge === 'Premium' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-4">
              <HeartIconSolid className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-600">Loved by Thousands</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Patients & <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Healthcare Providers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See what real users are saying about their transformative HealthBridge experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl shadow-md p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <BoltIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Simple Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. Start free and upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`bg-white rounded-2xl shadow-lg p-6 h-full ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-3">
                      <span className={`text-4xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      {plan.price !== 'Free' && (
                        <span className="text-gray-600 ml-2">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircleIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-blue-600' : 'text-teal-600'}`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.name === 'Basic' ? '/signup' : `/signup?plan=${plan.name.toLowerCase()}`}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers who are already experiencing 
              the future of healthcare with HealthBridge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-xl"
              >
                Start Your Free Trial
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/90 text-sm">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
