import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  StarIcon,
  ClockIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { toast } from 'react-hot-toast';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        setProfileUser({ id: userDoc.id, ...userDoc.data() });
      } else {
        toast.error('User not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const isOwnProfile = currentUser?.uid === userId;
  const isDoctor = profileUser?.role === 'doctor';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600 mb-6">This user profile could not be found.</p>
          <button onClick={() => navigate('/')} className="btn-hb-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = isDoctor 
    ? [
        { id: 'about', label: 'About', icon: UserIcon },
        { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
        { id: 'reviews', label: 'Reviews', icon: StarIcon },
        { id: 'availability', label: 'Availability', icon: CalendarIcon }
      ]
    : [
        { id: 'about', label: 'About', icon: UserIcon }
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-hb-primary">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="container-hb">
        <div className="relative -mt-32 pb-8">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-hb mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                  {profileUser.profilePhoto ? (
                    <img
                      src={profileUser.profilePhoto}
                      alt={profileUser.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-hb-primary flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Verified Badge */}
                {isDoctor && profileUser.verified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
                    <CheckBadgeIcon className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {isDoctor && 'Dr. '}{profileUser.displayName || 'User'}
                    </h1>
                    {isDoctor && profileUser.specialization && (
                      <p className="text-lg text-hb-primary font-medium mb-2">
                        {profileUser.specialization}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {profileUser.location && (
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {profileUser.location}
                        </span>
                      )}
                      
                      {isDoctor && profileUser.experience && (
                        <span className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {profileUser.experience} years experience
                        </span>
                      )}
                      
                      {profileUser.languages && profileUser.languages.length > 0 && (
                        <span className="flex items-center">
                          <GlobeAltIcon className="w-4 h-4 mr-1" />
                          {profileUser.languages.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    {isOwnProfile ? (
                      <Link to="/profile/settings" className="btn-hb-secondary">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    ) : (
                      <>
                        {isDoctor && (
                          <Link to="/appointment/book" className="btn-hb-primary">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Link>
                        )}
                        
                        <button className="btn-hb-secondary">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6">
                  {isDoctor && (
                    <>
                      <div className="flex items-center">
                        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                          <StarSolidIcon className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="font-semibold text-gray-900">
                            {profileUser.rating || '4.8'}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({profileUser.reviewCount || 156} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="font-semibold text-gray-900">
                          {profileUser.patientCount || 1234}
                        </span>
                        <span className="ml-1 text-sm">patients</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                        <span className="font-semibold text-gray-900">
                          {profileUser.appointmentCount || 567}
                        </span>
                        <span className="ml-1 text-sm">appointments</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-hb-primary text-hb-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Tab */}
              {activeTab === 'about' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Bio Section */}
                  {profileUser.bio && (
                    <div className="card-hb">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {isDoctor ? 'About the Doctor' : 'About'}
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {profileUser.bio}
                      </p>
                    </div>
                  )}

                  {/* Education (for doctors) */}
                  {isDoctor && profileUser.education && (
                    <div className="card-hb">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Education & Qualifications
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {profileUser.education}
                      </p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="card-hb">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {profileUser.email && (
                        <div className="flex items-center text-gray-700">
                          <EnvelopeIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>{profileUser.email}</span>
                        </div>
                      )}
                      
                      {profileUser.phone && (
                        <div className="flex items-center text-gray-700">
                          <PhoneIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>{profileUser.phone}</span>
                        </div>
                      )}
                      
                      {profileUser.address && (
                        <div className="flex items-center text-gray-700">
                          <MapPinIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>{profileUser.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Experience Tab (doctors only) */}
              {activeTab === 'experience' && isDoctor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card-hb"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Professional Experience
                  </h3>
                  {profileUser.workHistory && profileUser.workHistory.length > 0 ? (
                    <div className="space-y-4">
                      {profileUser.workHistory.map((work, index) => (
                        <div key={index} className="border-l-2 border-hb-primary pl-4">
                          <h4 className="font-semibold text-gray-900">{work.position}</h4>
                          <p className="text-gray-600">{work.hospital}</p>
                          <p className="text-sm text-gray-500">{work.duration}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {profileUser.experience} years of professional experience in {profileUser.specialization}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Reviews Tab (doctors only) */}
              {activeTab === 'reviews' && isDoctor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Review Summary */}
                  <div className="card-hb">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-4xl font-bold text-gray-900 mr-2">
                            {profileUser.rating || '4.8'}
                          </span>
                          <div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Math.floor(profileUser.rating || 4.8)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              Based on {profileUser.reviewCount || 156} reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <span className="text-sm text-gray-600 w-12">{rating} star</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {Math.floor(Math.random() * 50)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="card-hb">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">Patient Name</h4>
                            <span className="text-sm text-gray-500">2 weeks ago</span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-gray-700">
                            Excellent doctor! Very professional and caring. Took time to explain
                            everything and answered all my questions.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Availability Tab (doctors only) */}
              {activeTab === 'availability' && isDoctor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card-hb"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Availability Schedule
                  </h3>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{day}</span>
                        <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link to="/appointment/book" className="btn-hb-primary w-full">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Book an Appointment
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Consultation Types (doctors) */}
              {isDoctor && (
                <div className="card-hb">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Consultation Options
                  </h3>
                  <div className="space-y-3">
                    {(profileUser.consultationTypes || ['video', 'phone', 'clinic']).map((type) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {type === 'video' && <VideoCameraIcon className="w-5 h-5 text-blue-500 mr-2" />}
                          {type === 'phone' && <PhoneIcon className="w-5 h-5 text-green-500 mr-2" />}
                          {type === 'clinic' && <MapPinIcon className="w-5 h-5 text-purple-500 mr-2" />}
                          <span className="text-gray-900 capitalize">{type}</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          ₹{profileUser.consultationFee || 500}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="card-hb">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  {profileUser.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender</span>
                      <span className="text-gray-900 font-medium capitalize">{profileUser.gender}</span>
                    </div>
                  )}
                  
                  {profileUser.dateOfBirth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age</span>
                      <span className="text-gray-900 font-medium">
                        {new Date().getFullYear() - new Date(profileUser.dateOfBirth).getFullYear()} years
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-900 font-medium">
                      {profileUser.createdAt
                        ? new Date(profileUser.createdAt.toDate()).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Recently'}
                    </span>
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

export default UserProfile;