import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { appointmentServices } from '@/services/firebaseServices';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PatientAppointments = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, pending, cancelled

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentData = await appointmentServices.getUserAppointments(user.uid, 'patient');
      setAppointments(appointmentData || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-hb-warning', text: t('pending') },
      confirmed: { class: 'badge-hb-info', text: t('confirmed') },
      completed: { class: 'badge-hb-success', text: t('completed') },
      cancelled: { class: 'badge-hb-error', text: t('cancelled') },
      rejected: { class: 'badge-hb-error', text: t('rejected') }
    };
    return badges[status] || { class: 'badge-hb-info', text: status };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (!appointment.appointmentDate) return false;
      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= now && (appointment.status === 'confirmed' || appointment.status === 'pending');
    }
    return appointment.status === filter;
  });

  const filterOptions = [
    { key: 'all', label: 'All Appointments', count: appointments.length },
    { key: 'upcoming', label: 'Upcoming', count: appointments.filter(apt => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (!apt.appointmentDate) return false;
      const appointmentDate = new Date(apt.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= now && (apt.status === 'confirmed' || apt.status === 'pending');
    }).length },
    { key: 'completed', label: 'Completed', count: appointments.filter(apt => apt.status === 'completed').length },
    { key: 'pending', label: 'Pending', count: appointments.filter(apt => apt.status === 'pending').length },
    { key: 'cancelled', label: 'Cancelled', count: appointments.filter(apt => apt.status === 'cancelled' || apt.status === 'rejected').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your appointments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {t('myAppointments')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Manage and track all your medical appointments
              </p>
            </div>
            
            <Link
              to="/appointment/book"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-sm sm:text-base"
            >
              <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('bookAppointment')}</span>
            </Link>
          </div>

          {/* Filter Tabs - Ultra Compact Mobile */}
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`
                    flex-shrink-0 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-bold text-[10px] sm:text-sm transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap
                    ${filter === option.key 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  {/* Ultra short on mobile */}
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">
                    {option.key === 'all' ? 'All' : 
                     option.key === 'upcoming' ? 'Soon' :
                     option.key === 'completed' ? 'Done' :
                     option.key === 'pending' ? 'Wait' :
                     'Cncl'}
                  </span>
                  <span className={`
                    px-1 sm:px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold min-w-[18px] sm:min-w-[22px] text-center leading-none
                    ${filter === option.key 
                      ? 'bg-white/25 text-white' 
                      : 'bg-indigo-100 text-indigo-700'
                    }
                  `}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CalendarDaysIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                {filter === 'all' ? 'No appointments yet' : `No ${filter} appointments`}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                {filter === 'all' 
                  ? 'Book your first appointment with our qualified doctors'
                  : `You don't have any ${filter} appointments`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/appointment/book"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
                >
                  <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('bookAppointment')}</span>
                </Link>
              )}
            </motion.div>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 hover:shadow-md transition-shadow"
              >
                {/* Compact Mobile Layout */}
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Header: Doctor Info + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 leading-tight">
                          Dr. {appointment.doctorName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">{appointment.specialization}</p>
                      </div>
                    </div>
                    
                    <span className={`${getStatusBadge(appointment.status).class} flex-shrink-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                      {getStatusBadge(appointment.status).text}
                    </span>
                  </div>
                  
                  {/* Appointment Details - Compact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-700">
                      <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                      <span className="font-medium truncate">
                        {appointment.appointmentDate ? (
                          new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        ) : (
                          'Date TBD'
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-700">
                      <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                      <span className="font-medium">{appointment.appointmentTime || 'Time TBD'}</span>
                    </div>
                    
                    {appointment.appointmentType && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                        {appointment.appointmentType === 'video' ? (
                          <>
                            <VideoCameraIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                            <span className="font-medium text-green-700 truncate">Video Call</span>
                          </>
                        ) : appointment.appointmentType === 'phone' ? (
                          <>
                            <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-blue-700 truncate">Phone Call</span>
                          </>
                        ) : (
                          <>
                            <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                            <span className="font-medium text-purple-700 truncate">In-Person</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    {appointment.location && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 sm:col-span-2">
                        <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                        <span className="font-medium truncate">{appointment.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Reason for Visit */}
                  {appointment.reasonForVisit && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        <span className="font-semibold text-gray-900">Reason:</span>{' '}
                        {appointment.reasonForVisit}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Buttons - Compact Mobile */}
                  <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
                    {/* View Reviews Button - Always Visible */}
                    {appointment.doctorId && (
                      <Link
                        to={`/doctor/${appointment.doctorId}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-all shadow-sm hover:shadow-md"
                      >
                        <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Reviews</span>
                      </Link>
                    )}
                    
                    {/* Video Call Button */}
                    {appointment.status === 'confirmed' && appointment.appointmentType === 'video' && (
                      <Link
                        to={`/video-call/${appointment.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors shadow-sm"
                      >
                        <VideoCameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Join Call</span>
                      </Link>
                    )}
                    
                    {/* Details Button */}
                    <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors">
                      <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;