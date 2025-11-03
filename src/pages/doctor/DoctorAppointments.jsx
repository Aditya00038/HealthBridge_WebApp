import React, { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  VideoCameraIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';


import { appointmentServices } from '../../services/firebaseServices';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentRequests from '../../components/AppointmentRequests';
import toast from 'react-hot-toast';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Helper for avatar fallback
function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
}

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentServices.getUserAppointments(user.uid, 'doctor');
      console.log('📅 All appointments fetched:', data);
      console.log('📅 Appointment statuses:', data.map(a => ({ id: a.id, status: a.status, date: a.appointmentDate })));
      setAppointments(data);
    } catch (e) {
      console.error('Error fetching appointments:', e);
      setAppointments([]);
    }
    setLoading(false);
  };

  const handleMarkAsDone = async (appointment) => {
    if (!appointment) return;
    
    try {
      setProcessingId(appointment.id);
      
      // Update appointment status to completed
      await appointmentServices.updateAppointmentStatus(appointment.id, 'completed');
      
      // Create patient record directly (workaround for cache issue)
      const recordData = {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: appointment.doctorId,
        visitDate: Timestamp.now(),
        reason: appointment.reasonForVisit || appointment.reason,
        diagnosis: '',
        prescription: '',
        status: 'completed',
        appointmentTime: appointment.appointmentTime || appointment.time,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'patientRecords'), recordData);
      
      toast.success('✅ Appointment completed! Patient record created.');
      
      // Refresh appointments
      fetchAppointments();
      
    } catch (error) {
      console.error('Error marking appointment as done:', error);
      toast.error('Failed to complete appointment. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Today appointments (confirmed/approved/pending appointments, sorted by time)
  const today = new Date();
  const todayAppointments = appointments.filter(a => {
    // Accept confirmed, approved, or pending status
    const validStatuses = ['confirmed', 'approved', 'pending'];
    if (!validStatuses.includes(a.status)) {
      console.log('❌ Filtered out due to status:', a.status, a);
      return false;
    }
    
    // Parse appointment date
    let d;
    if (a.appointmentDate?.seconds) {
      d = new Date(a.appointmentDate.seconds * 1000);
    } else if (a.appointmentDate) {
      d = new Date(a.appointmentDate);
    } else {
      console.log('❌ No appointment date:', a);
      return false;
    }
    
    const isToday = d.toDateString() === today.toDateString();
    console.log('🔍 Checking appointment:', {
      id: a.id,
      patient: a.patientName,
      status: a.status,
      date: d.toDateString(),
      today: today.toDateString(),
      isToday: isToday
    });
    
    return isToday;
  }).sort((a, b) => {
    const ta = a.appointmentTime || a.time || a.selectedTime;
    const tb = b.appointmentTime || b.time || b.selectedTime;
    return (ta || '').localeCompare(tb || '');
  });

  console.log('✅ Today\'s appointments:', todayAppointments);

  // Next patient (first in today's list)
  const nextPatient = todayAppointments[0];
  
  // Filter appointments by date range
  const [selectedDate, setSelectedDate] = useState('today');
  const getFilteredAppointments = () => {
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return appointments.filter(a => {
      if (a.status !== 'confirmed' && a.status !== 'approved') return false;
      const aptDate = new Date(a.appointmentDate?.seconds ? a.appointmentDate.seconds * 1000 : a.appointmentDate);
      const aptDateOnly = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
      
      switch(selectedDate) {
        case 'today':
          return aptDateOnly.getTime() === todayDate.getTime();
        case 'tomorrow':
          const tomorrow = new Date(todayDate);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return aptDateOnly.getTime() === tomorrow.getTime();
        case 'week':
          const weekEnd = new Date(todayDate);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return aptDateOnly >= todayDate && aptDateOnly <= weekEnd;
        case 'month':
          return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();
        case 'all':
          return true;
        default:
          return aptDateOnly.getTime() === todayDate.getTime();
      }
    }).sort((a, b) => {
      const dateA = new Date(a.appointmentDate?.seconds ? a.appointmentDate.seconds * 1000 : a.appointmentDate);
      const dateB = new Date(b.appointmentDate?.seconds ? b.appointmentDate.seconds * 1000 : b.appointmentDate);
      return dateA - dateB;
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Today Appointment */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
              Today's Appointments
            </div>
            <div className="space-y-3">
              {todayAppointments.length === 0 && (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No appointments today</p>
                </div>
              )}
              {todayAppointments.map((apt, idx) => (
                <div key={apt.id} className={`flex items-center gap-3 rounded-xl p-4 ${idx === 0 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    {apt.patientAvatar ? (
                      <img src={apt.patientAvatar} alt={apt.patientName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">{getInitials(apt.patientName)}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900">{apt.patientName}</div>
                      <div className="text-xs text-gray-600">{apt.reasonForVisit || apt.reason || 'General consultation'}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600 font-medium">{apt.appointmentTime || apt.time || apt.selectedTime}</span>
                        {idx === 0 && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                            ONGOING
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAsDone(apt)}
                    disabled={processingId === apt.id}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {processingId === apt.id ? 'Processing...' : 'Complete'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Next Patient Details */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-semibold text-gray-900 mb-4">Next Patient Details</div>
            {nextPatient ? (
              <div className="space-y-4">
                {/* Check if patient profile is incomplete */}
                {(!nextPatient.patientPhone && !nextPatient.patientEmail) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Incomplete Profile:</strong> Patient hasn't completed their profile. Some information may be missing.
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  {nextPatient.patientAvatar ? (
                    <img src={nextPatient.patientAvatar} alt={nextPatient.patientName} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 flex-shrink-0">{getInitials(nextPatient.patientName)}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-gray-900">{nextPatient.patientName || 'Unknown Patient'}</div>
                    <div className="text-sm text-gray-500 mt-1">{nextPatient.patientAddress || nextPatient.address || <span className="text-gray-400 italic">Address not provided</span>}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">D.O.B</div>
                    <div className={`font-semibold ${nextPatient.dateOfBirth || nextPatient.dob ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {nextPatient.dateOfBirth || nextPatient.dob || 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">Gender</div>
                    <div className={`font-semibold ${nextPatient.gender || nextPatient.sex ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {nextPatient.gender || nextPatient.sex || 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">Weight</div>
                    <div className={`font-semibold ${nextPatient.weight ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {nextPatient.weight || 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">Height</div>
                    <div className={`font-semibold ${nextPatient.height ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {nextPatient.height || 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">Blood Type</div>
                    <div className={`font-semibold ${nextPatient.bloodType ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {nextPatient.bloodType || 'Not provided'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">Phone</div>
                    <div className={`font-semibold ${nextPatient.patientPhone || nextPatient.phone ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {nextPatient.patientPhone || nextPatient.phone || 'Not provided'}
                    </div>
                  </div>
                </div>
                
                {(nextPatient.medicalConditions && nextPatient.medicalConditions.length > 0) ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Medical Conditions</div>
                    <div className="flex flex-wrap gap-2">
                      {nextPatient.medicalConditions.map((condition, idx) => (
                        <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">{condition}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Medical Conditions</div>
                    <div className="text-sm text-gray-400 italic">No medical conditions recorded</div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {(nextPatient.patientPhone || nextPatient.phone) ? (
                    <a 
                      href={`tel:${nextPatient.patientPhone || nextPatient.phone}`}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-200 flex items-center gap-2 hover:bg-blue-100 transition-colors"
                    >
                      <PhoneIcon className="w-4 h-4" /> 
                      <span>{nextPatient.patientPhone || nextPatient.phone}</span>
                    </a>
                  ) : (
                    <button disabled className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-medium border border-gray-200 flex items-center gap-2 cursor-not-allowed">
                      <PhoneIcon className="w-4 h-4" /> 
                      <span>No phone</span>
                    </button>
                  )}
                  <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <DocumentTextIcon className="w-4 h-4" /> 
                    <span>Documents</span>
                  </button>
                  <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" /> 
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            ) : <div className="text-center py-8 text-gray-400">No confirmed appointments for today</div>}
          </div>
        </div>

        {/* All Appointments with Date Filter */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900">All Appointments</div>
            <div className="flex gap-2">
              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Appointments</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {getFilteredAppointments().length === 0 ? (
              <div className="text-center py-8 text-gray-400">No appointments found for the selected period.</div>
            ) : (
              getFilteredAppointments().map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    {apt.patientAvatar ? (
                      <img src={apt.patientAvatar} alt={apt.patientName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">{getInitials(apt.patientName)}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{apt.patientName}</div>
                      <div className="text-sm text-gray-500 truncate">{apt.reasonForVisit || apt.reason || 'General consultation'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {new Date(apt.appointmentDate?.seconds ? apt.appointmentDate.seconds * 1000 : apt.appointmentDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: new Date(apt.appointmentDate?.seconds ? apt.appointmentDate.seconds * 1000 : apt.appointmentDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </div>
                      <div className="text-xs text-gray-500">{apt.appointmentTime || apt.time || apt.selectedTime}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'confirmed' || apt.status === 'approved' ? 'bg-green-100 text-green-700' :
                      apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Appointment Requests Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CalendarDaysIcon className="w-6 h-6 mr-2 text-orange-500" />
            Pending Appointment Requests
          </h2>
          <AppointmentRequests 
            onAppointmentUpdate={fetchAppointments}
            doctorId={user?.uid}
          />
        </div>

      </div>
    </div>
  );
};

export default DoctorAppointments;