import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  VideoCameraIcon, 
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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentServices } from '../../services/firebaseServices';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { healthTips } from '../../assets/healthTips';

const parseTimeToMinutes = (timeString = '') => {
  if (!timeString.includes(':')) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [timePart, meridiemRaw] = timeString.split(' ');
  const [hoursRaw, minutesRaw] = timePart.split(':');
  let hours = parseInt(hoursRaw, 10);
  const minutes = parseInt(minutesRaw, 10) || 0;
  const meridiem = (meridiemRaw || '').toUpperCase();

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const normaliseDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && typeof value.seconds === 'number') {
    const milliseconds = value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1_000_000);
    return new Date(milliseconds);
  }
  return null;
};

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
      name: 'Book Appointment',
      description: 'Schedule with available doctors',
      icon: CalendarDaysIcon,
      href: '/appointment/book',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      premium: false
    },
    {
      name: 'Video Calls',
      description: 'Manage virtual consultations',
      icon: VideoCameraIcon,
      href: '/patient/video-appointments',
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      premium: false
    },
    {
      name: 'My Appointments',
      description: 'View and manage your appointments',
      icon: CalendarDaysIcon,
      href: '/patient/appointments',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      premium: false
    },
    {
      name: 'My Prescriptions',
      description: 'View all doctor prescriptions',
      icon: ClockIcon,
      href: '/patient/prescriptions',
      color: 'bg-gradient-to-r from-violet-500 to-purple-600',
      premium: false
    },
    {
      name: 'Locate Care',
      description: 'Find nearby hospitals and clinics',
      icon: MapPinIcon,
      href: '/locate',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      premium: false
    },
    {
      name: 'AI Assistant',
      description: 'Chat with Healthcare AI support',
      icon: ChatBubbleLeftRightIcon,
      href: '/chatbot',
      color: 'bg-gradient-to-r from-fuchsia-500 to-purple-600',
      premium: false
    },
    {
      name: 'My Profile',
      description: 'Manage your personal information',
      icon: UserIcon,
      href: '/patient/profile',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
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

  const appointmentTimeline = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const horizon = new Date(today);
    horizon.setDate(horizon.getDate() + 7);

    const groups = new Map();

    appointments.forEach((appointment) => {
      if (!appointment.appointmentDate) {
        return;
      }

      const date = normaliseDateValue(appointment.appointmentDate);
      if (!date) {
        return;
      }

      date.setHours(0, 0, 0, 0);
      if (date < today || date > horizon) {
        return;
      }

      const key = date.toISOString().split('T')[0];
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          date,
          label: date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          }),
          items: []
        });
      }

      groups.get(key).items.push(appointment);
    });

    return Array.from(groups.values())
      .sort((a, b) => a.date - b.date)
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => parseTimeToMinutes(a.appointmentTime) - parseTimeToMinutes(b.appointmentTime))
      }));
  }, [appointments]);

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

            <div className="bg-white rounded-xl shadow-md p-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">This Week&apos;s Schedule</h2>
                  <p className="text-xs text-gray-600">Upcoming appointments</p>
                </div>
                <Link
                  to="/patient/video-appointments"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                  Manage calls
                </Link>
              </div>

              {appointmentTimeline.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-3 bg-gray-50 text-center text-xs text-gray-600">
                  No appointments scheduled for the coming week yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {appointmentTimeline.slice(0, 2).map((group) => (
                    <div key={group.key} className="border border-gray-200 rounded-lg bg-gray-50 p-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <div className="text-xs font-semibold text-gray-900">{group.label}</div>
                        <span className="text-xs text-gray-500">{group.items.length} appointment{group.items.length > 1 ? 's' : ''}</span>
                      </div>

                      <div className="space-y-1.5">
                        {group.items.slice(0, 2).map((item) => {
                          const appointmentType = (item.type || item.appointmentType || 'physical').toLowerCase();
                          const typeClasses = appointmentType === 'video'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700';
                          const statusLabel = item.status
                            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                            : 'Pending';

                          return (
                            <div
                              key={item.id}
                              className="bg-white border border-white rounded-md shadow-sm px-2.5 py-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                <span className="text-xs font-semibold text-gray-900 min-w-[55px]">
                                  {item.appointmentTime || '--'}
                                </span>
                                <div>
                                  <p className="font-semibold text-xs text-gray-900">{item.doctorName || 'Doctor to be assigned'}</p>
                                  <p className="text-xs text-gray-500">{item.specialization || 'General consultation'}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${typeClasses}`}>
                                  {appointmentType === 'video' ? (
                                    <>
                                      <VideoCameraIcon className="w-3 h-3" />
                                      Video
                                    </>
                                  ) : (
                                    <>
                                      <MapPinIcon className="w-3 h-3" />
                                      In-person
                                    </>
                                  )}
                                </span>
                                <span className={`inline-flex items-center gap-0.5 text-xs ${getStatusBadge(item.status)}`}>
                                  {statusLabel}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Appointments + Health Tip + Images stacked on large screens */}
          <div className="flex flex-col gap-8">
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
            {/* Health Tips Section (now stacked below Recent Appointments on desktop) */}
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

            {/* Buy Medicines Online Button */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Buy Medicines Online
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Order your prescribed medicines and get them delivered to your doorstep
                  </p>
                </div>
                <Link to="/medicine-shop" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Shop Now</span>
                </Link>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600 pt-2">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Verified Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Tips Section moved above, now empty here for spacing */}
      </div>
    </div>
  );
};

export default PatientDashboard;
