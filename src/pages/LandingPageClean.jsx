import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const LandingPageClean = () => {
  const features = [
    {
      icon: CalendarIcon,
      title: 'Smart Appointments',
      description: 'Book with verified doctors near you. Real-time availability and instant confirmation.',
      color: 'indigo'
    },
    {
      icon: VideoCameraIcon,
      title: 'Video Consultations',
      description: 'Connect with healthcare professionals from anywhere. Secure and private.',
      color: 'violet'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Health Assistant',
      description: 'Get instant health insights and guidance powered by advanced AI.',
      color: 'purple'
    },
    {
      icon: HeartIcon,
      title: 'Health Records',
      description: 'Your complete medical history in one secure place. Access anytime.',
      color: 'pink'
    }
  ];

  const benefits = [
    'HIPAA Compliant & Secure',
    '24/7 Healthcare Access',
    '50,000+ Verified Doctors',
    'Multi-language Support'
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Patient',
      content: 'CareConnect made healthcare accessible and simple. I can consult with my doctor from home.',
      initials: 'SM'
    },
    {
      name: 'Dr. James Park',
      role: 'Cardiologist',
      content: 'A professional platform that helps me provide better care to more patients efficiently.',
      initials: 'JP'
    },
    {
      name: 'Maria Garcia',
      role: 'Patient',
      content: 'The AI assistant in my language is incredible. Finally, healthcare that understands me.',
      initials: 'MG'
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for occasional healthcare needs',
      features: [
        'Find nearby doctors',
        'Book appointments',
        'Basic health records',
        'Email support'
      ],
      highlighted: false
    },
    {
      name: 'Premium',
      price: '$29',
      period: '/month',
      description: 'Complete healthcare solution',
      features: [
        'Everything in Basic',
        'Unlimited video calls',
        'AI health assistant',
        'Priority support',
        'Medicine delivery',
        'Health analytics'
      ],
      highlighted: true
    },
    {
      name: 'Family',
      price: '$79',
      period: '/month',
      description: 'Healthcare for the whole family',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Family dashboard',
        'Pediatric specialists',
        'Shared records'
      ],
      highlighted: false
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full mb-8 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">AI-Powered Healthcare Platform</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-slate-900 mb-6 tracking-tight">
              Healthcare
              <span className="block text-indigo-600 mt-2">Made Simple</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
              Connect with verified doctors instantly. Book appointments, get consultations, and manage your health—all in one place.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started Free
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Everything you need for better health
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive healthcare tools designed for modern living
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group p-8 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <IconComponent className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-semibold text-indigo-600 mb-2">50K+</div>
              <div className="text-slate-600">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-violet-600 mb-2">500K+</div>
              <div className="text-slate-600">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-purple-600 mb-2">1M+</div>
              <div className="text-slate-600">Consultations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-pink-600 mb-2">99.9%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Trusted by thousands
            </h2>
            <p className="text-lg text-slate-600">
              Here's what our users have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 bg-white border border-slate-100 rounded-2xl"
              >
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`p-8 bg-white rounded-2xl ${
                  plan.highlighted 
                    ? 'border-2 border-indigo-600 shadow-lg' 
                    : 'border border-slate-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-semibold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">{plan.period}</span>}
                </div>
                <p className="text-slate-600 mb-6">
                  {plan.description}
                </p>
                <Link
                  to="/signup"
                  className={`block w-full text-center px-6 py-3 rounded-xl font-medium transition-colors mb-6 ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Get Started
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors who trust CareConnect for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Free Trial
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageClean;
