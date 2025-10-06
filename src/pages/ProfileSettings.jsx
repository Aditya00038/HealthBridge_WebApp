import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

const ProfileSettings = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    bio: '',
    specialization: '',
    experience: '',
    education: '',
    languages: [],
    profilePhoto: null
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    promotionalEmails: false,
    language: currentLanguage,
    theme: 'light',
    privacy: 'public'
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        displayName: userProfile.displayName || user?.displayName || '',
        email: userProfile.email || user?.email || '',
        phone: userProfile.phone || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || '',
        address: userProfile.address || '',
        emergencyContact: userProfile.emergencyContact || '',
        bio: userProfile.bio || '',
        specialization: userProfile.specialization || '',
        experience: userProfile.experience || '',
        education: userProfile.education || '',
        languages: userProfile.languages || [],
        profilePhoto: userProfile.profilePhoto || null
      });
      
      setSettings({
        emailNotifications: userProfile.settings?.emailNotifications ?? true,
        smsNotifications: userProfile.settings?.smsNotifications ?? false,
        appointmentReminders: userProfile.settings?.appointmentReminders ?? true,
        promotionalEmails: userProfile.settings?.promotionalEmails ?? false,
        language: userProfile.settings?.language || currentLanguage,
        theme: userProfile.settings?.theme || 'light',
        privacy: userProfile.settings?.privacy || 'public'
      });
    }
  }, [userProfile, user, currentLanguage]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    if (setting === 'language') {
      changeLanguage(value);
    }
  };

  const handleSaveField = async (field) => {
    try {
      setLoading(true);
      const updatedProfile = {
        ...userProfile,
        [field]: profileData[field],
        // For displayName, also update as 'name' for Firebase compatibility
        ...(field === 'displayName' && { name: profileData[field] })
      };
      
      await updateUserProfile(updatedProfile);
      setEditingField(null);
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const updatedProfile = {
        ...userProfile,
        settings: settings
      };
      
      await updateUserProfile(updatedProfile);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      setPhotoUploading(true);
      
      // Create a preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file);
      setProfileData(prev => ({
        ...prev,
        profilePhoto: previewUrl
      }));

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user profile with the new photo URL
      const updatedProfile = {
        ...userProfile,
        profilePhoto: downloadURL
      };
      
      await updateUserProfile(updatedProfile);
      
      // Update local state with the actual URL
      setProfileData(prev => ({
        ...prev,
        profilePhoto: downloadURL
      }));
      
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
      
      // Revert to previous photo on error
      setProfileData(prev => ({
        ...prev,
        profilePhoto: userProfile?.profilePhoto || null
      }));
    } finally {
      setPhotoUploading(false);
    }
  };

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    hi: 'हिंदी',
    mr: 'मराठी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    bn: 'বাংলা',
    gu: 'ગુજરાતી',
    pa: 'ਪੰਜਾਬੀ'
  };

  const ProfileField = ({ field, label, type = 'text', options = null }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              {type === 'select' ? (
                <select
                  value={profileData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="input-hb flex-1"
                >
                  <option value="">Select {label}</option>
                  {options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : type === 'textarea' ? (
                <textarea
                  value={profileData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="input-hb flex-1"
                  rows="3"
                />
              ) : (
                <input
                  type={type}
                  value={profileData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="input-hb flex-1"
                />
              )}
              <button
                onClick={() => handleSaveField(field)}
                disabled={loading}
                className="btn-hb-primary py-2 px-3"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="btn-hb-secondary py-2 px-3"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 py-2 px-3 bg-gray-50 rounded-lg min-h-[2.5rem] flex items-center">
                {profileData[field] || <span className="text-gray-400">Not set</span>}
              </div>
              <button
                onClick={() => setEditingField(field)}
                className="btn-hb-secondary py-2 px-3"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-hb py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your profile information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo Section */}
            <div className="lg:col-span-1">
              <div className="card-hb text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto relative">
                    {profileData.profilePhoto ? (
                      <img
                        src={profileData.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-hb-primary">
                        <UserIcon className="w-16 h-16 text-white" />
                      </div>
                    )}
                    {photoUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-hb-primary hover:bg-hb-primary-dark text-white p-2 rounded-full cursor-pointer transition-colors">
                    <CameraIcon className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={photoUploading}
                    />
                  </label>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {profileData.displayName || 'User'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {userProfile?.role === 'doctor' ? 'Doctor' : 'Patient'}
                </p>
                
                {userProfile?.role === 'doctor' && profileData.specialization && (
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block">
                    {profileData.specialization}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card-hb">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    field="displayName"
                    label="Full Name"
                    type="text"
                  />
                  
                  <ProfileField
                    field="phone"
                    label="Phone Number"
                    type="tel"
                  />
                  
                  <ProfileField
                    field="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                  />
                  
                  <ProfileField
                    field="gender"
                    label="Gender"
                    type="select"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                  
                  <div className="md:col-span-2">
                    <ProfileField
                      field="address"
                      label="Address"
                      type="textarea"
                    />
                  </div>
                  
                  <ProfileField
                    field="emergencyContact"
                    label="Emergency Contact"
                    type="tel"
                  />
                </div>
              </div>

              {/* Professional Information (for doctors) */}
              {userProfile?.role === 'doctor' && (
                <div className="card-hb">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Professional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                      field="specialization"
                      label="Specialization"
                      type="text"
                    />
                    
                    <ProfileField
                      field="experience"
                      label="Years of Experience"
                      type="number"
                    />
                    
                    <div className="md:col-span-2">
                      <ProfileField
                        field="education"
                        label="Education & Qualifications"
                        type="textarea"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <ProfileField
                        field="bio"
                        label="Professional Bio"
                        type="textarea"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="card-hb">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BellIcon className="w-5 h-5 mr-2" />
                  Preferences & Settings
                </h3>
                
                <div className="space-y-6">
                  {/* Language Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <GlobeAltIcon className="w-4 h-4 inline mr-1" />
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="input-hb max-w-xs"
                    >
                      {availableLanguages.map(lang => (
                        <option key={lang} value={lang}>
                          {languageNames[lang] || lang.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Notifications</h4>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', icon: BellIcon },
                        { key: 'smsNotifications', label: 'SMS Notifications', icon: DevicePhoneMobileIcon },
                        { key: 'appointmentReminders', label: 'Appointment Reminders', icon: BellIcon },
                        { key: 'promotionalEmails', label: 'Promotional Emails', icon: BellIcon }
                      ].map(setting => (
                        <label key={setting.key} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                            className="w-4 h-4 text-hb-primary focus:ring-hb-primary border-gray-300 rounded"
                          />
                          <setting.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{setting.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy}
                      onChange={(e) => handleSettingChange('privacy', e.target.value)}
                      className="input-hb max-w-xs"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="limited">Limited</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="btn-hb-primary"
                    >
                      {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;