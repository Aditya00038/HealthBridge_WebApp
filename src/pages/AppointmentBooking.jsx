import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { doctorServices, appointmentServices } from '@/services/firebaseServices';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const AppointmentBooking = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const specializations = [
    'all', 'General Medicine', 'Cardiology', 'Dermatology', 
    'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
    'Gynecology', 'Oncology', 'Endocrinology', 'Gastroenterology'
  ];

  const experienceOptions = [
    { value: 'all', label: 'Any Experience' },
    { value: '0-2', label: '0-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'Any Rating' },
    { value: '4+', label: '4+ stars' },
    { value: '4.5+', label: '4.5+ stars' },
    { value: '5', label: '5 stars only' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'availability', label: 'Most Available' },
    { value: 'price', label: 'Lowest Price' }
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const doctorData = await doctorServices.getAllDoctors();
      setDoctors(doctorData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors
    .filter(doctor => {
      // Search filter
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (doctor.bio || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // Specialization filter
      const matchesSpecialization = selectedSpecialization === 'all' || 
                                   doctor.specialization === selectedSpecialization;
      
      // Experience filter
      const doctorExperience = parseInt(doctor.experience) || 0;
      let matchesExperience = true;
      if (experienceFilter !== 'all') {
        if (experienceFilter === '0-2') matchesExperience = doctorExperience <= 2;
        else if (experienceFilter === '3-5') matchesExperience = doctorExperience >= 3 && doctorExperience <= 5;
        else if (experienceFilter === '6-10') matchesExperience = doctorExperience >= 6 && doctorExperience <= 10;
        else if (experienceFilter === '10+') matchesExperience = doctorExperience > 10;
      }
      
      // Rating filter
      const doctorRating = parseFloat(doctor.rating) || 0;
      let matchesRating = true;
      if (ratingFilter !== 'all') {
        if (ratingFilter === '4+') matchesRating = doctorRating >= 4;
        else if (ratingFilter === '4.5+') matchesRating = doctorRating >= 4.5;
        else if (ratingFilter === '5') matchesRating = doctorRating === 5;
      }
      
      // Location filter
      const matchesLocation = locationFilter === 'all' || 
                             (doctor.location || '').toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesSpecialization && matchesExperience && matchesRating && matchesLocation;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'rating') {
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      } else if (sortBy === 'experience') {
        return (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0);
      } else if (sortBy === 'price') {
        return (parseInt(a.consultationFee) || 0) - (parseInt(b.consultationFee) || 0);
      } else if (sortBy === 'availability') {
        // Mock availability sort - in real app, this would check actual availability
        return Math.random() - 0.5;
      }
      return 0;
    });

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setBookingLoading(true);
      
      const appointmentData = {
        patientId: user.uid,
        patientName: user.displayName || user.email,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        appointmentDate: new Date(selectedDate + 'T' + convertTo24Hour(selectedTime)),
        status: 'pending',
        type: appointmentType,
        time: selectedTime,
        reason: reason,
        specialization: selectedDoctor.specialization
      };

      await appointmentServices.createAppointment(appointmentData);
      setBookingSuccess(true);
      setStep(4);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setBookingSuccess(false);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Healthcare Professional Hero Section - Improved Colors */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
              Book Your Appointment
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Connect with qualified healthcare professionals instantly
            </p>
            
            {/* Compact Stats */}
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white/95 px-6 py-3 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-gray-900">{doctors.length}+</div>
                <div className="text-xs text-gray-600 font-medium">Doctors</div>
              </div>
              <div className="bg-white/95 px-6 py-3 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-gray-900">4.8★</div>
                <div className="text-xs text-gray-600 font-medium">Rating</div>
              </div>
              <div className="bg-white/95 px-6 py-3 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-600 font-medium">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Healthcare Search Section - Improved Colors */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Your Healthcare Provider</h2>
                
                {/* Search Bar - Teal Focus */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <MagnifyingGlassIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by doctor name, specialization, or medical condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-gray-400 text-gray-900 font-medium"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`
                        flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300
                        ${showFilters 
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105' 
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:bg-teal-50'
                        }
                      `}
                    >
                      <FunnelIcon className="h-5 w-5" />
                      Filters
                    </button>
                    
                    <div className="relative min-w-[220px]">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <AdjustmentsHorizontalIcon className="h-5 w-5 text-teal-600" />
                      </div>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none w-full bg-white border-2 border-gray-200 text-gray-700 pl-12 pr-10 py-4 rounded-xl font-semibold hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value} className="py-2">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Options - Improved Colors */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t-2 border-gray-100 pt-6 mt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Specialization Filter */}
                        <div>
                          <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-2">
                              <AcademicCapIcon className="h-5 w-5 text-teal-600" />
                            </div>
                            Specialization
                          </label>
                          <select
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="appearance-none w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 pr-10 rounded-xl hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer font-semibold"
                          >
                            {specializations.map(spec => (
                              <option key={spec} value={spec} className="py-2">
                                {spec === 'all' ? 'All Specializations' : spec}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Experience Filter */}
                        <div>
                          <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-2">
                              <ClockIcon className="h-5 w-5 text-teal-600" />
                            </div>
                            Experience
                          </label>
                          <select
                            value={experienceFilter}
                            onChange={(e) => setExperienceFilter(e.target.value)}
                            className="appearance-none w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 pr-10 rounded-xl hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer font-semibold"
                          >
                            {experienceOptions.map(option => (
                              <option key={option.value} value={option.value} className="py-2">
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                          <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2">
                              <StarIcon className="h-5 w-5 text-amber-500" />
                            </div>
                            Rating
                          </label>
                          <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="appearance-none w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 pr-10 rounded-xl hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer font-semibold"
                          >
                            {ratingOptions.map(option => (
                              <option key={option.value} value={option.value} className="py-2">
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Location Filter */}
                        <div>
                          <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                              <MapPinIcon className="h-5 w-5 text-red-600" />
                            </div>
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="Enter city or area..."
                            value={locationFilter === 'all' ? '' : locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value || 'all')}
                            className="w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-semibold placeholder-gray-400"
                          />
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Showing {filteredDoctors.length} doctors
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedSpecialization('all');
                            setExperienceFilter('all');
                            setRatingFilter('all');
                            setLocationFilter('all');
                            setSortBy('rating');
                          }}
                          className="text-sm text-hb-primary hover:text-hb-primary-dark font-medium transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filteredDoctors.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UserIcon className="h-12 w-12 text-blue-600" />
                    </div>
                    {doctors.length === 0 ? (
                      <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Doctors Registered Yet</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          We're still building our network of healthcare professionals. Be the first to join our community!
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 mb-2">
                            Are you a healthcare professional?
                          </p>
                          <a 
                            href="/auth/signup" 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            Register as a Doctor
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctors Match Your Criteria</h3>
                        <p className="text-gray-500">
                          Try adjusting your search or specialization filter.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available in total
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group
                      ${selectedDoctor?.id === doctor.id 
                        ? 'border-2 border-teal-600 bg-gradient-to-br from-teal-50 via-white to-cyan-50 shadow-xl shadow-teal-200/50' 
                        : 'border border-gray-200 bg-white hover:border-teal-400 shadow-md hover:shadow-lg'
                      }
                    `}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    {/* Compact Doctor Header with Photo */}
                    <div className="relative">
                      <div className="h-24 bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800"></div>
                      <div className="absolute -bottom-8 left-4">
                        <div className="w-16 h-16 rounded-xl border-3 border-white overflow-hidden bg-white shadow-lg">
                          {doctor.profilePhoto ? (
                            <img
                              src={doctor.profilePhoto}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center">
                              <UserIcon className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Compact Availability Badge */}
                      <div className="absolute top-2 right-2">
                        <div className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md
                          ${doctor.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                          }
                        `}>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          {doctor.available ? 'Available' : 'Busy'}
                        </div>
                      </div>
                    </div>

                    {/* Compact Doctor Info */}
                    <div className="p-4 pt-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{doctor.name}</h3>
                          <p className="text-teal-600 font-semibold text-sm">{doctor.specialization}</p>
                        </div>
                        
                        {/* Compact Fee Badge */}
                        {doctor.consultationFee && (
                          <div className="text-right bg-teal-50 px-3 py-2 rounded-lg border border-teal-300">
                            <p className="text-lg font-bold text-teal-600">₹{doctor.consultationFee}</p>
                            <p className="text-xs text-gray-600 font-medium">fee</p>
                          </div>
                        )}
                      </div>

                      {/* Compact Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          <StarSolidIcon className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-sm font-bold text-gray-900">{doctor.rating || 4.5}</span>
                        </div>
                        <span className="text-xs text-gray-600">({doctor.reviewCount || 127} reviews)</span>
                      </div>

                      {/* Compact Experience Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs text-gray-700">
                          <ClockIcon className="h-4 w-4 text-teal-600 mr-2" />
                          <span className="font-semibold">{doctor.experience || '5+'} years exp</span>
                        </div>
                        
                        {doctor.location && (
                          <div className="flex items-center text-xs text-gray-700">
                            <MapPinIcon className="h-4 w-4 text-teal-600 mr-2" />
                            <span className="font-medium">{doctor.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Compact Consultation Types */}
                      <div className="flex items-center gap-2 mb-3">
                        {doctor.consultationTypes?.includes('video') && (
                          <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                            <VideoCameraIcon className="h-3 w-3 mr-1" />
                            Video
                          </div>
                        )}
                        {doctor.consultationTypes?.includes('phone') && (
                          <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            Phone
                          </div>
                        )}
                        {doctor.consultationTypes?.includes('clinic') && (
                          <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            Clinic
                          </div>
                        )}
                      </div>

                      {/* Compact Book Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doctor);
                          setStep(2);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg font-bold text-sm flex items-center justify-center gap-2 group/button"
                      >
                        <CalendarIcon className="h-5 w-5" />
                        Book Appointment
                      </button>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Date, Time & Type */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Date, Time & Type</h2>
              
              {/* Selected Doctor Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900">Selected Doctor:</h3>
                <p className="text-gray-600">{selectedDoctor?.name} - {selectedDoctor?.specialization}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAppointmentType('video')}
                      className={`
                        p-3 border rounded-lg flex items-center justify-center gap-2 transition-all
                        ${appointmentType === 'video' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <VideoCameraIcon className="h-4 w-4" />
                      Video Call
                    </button>
                    <button
                      onClick={() => setAppointmentType('physical')}
                      className={`
                        p-3 border rounded-lg flex items-center justify-center gap-2 transition-all
                        ${appointmentType === 'physical' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <MapPinIcon className="h-4 w-4" />
                      In-Person
                    </button>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          p-2 text-sm border rounded-lg transition-all
                          ${selectedTime === time 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next: Add Details
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Add Reason & Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Details</h2>
              
              {/* Appointment Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Doctor:</span>
                    <p className="font-medium">{selectedDoctor?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Specialization:</span>
                    <p className="font-medium">{selectedDoctor?.specialization}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{new Date(selectedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium flex items-center gap-1">
                      {appointmentType === 'video' ? (
                        <>
                          <VideoCameraIcon className="h-4 w-4" />
                          Video Consultation
                        </>
                      ) : (
                        <>
                          <MapPinIcon className="h-4 w-4" />
                          In-Person Visit
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for this appointment..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!reason.trim() || bookingLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Booking Success */}
          {step === 4 && bookingSuccess && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h2>
              <p className="text-gray-600 mb-8">
                Your appointment with {selectedDoctor?.name} has been scheduled for{' '}
                {new Date(selectedDate).toLocaleDateString()} at {selectedTime}.
                You will receive a confirmation email shortly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetBooking}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Book Another Appointment
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentBooking;