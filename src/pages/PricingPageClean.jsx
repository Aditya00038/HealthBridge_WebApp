import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckIcon, 
  XMarkIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  HeartIcon,
  UserGroupIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const PricingPageClean = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      name: 'Basic',
      tagline: 'For Getting Started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for occasional healthcare needs',
      icon: HeartIcon,
      features: [
        { text: 'Appointment booking', included: true },
        { text: 'Video consultations', included: true },
        { text: 'Basic chatbot support', included: true },
        { text: 'Limited health record storage (100MB)', included: true },
        { text: 'Find nearby doctors & hospitals', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Email support (48hr response)', included: true },
        { text: 'Advanced AI chatbot', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      highlighted: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Premium',
      tagline: 'Most Popular Choice',
      monthlyPrice: 400,
      yearlyPrice: 4400,
      discount: '8% OFF',
      description: 'Complete healthcare solution for individuals',
      icon: SparklesIcon,
      features: [
        { text: 'Everything in Basic', included: true },
        { text: 'Advanced AI chatbot (unlimited)', included: true },
        { text: 'Large health record storage (5GB)', included: true },
        { text: '24/7 priority support (chat & call)', included: true },
        { text: 'Priority booking & scheduling', included: true },
        { text: 'Unlimited video consultations', included: true },
        { text: 'Medicine delivery with 15% discount', included: true },
        { text: 'Health analytics & reports', included: true },
        { text: 'Digital prescriptions & records', included: true },
      ],
      cta: 'Start 7-Day Free Trial',
      highlighted: true,
      color: 'from-purple-600 to-indigo-600'
    },
    {
      name: 'Family',
      tagline: 'Best Value for Families',
      monthlyPrice: 1200,
      yearlyPrice: 12999,
      discount: '10% OFF',
      description: 'Healthcare for your entire family (5 accounts)',
      icon: UserGroupIcon,
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Up to 5 family accounts included', included: true },
        { text: 'Shared family health records (25GB)', included: true },
        { text: 'Family health dashboard', included: true },
        { text: 'Pediatric & elderly care specialists', included: true },
        { text: 'Family medicine delivery (free)', included: true },
        { text: 'Dedicated family account manager', included: true },
        { text: 'Annual health checkup (1 per member)', included: true },
        { text: 'Emergency ambulance priority service', included: true },
      ],
      cta: 'Start 7-Day Free Trial',
      highlighted: false,
      color: 'from-emerald-600 to-teal-600'
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No questions asked. You\'ll retain access until the end of your billing period.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Premium and Family plans come with a 7-day free trial. No credit card required to start. Cancel anytime during the trial.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, and digital wallets (Paytm, PhonePe, Google Pay).',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately. Downgrades apply from the next billing cycle.',
    },
    {
      question: 'How much do I save with yearly billing?',
      answer: 'Premium saves ₹400/year (8% off) and Family saves ₹1,401/year (10% off) when you choose yearly billing.',
    },
    {
      question: 'How many accounts in Family plan?',
      answer: 'Family plan includes up to 5 separate accounts with shared health records. Each member gets their own login and privacy controls.',
    },
  ];

  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Bank-level encryption for all your health data'
    },
    {
      icon: BoltIcon,
      title: 'Instant Access',
      description: 'Start using all features immediately after signup'
    },
    {
      icon: StarIcon,
      title: 'No Hidden Fees',
      description: 'What you see is what you pay. Always transparent.'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <SparklesIcon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-gray-900">7-Day Free Trial • No Credit Card Required</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Healthcare That Fits Your Budget
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Premium healthcare starting at just <span className="text-purple-600 font-bold">₹400/month</span> — less than few hours of work!
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Access verified doctors, AI health assistant, and comprehensive medical services.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const displayPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              
              return (
                <div
                  key={index}
                  className={`relative p-8 bg-white rounded-3xl transition-all duration-300 hover:scale-105 ${
                    plan.highlighted
                      ? 'border-2 border-purple-500 shadow-2xl md:scale-105'
                      : 'border border-gray-200 shadow-lg'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                      ⭐ {plan.tagline}
                    </div>
                  )}

                  {!plan.highlighted && billingCycle === 'yearly' && plan.discount && (
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                      {plan.discount}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.color} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    {!plan.highlighted && (
                      <p className="text-sm text-gray-500 font-medium mb-4">{plan.tagline}</p>
                    )}
                    
                    <div className="mb-3">
                      {displayPrice === 0 ? (
                        <div className="flex items-end gap-2">
                          <span className="text-5xl font-bold text-gray-900">Free</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-semibold text-gray-900">₹</span>
                            <span className="text-5xl font-bold text-gray-900">{displayPrice.toLocaleString('en-IN')}</span>
                            <span className="text-gray-500 mb-2">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                          </div>
                          {billingCycle === 'monthly' && (
                            <p className="text-sm text-purple-600 font-semibold mt-1">
                              {plan.monthlyPrice === 400 ? '~ Just few hours of work' : '~ Cost of 2-3 movie tickets'}
                            </p>
                          )}
                        </>
                      )}
                      {billingCycle === 'yearly' && displayPrice > 0 && (
                        <div className="mt-1">
                          <p className="text-sm text-green-600 font-medium">
                            ₹{Math.round(plan.yearlyPrice / 12).toLocaleString('en-IN')}/month when billed yearly
                          </p>
                          <p className="text-xs text-purple-600 font-semibold mt-0.5">
                            {plan.name === 'Premium' ? '~ Just few hours of work/month' : '~ Less than a family dinner/month'}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  <Link
                    to="/signup"
                    className={`block w-full text-center px-6 py-4 rounded-xl font-bold transition-all mb-8 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        {feature.included ? (
                          <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included ? 'text-gray-700 text-sm' : 'text-gray-400 text-sm line-through'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-2">
                  <span className="text-purple-600">Q.</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-5">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Every Plan Comes With
            </h2>
            <p className="text-lg text-gray-600">
              Essential healthcare features included in all plans
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🔒', text: 'Bank-Grade Security' },
              { icon: '📱', text: 'Mobile & Web Access' },
              { icon: '👨‍⚕️', text: 'Verified Specialists' },
              { icon: '�', text: 'Digital Prescriptions' },
              { icon: '🔔', text: 'Smart Reminders' },
              { icon: '💳', text: 'UPI & Card Payments' },
              { icon: '📊', text: 'Health Analytics' },
              { icon: '🌐', text: 'Cloud Backup' }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl hover:shadow-lg hover:scale-105 transition-all">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-sm font-semibold text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <SparklesIcon className="w-16 h-16 text-purple-200 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of satisfied users. Start your 7-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all"
            >
              Learn More
            </Link>
          </div>
          <p className="text-sm text-purple-200 mt-6">
            No credit card required • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
};

export default PricingPageClean;
