import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  UserCircleIcon,
  AcademicCapIcon,
  ClockIcon,
  LanguageIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchDoctorProfile();
    checkReviewEligibility();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const doctorDoc = await getDoc(doc(db, 'users', doctorId));
      
      if (doctorDoc.exists()) {
        setDoctor({ id: doctorDoc.id, ...doctorDoc.data() });
      } else {
        console.error('Doctor not found');
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = () => {
    // Check if user is a patient (not a doctor viewing their own profile)
    if (userProfile?.role === 'patient' && doctorId !== user?.uid) {
      setCanReview(true);
    }
  };

  const handleBookAppointment = () => {
    navigate('/patient/appointments/book', { state: { doctorId, doctorName: doctor?.displayName } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor Not Found</h2>
          <p className="text-slate-600 mb-4">The doctor profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Doctor Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {doctor.profilePhoto ? (
                <img
                  src={doctor.profilePhoto}
                  alt={doctor.displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-100">
                  <UserCircleIcon className="w-20 h-20 text-indigo-600" />
                </div>
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Dr. {doctor.displayName}
                  </h1>
                  {doctor.specialization && (
                    <p className="text-lg text-indigo-600 font-medium mb-3">
                      {doctor.specialization}
                    </p>
                  )}
                  
                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {doctor.experience && (
                      <div className="flex items-center gap-1">
                        <AcademicCapIcon className="w-4 h-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                    )}
                    {doctor.consultationFee && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">₹{doctor.consultationFee}</span>
                        <span>consultation fee</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {canReview && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleBookAppointment}
                      className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                    >
                      <CalendarIcon className="w-5 h-5" />
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctor.clinicAddress && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Clinic Address</p>
                  <p className="text-sm text-slate-600">{doctor.clinicAddress}</p>
                </div>
              </div>
            )}
            
            {doctor.consultationHours && (
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Consultation Hours</p>
                  <p className="text-sm text-slate-600">{doctor.consultationHours}</p>
                </div>
              </div>
            )}
            
            {doctor.languages && (
              <div className="flex items-start gap-3">
                <LanguageIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Languages</p>
                  <p className="text-sm text-slate-600">{doctor.languages}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          {doctor.bio && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">About</h3>
              <p className="text-slate-700 leading-relaxed">{doctor.bio}</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReviewList doctorId={doctorId} />
          </div>

          {/* Review Form Sidebar */}
          {canReview && (
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ReviewForm
                  doctorId={doctorId}
                  appointmentId={null}
                  onReviewSubmitted={() => {
                    // Refresh reviews
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
