import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  HeartIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  AcademicCapIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'patient',
    specialization: '',
    licenseNumber: '',
    experience: '',
    consultationFee: '',
    videoConsultationFee: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [focusedField, setFocusedField] = useState(null);
  
  const { signup, googleSignIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const specializations = [
    { value: 'general', label: 'General Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'gynecology', label: 'Gynecology' },
    { value: 'ent', label: 'ENT' },
    { value: 'ophthalmology', label: 'Ophthalmology' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (formData.role !== 'doctor') return true;
    
    const newErrors = {};
    
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required for doctors';
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Medical license number is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Years of experience is required';
    } else if (parseInt(formData.experience) < 0 || parseInt(formData.experience) > 50) {
      newErrors.experience = 'Please enter a valid number of years (0-50)';
    }
    
    if (!formData.consultationFee) {
      newErrors.consultationFee = 'Consultation fee is required';
    } else if (parseInt(formData.consultationFee) < 0) {
      newErrors.consultationFee = 'Fee must be a positive number';
    }
    
    if (!formData.videoConsultationFee) {
      newErrors.videoConsultationFee = 'Video consultation fee is required';
    } else if (parseInt(formData.videoConsultationFee) < 0) {
      newErrors.videoConsultationFee = 'Fee must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      if (formData.role === 'patient') {
        handleSubmit();
      } else {
        setCurrentStep(2);
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();
    
    if (!isStep1Valid || !isStep2Valid) {
      return;
    }

    try {
      setLoading(true);
      const result = await signup(formData);
      
      if (result.success) {
        toast.success('Welcome to CareConnect! Registration successful.', {
          icon: '🎉',
          style: {
            borderRadius: '12px',
            background: '#10b981',
            color: '#fff',
          },
        });
        
        if (formData.role === 'doctor') {
          navigate('/doctor/profile-setup');
        } else {
          navigate('/patient/dashboard');
        }
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await googleSignIn();
      
      if (result.success) {
        toast.success('Successfully signed in with Google!', {
          icon: '🎉',
        });
      } else {
        toast.error(result.error || 'Failed to sign in with Google.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 animate-gradient"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-400/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Logo & Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 mb-4 shadow-glow-green">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Join CareConnect
            </h1>
            <p className="text-gray-600">
              Start your healthcare journey today
            </p>
          </motion.div>

          {/* Signup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-glass p-8"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= 1 
                      ? 'bg-gradient-to-br from-secondary-500 to-primary-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > 1 ? <CheckCircleIcon className="w-6 h-6" /> : '1'}
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                    Basic Info
                  </span>
                </div>
                
                <div className={`flex-1 h-2 mx-4 rounded-full transition-all duration-500 ${
                  currentStep >= 2 ? 'bg-gradient-to-r from-secondary-500 to-primary-500' : 'bg-gray-200'
                }`}></div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= 2 
                      ? 'bg-gradient-to-br from-secondary-500 to-primary-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                    {formData.role === 'doctor' ? 'Professional' : 'Complete'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        I want to register as
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'patient', label: 'Patient', icon: UserIcon, description: 'Find doctors & book appointments' },
                          { value: 'doctor', label: 'Doctor', icon: AcademicCapIcon, description: 'Provide consultations' }
                        ].map((role) => {
                          const IconComponent = role.icon;
                          return (
                            <motion.button
                              key={role.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                              className={`relative p-5 text-left border-2 rounded-xl transition-all duration-200 ${
                                formData.role === role.value
                                  ? 'bg-gradient-to-br from-secondary-50 to-primary-50 border-primary-500 shadow-lg'
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  formData.role === role.value
                                    ? 'bg-gradient-to-br from-secondary-500 to-primary-500'
                                    : 'bg-gray-100'
                                }`}>
                                  <IconComponent className={`w-6 h-6 ${
                                    formData.role === role.value ? 'text-white' : 'text-gray-600'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{role.label}</div>
                                  <div className="text-xs text-gray-600 mt-1">{role.description}</div>
                                </div>
                              </div>
                              {formData.role === role.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center"
                                >
                                  <CheckCircleIcon className="w-5 h-5 text-white" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <UserIcon className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'name' ? 'text-primary-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <motion.input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`input pl-12 ${errors.name ? 'input-error' : ''}`}
                          placeholder="John Doe"
                          whileFocus={{ scale: 1.01 }}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email & Phone in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <EnvelopeIcon className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'email' ? 'text-primary-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <motion.input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`input pl-12 ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <PhoneIcon className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'phone' ? 'text-primary-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <motion.input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className={`input pl-12 ${errors.phone ? 'input-error' : ''}`}
                            placeholder="+1 (555) 000-0000"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.phone && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.phone}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Password & Confirm Password in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'password' ? 'text-primary-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <motion.input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={`input pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                            placeholder="Min. 6 characters"
                            whileFocus={{ scale: 1.01 }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                        <AnimatePresence>
                          {errors.password && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.password}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'confirmPassword' ? 'text-primary-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <motion.input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            className={`input pl-12 pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="Re-enter password"
                            whileFocus={{ scale: 1.01 }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                        <AnimatePresence>
                          {errors.confirmPassword && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.confirmPassword}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div>
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      <AnimatePresence>
                        {errors.acceptTerms && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.acceptTerms}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Next Button */}
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary w-full group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{formData.role === 'patient' ? 'Create Account' : 'Continue'}</span>
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/80 text-gray-500 backdrop-blur-sm">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    {/* Google Sign Up */}
                    <motion.button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 hover:shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </motion.button>
                  </motion.div>
                )}

                {currentStep === 2 && formData.role === 'doctor' && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Details</h3>
                      <p className="text-sm text-gray-600">Help patients find you with your medical credentials</p>
                    </div>

                    {/* Specialization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className={`select pl-12 ${errors.specialization ? 'input-error' : ''}`}
                        >
                          <option value="">Select your specialization</option>
                          {specializations.map(spec => (
                            <option key={spec.value} value={spec.value}>
                              {spec.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <AnimatePresence>
                        {errors.specialization && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.specialization}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* License Number & Experience in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medical License Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <IdentificationIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            className={`input pl-12 ${errors.licenseNumber ? 'input-error' : ''}`}
                            placeholder="MED-12345"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.licenseNumber && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.licenseNumber}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <motion.input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className={`input ${errors.experience ? 'input-error' : ''}`}
                          placeholder="5"
                          min="0"
                          max="50"
                          whileFocus={{ scale: 1.01 }}
                        />
                        <AnimatePresence>
                          {errors.experience && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.experience}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Consultation Fees in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          In-Person Consultation Fee ($)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <BanknotesIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleInputChange}
                            className={`input pl-12 ${errors.consultationFee ? 'input-error' : ''}`}
                            placeholder="50"
                            min="0"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.consultationFee && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.consultationFee}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video Consultation Fee ($)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <BanknotesIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="number"
                            name="videoConsultationFee"
                            value={formData.videoConsultationFee}
                            onChange={handleInputChange}
                            className={`input pl-12 ${errors.videoConsultationFee ? 'input-error' : ''}`}
                            placeholder="35"
                            min="0"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.videoConsultationFee && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.videoConsultationFee}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <motion.button
                        type="button"
                        onClick={handlePreviousStep}
                        className="btn-outline flex-1 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="btn-primary flex-1 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Create Account</span>
                        <CheckCircleIcon className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
