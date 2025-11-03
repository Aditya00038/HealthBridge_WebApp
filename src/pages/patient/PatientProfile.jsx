import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ClockIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PatientProfile = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: ''
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        displayName: userProfile.displayName || user?.displayName || '',
        email: user?.email || '',
        phone: userProfile.phone || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || '',
        bloodGroup: userProfile.bloodGroup || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        zipCode: userProfile.zipCode || '',
        emergencyContact: userProfile.emergencyContact || '',
        emergencyPhone: userProfile.emergencyPhone || '',
        medicalHistory: userProfile.medicalHistory || '',
        allergies: userProfile.allergies || '',
        currentMedications: userProfile.currentMedications || ''
      });
    }
  }, [userProfile, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const result = await updateProfile(profileData);
      if (result?.success) {
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600">Manage your personal information and medical records</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {/* Profile Photo */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={profileData.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-0 right-1/2 transform translate-x-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:scale-110">
                  <CameraIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{profileData.displayName}</h2>
                <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  {profileData.email}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">Member Since</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <HeartIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Blood Group</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileData.bloodGroup || 'Not Set'}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">Account Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Detailed Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              {/* Edit Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Form Sections */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={profileData.bloodGroup}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-blue-600" />
                    Address Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="New York"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="NY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={profileData.zipCode}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="10001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-red-600" />
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={profileData.emergencyPhone}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="+1 (555) 987-6543"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <HeartIcon className="w-5 h-5 text-red-600" />
                    Medical Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                      <textarea
                        name="medicalHistory"
                        value={profileData.medicalHistory}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={3}
                        placeholder="Previous surgeries, chronic conditions, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                      <textarea
                        name="allergies"
                        value={profileData.allergies}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={2}
                        placeholder="Penicillin, peanuts, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                      <textarea
                        name="currentMedications"
                        value={profileData.currentMedications}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={2}
                        placeholder="List of medications you're currently taking"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
