import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  StarIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentServices } from '@/services/firebaseServices';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PaymentModal from '@/components/ui/PaymentModal';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      pending: { 
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'Pending Approval',
        icon: ClockIcon
      },
      confirmed: { 
        class: 'bg-blue-100 text-blue-800 border-blue-200', 
        text: 'Confirmed',
        icon: CheckCircleIcon
      },
      completed: { 
        class: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Completed',
        icon: CheckCircleIcon
      },
      cancelled: { 
        class: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Cancelled',
        icon: XCircleIcon
      },
      rejected: { 
        class: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Rejected',
        icon: XCircleIcon
      }
    };
    return badges[status] || { 
      class: 'bg-gray-100 text-gray-800 border-gray-200', 
      text: status,
      icon: ExclamationTriangleIcon
    };
  };

  const getPaymentBadge = (paymentStatus) => {
    const badges = {
      paid: { class: 'bg-green-100 text-green-800', text: 'Paid', icon: CheckCircleIcon },
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Payment Pending', icon: ClockIcon },
      failed: { class: 'bg-red-100 text-red-800', text: 'Payment Failed', icon: XCircleIcon }
    };
    return badges[paymentStatus] || { class: 'bg-gray-100 text-gray-800', text: 'Not Paid', icon: CreditCardIcon };
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const now = new Date();
      const appointmentDate = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
      return appointmentDate > now && (appointment.status === 'confirmed' || appointment.status === 'pending');
    }
    return appointment.status === filter;
  });

  const filterOptions = [
    { key: 'all', label: 'All', count: appointments.length, color: 'blue' },
    { key: 'upcoming', label: 'Upcoming', count: appointments.filter(apt => {
      const now = new Date();
      const appointmentDate = new Date(`${apt.appointmentDate} ${apt.appointmentTime}`);
      return appointmentDate > now && (apt.status === 'confirmed' || apt.status === 'pending');
    }).length, color: 'purple' },
    { key: 'completed', label: 'Completed', count: appointments.filter(apt => apt.status === 'completed').length, color: 'green' },
    { key: 'pending', label: 'Pending', count: appointments.filter(apt => apt.status === 'pending').length, color: 'yellow' },
    { key: 'cancelled', label: 'Cancelled', count: appointments.filter(apt => apt.status === 'cancelled' || apt.status === 'rejected').length, color: 'red' }
  ];

  const handlePayment = (appointment) => {
    setSelectedAppointmentForPayment(appointment);
    setShowPaymentModal(true);
  };

  const processPayment = async (paymentMethod, cardDetails = null) => {
    if (!selectedAppointmentForPayment) return;

    try {
      setIsProcessingPayment(true);
      
      if (paymentMethod === 'card') {
        // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
        console.log('Processing card payment for appointment:', selectedAppointmentForPayment.id);
        console.log('Card details:', cardDetails);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update appointment with payment status
        await appointmentServices.updateAppointment(selectedAppointmentForPayment.id, {
          paymentStatus: 'paid',
          paymentMethod: 'card',
          paymentDate: new Date().toISOString()
        });
      } else {
        // Cash payment - mark as payment pending
        await appointmentServices.updateAppointment(selectedAppointmentForPayment.id, {
          paymentStatus: 'pending',
          paymentMethod: 'cash'
        });
      }

      // Refresh appointments
      await fetchAppointments();
      setShowPaymentModal(false);
      setSelectedAppointmentForPayment(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your appointments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Appointments
              </h1>
              <p className="mt-2 text-gray-600">Manage and track all your medical appointments</p>
            </div>
            <Link
              to="/appointment/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Book New Appointment
            </Link>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  filter === option.key
                    ? `bg-gradient-to-r from-${option.color}-500 to-${option.color}-600 text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === option.key ? 'bg-white/30' : 'bg-gray-200'
                }`}>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <CalendarDaysIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't booked any appointments yet."
                  : `No ${filter} appointments to display.`
                }
              </p>
              <Link
                to="/appointment/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                Book Your First Appointment
              </Link>
            </motion.div>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const statusBadge = getStatusBadge(appointment.status);
              const paymentBadge = getPaymentBadge(appointment.paymentStatus);
              const StatusIcon = statusBadge.icon;
              const PaymentIcon = paymentBadge.icon;
              const isExpanded = expandedAppointment === appointment.id;

              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Appointment Header */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left: Doctor Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {appointment.doctorName?.charAt(0) || 'D'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {appointment.doctorName || 'Doctor Name'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {appointment.specialty || 'General Practitioner'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.class}`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusBadge.text}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge.class}`}>
                              <PaymentIcon className="w-4 h-4" />
                              {paymentBadge.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Date & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <ClockIcon className="w-4 h-4 text-purple-600" />
                            {appointment.appointmentTime || 'Time not set'}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {appointment.paymentStatus !== 'paid' && appointment.status === 'confirmed' && (
                            <button
                              onClick={() => handlePayment(appointment)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                            >
                              <CreditCardIcon className="w-4 h-4 inline mr-1" />
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedAppointment(isExpanded ? null : appointment.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUpIcon className="w-4 h-4 inline mr-1" />
                                Less
                              </>
                            ) : (
                              <>
                                <ChevronDownIcon className="w-4 h-4 inline mr-1" />
                                Details
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50"
                      >
                        <div className="p-6 space-y-6">
                          {/* Appointment Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">Location</span>
                              </div>
                              <p className="text-gray-900">{appointment.location || 'Clinic Address'}</p>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <PhoneIcon className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-gray-700">Contact</span>
                              </div>
                              <p className="text-gray-900">{appointment.phone || '+1 (555) 123-4567'}</p>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <BanknotesIcon className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-700">Consultation Fee</span>
                              </div>
                              <p className="text-gray-900 font-bold text-lg">
                                ${appointment.consultationFee || '50.00'}
                              </p>
                            </div>
                          </div>

                          {/* Reason for Visit */}
                          {appointment.reason && (
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">Reason for Visit</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{appointment.reason}</p>
                            </div>
                          )}

                          {/* Payment Details */}
                          {appointment.paymentStatus === 'paid' && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-green-800">Payment Completed</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-green-700">Payment Method:</span>
                                  <span className="ml-2 font-semibold text-green-900">
                                    {appointment.paymentMethod === 'online' ? 'Online Payment' : 'Cash'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-green-700">Payment Date:</span>
                                  <span className="ml-2 font-semibold text-green-900">
                                    {appointment.paymentDate 
                                      ? new Date(appointment.paymentDate).toLocaleDateString()
                                      : 'N/A'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            {appointment.status === 'confirmed' && (
                              <>
                                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
                                  <VideoCameraIcon className="w-5 h-5" />
                                  Join Video Call
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-all">
                                  <ArrowPathIcon className="w-5 h-5" />
                                  Reschedule
                                </button>
                              </>
                            )}
                            {appointment.status === 'pending' && (
                              <button className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all">
                                <XCircleIcon className="w-5 h-5" />
                                Cancel Request
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Professional Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          appointment={selectedAppointmentForPayment}
          onPaymentComplete={processPayment}
          isProcessing={isProcessingPayment}
        />
      </div>
    </div>
  );
};

export default PatientAppointments;
