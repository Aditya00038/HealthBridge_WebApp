import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doctorServices } from '../services/firebaseServices';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  UserIcon,
  AcademicCapIcon,
  IdentificationIcon,
  ClockIcon,
  BanknotesIcon,
  LanguageIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DoctorProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    displayName: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    education: '',
    bio: '',
    consultationFee: '',
    videoConsultationFee: '',
    languages: [],
    clinicAddress: '',
    profilePhoto: null,
    profilePhotoURL: '',
    bannerPhoto: null,
    bannerPhotoURL: '',
    workingHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '13:00', available: false }
    },
    emergencyAvailable: false
  });

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Gynecology',
    'Ophthalmology',
    'ENT (Ear, Nose, Throat)',
    'Endocrinology',
    'Gastroenterology'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Hindi',
    'Arabic',
    'Russian'
  ];

  useEffect(() => {
    if (user) {
      // Pre-fill with user data if available
      setProfileData(prev => ({
        ...prev,
        displayName: user.displayName || ''
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (field, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          [field]: file,
          [`${field}URL`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const handleLanguageToggle = (language) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (!profileData.displayName || !profileData.specialization || !profileData.licenseNumber) {
          toast.error('Please fill in all required basic information fields');
          return false;
        }
        if (!profileData.profilePhotoURL || !profileData.bannerPhotoURL) {
          toast.error('Profile photo and banner image are required');
          return false;
        }
        return true;
      case 2:
        if (!profileData.experience || !profileData.education || !profileData.bio) {
          toast.error('Please fill in all professional details');
          return false;
        }
        return true;
      case 3:
        if (!profileData.consultationFee || !profileData.videoConsultationFee) {
          toast.error('Please enter consultation fees');
          return false;
        }
        if (profileData.languages.length === 0) {
          toast.error('Please select at least one language');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const completeProfile = {
        ...profileData,
        consultationFee: parseFloat(profileData.consultationFee),
        videoConsultationFee: parseFloat(profileData.videoConsultationFee),
        experience: profileData.experience + ' years'
      };

      await doctorServices.createDoctorProfile(user.uid, completeProfile);
      
      toast.success('Profile created successfully! You are now available for patient appointments.');
      navigate('/doctor/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Doctor Profile</h1>
          <p className="text-gray-600">Help patients find and connect with you by completing your professional profile</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Professional' },
              { num: 3, label: 'Consultation' },
              { num: 4, label: 'Review' }
            ].map((stepItem, index) => (
              <div key={stepItem.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${step >= stepItem.num 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {stepItem.num === 4 && step >= 4 ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : step > stepItem.num ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      stepItem.num
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= stepItem.num ? 'text-teal-600' : 'text-gray-500'}`}>
                    {stepItem.label}
                  </span>
                </div>
                {stepItem.num < 4 && (
                  <div className={`w-16 h-1 mx-4 transition-all duration-300 ${step > stepItem.num ? 'bg-gradient-to-r from-teal-600 to-cyan-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <select
                    value={profileData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number *
                  </label>
                  <div className="relative">
                    <IdentificationIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MD-123456"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Address
                  </label>
                  <input
                    type="text"
                    value={profileData.clinicAddress}
                    onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Medical Center Dr, City, State"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="mt-8 space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CameraIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Profile Images *
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload your professional photo and banner image. These are required to help patients recognize you.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Photo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Profile Photo * 
                        <span className="text-xs text-red-600 ml-1">(Required)</span>
                      </label>
                      <div className="relative">
                        {profileData.profilePhotoURL ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                            <img
                              src={profileData.profilePhotoURL}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleInputChange('profilePhotoURL', '')}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                            <div className="flex flex-col items-center justify-center py-8">
                              <CameraIcon className="h-12 w-12 text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600 font-medium mb-1">Upload Profile Photo</p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload('profilePhoto', e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Banner Photo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Banner Image * 
                        <span className="text-xs text-red-600 ml-1">(Required)</span>
                      </label>
                      <div className="relative">
                        {profileData.bannerPhotoURL ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                            <img
                              src={profileData.bannerPhotoURL}
                              alt="Banner Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleInputChange('bannerPhotoURL', '')}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                            <div className="flex flex-col items-center justify-center py-8">
                              <CameraIcon className="h-12 w-12 text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600 font-medium mb-1">Upload Banner Image</p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload('bannerPhoto', e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {(!profileData.profilePhotoURL || !profileData.bannerPhotoURL) && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Required Images Missing</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Both profile photo and banner image are required to proceed. These help patients identify and trust your profile.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Professional Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <div className="relative">
                      <ClockIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education *
                    </label>
                    <div className="relative">
                      <AcademicCapIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MD from Harvard Medical School"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell patients about your expertise, approach to care, and what makes you unique..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Consultation & Languages */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Consultation Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In-Person Consultation Fee ($) *
                    </label>
                    <div className="relative">
                      <BanknotesIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.consultationFee}
                        onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="75"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Consultation Fee ($) *
                    </label>
                    <div className="relative">
                      <BanknotesIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.videoConsultationFee}
                        onChange={(e) => handleInputChange('videoConsultationFee', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="60"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken * (Select at least one)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languages.map(language => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.languages.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Profile</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Name:</span>
                    <p className="text-gray-600">{profileData.displayName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Specialization:</span>
                    <p className="text-gray-600">{profileData.specialization}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Experience:</span>
                    <p className="text-gray-600">{profileData.experience} years</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">License:</span>
                    <p className="text-gray-600">{profileData.licenseNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">In-Person Fee:</span>
                    <p className="text-gray-600">${profileData.consultationFee}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Video Fee:</span>
                    <p className="text-gray-600">${profileData.videoConsultationFee}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Languages:</span>
                  <p className="text-gray-600">{profileData.languages.join(', ')}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Bio:</span>
                  <p className="text-gray-600">{profileData.bio}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Instant Approval</span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Your profile will be instantly approved upon submission! You'll be immediately available for patient appointments 
                  and can start providing consultations right away.
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-300"
              >
                ← Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(step)}
                  className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      Complete Profile Setup
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileSetup;