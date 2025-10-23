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
      <div className="container-hb py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('myAppointments')}
              </h1>
              <p className="text-gray-600">
                Manage and track all your medical appointments
              </p>
            </div>
            
            <Link
              to="/appointment/book"
              className="btn-hb-primary mt-4 sm:mt-0"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              {t('bookAppointment')}
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2
                  ${filter === option.key 
                    ? 'bg-hb-primary text-white shadow-hb-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <span>{option.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${filter === option.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No appointments yet' : `No ${filter} appointments`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Book your first appointment with our qualified doctors'
                  : `You don't have any ${filter} appointments at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/appointment/book"
                  className="btn-hb-primary"
                >
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  {t('bookAppointment')}
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
                className="card-hb-interactive"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-hb-primary rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {appointment.doctorName}
                        </h3>
                        <span className={getStatusBadge(appointment.status).class}>
                          {getStatusBadge(appointment.status).text}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{appointment.specialization}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <CalendarDaysIcon className="w-4 h-4 mr-1" />
                          {appointment.appointmentDate ? (
                            new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          ) : (
                            'Invalid Date'
                          )}
                        </span>
                        
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {appointment.appointmentTime || 'Time not set'}
                        </span>
                        
                        {appointment.appointmentType === 'video' && (
                          <span className="flex items-center text-green-600">
                            <VideoCameraIcon className="w-4 h-4 mr-1" />
                            Video Call
                          </span>
                        )}
                        
                        {appointment.appointmentType === 'phone' && (
                          <span className="flex items-center text-blue-600">
                            <PhoneIcon className="w-4 h-4 mr-1" />
                            Phone Call
                          </span>
                        )}
                        
                        {appointment.location && (
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {appointment.location}
                          </span>
                        )}
                      </div>
                      
                      {appointment.reasonForVisit && (
                        <div className="mt-2 text-sm text-gray-700">
                          <strong>Reason:</strong> {appointment.reasonForVisit}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end space-y-2">
                    <div className="flex items-center">
                      {getStatusIcon(appointment.status)}
                    </div>
                    
                    <div className="flex space-x-2">
                      {appointment.status === 'confirmed' && appointment.appointmentType === 'video' && (
                        <Link
                          to={`/video-call/${appointment.id}`}
                          className="btn-hb-secondary text-sm py-2 px-3"
                        >
                          <VideoCameraIcon className="w-4 h-4 mr-1" />
                          Join Call
                        </Link>
                      )}
                      
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
                        <EyeIcon className="w-4 h-4 mr-1 inline" />
                        Details
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
  );
};

export default PatientAppointments;