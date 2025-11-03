// Appointment Request Management Component for Doctor Dashboard
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { appointmentServices } from '../services/firebaseServices';
import { useAuth } from '../contexts/AuthContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon,
  VideoCameraIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AppointmentRequests = ({ onAppointmentUpdate, doctorId }) => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (user || doctorId) {
      fetchPendingRequests();
    }
  }, [user, doctorId]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const docId = doctorId || user?.uid;
      if (!docId) {
        console.error('No doctor ID available');
        return;
      }
      console.log('Fetching pending appointments for doctor:', docId);
      const requests = await appointmentServices.getPendingAppointments(docId);
      console.log('Found pending requests:', requests);
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load appointment requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      setProcessingId(appointmentId);
      const docId = doctorId || user?.uid;
      const result = await appointmentServices.approveAppointment(appointmentId, docId);
      toast.success('✅ Appointment approved! Patient has been notified.');
      
      // Remove from pending list
      setPendingRequests(prev => prev.filter(req => req.id !== appointmentId));
      
      // Notify parent component to refresh
      if (onAppointmentUpdate) {
        onAppointmentUpdate();
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Failed to approve appointment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (appointmentId, reason = '') => {
    try {
      setProcessingId(appointmentId);
      const docId = doctorId || user?.uid;
      const result = await appointmentServices.rejectAppointment(appointmentId, docId, reason);
      toast.success('❌ Appointment rejected. Patient has been notified.');
      
      // Remove from pending list
      setPendingRequests(prev => prev.filter(req => req.id !== appointmentId));
      
      // Notify parent component to refresh
      if (onAppointmentUpdate) {
        onAppointmentUpdate();
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    } finally {
      setProcessingId(null);
    }
  };


  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Appointment Requests
        </h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {pendingRequests.length} pending
          </span>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-500">
            You have no appointment requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <UserIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {request.patientName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Patient ID: {request.patientId?.slice(-8) || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">New Request</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Date</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(request.appointmentDate.seconds * 1000).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <ClockIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Time</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {request.time || request.selectedTime || '10:00 AM'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          {request.type === 'video' ? (
                            <VideoCameraIcon className="h-4 w-4 text-purple-600" />
                          ) : (
                            <MapPinIcon className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Type</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {request.type || 'consultation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Requested</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'Today'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                    </div>
                  )}
                  
                  {request.specialization && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {request.specialization}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    {processingId === request.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;