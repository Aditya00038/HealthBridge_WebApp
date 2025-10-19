import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const PricingPage = () => {
  const { user, hasPremium } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic healthcare needs',
      features: [
        'Physical appointment booking',
        'Basic AI chatbot (5 messages/day)',
        'Medicine recommendations',
        'Health tips and articles',
        'Basic profile management'
      ],
      limitations: [
        'No video consultations',
        'Limited chatbot usage',
        'No priority support',
        'No advanced analytics'
      ],
      buttonText: 'Current Plan',
      buttonColor: 'bg-gray-600',
      popular: false
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'per month',
      description: 'Complete healthcare access with video consultations and unlimited AI support',
      features: [
        'Everything in Free plan',
        'Unlimited video consultations',
        'Unlimited AI chatbot access',
        'Voice message support',
        'Image symptom analysis',
        'Priority customer support',
        'Advanced health analytics',
        'Prescription management',
        'Medicine delivery tracking'
      ],
      limitations: [],
      buttonText: user ? (hasPremium() ? 'Current Plan' : 'Upgrade Now') : 'Get Started',
      buttonColor: 'bg-primary-600 hover:bg-primary-700',
      popular: true
    },
    {
      name: 'Pro',
      price: '$39',
      period: 'per month',
      description: 'For healthcare professionals and advanced users',
      features: [
        'Everything in Premium plan',
        'Multiple family member profiles',
        'Health data export',
        'API access for integrations',
        'Custom health reports',
        'Dedicated account manager',
        '24/7 phone support',
        'Advanced telemedicine features'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From free basic care to premium telemedicine features, we have a plan that fits your healthcare needs
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg p-6 ${
                plan.popular ? 'ring-2 ring-emerald-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== '$0' && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mb-4 mt-6">Not included:</h4>
                    <ul className="space-y-3">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start">
                          <XMarkIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${plan.buttonColor} ${
                  plan.buttonText === 'Current Plan' ? 'cursor-not-allowed opacity-75' : ''
                }`}
                disabled={plan.buttonText === 'Current Plan'}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-card">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I switch plans anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades and at the next billing cycle for downgrades.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-card">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Are video consultations secure?
                </h3>
                <p className="text-gray-600">
                  Absolutely. All video consultations are end-to-end encrypted and HIPAA compliant. Your health data is always protected.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-card">
                <h3 className="font-semibold text-gray-900 mb-2">
                  How does the AI chatbot work?
                </h3>
                <p className="text-gray-600">
                  Our AI chatbot uses advanced natural language processing to understand your health queries in multiple languages and provides evidence-based health information and recommendations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-primary-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Healthcare?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of patients who have already improved their health journey with CareConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Start Free Today
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to={user ? '/patient/dashboard' : '/signup'}
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
