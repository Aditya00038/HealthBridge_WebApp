import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ShieldCheckIcon,
  HomeIcon,
  UserGroupIcon,
  BanknotesIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const governmentSchemes = [
  {
    id: 1,
    title: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    category: 'Insurance',
    icon: ShieldCheckIcon,
    color: 'blue',
    description: 'Free health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    eligibility: 'Economically vulnerable families based on SECC 2011 database',
    benefits: [
      'Coverage of ₹5 lakh per family per year',
      'Cashless treatment at empanelled hospitals',
      'Covers over 1,500 medical procedures',
      'No cap on family size or age'
    ],
    website: 'https://pmjay.gov.in/',
    contactNumber: '14555'
  },
  {
    id: 2,
    title: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    category: 'Insurance',
    icon: ShieldCheckIcon,
    color: 'emerald',
    description: 'Accident insurance scheme offering coverage for accidental death and disability.',
    eligibility: 'Individuals aged 18-70 years with bank account',
    benefits: [
      '₹2 lakh for accidental death',
      '₹2 lakh for total permanent disability',
      '₹1 lakh for partial permanent disability',
      'Premium of only ₹20 per year'
    ],
    website: 'https://www.india.gov.in/spotlight/pradhan-mantri-suraksha-bima-yojana',
    contactNumber: '1800-180-1111'
  },
  {
    id: 3,
    title: 'Janani Suraksha Yojana (JSY)',
    category: 'Maternal Health',
    icon: HeartIcon,
    color: 'pink',
    description: 'Safe motherhood intervention program to reduce maternal and neonatal mortality.',
    eligibility: 'Pregnant women preferably from BPL families',
    benefits: [
      'Cash assistance for institutional delivery',
      '₹1,400 for rural areas, ₹1,000 for urban areas',
      'Free delivery services',
      'Post-delivery care'
    ],
    website: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309',
    contactNumber: '1800-180-1104'
  },
  {
    id: 4,
    title: 'Rashtriya Swasthya Bima Yojana (RSBY)',
    category: 'Insurance',
    icon: UserGroupIcon,
    color: 'indigo',
    description: 'Health insurance scheme for Below Poverty Line (BPL) families.',
    eligibility: 'BPL families registered in the state',
    benefits: [
      'Coverage of ₹30,000 per family per year',
      'Cashless hospitalization',
      'Covers pre-existing diseases',
      'Transport allowance'
    ],
    website: 'https://www.rsby.gov.in/',
    contactNumber: '1800-345-3886'
  },
  {
    id: 5,
    title: 'National Health Mission (NHM)',
    category: 'Healthcare Services',
    icon: HomeIcon,
    color: 'purple',
    description: 'Comprehensive health programs for rural and urban areas.',
    eligibility: 'All citizens, especially in rural and underserved areas',
    benefits: [
      'Free essential drugs and diagnostics',
      'Maternal and child health services',
      'Disease control programs',
      'Health infrastructure development'
    ],
    website: 'https://nhm.gov.in/',
    contactNumber: '1800-180-1104'
  },
  {
    id: 6,
    title: 'Pradhan Mantri Bhartiya Janaushadhi Kendra (PMBJK)',
    category: 'Medicine',
    icon: BanknotesIcon,
    color: 'green',
    description: 'Generic medicines at affordable prices through dedicated stores.',
    eligibility: 'All citizens',
    benefits: [
      'Generic medicines at 50-90% lower prices',
      '1,500+ medicines available',
      'Same quality as branded medicines',
      '9,000+ stores across India'
    ],
    website: 'https://janaushadhi.gov.in/',
    contactNumber: '1800-180-1800'
  }
];

const healthNews = [
  {
    id: 1,
    title: 'India Launches Universal Immunization Programme Expansion',
    category: 'Vaccination',
    date: '2024-01-15',
    summary: 'Government expands vaccination coverage to include newer vaccines for children and adults.',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'New Guidelines for Diabetes Management Released',
    category: 'Disease Management',
    date: '2024-01-10',
    summary: 'Health Ministry releases comprehensive guidelines for diabetes prevention and management.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Mental Health Awareness Month: Free Counseling Services',
    category: 'Mental Health',
    date: '2024-01-05',
    summary: 'Free mental health counseling services available at all government hospitals this month.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'Nationwide Eye Health Screening Campaign',
    category: 'Prevention',
    date: '2023-12-28',
    summary: 'Free eye check-ups and cataract surgeries being conducted across rural areas.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=250&fit=crop'
  }
];

const HealthNews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('schemes'); // schemes or news

  const categories = [
    { id: 'all', name: 'All', icon: SparklesIcon },
    { id: 'Insurance', name: 'Insurance', icon: ShieldCheckIcon },
    { id: 'Maternal Health', name: 'Maternal Health', icon: HeartIcon },
    { id: 'Healthcare Services', name: 'Services', icon: HomeIcon },
    { id: 'Medicine', name: 'Medicine', icon: BanknotesIcon }
  ];

  const filteredSchemes = governmentSchemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredNews = healthNews.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <NewspaperIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Health Information Hub</h1>
          </div>
          <p className="text-gray-600">
            Explore government health schemes and stay updated with latest health news
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('schemes')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeTab === 'schemes'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Government Schemes
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Health News
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'schemes' ? 'schemes' : 'news'}...`}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter (only for schemes) */}
        {activeTab === 'schemes' && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'schemes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme, index) => {
              const Icon = scheme.icon;
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className={`bg-gradient-to-r from-${scheme.color}-500 to-${scheme.color}-600 p-6`}>
                    <div className="flex items-start gap-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{scheme.title}</h3>
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm">
                          {scheme.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{scheme.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Eligibility:</h4>
                      <p className="text-gray-600 text-sm">{scheme.eligibility}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <a
                        href={scheme.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Visit Website
                      </a>
                      <a
                        href={`tel:${scheme.contactNumber}`}
                        className="flex-1 text-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
                      >
                        {scheme.contactNumber}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      {news.category}
                    </span>
                    <span className="text-gray-500 text-sm">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{news.title}</h3>
                  <p className="text-gray-600 text-sm">{news.summary}</p>
                  <button className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                    Read More →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {activeTab === 'schemes' && filteredSchemes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">No schemes found matching your search.</p>
          </div>
        )}

        {activeTab === 'news' && filteredNews.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">No news found matching your search.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HealthNews;
