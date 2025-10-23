import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  MapIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  HeartIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { 
  getFacilitiesByCity, 
  getAvailableCities, 
  getUserLocation, 
  calculateDistance 
} from '@/services/locationServices';

const LocatePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);

  // Load facilities when city changes
  useEffect(() => {
    loadFacilities();
  }, [selectedCity]);

  // Get user location on mount
  useEffect(() => {
    getUserLocation()
      .then(location => {
        setUserLocation(location);
        calculateDistances(location);
      })
      .catch(error => {
        console.log('Location access denied:', error);
      });
  }, []);

  const loadFacilities = () => {
    setLoading(true);
    const cityData = getFacilitiesByCity(selectedCity);
    setFacilities(cityData);
    
    if (userLocation) {
      calculateDistances(userLocation);
    }
    
    setLoading(false);
  };

  const calculateDistances = (location) => {
    setFacilities(prev => prev.map(facility => ({
      ...facility,
      distance: `${calculateDistance(
        location.lat,
        location.lng,
        facility.coordinates.lat,
        facility.coordinates.lng
      ).toFixed(1)} km`
    })));
  };

  const availableCities = [
    { id: 'mumbai', name: 'Mumbai, Maharashtra' },
    { id: 'delhi', name: 'Delhi NCR' },
    { id: 'bangalore', name: 'Bangalore, Karnataka' },
    { id: 'chennai', name: 'Chennai, Tamil Nadu' },
    { id: 'hyderabad', name: 'Hyderabad, Telangana' },
    { id: 'pune', name: 'Pune, Maharashtra' },
    { id: 'kolkata', name: 'Kolkata, West Bengal' },
    { id: 'ahmedabad', name: 'Ahmedabad, Gujarat' },
    { id: 'jaipur', name: 'Jaipur, Rajasthan' }
  ];

  const oldMockData = [
    {
      id: 1,
      name: 'City Medical Center',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.8,
      reviews: 324,
      distance: '0.5 km',
      address: '123 Healthcare Ave, Downtown',
      phone: '+1 (555) 123-4567',
      hours: '24/7',
      doctors: 45,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      services: ['Emergency', 'ICU', 'Surgery', 'Diagnostics']
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      type: 'doctor',
      specialty: 'Cardiologist',
      rating: 4.9,
      reviews: 156,
      distance: '0.8 km',
      address: '456 Medical Plaza, Suite 201',
      phone: '+1 (555) 234-5678',
      hours: 'Mon-Fri: 9AM-6PM',
      experience: '15 years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      coordinates: { lat: 40.7138, lng: -74.0070 },
      services: ['Heart Checkup', 'ECG', 'Angiography']
    },
    {
      id: 3,
      name: 'Green Valley Clinic',
      type: 'clinic',
      specialty: 'Primary Care Clinic',
      rating: 4.6,
      reviews: 89,
      distance: '1.2 km',
      address: '789 Wellness Street',
      phone: '+1 (555) 345-6789',
      hours: 'Mon-Sat: 8AM-8PM',
      doctors: 8,
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
      coordinates: { lat: 40.7118, lng: -74.0050 },
      services: ['General Checkup', 'Vaccinations', 'Lab Tests']
    },
    {
      id: 4,
      name: 'Dr. Michael Chen',
      type: 'doctor',
      specialty: 'Pediatrician',
      rating: 4.9,
      reviews: 203,
      distance: '1.5 km',
      address: '321 Kids Care Center',
      phone: '+1 (555) 456-7890',
      hours: 'Mon-Fri: 8AM-5PM',
      experience: '12 years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      coordinates: { lat: 40.7148, lng: -74.0080 },
      services: ['Child Care', 'Vaccinations', 'Growth Monitoring']
    },
    {
      id: 5,
      name: 'Memorial Hospital',
      type: 'hospital',
      specialty: 'General Hospital',
      rating: 4.7,
      reviews: 445,
      distance: '2.1 km',
      address: '555 Memorial Drive',
      phone: '+1 (555) 567-8901',
      hours: '24/7',
      doctors: 78,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
      coordinates: { lat: 40.7108, lng: -74.0040 },
      services: ['Emergency', 'Surgery', 'Maternity', 'ICU']
    },
    {
      id: 6,
      name: 'Sunrise Family Clinic',
      type: 'clinic',
      specialty: 'Family Medicine',
      rating: 4.5,
      reviews: 67,
      distance: '2.3 km',
      address: '890 Sunrise Boulevard',
      phone: '+1 (555) 678-9012',
      hours: 'Mon-Sat: 9AM-7PM',
      doctors: 5,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400',
      coordinates: { lat: 40.7158, lng: -74.0090 },
      services: ['Family Care', 'Chronic Disease', 'Women\'s Health']
    },
    {
      id: 7,
      name: 'Dr. Emily Rodriguez',
      type: 'doctor',
      specialty: 'Dermatologist',
      rating: 4.8,
      reviews: 134,
      distance: '2.8 km',
      address: '234 Skin Care Plaza',
      phone: '+1 (555) 789-0123',
      hours: 'Tue-Sat: 10AM-6PM',
      experience: '10 years',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
      coordinates: { lat: 40.7098, lng: -74.0030 },
      services: ['Skin Treatment', 'Cosmetic Procedures', 'Acne Care']
    },
    {
      id: 8,
      name: 'Central Diagnostic Center',
      type: 'clinic',
      specialty: 'Diagnostic & Imaging',
      rating: 4.7,
      reviews: 178,
      distance: '3.0 km',
      address: '567 Diagnostic Road',
      phone: '+1 (555) 890-1234',
      hours: 'Mon-Sun: 7AM-9PM',
      doctors: 12,
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400',
      coordinates: { lat: 40.7168, lng: -74.0100 },
      services: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound']
    }
  ]; // End of old mock data - now removed

  const types = [
    { id: 'all', name: 'All', icon: MapPinIcon, color: 'gray' },
    { id: 'doctor', name: 'Doctors', icon: UserGroupIcon, color: 'blue' },
    { id: 'clinic', name: 'Clinics', icon: BuildingOfficeIcon, color: 'green' },
    { id: 'hospital', name: 'Hospitals', icon: HeartIcon, color: 'red' }
  ];

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || facility.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarIconSolid key="half" className="w-5 h-5 text-yellow-400 opacity-50" />
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }
    return stars;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'doctor':
        return 'from-blue-500 to-blue-600';
      case 'clinic':
        return 'from-green-500 to-green-600';
      case 'hospital':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'doctor':
        return UserGroupIcon;
      case 'clinic':
        return BuildingOfficeIcon;
      case 'hospital':
        return HeartIcon;
      default:
        return MapPinIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Locate Healthcare Facilities
          </h1>
          <p className="text-sm text-gray-600">
            Find nearby doctors, clinics, and hospitals in your area
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <>
            {/* Search and Filter Bar - Compact Teal Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6"
        >
          {/* City Selector */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <div className="w-6 h-6 bg-teal-100 rounded-md flex items-center justify-center mr-1.5">
                <GlobeAltIcon className="w-3.5 h-3.5 text-teal-600" />
              </div>
              Select City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white text-sm font-medium hover:border-teal-500 transition-all"
            >
              {availableCities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-600" />
            <input
              type="text"
              placeholder="Search by name, specialty, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-400 text-sm font-medium"
            />
          </div>

          {/* Type Filter - Compact Teal Theme */}
          <div className="flex flex-wrap gap-2">
            {types.map((type) => {
              const IconComponent = type.icon;
              const isActive = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-500 hover:bg-teal-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{type.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {facilities.filter(f => type.id === 'all' || f.type === type.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-semibold">
            Found <span className="text-teal-600">{filteredFacilities.length}</span> healthcare facilities
          </p>
        </div>

        {/* Facilities Grid - Compact Healthcare Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility, index) => {
            const TypeIcon = getTypeIcon(facility.type);
            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:border-teal-400 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedLocation(facility)}
              >
                {/* Compact Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center gap-1 shadow-md">
                    <TypeIcon className="w-3 h-3" />
                    {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white text-gray-900 text-xs font-bold flex items-center gap-1 shadow-md">
                    <MapPinIcon className="w-3 h-3 text-teal-600" />
                    {facility.distance}
                  </div>
                </div>

                {/* Compact Content */}
                <div className="p-4">
                  {/* Name and Specialty */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{facility.specialty}</p>

                  {/* Compact Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <StarIconSolid className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-sm font-bold text-gray-900">{facility.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">({facility.reviews} reviews)</span>
                  </div>

                  {/* Compact Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapIcon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span className="text-xs truncate">{facility.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <ClockIcon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span className="text-xs">{facility.hours}</span>
                    </div>
                    {facility.doctors && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserGroupIcon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">{facility.doctors} doctors</span>
                      </div>
                    )}
                  </div>

                  {/* Compact Services Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {facility.services.slice(0, 2).map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md font-semibold"
                      >
                        {service}
                      </span>
                    ))}
                    {facility.services.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-semibold">
                        +{facility.services.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Compact Action Button */}
                  <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-bold text-sm hover:from-teal-700 hover:to-cyan-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFacilities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocatePage;
