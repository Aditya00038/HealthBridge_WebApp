import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  StarIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  TagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MedicineShop = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Sample medicine data with real medicine images
  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'pain-relief',
      price: 45,
      originalPrice: 60,
      discount: 25,
      rating: 4.5,
      reviews: 1234,
      inStock: true,
      prescription: false,
      manufacturer: 'Cipla',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
      description: 'Effective pain relief and fever reducer',
      dosage: '500mg tablets',
      packSize: '15 tablets',
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      category: 'antibiotics',
      price: 120,
      originalPrice: 150,
      discount: 20,
      rating: 4.7,
      reviews: 890,
      inStock: true,
      prescription: true,
      manufacturer: 'Sun Pharma',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop',
      description: 'Antibiotic for bacterial infections',
      dosage: '250mg capsules',
      packSize: '10 capsules',
    },
    {
      id: 3,
      name: 'Cetrizine 10mg',
      category: 'allergy',
      price: 35,
      originalPrice: 50,
      discount: 30,
      rating: 4.3,
      reviews: 567,
      inStock: true,
      prescription: false,
      manufacturer: 'Dr. Reddy\'s',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
      description: 'Fast relief from allergies',
      dosage: '10mg tablets',
      packSize: '10 tablets',
    },
    {
      id: 4,
      name: 'Vitamin D3 1000 IU',
      category: 'vitamins',
      price: 250,
      originalPrice: 300,
      discount: 17,
      rating: 4.6,
      reviews: 2341,
      inStock: true,
      prescription: false,
      manufacturer: 'HealthKart',
      image: 'https://images.unsplash.com/photo-1550572017-4fade5de0815?w=400&h=400&fit=crop',
      description: 'Essential vitamin D supplement',
      dosage: '1000 IU capsules',
      packSize: '60 capsules',
    },
    {
      id: 5,
      name: 'Omeprazole 20mg',
      category: 'digestive',
      price: 85,
      originalPrice: 110,
      discount: 23,
      rating: 4.4,
      reviews: 456,
      inStock: true,
      prescription: false,
      manufacturer: 'Lupin',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop',
      description: 'Treats acid reflux and heartburn',
      dosage: '20mg capsules',
      packSize: '14 capsules',
    },
    {
      id: 6,
      name: 'Aspirin 75mg',
      category: 'pain-relief',
      price: 40,
      originalPrice: 55,
      discount: 27,
      rating: 4.5,
      reviews: 789,
      inStock: true,
      prescription: false,
      manufacturer: 'Bayer',
      image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=400&fit=crop',
      description: 'Pain relief and blood thinner',
      dosage: '75mg tablets',
      packSize: '30 tablets',
    },
    {
      id: 7,
      name: 'Metformin 500mg',
      category: 'diabetes',
      price: 95,
      originalPrice: 120,
      discount: 21,
      rating: 4.6,
      reviews: 1567,
      inStock: true,
      prescription: true,
      manufacturer: 'USV',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop',
      description: 'Diabetes management medication',
      dosage: '500mg tablets',
      packSize: '30 tablets',
    },
    {
      id: 8,
      name: 'Cough Syrup',
      category: 'cold-flu',
      price: 110,
      originalPrice: 140,
      discount: 21,
      rating: 4.2,
      reviews: 234,
      inStock: true,
      prescription: false,
      manufacturer: 'Dabur',
      image: 'https://images.unsplash.com/photo-1587854680352-936b22b91030?w=400&h=400&fit=crop',
      description: 'Relief from cough and cold',
      dosage: '100ml bottle',
      packSize: '1 bottle',
    },
  ];

  const categories = [
    { 
      id: 'all', 
      name: 'All Medicines', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2zM5.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
      )
    },
    { 
      id: 'pain-relief', 
      name: 'Pain Relief', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a1 1 0 112 0v3a1 1 0 11-2 0v-3zm1-4a1 1 0 100 2 1 1 0 000-2z"/>
        </svg>
      )
    },
    { 
      id: 'antibiotics', 
      name: 'Antibiotics', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"/>
        </svg>
      )
    },
    { 
      id: 'vitamins', 
      name: 'Vitamins', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
        </svg>
      )
    },
    { 
      id: 'allergy', 
      name: 'Allergy', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"/>
        </svg>
      )
    },
    { 
      id: 'digestive', 
      name: 'Digestive', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
      )
    },
    { 
      id: 'diabetes', 
      name: 'Diabetes', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"/>
        </svg>
      )
    },
    { 
      id: 'cold-flu', 
      name: 'Cold & Flu', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"/>
        </svg>
      )
    },
  ];

  // Filter medicines
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discount - a.discount;
      default:
        return b.reviews - a.reviews;
    }
  });

  // Cart functions
  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      toast.success('Quantity updated in cart');
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
      toast.success('Added to cart');
    }
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(medicineId);
    } else {
      setCart(cart.map(item =>
        item.id === medicineId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Medicine Shop
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Order medicines online with fast delivery
                </p>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines, manufacturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {sortedMedicines.length} medicines found
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Verified Products</span>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Best Prices</span>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-700">24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedMedicines.map(medicine => (
            <motion.div
              key={medicine.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
            >
              {/* Medicine Image */}
              <div className="relative">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-48 object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop';
                  }}
                />
                {medicine.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                    {medicine.discount}% OFF
                  </div>
                )}
                {medicine.prescription && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                    Rx
                  </div>
                )}
                {!medicine.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Medicine Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                  {medicine.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{medicine.manufacturer}</p>
                <p className="text-xs text-gray-500 mb-2">{medicine.packSize}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">{medicine.rating}</span>
                  <span className="text-xs text-gray-500">({medicine.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                  {medicine.originalPrice > medicine.price && (
                    <span className="text-sm text-gray-400 line-through">₹{medicine.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(medicine)}
                  disabled={!medicine.inStock}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    medicine.inStock
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No medicines found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Cart Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                  <p className="text-sm text-green-100">{cartCount} items</p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add medicines to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-600 mb-2">{item.packSize}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-green-600 font-bold">₹{item.price}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-sm w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">₹{cartTotal}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      toast.success('Proceeding to checkout...');
                      // Add checkout logic here
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Free delivery on orders above ₹500
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineShop;
