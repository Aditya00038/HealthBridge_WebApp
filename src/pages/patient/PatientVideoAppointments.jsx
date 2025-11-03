import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  VideoCameraIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentServices } from '@/services/firebaseServices';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const VIDEO_MARKERS = ['video', 'virtual', 'telehealth', 'tele-health', 'online'];

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

const parseAppointmentDateTime = (appointment) => {
  if (!appointment?.appointmentDate || !appointment?.appointmentTime) {
    return null;
  }

  const [timePart, meridiem] = appointment.appointmentTime.split(' ');
  if (!timePart || !meridiem) {
    return null;
  }

  const [rawHours, rawMinutes = '0'] = timePart.split(':');
  let hours = parseInt(rawHours, 10);
  const minutes = parseInt(rawMinutes, 10) || 0;
  const meridiemUpper = meridiem.toUpperCase();

  if (meridiemUpper === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiemUpper === 'AM' && hours === 12) {
    hours = 0;
  }

  const baseDate = normaliseDateValue(appointment.appointmentDate);
  if (!baseDate) {
    return null;
  }

  const parsed = new Date(baseDate);
  parsed.setHours(hours, minutes, 0, 0);
  return parsed;
};

const statusStyles = {
  pending: {
    wrapper: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: ClockIcon,
    label: 'Pending Approval'
  },
  confirmed: {
    wrapper: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircleIcon,
    label: 'Confirmed'
  },
  accepted: {
    wrapper: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircleIcon,
    label: 'Accepted'
  },
  approved: {
    wrapper: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircleIcon,
    label: 'Approved'
  },
  scheduled: {
    wrapper: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircleIcon,
    label: 'Scheduled'
  },
  rescheduled: {
    wrapper: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircleIcon,
    label: 'Rescheduled'
  },
  completed: {
    wrapper: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircleIcon,
    label: 'Completed'
  },
  cancelled: {
    wrapper: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircleIcon,
    label: 'Cancelled'
  },
  rejected: {
    wrapper: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircleIcon,
    label: 'Rejected'
  }
};

const UPCOMING_STATUSES = new Set(['pending', 'confirmed', 'accepted', 'approved', 'scheduled', 'rescheduled']);
const LIVE_STATUSES = new Set(['confirmed', 'accepted', 'approved', 'scheduled', 'rescheduled']);

const isVideoAppointment = (appointment = {}) => {
  if (appointment.isVideo === true || appointment.videoLink || appointment.meetingLink) {
    return true;
  }

  const candidateValues = [
    appointment.type,
    appointment.appointmentType,
    appointment.mode,
    appointment.consultationMode,
    appointment.consultationType,
    appointment.visitType,
    appointment.serviceType,
    appointment.channel
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return candidateValues.some((value) => VIDEO_MARKERS.some((marker) => value.includes(marker)));
};

const PatientVideoAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    if (!user?.uid) return;

    try {
      setRefreshing(true);
      const data = await appointmentServices.getUserAppointments(user.uid, 'patient');
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading video appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const videoAppointments = useMemo(
    () => (appointments || []).filter((appointment) => isVideoAppointment(appointment)),
    [appointments]
  );

  const upcomingAppointments = useMemo(() => {
    const nowMs = Date.now();

    return videoAppointments
      .map((appointment) => {
        const status = (appointment.status || '').toLowerCase();
        const dateTime = parseAppointmentDateTime(appointment);
        const timestamp = dateTime?.getTime() ?? null;

        return {
          appointment,
          status,
          dateTime,
          timestamp
        };
      })
      .filter(({ status, timestamp }) => {
        if (!UPCOMING_STATUSES.has(status)) {
          return false;
        }

        if (timestamp === null) {
          return true;
        }

        return timestamp >= nowMs;
      })
      .sort((a, b) => {
        const aTime = a.timestamp ?? Number.MAX_SAFE_INTEGER;
        const bTime = b.timestamp ?? Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      });
  }, [videoAppointments]);

  const nextUpcoming = upcomingAppointments[0] ?? null;
  const upcomingCount = upcomingAppointments.length;
  const hasUpcoming = upcomingCount > 0;
  const nextAppointmentDate = nextUpcoming
    ? nextUpcoming.dateTime ?? normaliseDateValue(nextUpcoming.appointment?.appointmentDate)
    : null;
  const nowMs = Date.now();

  if (loading) {
    return <LoadingSpinner text="Loading your video consultations..." />;
  }

  const hasNoVideoAppointments = videoAppointments.length === 0;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-3xl shadow-2xl p-8 md:p-10 bg-white text-slate-900 border border-slate-200">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                    Telehealth Hub
                  </span>
                  <h1 className="text-3xl font-bold mt-4 mb-2">My Video Consultations</h1>
                  <p className="text-slate-600 max-w-2xl">
                    Only your upcoming virtual visits appear here so you can focus on what is next.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/patient/appointments"
                    className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-400 transition-colors"
                  >
                    View all appointments
                  </Link>
                  <button
                    type="button"
                    onClick={fetchAppointments}
                    disabled={refreshing}
                    className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing' : 'Refresh list'}
                  </button>
                </div>
              </div>

              {hasUpcoming && nextUpcoming && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-lg">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next video visit</p>
                    <h3 className="mt-2 text-xl font-semibold">
                      {nextUpcoming.appointment.doctorName || 'Assigned Physician'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {nextUpcoming.appointment.specialization || 'Specialist consultation'}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {nextAppointmentDate
                          ? nextAppointmentDate.toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Date TBD'}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {nextUpcoming.appointment.appointmentTime || 'Time TBD'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Upcoming</p>
                      <div className="mt-2 flex items-end gap-2 text-slate-900">
                        <span className="text-3xl font-bold">{upcomingCount}</span>
                        <span className="text-sm text-slate-500">appointments</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      Need to change plans? Reschedule from the appointment list before start time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-soft p-6 md:p-8">
            {hasNoVideoAppointments ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                  <VideoCameraIcon className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  No video consultations yet
                </h2>
                <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                  Book a virtual consultation to get started. Your confirmed calls will appear here automatically.
                </p>
                <Link
                  to="/appointment/book"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <VideoCameraIcon className="w-5 h-5" />
                  Book a video appointment
                </Link>
              </motion.div>
            ) : hasUpcoming ? (
              <div className="space-y-5">
                {upcomingAppointments.map(({ appointment, dateTime }, index) => {
                  const statusKey = (appointment.status || 'pending').toLowerCase();
                  const statusMeta = statusStyles[statusKey] || statusStyles.pending;
                  const StatusIcon = statusMeta.icon;
                  const appointmentDate = dateTime ?? normaliseDateValue(appointment.appointmentDate);
                  const timestamp = dateTime?.getTime() ?? null;
                  const callIsStartingSoon =
                    timestamp !== null && timestamp - nowMs <= 15 * 60 * 1000 && timestamp > nowMs;
                  const callIsLive = timestamp !== null && timestamp <= nowMs && LIVE_STATUSES.has(statusKey);
                  const joinButtonClasses = callIsLive
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
                    : callIsStartingSoon
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200';

                  return (
                    <motion.div
                      key={appointment.id || `${statusKey}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <VideoCameraIcon className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">
                              {appointment.doctorName || 'Assigned Physician'}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">
                              {appointment.specialization || 'Specialist consultation'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-4 h-4" />
                                {appointmentDate
                                  ? appointmentDate.toLocaleDateString(undefined, {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : 'Date TBD'}
                              </span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {appointment.appointmentTime || 'Time TBD'}
                              </span>
                              {appointment.appointmentNumber && (
                                <span className="flex items-center gap-1">
                                  <ShieldCheckIcon className="w-4 h-4" />
                                  {appointment.appointmentNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm font-semibold ${statusMeta.wrapper}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusMeta.label}
                          </span>

                          <div className="flex flex-wrap items-center gap-3 justify-end">
                            <Link
                              to={`/patient/video-consultation/${appointment.id}`}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${joinButtonClasses}`}
                            >
                              <PlayIcon className="w-4 h-4" />
                              {callIsLive ? 'Join live call' : callIsStartingSoon ? 'Enter waiting room' : 'View call lobby'}
                            </Link>
                            <Link
                              to={`/video-call/${appointment.id}`}
                              className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                            >
                              Join via browser
                            </Link>
                          </div>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700">
                          {appointment.reason}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  No upcoming video consultations
                </h2>
                <p className="text-slate-600 max-w-lg mx-auto">
                  Any cancelled or completed sessions are hidden. Once your doctor confirms a new virtual visit it will show up here instantly.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientVideoAppointments;
