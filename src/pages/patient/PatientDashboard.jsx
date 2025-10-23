import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentServices } from '../../services/firebaseServices';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const PatientDashboard = () => {
  const { user, userProfile, hasPremium, canAccessFeature } = useAuth();
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
      now.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
      
      const stats = {
        totalAppointments: appointmentData.length,
        upcomingAppointments: appointmentData.filter(apt => {
          // Parse the appointment date
          const aptDate = new Date(apt.appointmentDate);
          aptDate.setHours(0, 0, 0, 0);
          // Include confirmed and pending appointments that are in the future
          return aptDate >= now && (apt.status === 'confirmed' || apt.status === 'pending');
        }).length,
        completedAppointments: appointmentData.filter(apt => apt.status === 'completed').length,
        pendingAppointments: appointmentData.filter(apt => apt.status === 'pending').length
      };
      
      console.log('Appointment Stats:', stats);
      console.log('All Appointments:', appointmentData);
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold',
      confirmed: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold',
      completed: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold',
      cancelled: 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold',
      rejected: 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold';
  };

  const quickActions = [
    {
      name: 'My Appointments',
      description: 'View and manage your appointments',
      icon: CalendarDaysIcon,
      href: '/patient/appointments',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      premium: false
    },
    {
      name: 'Book Appointment',
      description: 'Schedule with available doctors',
      icon: CalendarDaysIcon,
      href: '/appointment/book',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      premium: false
    },
    {
      name: 'Video Call',
      description: 'Start instant video consultation',
      icon: VideoCameraIcon,
      href: '/video-call',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      premium: true
    },
    {
      name: 'My Profile',
      description: 'Manage your personal information',
      icon: UserIcon,
      href: '/patient/profile',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      premium: false
    },
    {
      name: 'AI Assistant',
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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {userProfile?.name || user?.displayName || 'Patient'}! 👋
              </h1>
              <p className="text-gray-600">
                Today: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {!hasPremium && (
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className={`bg-white rounded-xl shadow-md p-6 border-2 ${stat.borderColor} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <ArrowTrendingUpIcon className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const isDisabled = action.premium && !canAccessFeature(action.href);
                  
                  return (
                    <Link
                      key={action.name}
                      to={isDisabled ? '/pricing' : action.href}
                      className={`
                        block p-6 rounded-xl border-2 border-transparent transition-all relative
                        ${isDisabled 
                          ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                          : 'bg-white hover:border-gray-200 shadow-sm hover:shadow-md'
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
                      
                      <div className="flex items-center text-sm font-medium text-blue-600">
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
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
                <Link
                  to="/patient/appointments"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View All
                  <EyeIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Dr. {appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialization}</p>
                      </div>
                      <span className={getStatusBadge(appointment.status)}>
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
                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="text-center py-8">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No appointments yet</p>
                    <Link
                      to="/appointment/book"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Book your first appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-md p-6 border-2 border-teal-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-md">
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
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
