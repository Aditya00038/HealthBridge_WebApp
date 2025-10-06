import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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
  MapPinIcon,
  BellIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  StarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayAppts = appointmentData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate.toDate ? apt.appointmentDate.toDate() : apt.appointmentDate);
        return aptDate >= today && aptDate < tomorrow;
      });
      
      setStats({
        totalAppointments: appointmentData.length,
        todayAppointments: todayAppts.length,
        pendingAppointments: appointmentData.filter(apt => apt.status === 'upcoming').length,
        completedAppointments: appointmentData.filter(apt => apt.status === 'completed').length
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAppointments = () => {
    return appointments
      .filter(apt => apt.status === 'upcoming')
      .slice(0, 5);
  };

  const formatDate = (date) => {
    const d = new Date(date.toDate ? date.toDate() : date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    const d = new Date(date.toDate ? date.toDate() : date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, Dr. {user?.displayName || 'Doctor'}
                </h1>
                <p className="text-blue-100">Managing your patients and appointments</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{stats.todayAppointments} appointments today</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/video-call" 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <VideoCameraIcon className="h-4 w-4" />
                  Start Consultation
                </Link>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <BellIcon className="h-4 w-4" />
                  Notifications
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Patients"
            value={stats.totalAppointments}
            icon={UsersIcon}
            color="blue"
            subtitle="This month"
          />
          <StatsCard
            title="Today's Schedule"
            value={stats.todayAppointments}
            icon={CalendarIcon}
            color="green"
            subtitle="Appointments"
          />
          <StatsCard
            title="Pending Reviews"
            value={stats.pendingAppointments}
            icon={DocumentTextIcon}
            color="orange"
            subtitle="Awaiting consultation"
          />
          <StatsCard
            title="Completed Today"
            value={stats.completedAppointments}
            icon={CheckCircleIcon}
            color="purple"
            subtitle="Consultations"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Appointment Requests
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Schedule New
                </button>
              </div>
              
              <div className="space-y-4">
                {getUpcomingAppointments().map((appointment, index) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                ))}
                
                {getUpcomingAppointments().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions & Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <QuickActions />
            <RecentAlerts />
          </motion.div>
        </div>
        )}

        {/* Appointment Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AppointmentRequests doctorId={user?.uid} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${colorClasses[color]} shadow-sm`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <UsersIcon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
        <p className="text-sm text-gray-600">{appointment.reason}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {formatDate(appointment.appointmentDate)}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {appointment.time}
          </span>
          <span className="flex items-center gap-1">
            {appointment.type === 'video' ? (
              <VideoCameraIcon className="h-3 w-3" />
            ) : (
              <MapPinIcon className="h-3 w-3" />
            )}
            {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {appointment.type === 'video' ? (
            <Link
              to={`/video-call/${appointment.id}`}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-1"
            >
              <VideoCameraIcon className="h-3 w-3" />
              Start Video
            </Link>
          ) : (
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1">
              <CheckCircleIcon className="h-3 w-3" />
              Check In
            </button>
          )}
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1">
            <ChatBubbleLeftRightIcon className="h-3 w-3" />
            Message
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            Reschedule
          </button>
          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1">
            <DocumentTextIcon className="h-3 w-3" />
            Notes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    { title: 'View All Patients', icon: UsersIcon, color: 'blue', href: '/doctor/patients' },
    { title: 'Start Video Call', icon: VideoCameraIcon, color: 'green', href: '/video-call' },
    { title: 'Patient Records', icon: DocumentTextIcon, color: 'purple', href: '/doctor/records' },
    { title: 'Schedule Management', icon: CalendarIcon, color: 'orange', href: '/doctor/schedule' },
    { title: 'Prescription Pad', icon: PencilIcon, color: 'indigo', href: '/doctor/prescriptions' },
    { title: 'Emergency Alerts', icon: ExclamationTriangleIcon, color: 'red', href: '/doctor/alerts' }
  ];

  const colorClasses = {
    blue: 'group-hover:text-blue-600 group-hover:bg-blue-50',
    green: 'group-hover:text-green-600 group-hover:bg-green-50',
    purple: 'group-hover:text-purple-600 group-hover:bg-purple-50',
    orange: 'group-hover:text-orange-600 group-hover:bg-orange-50',
    indigo: 'group-hover:text-indigo-600 group-hover:bg-indigo-50',
    red: 'group-hover:text-red-600 group-hover:bg-red-50'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Tools</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            to={action.href}
            className={`flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-all group border border-transparent hover:border-gray-200 ${colorClasses[action.color]}`}
          >
            <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-${action.color}-100 transition-colors`}>
              <action.icon className={`h-4 w-4 text-gray-500 group-hover:text-${action.color}-600 transition-colors`} />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Recent Alerts Component
const RecentAlerts = () => {
  const alerts = [
    { message: "Lab results ready for John Smith", time: "5 min ago", type: "info", priority: "high" },
    { message: "Emergency consultation request from Mary Johnson", time: "15 min ago", type: "urgent", priority: "urgent" },
    { message: "Patient Emily Brown rescheduled appointment", time: "1h ago", type: "info", priority: "normal" },
    { message: "Prescription refill requested by David Wilson", time: "2h ago", type: "info", priority: "normal" },
    { message: "New patient registration: Sarah Davis", time: "3h ago", type: "success", priority: "normal" }
  ];

  const getPriorityStyles = (priority, type) => {
    if (priority === 'urgent' || type === 'urgent') {
      return 'bg-red-50 border border-red-200';
    } else if (priority === 'high') {
      return 'bg-orange-50 border border-orange-200';
    } else if (type === 'success') {
      return 'bg-green-50 border border-green-200';
    }
    return 'bg-gray-50 border border-gray-200';
  };

  const getPriorityIcon = (priority, type) => {
    if (priority === 'urgent' || type === 'urgent') {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />;
    } else if (priority === 'high') {
      return <ClockIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />;
    } else if (type === 'success') {
      return <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />;
    }
    return <BellIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Patient Alerts</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${getPriorityStyles(alert.priority, alert.type)} hover:shadow-sm transition-all cursor-pointer`}>
            {getPriorityIcon(alert.priority, alert.type)}
            <div className="flex-1">
              <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{alert.time}</p>
                {alert.priority === 'urgent' && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                    Urgent
                  </span>
                )}
                {alert.priority === 'high' && (
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                    High Priority
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
