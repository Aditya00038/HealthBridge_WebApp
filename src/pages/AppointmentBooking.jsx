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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Schedule your consultation with our healthcare professionals and take control of your health journey</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-lg
                  ${step >= stepNum ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200' : 'bg-white text-gray-500 shadow-gray-200'}
                `}>
                  {stepNum === 4 && bookingSuccess ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Doctor</h2>
              
              {/* Enhanced Search and Filters */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search doctors by name, specialization, or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-hb pl-10 w-full"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`
                        flex items-center px-4 py-2 rounded-lg font-medium transition-colors
                        ${showFilters 
                          ? 'bg-hb-primary text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <FunnelIcon className="h-4 w-4 mr-2" />
                      Filters
                    </button>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-hb min-w-[140px]"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-4 mt-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Specialization Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specialization
                          </label>
                          <select
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="input-hb w-full"
                          >
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>
                                {spec === 'all' ? 'All Specializations' : spec}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Experience Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience
                          </label>
                          <select
                            value={experienceFilter}
                            onChange={(e) => setExperienceFilter(e.target.value)}
                            className="input-hb w-full"
                          >
                            {experienceOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="input-hb w-full"
                          >
                            {ratingOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Location Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="Enter city or area"
                            value={locationFilter === 'all' ? '' : locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value || 'all')}
                            className="input-hb w-full"
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
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`
                      rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden
                      ${selectedDoctor?.id === doctor.id 
                        ? 'border-2 border-hb-primary bg-gradient-to-r from-blue-50 to-blue-100 shadow-blue-200' 
                        : 'border border-gray-200 bg-white hover:border-hb-primary'
                      }
                    `}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    {/* Doctor Header with Photo */}
                    <div className="relative">
                      <div className="h-32 bg-gradient-hb-primary"></div>
                      <div className="absolute -bottom-8 left-6">
                        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                          {doctor.profilePhoto ? (
                            <img
                              src={doctor.profilePhoto}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-hb-primary flex items-center justify-center">
                              <UserIcon className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Availability Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${doctor.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                          }
                        `}>
                          {doctor.available ? '● Available Now' : '● Busy'}
                        </div>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6 pt-12">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{doctor.name}</h3>
                          <p className="text-hb-primary font-medium text-sm">{doctor.specialization}</p>
                        </div>
                        
                        {/* Consultation Fee */}
                        {doctor.consultationFee && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">₹{doctor.consultationFee}</p>
                            <p className="text-xs text-gray-500">consultation</p>
                          </div>
                        )}
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <StarSolidIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold text-gray-900">{doctor.rating || 4.5}</span>
                        </div>
                        <span className="text-sm text-gray-600">({doctor.reviewCount || 127} reviews)</span>
                      </div>

                      {/* Experience and Education */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{doctor.experience || '5+'} years experience</span>
                        </div>
                        
                        {doctor.education && (
                          <div className="flex items-center text-sm text-gray-600">
                            <AcademicCapIcon className="h-4 w-4 mr-2 text-green-500" />
                            <span className="truncate">{doctor.education}</span>
                          </div>
                        )}
                        
                        {doctor.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2 text-red-500" />
                            <span>{doctor.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Bio/Description */}
                      {doctor.bio && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}

                      {/* View Profile Link */}
                      <Link
                        to={`/profile/${doctor.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-hb-primary hover:text-hb-primary-dark font-medium mb-4 inline-flex items-center group"
                      >
                        <UserIcon className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                        View Full Profile
                      </Link>

                      {/* Consultation Types */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          {doctor.consultationTypes?.includes('video') && (
                            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center">
                              <VideoCameraIcon className="h-3 w-3 mr-1" />
                              Video
                            </div>
                          )}
                          {doctor.consultationTypes?.includes('phone') && (
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center">
                              <PhoneIcon className="h-3 w-3 mr-1" />
                              Phone
                            </div>
                          )}
                          {doctor.consultationTypes?.includes('clinic') && (
                            <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              Clinic
                            </div>
                          )}
                        </div>
                        
                        {/* Next Available */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Next available</p>
                          <p className="text-xs font-medium text-green-600">Today 2:30 PM</p>
                        </div>
                      </div>

                      {/* Book Appointment Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doctor);
                          setStep(2);
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm flex items-center justify-center gap-2"
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