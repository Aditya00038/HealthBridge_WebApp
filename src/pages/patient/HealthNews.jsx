import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ShieldCheckIcon,
  HomeIcon,
  UserGroupIcon,
  BanknotesIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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

const HealthNews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('schemes');
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsPage, setNewsPage] = useState(1);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('health');

  // Fetch real health news from NewsAPI
  useEffect(() => {
    if (activeTab === 'news') {
      fetchHealthNews();
    }
  }, [activeTab, selectedNewsCategory, newsPage]);

  const fetchHealthNews = async () => {
    setLoadingNews(true);
    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      
      if (!apiKey) {
        // Fallback to demo data if no API key
        setNewsArticles([
          {
            title: 'India Launches Universal Immunization Programme Expansion',
            description: 'Government expands vaccination coverage to include newer vaccines for children and adults across the country.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop',
            publishedAt: '2024-01-15T10:00:00Z',
            source: { name: 'Health Ministry' }
          },
          {
            title: 'New Guidelines for Diabetes Management Released',
            description: 'Health Ministry releases comprehensive guidelines for diabetes prevention and management in India.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
            publishedAt: '2024-01-10T10:00:00Z',
            source: { name: 'Medical Journal' }
          },
          {
            title: 'Mental Health Awareness Month: Free Counseling Services',
            description: 'Free mental health counseling services available at all government hospitals this month.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
            publishedAt: '2024-01-05T10:00:00Z',
            source: { name: 'Health Department' }
          },
          {
            title: 'Nationwide Eye Health Screening Campaign',
            description: 'Free eye check-ups and cataract surgeries being conducted across rural areas of India.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=250&fit=crop',
            publishedAt: '2023-12-28T10:00:00Z',
            source: { name: 'Eye Care Foundation' }
          },
          {
            title: 'Ayushman Bharat Digital Mission Expands Coverage',
            description: 'Digital health IDs now available for all citizens to access medical records seamlessly.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop',
            publishedAt: '2023-12-20T10:00:00Z',
            source: { name: 'Digital Health Authority' }
          },
          {
            title: 'India Reports Significant Decline in Tuberculosis Cases',
            description: 'TB cases drop by 20% following nationwide awareness and treatment programs.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=250&fit=crop',
            publishedAt: '2023-12-15T10:00:00Z',
            source: { name: 'WHO India' }
          }
        ]);
        setLoadingNews(false);
        return;
      }

      // Fetch from NewsAPI
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${selectedNewsCategory}+India&language=en&sortBy=publishedAt&pageSize=12&page=${newsPage}&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setNewsArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news. Using demo articles.');
      // Keep existing demo articles
    } finally {
      setLoadingNews(false);
    }
  };

  const newsCategories = [
    { id: 'health', name: 'Health' },
    { id: 'medical', name: 'Medical' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'mental+health', name: 'Mental Health' },
    { id: 'vaccination', name: 'Vaccination' }
  ];

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

  const filteredNews = newsArticles.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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

        {/* Category Filter */}
        {activeTab === 'schemes' ? (
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
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedNewsCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedNewsCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
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
          <>
            {loadingNews ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedNewsCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredNews.map((article, index) => (
                      <motion.div
                        key={article.url || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                      >
                        {article.urlToImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1">
                              <NewspaperIcon className="w-3 h-3" />
                              {article.source?.name || 'News'}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {article.description || 'No description available.'}
                          </p>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                          >
                            Read Full Article
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {filteredNews.length > 0 && (
                  <div className="flex justify-center gap-3 mt-8">
                    <button
                      onClick={() => setNewsPage(p => Math.max(1, p - 1))}
                      disabled={newsPage === 1}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold">
                      Page {newsPage}
                    </span>
                    <button
                      onClick={() => setNewsPage(p => p + 1)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
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
