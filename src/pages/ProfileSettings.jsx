import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  DevicePhoneMobileIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

const ProfileSettings = () => {
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  
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
    privacy: 'public'
  });

  const profilePageHref = userProfile?.role === 'doctor'
    ? (user?.uid ? `/profile/${user.uid}` : '/profile/settings')
    : '/patient/profile';

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
        privacy: userProfile.settings?.privacy || 'public'
      });
    }
  }, [userProfile, user, currentLanguage]);

  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out from settings:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  };

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

  const cardBaseClasses = 'rounded-3xl border border-slate-200 bg-white shadow-soft';
  const cardContentClasses = `${cardBaseClasses} p-6`;
  const inputControlClasses = 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition';
  const textAreaControlClasses = `${inputControlClasses} min-h-[120px]`;
  const readOnlyPillClasses = 'flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 whitespace-pre-wrap';
  const primaryActionClasses = 'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-semibold px-4 py-2.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-60 disabled:cursor-not-allowed';
  const iconConfirmClasses = 'inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-60';
  const iconNeutralClasses = 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition';
  const toggleInputClasses = 'w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded';

  const ProfileField = ({ field, label, type = 'text', options = null }) => {
    const isEditing = editingField === field;
    const isMultiline = type === 'textarea';
    const fieldWrapperClasses = isMultiline
      ? 'flex flex-col md:flex-row md:items-start gap-3'
      : 'flex flex-wrap items-center gap-3';
    const readOnlyClasses = isMultiline
      ? `${readOnlyPillClasses} min-h-[3.5rem]`
      : `${readOnlyPillClasses} min-h-[2.75rem] flex items-center`;
    
    // Local state for editing - prevents parent re-render on every keystroke
    const [editValue, setEditValue] = React.useState(profileData[field] || '');
    
    // Update local state when entering edit mode
    React.useEffect(() => {
      if (isEditing) {
        setEditValue(profileData[field] || '');
      }
    }, [isEditing, profileData, field]);
    
    const handleSave = async () => {
      // Update parent state with the edited value
      handleInputChange(field, editValue);
      await handleSaveField(field);
    };
    
    const handleCancel = () => {
      setEditValue(profileData[field] || '');
      setEditingField(null);
    };
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <div className={fieldWrapperClasses}>
          {isEditing ? (
            <>
              {type === 'select' ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={inputControlClasses}
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
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={textAreaControlClasses}
                  rows="3"
                  autoFocus
                />
              ) : (
                <input
                  type={type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={inputControlClasses}
                  autoFocus
                />
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className={iconConfirmClasses}
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className={iconNeutralClasses}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className={readOnlyClasses}>
                {profileData[field] || <span className="text-slate-400">Not set</span>}
              </div>
              <button
                onClick={() => setEditingField(field)}
                className={iconNeutralClasses}
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
  <div className="min-h-screen bg-slate-50">
      <div className="container-hb py-8 px-4 sm:px-6 lg:px-8">
        <div>
          {/* Simple Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Profile Settings
              </h1>
              <p className="text-slate-600 text-sm">
                Manage your profile information and preferences
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors disabled:opacity-60"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              {logoutLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>

          {/* Simple 3-line Quick Link */}
          <div className="mb-6">
            <Link
              to={profilePageHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span className="font-medium">View Profile Page</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simple Profile Photo Section */}
            <div className="lg:col-span-1">
              <div className={`${cardContentClasses} text-center`}>
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto">
                    {profileData.profilePhoto ? (
                      <img
                        src={profileData.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-500">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {photoUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                    <CameraIcon className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={photoUploading}
                    />
                  </label>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {profileData.displayName || 'User'}
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  {profileData.email}
                </p>
                <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                  {userProfile?.role === 'doctor' ? 'Doctor' : 'Patient'}
                </span>
                
                {userProfile?.role === 'doctor' && profileData.specialization && (
                  <p className="text-sm text-slate-600 mt-3">
                    {profileData.specialization}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-4">
              {/* Simple Basic Information */}
              <div className={cardContentClasses}>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-500" />
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

              {/* Simple Professional Information (for doctors) */}
              {userProfile?.role === 'doctor' && (
                <div className={cardContentClasses}>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-500" />
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

              {/* Simple Settings */}
              <div className={cardContentClasses}>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-teal-500" />
                  Preferences & Settings
                </h3>
                <div className="space-y-6">
                  {/* Language Setting */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <GlobeAltIcon className="w-4 h-4 inline mr-1" />
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className={`${inputControlClasses} max-w-xs`}
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
                    <h4 className="font-medium text-slate-900">Notifications</h4>
                    
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
                            className={toggleInputClasses}
                          />
                          <setting.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{setting.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Setting */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy}
                      onChange={(e) => handleSettingChange('privacy', e.target.value)}
                      className={`${inputControlClasses} max-w-xs`}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="limited">Limited</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className={primaryActionClasses}
                    >
                      {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default ProfileSettings;
