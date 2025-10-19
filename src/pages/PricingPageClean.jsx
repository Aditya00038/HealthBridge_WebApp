import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PricingPageClean = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for occasional healthcare needs',
      features: [
        { text: 'Find nearby doctors', included: true },
        { text: 'Book appointments', included: true },
        { text: 'Basic health records', included: true },
        { text: 'Email support', included: true },
        { text: 'Video consultations', included: false },
        { text: 'AI health assistant', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: '$29',
      period: '/month',
      description: 'Complete healthcare solution',
      features: [
        { text: 'Everything in Basic', included: true },
        { text: 'Unlimited video consultations', included: true },
        { text: 'AI health assistant', included: true },
        { text: 'Priority booking', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Medicine delivery', included: true },
        { text: 'Health analytics dashboard', included: true },
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Family',
      price: '$79',
      period: '/month',
      description: 'Healthcare for the whole family',
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Up to 6 family members', included: true },
        { text: 'Family health dashboard', included: true },
        { text: 'Pediatric specialists', included: true },
        { text: 'Shared medical records', included: true },
        { text: 'Family medicine delivery', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      cta: 'Get Started',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No questions asked.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, Premium and Family plans come with a 14-day free trial. No credit card required.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital payment methods.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Changes take effect immediately.',
    },
  ];

  return (
    <div className="bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Choose the plan that's right for you. All plans include access to verified doctors and secure health records.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 bg-white rounded-2xl ${
                  plan.highlighted
                    ? 'border-2 border-indigo-600 shadow-lg scale-105 md:scale-110'
                    : 'border border-slate-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-semibold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>

                <Link
                  to="/signup"
                  className={`block w-full text-center px-6 py-3 rounded-xl font-medium transition-colors mb-8 ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included ? 'text-slate-700' : 'text-slate-400'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Our team is here to help. Contact us for personalized assistance.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPageClean;
