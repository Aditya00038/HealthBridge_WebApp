import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { doctorServices, appointmentServices, scheduleServices } from '@/services/firebaseServices';
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

const sanitizeText = (text = '') => text.toLowerCase().trim();

const hashString = (input = '') => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).toUpperCase().slice(0, 5);
};

const generateAppointmentCode = ({
  appointmentType,
  urgencyLevel,
  doctorId,
  appointmentDate,
  appointmentTime,
  patientId
}) => {
  if (!appointmentDate || !appointmentTime) {
    return 'TBD';
  }

  const prefix = appointmentType === 'physical' ? 'IP' : 'VC';
  const urgencyCode = (urgencyLevel || 'routine').charAt(0).toUpperCase();
  const doctorSegment = (doctorId || 'GEN').toString().slice(-3).toUpperCase();
  const base = `${appointmentDate}|${appointmentTime}|${doctorId || ''}|${patientId || ''}`;
  const hash = hashString(base).padStart(4, '0');

  return `${prefix}-${urgencyCode}${hash}-${doctorSegment}`;
};

const REASON_PROFILES = [
  {
    id: 'cardiac_emergency',
    category: 'Cardiac Evaluation',
    urgencyLevel: 'critical',
    priorityScore: 5,
    keywords: ['chest pain', 'pressure in chest', 'tightness', 'shortness of breath', 'breathless', 'palpitation', 'palpitations'],
    recommendedSpecialties: ['Cardiology', 'Emergency Medicine'],
    message: 'Chest discomfort and breathing issues require urgent evaluation. Please be prepared to seek emergency care if symptoms worsen.'
  },
  {
    id: 'neurology_severe',
    category: 'Neurological Assessment',
    urgencyLevel: 'high',
    priorityScore: 4,
    keywords: ['severe headache', 'loss of consciousness', 'numbness', 'stroke', 'slurred speech'],
    recommendedSpecialties: ['Neurology'],
    message: 'Neurological symptoms can escalate quickly. Early assessment improves outcomes.'
  },
  {
    id: 'injury',
    category: 'Trauma & Injury',
    urgencyLevel: 'high',
    priorityScore: 4,
    keywords: ['fracture', 'injury', 'accident', 'severe bleeding', 'deep cut', 'sprain'],
    recommendedSpecialties: ['Orthopedics', 'Emergency Medicine'],
    message: 'Acute injuries benefit from prioritized triage so that imaging and treatment can be arranged promptly.'
  },
  {
    id: 'fever',
    category: 'Infection & Fever',
    urgencyLevel: 'medium',
    priorityScore: 3,
    keywords: ['high fever', 'persistent fever', 'flu symptoms', 'infection', 'viral'],
    recommendedSpecialties: ['General Medicine', 'Internal Medicine'],
    message: 'Fever and infection symptoms are monitored closely to prevent escalation. Stay hydrated and track temperature.'
  },
  {
    id: 'checkup',
    category: 'Routine Health Check',
    urgencyLevel: 'routine',
    priorityScore: 2,
    keywords: ['health check', 'routine check', 'annual physical', 'regular checkup', 'follow up', 'follow-up'],
    recommendedSpecialties: ['General Medicine'],
    message: 'Routine visits help maintain long-term health. Please bring previous reports if available.'
  },
  {
    id: 'skin',
    category: 'Dermatology Review',
    urgencyLevel: 'routine',
    priorityScore: 2,
    keywords: ['rash', 'skin irritation', 'eczema', 'acne', 'allergy rash'],
    recommendedSpecialties: ['Dermatology'],
    message: 'Skin concerns benefit from photographic documentation. Consider uploading clear images ahead of your visit.'
  }
];

const classifyReasonForVisit = ({
  reason,
  appointmentType,
  selectedDoctor,
  appointmentDate,
  appointmentTime,
  patientId
}) => {
  const normalizedReason = sanitizeText(reason);
  const matchedProfile = REASON_PROFILES.find((profile) =>
    profile.keywords.some((keyword) => normalizedReason.includes(keyword))
  );

  const fallbackCategory = appointmentType === 'physical' ? 'General Consultation' : 'Virtual Follow-up';
  const urgencyLevel = matchedProfile?.urgencyLevel || (appointmentType === 'physical' ? 'routine' : 'standard');
  const priorityScore = matchedProfile?.priorityScore || (appointmentType === 'physical' ? 2 : 1);
  const recommendations = matchedProfile?.recommendedSpecialties || (selectedDoctor?.specialization ? [selectedDoctor.specialization] : []);
  const notes = matchedProfile?.message || 'Your doctor will review your concerns before the consultation.';
  const appointmentNumber = generateAppointmentCode({
    appointmentType,
    urgencyLevel,
    doctorId: selectedDoctor?.id,
    appointmentDate,
    appointmentTime,
    patientId
  });

  return {
    category: matchedProfile?.category || fallbackCategory,
    urgencyLevel,
    priorityScore,
    recommendations,
    notes,
    appointmentNumber,
    flaggedForPriority: urgencyLevel === 'critical' || urgencyLevel === 'high'
  };
};

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
  const [sortBy, setSortBy] = useState('best');
  const [showFilters, setShowFilters] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [consultModeFilter, setConsultModeFilter] = useState({ physical: false, video: false });
  const [feeRangeFilter, setFeeRangeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Count active filters for mobile indicator
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedSpecialization !== 'all') count++;
    if (experienceFilter !== 'all') count++;
    if (ratingFilter !== 'all') count++;
    if (locationFilter !== 'all') count++;
    if (feeRangeFilter !== 'all') count++;
    if (genderFilter !== 'all') count++;
    if (consultModeFilter.physical || consultModeFilter.video) count++;
    return count;
  };

  const renderRatingStars = (value) => {
    const rating = Math.max(0, Math.min(5, value || 0));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center" style={{ gap: '2px' }}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <StarSolidIcon 
            key={`full-${i}`} 
            className="w-5 h-5" 
            style={{ color: '#FBBF24', fill: '#FBBF24' }}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div key="half" className="relative" style={{ width: '20px', height: '20px' }}>
            <StarIcon 
              className="w-5 h-5 absolute" 
              style={{ color: '#D1D5DB' }}
            />
            <div className="overflow-hidden absolute" style={{ width: '50%' }}>
              <StarSolidIcon 
                className="w-5 h-5" 
                style={{ color: '#FBBF24', fill: '#FBBF24' }}
              />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon 
            key={`empty-${i}`} 
            className="w-5 h-5" 
            style={{ color: '#D1D5DB' }}
          />
        ))}
      </div>
    );
  };

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

  const feeOptions = [
    { value: 'all', label: 'Any Fee', min: null, max: null },
    { value: '100-500', label: '₹100 - ₹500', min: 100, max: 500 },
    { value: '500-1000', label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { value: '1000+', label: '₹1,000+', min: 1000, max: null }
  ];

  const genderOptions = [
    { value: 'all', label: 'Any Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const reasonSuggestions = [
    {
      id: 'cardiac',
      label: 'Chest pain with breathlessness',
      value: 'Experiencing chest pain and shortness of breath since last night',
      type: 'physical'
    },
    {
      id: 'injury',
      label: 'Recent injury or fall',
      value: 'Suffered a fall yesterday with swelling and suspected fracture in wrist',
      type: 'physical'
    },
    {
      id: 'fever',
      label: 'High fever & chills',
      value: 'Persistent high fever with chills and body ache for three days',
      type: 'physical'
    },
    {
      id: 'followup',
      label: 'Follow-up consultation',
      value: 'Follow-up visit to review ongoing treatment progress',
      type: 'physical'
    },
    {
      id: 'skin',
      label: 'Skin irritation / rash',
      value: 'New skin rash spreading over arms with itching for one week',
      type: 'physical'
    }
  ];

  const sortOptions = [
    { value: 'best', label: '⭐ Best Doctors' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'availability', label: 'Most Available' },
    { value: 'price', label: 'Lowest Price' }
  ];

  // Fetch available time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableTimeSlots();
    } else {
      // Show default slots if no doctor/date selected
      setTimeSlots([
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
      ]);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    try {
      setLoadingSlots(true);
      const slots = await scheduleServices.getAvailableTimeSlots(
        selectedDoctor.id,
        selectedDate
      );
      
      if (slots && slots.length > 0) {
        // Convert 24h format to 12h AM/PM format
        const formattedSlots = slots.map(slot => {
          const [hours, minutes] = slot.time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${displayHour}:${minutes} ${ampm}`;
        });
        setTimeSlots(formattedSlots);
      } else {
        // No schedule set for this day, show default slots
        setTimeSlots([
          '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
          '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
        ]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      // Fallback to default slots on error
      setTimeSlots([
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
      ]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const reasonInsights = useMemo(() => classifyReasonForVisit({
    reason,
    appointmentType,
    selectedDoctor,
    appointmentDate: selectedDate,
    appointmentTime: selectedTime,
    patientId: user?.uid
  }), [reason, appointmentType, selectedDoctor, selectedDate, selectedTime, user?.uid]);

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
      const lowerSearch = searchTerm.toLowerCase();
      const doctorSpecializations = Array.isArray(doctor.specializations) && doctor.specializations.length > 0
        ? doctor.specializations
        : [doctor.specialization || ''];
      const matchesSearch = !lowerSearch ||
        doctor.name.toLowerCase().includes(lowerSearch) ||
        doctorSpecializations.some((spec) => spec.toLowerCase().includes(lowerSearch)) ||
        (doctor.bio || '').toLowerCase().includes(lowerSearch);

      // Specialization filter
      const matchesSpecialization = selectedSpecialization === 'all' ||
        doctorSpecializations.some((spec) => spec.toLowerCase().includes(selectedSpecialization.toLowerCase()));

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
        [doctor.location, doctor.city, doctor.state]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(locationFilter.toLowerCase()));

      // Consultation mode filter
      const activeModes = Object.entries(consultModeFilter)
        .filter(([, isSelected]) => isSelected)
        .map(([mode]) => mode);

      const doctorModesRaw = doctor.consultationModes || doctor.consultationTypes || doctor.availableModes;
      const doctorModes = Array.isArray(doctorModesRaw)
        ? doctorModesRaw
        : doctorModesRaw
          ? [doctorModesRaw]
          : ['video', 'physical'];

      const normalizedDoctorModes = doctorModes.map((mode) => mode.toString().toLowerCase());
      const matchesConsultMode = activeModes.length === 0 ||
        activeModes.some((mode) => normalizedDoctorModes.includes(mode));

      // Fee filter
      const doctorFee = parseInt(doctor.consultationFee) || 0;
      let matchesFee = true;
      if (feeRangeFilter !== 'all') {
        const currentFeeBand = feeOptions.find((option) => option.value === feeRangeFilter);
        if (currentFeeBand) {
          const { min, max } = currentFeeBand;
          if (min !== null && doctorFee < min) matchesFee = false;
          if (max !== null && doctorFee > max) matchesFee = false;
        }
      }

      // Gender filter
      const doctorGender = (doctor.gender || '').toLowerCase();
      const matchesGender = genderFilter === 'all' || doctorGender === genderFilter;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesExperience &&
        matchesRating &&
        matchesLocation &&
        matchesConsultMode &&
        matchesFee &&
        matchesGender
      );
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'best') {
        // Best doctors: Weighted score based on appointments (60%) and rating (40%)
        const getScore = (doctor) => {
          const appointments = doctor.totalAppointments || 0;
          const rating = doctor.averageRating || 0;
          const reviews = doctor.totalReviews || 0;
          
          // Normalize appointments (assuming max ~500 appointments)
          const normalizedAppointments = Math.min(appointments / 500, 1);
          // Normalize rating (out of 5)
          const normalizedRating = rating / 5;
          // Bonus for having reviews
          const reviewBonus = reviews > 0 ? 0.1 : 0;
          
          return (normalizedAppointments * 0.6) + (normalizedRating * 0.4) + reviewBonus;
        };
        
        return getScore(b) - getScore(a);
      } else if (sortBy === 'rating') {
        return (parseFloat(b.averageRating || b.rating) || 0) - (parseFloat(a.averageRating || a.rating) || 0);
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
      const reasonMeta = classifyReasonForVisit({
        reason,
        appointmentType,
        selectedDoctor,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        patientId: user?.uid
      });
      
      const appointmentData = {
        patientId: user.uid,
        patientName: user.displayName || user.email,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        appointmentDate: selectedDate, // Store as string (e.g., "2025-11-15")
        appointmentTime: selectedTime, // Store as string (e.g., "10:00 AM")
        status: 'pending',
        type: appointmentType,
        reason: reason,
        specialization: selectedDoctor.specialization,
        reasonCategory: reasonMeta.category,
        urgencyLevel: reasonMeta.urgencyLevel,
        priorityScore: reasonMeta.priorityScore,
        appointmentNumber: reasonMeta.appointmentNumber,
        recommendedSpecialties: reasonMeta.recommendations,
        triageNotes: reasonMeta.notes,
        isPriorityCase: reasonMeta.flaggedForPriority,
        triageMetadata: reasonMeta
      };

      console.log('Creating appointment with data:', appointmentData);
      
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

  const consultModesActive = consultModeFilter.physical || consultModeFilter.video;
  const hasActiveFilters =
    selectedSpecialization !== 'all' ||
    locationFilter !== 'all' ||
    ratingFilter !== 'all' ||
    experienceFilter !== 'all' ||
    feeRangeFilter !== 'all' ||
    genderFilter !== 'all' ||
    consultModesActive;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              {/* Healthcare Search Section - Compact */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Find Your Healthcare Provider</h2>
                
                {/* Search Bar - Compact Teal Theme */}
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <MagnifyingGlassIcon className="h-4 w-4 text-teal-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by doctor name, specialization, or medical condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder-gray-400 text-gray-900 font-medium"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`
                        relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300
                        ${showFilters 
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-500 hover:bg-teal-50'
                        }
                      `}
                    >
                      <FunnelIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                      <span className="sm:hidden">Filter</span>
                      {getActiveFilterCount() > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </button>
                    
                    <div className="relative w-full sm:w-auto sm:min-w-[200px]">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <AdjustmentsHorizontalIcon className="h-4 w-4 text-teal-600" />
                      </div>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-300 text-gray-700 pl-9 pr-8 py-2.5 rounded-lg text-sm font-semibold hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value} className="py-2">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                      className="border-t border-gray-200 pt-3 mt-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Specialization Filter */}
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            <div className="w-6 h-6 bg-teal-100 rounded-md flex items-center justify-center mr-1.5">
                              <AcademicCapIcon className="h-3.5 w-3.5 text-teal-600" />
                            </div>
                            Specialization
                          </label>
                          <select
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="appearance-none w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 pr-8 rounded-lg text-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer font-medium"
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
                          <label className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            <div className="w-6 h-6 bg-teal-100 rounded-md flex items-center justify-center mr-1.5">
                              <ClockIcon className="h-3.5 w-3.5 text-teal-600" />
                            </div>
                            Experience
                          </label>
                          <select
                            value={experienceFilter}
                            onChange={(e) => setExperienceFilter(e.target.value)}
                            className="appearance-none w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 pr-8 rounded-lg text-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer font-medium"
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
                          <label className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center mr-1.5">
                              <StarIcon className="h-3.5 w-3.5 text-amber-500" />
                            </div>
                            Rating
                          </label>
                          <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="appearance-none w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 pr-8 rounded-lg text-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer font-medium"
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
                          <label className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center mr-1.5">
                              <MapPinIcon className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="Enter city or area..."
                            value={locationFilter === 'all' ? '' : locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value || 'all')}
                            className="w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium placeholder-gray-400"
                          />
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
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
                            setConsultModeFilter({ physical: false, video: false });
                            setFeeRangeFilter('all');
                            setGenderFilter('all');
                          }}
                          className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Two Column Layout: Sidebar + Results */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar: Filters */}
                <div className="w-full lg:w-72 lg:flex-shrink-0">
                  <div className="bg-white rounded-lg border border-gray-200 p-5 lg:sticky lg:top-24">
                    {/* Filter Header */}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                      <button
                        onClick={() => {
                          setSelectedSpecialization('all');
                          setExperienceFilter('all');
                          setRatingFilter('all');
                          setLocationFilter('all');
                          setConsultModeFilter({ physical: false, video: false });
                          setFeeRangeFilter('all');
                          setGenderFilter('all');
                        }}
                        className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {selectedSpecialization !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                              {selectedSpecialization}
                              <button onClick={() => setSelectedSpecialization('all')} className="hover:bg-teal-200 rounded-full p-0.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {locationFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                              {locationFilter}
                              <button onClick={() => setLocationFilter('all')} className="hover:bg-teal-200 rounded-full p-0.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {ratingFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                              Rating {ratingOptions.find((option) => option.value === ratingFilter)?.label || ratingFilter}
                              <button onClick={() => setRatingFilter('all')} className="hover:bg-amber-200 rounded-full p-0.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {experienceFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              Experience {experienceOptions.find((option) => option.value === experienceFilter)?.label || experienceFilter}
                              <button onClick={() => setExperienceFilter('all')} className="hover:bg-blue-200 rounded-full p-0.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {feeRangeFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              Fee {feeOptions.find((option) => option.value === feeRangeFilter)?.label || feeRangeFilter}
                              <button onClick={() => setFeeRangeFilter('all')} className="hover:bg-purple-200 rounded-full p-0.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {genderFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                              {genderOptions.find((option) => option.value === genderFilter)?.label || genderFilter}
                              <button onClick={() => setGenderFilter('all')} className="hover:bg-rose-200 rounded-full p-0.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {consultModeFilter.physical && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                              In-person
                              <button
                                onClick={() => setConsultModeFilter((prev) => ({ ...prev, physical: false }))}
                                className="hover:bg-slate-200 rounded-full p-0.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                          {consultModeFilter.video && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                              Video consult
                              <button
                                onClick={() => setConsultModeFilter((prev) => ({ ...prev, video: false }))}
                                className="hover:bg-sky-200 rounded-full p-0.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mode of Consult */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Mode of Consult</h4>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={consultModeFilter.physical}
                            onChange={() =>
                              setConsultModeFilter((prev) => ({
                                ...prev,
                                physical: !prev.physical
                              }))
                            }
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Hospital Visit</span>
                        </label>
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={consultModeFilter.video}
                            onChange={() =>
                              setConsultModeFilter((prev) => ({
                                ...prev,
                                video: !prev.video
                              }))
                            }
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Online Consult</span>
                        </label>
                      </div>
                    </div>

                    {/* Experience Filter */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Experience (In Years)</h4>
                      <div className="space-y-2">
                        {experienceOptions.map(option => (
                          <label key={option.value} className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={experienceFilter === option.value}
                              onChange={() => setExperienceFilter(option.value === experienceFilter ? 'all' : option.value)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Rating</h4>
                      <div className="space-y-2">
                        {ratingOptions
                          .filter((option) => option.value !== 'all')
                          .map((option) => (
                            <label key={option.value} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={ratingFilter === option.value}
                                onChange={() =>
                                  setRatingFilter((prev) =>
                                    prev === option.value ? 'all' : option.value
                                  )
                                }
                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                            </label>
                          ))}
                      </div>
                    </div>

                    {/* Fees Filter */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Fees (In Rupees)</h4>
                      <div className="space-y-2">
                        {feeOptions
                          .filter((option) => option.value !== 'all')
                          .map((option) => (
                            <label key={option.value} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={feeRangeFilter === option.value}
                                onChange={() =>
                                  setFeeRangeFilter((prev) =>
                                    prev === option.value ? 'all' : option.value
                                  )
                                }
                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                            </label>
                          ))}
                      </div>
                    </div>

                    {/* Gender Filter */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Gender</h4>
                      <div className="space-y-2">
                        {genderOptions
                          .filter((option) => option.value !== 'all')
                          .map((option) => (
                            <label key={option.value} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={genderFilter === option.value}
                                onChange={() =>
                                  setGenderFilter((prev) =>
                                    prev === option.value ? 'all' : option.value
                                  )
                                }
                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Doctor Cards */}
                <div className="flex-1">
              <div className="space-y-4">
                {filteredDoctors.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 p-5 mb-4"
                  >
                    {/* Horizontal Layout */}
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Left: Doctor Photo */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          {doctor.profilePhoto ? (
                            <img
                              src={doctor.profilePhoto}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                              <UserIcon className="h-12 w-12 text-teal-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle: Doctor Info */}
                      <div className="flex-1 min-w-0">
                        {/* Doctor Name with Verification & Badges */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 cursor-pointer">
                            {doctor.name}
                          </h3>
                          {doctor.verified && (
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {/* Best Doctor Badge - Top by appointments & rating */}
                          {doctor.isBestDoctor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-sm">
                              ⭐ BEST
                            </span>
                          )}
                          {/* Top Rated Badge - High rating + sufficient reviews */}
                          {!doctor.isBestDoctor && doctor.averageRating >= 4.5 && doctor.totalReviews >= 10 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm">
                              Top Rated
                            </span>
                          )}
                          {/* Experienced Badge */}
                          {doctor.experience >= 10 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Experienced
                            </span>
                          )}
                        </div>
                        
                        {/* Specialization */}
                        <p className="text-gray-600 text-base mb-2">{doctor.specialization}</p>
                        
                        {/* Experience & Qualifications */}
                        {doctor.experience && (
                          <p className="text-sm text-blue-600 font-medium mb-2">
                            {doctor.experience} YEARS{doctor.qualifications ? ` • ${doctor.qualifications}` : ''}
                          </p>
                        )}

                        {/* Hospital/Clinic Address - Only show if provided */}
                        {doctor.hospital && (
                          <p className="text-sm text-gray-700 mb-2">
                            📍 {doctor.hospital}
                            {doctor.area && `, ${doctor.area}`}
                            {doctor.city && `, ${doctor.city}`}
                          </p>
                        )}

                        {/* Rating & Stats - Only show real data */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {(doctor.averageRating || doctor.totalReviews) && (
                            <div className="flex items-center gap-2">
                              {renderRatingStars(doctor.averageRating || 0)}
                              <span className="text-sm font-semibold text-gray-900">
                                {(doctor.averageRating || 0).toFixed(1)}
                              </span>
                              <span className="text-sm text-gray-600">
                                ({doctor.totalReviews || 0} {doctor.totalReviews === 1 ? 'review' : 'reviews'})
                              </span>
                            </div>
                          )}
                          {doctor.totalAppointments > 0 && (
                            <span className="text-sm text-gray-600">
                              • {doctor.totalAppointments} {doctor.totalAppointments === 1 ? 'patient' : 'patients'} treated
                            </span>
                          )}
                          {!doctor.averageRating && !doctor.totalReviews && !doctor.totalAppointments && (
                            <span className="text-sm text-gray-500 italic">
                              New doctor - No reviews yet
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Fee and Action */}
                      <div className="flex-shrink-0 flex flex-col items-end justify-between min-w-[260px]">
                        {/* Consultation Fee */}
                        <div className="text-right mb-4">
                          <p className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee || 700}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 w-full">
                          {/* View Reviews Button */}
                          <Link
                            to={`/doctor/${doctor.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-4 py-2 bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <StarIcon className="w-4 h-4" />
                            View Reviews
                          </Link>

                          {/* Visit Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoctor(doctor);
                              setStep(2);
                            }}
                            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <div className="font-bold">Visit Doctor</div>
                            <div className="text-xs font-normal opacity-90">
                              Available in {doctor.availableIn || '3 days'}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
                </div>
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
                    {selectedDoctor && (
                      <span className="ml-2 text-xs text-gray-500">
                        (Based on doctor's schedule)
                      </span>
                    )}
                  </label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading available slots...</span>
                    </div>
                  ) : timeSlots.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                      <ClockIcon className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-yellow-700 font-medium">No available slots for this date</p>
                      <p className="text-yellow-600 text-sm mt-1">
                        The doctor hasn't set their schedule for this day yet.
                      </p>
                    </div>
                  )}
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
              
              {/* Appointment Summary with Patient Info */}
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
                  <div>
                    <span className="text-gray-600">Patient Name:</span>
                    <p className="font-medium">{user?.displayName || user?.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Patient Email:</span>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                {appointmentType === 'physical' && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Fill Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {reasonSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => setReason(suggestion.value)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for this appointment..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {appointmentType === 'physical' && (
                  <div className="mt-4 bg-gradient-to-br from-teal-50 via-white to-sky-50 border border-teal-100 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Triage summary</p>
                        <h4 className="text-lg font-bold text-gray-900">{reasonInsights.category}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-teal-200 text-teal-700">
                          Urgency: {reasonInsights.urgencyLevel.charAt(0).toUpperCase() + reasonInsights.urgencyLevel.slice(1)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-blue-200 text-blue-700">
                          Priority Score: {reasonInsights.priorityScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{reasonInsights.notes}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {reasonInsights.recommendations.map((specialist) => (
                        <span key={specialist} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700">
                          Suggested: {specialist}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
                      <div>
                        Appointment number preview:{' '}
                        <span className="font-semibold text-gray-900">{reasonInsights.appointmentNumber}</span>
                      </div>
                      {reasonInsights.flaggedForPriority && (
                        <span className="text-rose-600 font-semibold">This visit will be flagged for priority triage.</span>
                      )}
                    </div>
                  </div>
                )}
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

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left mb-8">
                <p className="text-sm font-semibold text-blue-700 uppercase mb-1">Triage Details</p>
                <p className="text-lg font-bold text-gray-900 mb-1">Appointment Number: {reasonInsights.appointmentNumber}</p>
                <p className="text-sm text-gray-700 mb-1">
                  Urgency Level: <span className="font-semibold text-gray-900">{reasonInsights.urgencyLevel}</span>
                  {' '}• Priority Score: <span className="font-semibold text-gray-900">{reasonInsights.priorityScore}</span>
                </p>
                <p className="text-sm text-gray-600">{reasonInsights.notes}</p>
                <div className="mt-4">
                  <span className="text-gray-600 font-semibold">Patient Name:</span> <span className="text-gray-900">{user?.displayName || user?.email}</span><br />
                  <span className="text-gray-600 font-semibold">Patient Email:</span> <span className="text-gray-900">{user?.email}</span>
                </div>
              </div>

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