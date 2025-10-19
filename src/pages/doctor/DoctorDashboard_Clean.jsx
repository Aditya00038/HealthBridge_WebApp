import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentServices } from '../../services/firebaseServices';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AppointmentRequests from '../../components/AppointmentRequests';
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  VideoCameraIcon,
  BellIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  StarIcon,
  UserIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentData = await appointmentServices.getUserAppointments(user.uid, 'doctor');
      setAppointments(appointmentData);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const stats = {
        totalAppointments: appointmentData.length,
        todayAppointments: appointmentData.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.toDateString() === today.toDateString();
        }).length,
        pendingAppointments: appointmentData.filter(apt => apt.status === 'pending').length,
        completedAppointments: appointmentData.filter(apt => apt.status === 'completed').length
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
      name: 'Appointment Management',
      description: 'Review and manage patient appointments',
      icon: CalendarIcon,
      href: '/doctor/appointments',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    },
    {
      name: 'View Schedule',
      description: 'Check your appointment schedule',
      icon: CalendarIcon,
      href: '/doctor/schedule',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      name: 'Patient Records',
      description: 'Access patient medical records',
      icon: DocumentTextIcon,
      href: '/doctor/patients',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      name: 'Video Consultations',
      description: 'Start or join video calls',
      icon: VideoCameraIcon,
      href: '/video-call',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      name: 'Profile Settings',
      description: 'Manage your profile and preferences',
      icon: UserIcon,
      href: '/profile/settings',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    }
  ];

  const statCards = [
    {
      name: 'Total Appointments',
      value: stats.totalAppointments,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: ClockIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Pending Requests',
      value: stats.pendingAppointments,
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Completed',
      value: stats.completedAppointments,
      icon: CheckCircleIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
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
                Welcome, Dr. {userProfile?.name || user?.displayName || 'Doctor'}! 👩‍⚕️
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
            
            <div className="mt-4 sm:mt-0">
              <Link
                to="/doctor/profile-setup"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Update Profile
              </Link>
            </div>
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
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="block p-6 rounded-xl border-2 border-transparent bg-white hover:border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      Access Now
                      <EyeIcon className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <Link
                  to="/doctor/appointments"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View All
                  <EyeIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {appointments
                  .filter(apt => {
                    const today = new Date();
                    const aptDate = new Date(apt.appointmentDate);
                    return aptDate.toDateString() === today.toDateString();
                  })
                  .slice(0, 3)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                          <p className="text-sm text-gray-600">{appointment.patientEmail}</p>
                        </div>
                        <span className={getStatusBadge(appointment.status)}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {appointment.appointmentTime}
                        </span>
                        {appointment.appointmentType === 'video' && (
                          <span className="flex items-center text-green-600">
                            <VideoCameraIcon className="w-4 h-4 mr-1" />
                            Video
                          </span>
                        )}
                      </div>
                      
                      {appointment.reasonForVisit && (
                        <div className="mt-3 text-sm text-gray-700">
                          <strong>Reason:</strong> {appointment.reasonForVisit}
                        </div>
                      )}
                    </div>
                  ))}

                {appointments.filter(apt => {
                  const today = new Date();
                  const aptDate = new Date(apt.appointmentDate);
                  return aptDate.toDateString() === today.toDateString();
                }).length === 0 && (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No appointments today</p>
                    <p className="text-sm text-gray-500">Check your schedule for upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Requests Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BellIcon className="w-6 h-6 mr-2 text-orange-500" />
                Appointment Requests
              </h2>
              {stats.pendingAppointments > 0 && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.pendingAppointments} pending
                </span>
              )}
            </div>
            <AppointmentRequests 
              onAppointmentUpdate={fetchAppointments}
              doctorId={user?.uid}
            />
          </div>
        </div>

        {/* Professional Tips Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md p-6 border-2 border-indigo-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-md">
                <HeartIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Tip</h3>
                <p className="text-gray-700 mb-4">
                  Regular patient follow-ups improve treatment outcomes by 40%. Consider scheduling 
                  follow-up appointments for patients with chronic conditions or complex treatments.
                </p>
                <div className="flex items-center text-sm text-indigo-700">
                  <StarIcon className="w-4 h-4 mr-1" />
                  Best practices from medical research
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
