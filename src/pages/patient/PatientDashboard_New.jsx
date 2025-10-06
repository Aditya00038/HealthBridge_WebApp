import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  EyeIcon,
  SparklesIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { appointmentServices } from '@/services/firebaseServices';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PatientDashboard = () => {
  const { user, userProfile, hasPremium, canAccessFeature } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentData = await appointmentServices.getUserAppointments(user.uid, 'patient');
      setAppointments(appointmentData);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const stats = {
        totalAppointments: appointmentData.length,
        upcomingAppointments: appointmentData.filter(apt => 
          new Date(apt.appointmentDate) >= today && apt.status === 'confirmed'
        ).length,
        completedAppointments: appointmentData.filter(apt => apt.status === 'completed').length,
        pendingAppointments: appointmentData.filter(apt => apt.status === 'pending').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-hb-warning',
      confirmed: 'badge-hb-info',
      completed: 'badge-hb-success',
      cancelled: 'badge-hb-error',
      rejected: 'badge-hb-error'
    };
    return badges[status] || 'badge-hb-info';
  };

  const quickActions = [
    {
      name: t('bookAppointment'),
      description: 'Schedule with available doctors',
      icon: CalendarDaysIcon,
      href: '/appointment/book',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      premium: false
    },
    {
      name: t('videoCall'),
      description: 'Start instant video consultation',
      icon: VideoCameraIcon,
      href: '/video-call',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      premium: true
    },
    {
      name: t('aiAssistant'),
      description: 'Get AI-powered health insights',
      icon: ChatBubbleLeftRightIcon,
      href: '/chatbot',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      premium: false
    }
  ];

  const statCards = [
    {
      name: 'Total Appointments',
      value: stats.totalAppointments,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      name: 'Completed',
      value: stats.completedAppointments,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Pending',
      value: stats.pendingAppointments,
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('welcomeUser')}, {userProfile?.name || user?.displayName || 'Patient'}! 👋
              </h1>
              <p className="text-gray-600">
                {t('today')}: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {!hasPremium && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-4 sm:mt-0"
              >
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-hb-md hover:shadow-hb-lg transition-all duration-200"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className={`card-hb-interactive ${stat.bgColor} ${stat.borderColor} border-2`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card-hb">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('quickActions')}</h2>
                <ArrowTrendingUpIcon className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const isDisabled = action.premium && !canAccessFeature(action.href);
                  
                  return (
                    <motion.div
                      key={action.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                    >
                      <Link
                        to={isDisabled ? '/pricing' : action.href}
                        className={`
                          block p-6 rounded-xl border-2 border-transparent transition-all duration-200 relative
                          ${isDisabled 
                            ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                            : 'bg-white hover:border-gray-200 shadow-hb hover:shadow-hb-md'
                          }
                        `}
                      >
                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          {action.name}
                          {action.premium && (
                            <SparklesIcon className="w-4 h-4 text-amber-500 ml-2" />
                          )}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                        
                        <div className="flex items-center text-sm font-medium text-hb-primary">
                          {isDisabled ? 'Upgrade Required' : 'Get Started'}
                          <PlusIcon className="w-4 h-4 ml-1" />
                        </div>
                        
                        {action.premium && !hasPremium && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                              Premium
                            </div>
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card-hb">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('recentAppointments')}</h2>
                <Link
                  to="/patient/appointments"
                  className="text-hb-primary hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View All
                  <EyeIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-hb transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Dr. {appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialization}</p>
                      </div>
                      <span className={`${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {appointment.appointmentTime}
                      </span>
                    </div>
                    
                    {appointment.appointmentType === 'video' && (
                      <div className="mt-3 flex items-center text-sm text-green-600">
                        <VideoCameraIcon className="w-4 h-4 mr-1" />
                        Video Consultation
                      </div>
                    )}
                  </motion.div>
                ))}

                {appointments.length === 0 && (
                  <div className="text-center py-8">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No appointments yet</p>
                    <Link
                      to="/appointment/book"
                      className="text-hb-primary hover:text-blue-700 font-medium"
                    >
                      Book your first appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Health Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <div className="card-hb bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-hb">
                <HeartIcon className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Health Tip</h3>
                <p className="text-gray-700 mb-4">
                  Stay hydrated! Drinking 8 glasses of water daily helps maintain your body's functions, 
                  improves skin health, and boosts your energy levels.
                </p>
                <div className="flex items-center text-sm text-teal-700">
                  <StarIcon className="w-4 h-4 mr-1" />
                  Recommended by our medical team
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;