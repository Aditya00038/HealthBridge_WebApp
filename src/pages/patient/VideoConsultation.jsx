import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  VideoCameraIcon,
  ClockIcon,
  CalendarIcon,
  BellAlertIcon,
  InformationCircleIcon,
  UserIcon,
  PhoneIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { appointmentServices } from '@/services/firebaseServices';

const parseAppointmentDateTime = (appointment) => {
  if (!appointment?.appointmentDate || !appointment?.appointmentTime) {
    return null;
  }

  const timeParts = appointment.appointmentTime.split(' ');
  if (timeParts.length < 2) return null;

  const [time, modifier] = timeParts;
  const [rawHours, rawMinutes] = time.split(':');
  let hours = parseInt(rawHours, 10);
  const minutes = parseInt(rawMinutes, 10);

  if (modifier.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  const isoDateTime = `${appointment.appointmentDate}T${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:00`;
  return new Date(isoDateTime);
};

const formatTimeRemaining = (milliseconds) => {
  if (milliseconds === null) {
    return '--:--:--';
  }

  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const data = await appointmentServices.getAppointmentById(appointmentId);
        if (!data) {
          setError('Appointment not found or may have been removed.');
          return;
        }
        setAppointment(data);
      } catch (err) {
        console.error('Failed to load appointment:', err);
        setError('Unable to load appointment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    } else {
      setError('Invalid appointment link.');
      setLoading(false);
    }
  }, [appointmentId]);

  const callStartTime = useMemo(() => parseAppointmentDateTime(appointment), [appointment]);

  useEffect(() => {
    if (!callStartTime) return;

    const updateTime = () => {
      setTimeRemaining(callStartTime.getTime() - Date.now());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [callStartTime]);

  useEffect(() => {
    if (!callStartTime || timeRemaining === null) return;

    if (timeRemaining <= 15 * 60 * 1000 && timeRemaining > 0 && !notificationSent) {
      toast((t) => (
        <div>
          <p className="font-semibold">Video consultation in 15 minutes</p>
          <p className="text-sm opacity-80">Please join the waiting room to prepare for your call.</p>
        </div>
      ));
      setNotificationSent(true);
    }
  }, [callStartTime, notificationSent, timeRemaining]);

  const joinCall = () => {
    navigate(`/video-call/${appointmentId}`);
  };

  if (loading) {
    return <LoadingSpinner text="Preparing your consultation" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <InformationCircleIcon className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">We're sorry</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/patient/appointments"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Back to appointments
        </Link>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  if (appointment.type !== 'video') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <VideoCameraIcon className="w-16 h-16 text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">In-person appointment scheduled</h1>
        <p className="text-gray-600 mb-6">
          This appointment is an in-person consultation. You can review full details from the appointments page.
        </p>
        <Link
          to="/patient/appointments"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          View my appointments
        </Link>
      </div>
    );
  }

  const callStarted = timeRemaining !== null && timeRemaining <= 0;
  const callOpensSoon = timeRemaining !== null && timeRemaining <= 5 * 60 * 1000;
  const formattedTimeRemaining = formatTimeRemaining(timeRemaining);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-white/70 mb-2">Video Consultation</p>
                <h1 className="text-3xl font-bold mb-3">
                  {callStarted ? 'Your consultation is live' : 'Your doctor will join soon'}
                </h1>
                <p className="text-white/80 max-w-xl">
                  Please review the call details below and be ready with any medical reports or questions you want to discuss.
                </p>
              </div>
              <div className="bg-white/20 rounded-2xl px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-widest text-white/80">Time remaining</p>
                <p className="text-3xl font-extrabold tracking-wide">{formattedTimeRemaining}</p>
                <p className="text-xs text-white/70">HH : MM : SS</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 space-y-8 bg-white/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                  <VideoCameraIcon className="w-5 h-5 text-teal-600" /> Call details
                </h2>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Doctor</p>
                      <p className="font-semibold text-slate-900">{appointment.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Date</p>
                      <p className="font-semibold text-slate-900">
                        {callStartTime?.toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Scheduled time</p>
                      <p className="font-semibold text-slate-900">{appointment.appointmentTime}</p>
                    </div>
                  </div>
                  {appointment.appointmentNumber && (
                    <div className="flex items-center gap-3">
                      <ShieldCheckIcon className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Appointment number</p>
                        <p className="font-semibold text-slate-900">{appointment.appointmentNumber}</p>
                      </div>
                    </div>
                  )}
                  {appointment.reason && (
                    <div className="flex items-start gap-3">
                      <InformationCircleIcon className="w-5 h-5 text-slate-500 mt-1" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Reason for visit</p>
                        <p className="text-slate-700 leading-relaxed">{appointment.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                  <BellAlertIcon className="w-5 h-5 text-teal-600" /> Pre-call checklist
                </h2>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-500 mt-2" />
                    Test your microphone and camera before joining.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-500 mt-2" />
                    Ensure you are in a quiet, well-lit space with a strong internet connection.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-500 mt-2" />
                    Keep medical reports, prescriptions, or recent test results handy.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-500 mt-2" />
                    Prepare a short list of questions or symptoms to discuss.
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-teal-50 border border-teal-100 rounded-2xl">
                <h3 className="text-sm font-semibold text-teal-700 uppercase mb-3">Need to update contact details?</h3>
                <p className="text-sm text-teal-900 mb-4">
                  If your contact number or email has changed, update it now so the doctor can reach you if needed.
                </p>
                <Link
                  to="/patient/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-teal-700 font-semibold border border-teal-200 hover:bg-teal-100 transition"
                >
                  <PhoneIcon className="w-4 h-4" /> Update contact info
                </Link>
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-700">
                <h3 className="text-sm font-semibold text-white uppercase mb-3">Join instructions</h3>
                <p className="text-sm text-slate-200 mb-4">
                  You can join the video consultation a few minutes before the scheduled time. Once the doctor connects, the call will begin automatically.
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <p>• Join at least 5 minutes before your slot.</p>
                  <p>• Keep the browser window open while waiting.</p>
                  <p>• If you face connectivity issues, contact support immediately.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-100 rounded-2xl p-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Call status</p>
                <p className="text-lg font-semibold text-slate-900">
                  {callStarted
                    ? 'Your doctor is ready to start the consultation.'
                    : callOpensSoon
                      ? 'You can join the waiting room now.'
                      : 'Join will be available closer to the scheduled time.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/patient/appointments"
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition"
                >
                  View all appointments
                </Link>
                <button
                  type="button"
                  onClick={joinCall}
                  disabled={!callStarted && !callOpensSoon}
                  className={`px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition ${
                    callStarted || callOpensSoon
                      ? 'bg-teal-600 hover:bg-teal-700 shadow-lg'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <VideoCameraIcon className="w-5 h-5" />
                  {callStarted ? 'Join live consultation' : 'Enter waiting room'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoConsultation;
