import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

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
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      borderColor: 'border-gray-200',
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
      buttonText: user ? (hasPremium ? hasPremium() : false ? 'Current Plan' : 'Upgrade Now') : 'Get Started',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-500',
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
      borderColor: 'border-purple-200',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From free basic care to premium telemedicine features, we have a plan that fits your healthcare needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg transition-shadow hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-blue-500 md:-mt-4 md:mb-4' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 Most Popular
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== '$0' && (
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="mb-6 space-y-3">
                  <p className="text-sm font-semibold text-gray-900 mb-3">What's included:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-blue-600' : 'text-green-600'
                      }`} />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations List */}
                {plan.limitations.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Not included:</p>
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <XMarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  to={plan.name === 'Pro' ? '/contact' : '/signup'}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold text-white transition-colors ${plan.buttonColor}`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison Table */}
        <div className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Compare Plans
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Physical Appointments</td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Video Consultations</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">AI Chatbot</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">5 msgs/day</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">Unlimited</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Priority Support</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Family Members</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">Up to 6</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Dedicated Account Manager</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            We're here to help! Contact our support team for any pricing questions.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
