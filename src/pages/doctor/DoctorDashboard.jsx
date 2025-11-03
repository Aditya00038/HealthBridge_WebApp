import { Link } from 'react-router-dom';
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
  EyeIcon
} from '@heroicons/react/24/outline';
// --- Appointment Management Dashboard State & Handlers ---

import React, { useState, useEffect } from 'react';
import { appointmentServices } from '../../services/firebaseServices';
import { useAuth } from '../../contexts/AuthContext';

  const DoctorDashboard = () => {
  // Doctor quick actions
  const quickActions = [
    {
      name: 'My Schedule',
      description: 'Check your upcoming schedule',
      icon: ClockIcon,
      href: '/doctor/schedule',
      color: 'bg-gradient-to-r from-violet-500 to-purple-600',
    },
    {
      name: 'Manage Appointments',
      description: 'View and manage all patient appointments',
      icon: CalendarDaysIcon,
      href: '/doctor/appointments',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      name: 'Video Consults',
      description: 'Start or join video consultations',
      icon: VideoCameraIcon,
      href: '/video-call',
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    },
    {
      name: 'Patient Records',
      description: 'Access and update patient medical records',
      icon: DocumentTextIcon,
      href: '/doctor/patient-records',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      name: 'My Profile',
      description: 'Manage your profile and preferences',
      icon: UserIcon,
      href: '/profile/settings',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    }
  ];
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      if (user) fetchAppointments();
      // eslint-disable-next-line
    }, [user]);

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await appointmentServices.getUserAppointments(user.uid, 'doctor');
        setAppointments(data);
      } catch (e) {
        setAppointments([]);
      }
      setLoading(false);
    };

    const filtered = appointments.filter(a => {
      const statusMatch = statusFilter === 'all' || a.status === statusFilter;
      const typeMatch = typeFilter === 'all' || (a.appointmentType || a.type) === typeFilter;
      const searchMatch =
        search.trim() === '' ||
        (a.patientName && a.patientName.toLowerCase().includes(search.toLowerCase())) ||
        (a.patientEmail && a.patientEmail.toLowerCase().includes(search.toLowerCase()));
      return statusMatch && typeMatch && searchMatch;
    });

    const stats = {
      total: appointments.length,
      today: appointments.filter(a => {
        const d = new Date(a.appointmentDate?.seconds ? a.appointmentDate.seconds * 1000 : a.appointmentDate);
        const t = new Date();
        return d.toDateString() === t.toDateString();
      }).length,
      pending: appointments.filter(a => a.status === 'pending').length,
      completed: appointments.filter(a => a.status === 'completed').length,
    };

    const formatDate = d => {
      if (!d) return '';
      const date = typeof d === 'object' && d.seconds ? new Date(d.seconds * 1000) : new Date(d);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleAction = async (id, action) => {
      if (!id) return;
      if (action === 'confirm') await appointmentServices.approveAppointment(id, user.uid);
      if (action === 'complete') await appointmentServices.updateAppointmentStatus(id, 'completed', { actorId: user.uid });
      if (action === 'cancel') await appointmentServices.updateAppointmentStatus(id, 'cancelled', { actorId: user.uid });
      fetchAppointments();
    };

    // Compute urgency based on reason/symptoms keywords. Higher number = higher urgency.
    const computeUrgency = (apt) => {
      if (!apt) return 0;
      const text = `${apt.reason || ''} ${apt.reasonForVisit || ''} ${apt.diagnosis || ''}`.toLowerCase();
      const high = ['chest pain','shortness of breath','breathless','unconscious','stroke','paralysis','severe bleeding','heavy bleeding','severe pain','collapse'];
      const med = ['fever','high fever','infection','severe','dizziness','vomit','vomiting','dehydration','loss of consciousness','urgent'];
      for (const k of high) if (text.includes(k)) return 5;
      for (const k of med) if (text.includes(k)) return 3;
      return 1;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">Doctor Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Quick Actions Left */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="block p-6 rounded-xl border-2 border-transparent bg-white hover:border-blue-300 shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                      Go
                      <EyeIcon className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Graphs/Business Visuals Right */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-stretch">
              <h2 className="text-lg font-bold text-blue-800 mb-4">Business Overview</h2>
              <div className="w-full h-56">
                <BusinessChart appointments={appointments} />
              </div>
              <div className="mt-4 text-xs text-gray-500">Showing appointments over the last 7 days.</div>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Today" value={stats.today} />
            <StatCard label="Pending" value={stats.pending} />
            <StatCard label="Completed" value={stats.completed} />
          </div>
          {/* Table removed: only quick actions, stats, and chart remain */}
          {showModal && selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowModal(false)} aria-label="Close">×</button>
                <h3 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-blue-400" /> Appointment Details
                </h3>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Patient:</strong> <span>{selected.patientName}</span></div>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Email:</strong> <span>{selected.patientEmail}</span></div>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Date:</strong> <span>{formatDate(selected.appointmentDate)}</span></div>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Time:</strong> <span>{selected.appointmentTime || selected.time || selected.selectedTime}</span></div>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Type:</strong> <span className="capitalize">{selected.appointmentType || selected.type}</span></div>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Status:</strong> <span className="capitalize">{selected.status}</span></div>
                <div className="mb-2 text-sm text-gray-700 flex items-center gap-2"><strong>Urgency:</strong> <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white ${computeUrgency(selected) >= 5 ? 'bg-red-500' : computeUrgency(selected) >= 3 ? 'bg-yellow-400' : 'bg-green-400'}`}>{computeUrgency(selected) >= 5 ? 'High' : computeUrgency(selected) >= 3 ? 'Medium' : 'Low'}</span></div>
                {selected.reasonForVisit && (<div className="mb-2 text-sm text-gray-700"><strong>Reason:</strong> {selected.reasonForVisit}</div>)}
                {selected.reason && (<div className="mb-2 text-sm text-gray-700"><strong>Reason:</strong> {selected.reason}</div>)}
                {selected.specialization && (<div className="mb-2 text-sm text-gray-700"><strong>Specialization:</strong> {selected.specialization}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  function StatCard({ label, value }) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-center">
        <div className="text-2xl font-bold text-blue-700">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    );
  }

  // Small inline business chart (7-day bar + sparkline)
  function BusinessChart({ appointments = [] }) {
    // build last 7 days labels
    const days = [];
    const counts = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0,0,0,0);
      days.push(d);
      counts.push(0);
    }

    appointments.forEach(a => {
      const ts = a.appointmentDate?.seconds ? new Date(a.appointmentDate.seconds * 1000) : new Date(a.appointmentDate);
      if (!ts || isNaN(ts)) return;
      const dayStart = new Date(ts); dayStart.setHours(0,0,0,0);
      for (let i = 0; i < days.length; i++) {
        if (days[i].toDateString() === dayStart.toDateString()) {
          counts[i] += 1;
          break;
        }
      }
    });

    const max = Math.max(...counts, 1);
    const width = 300;
    const height = 120;
    const padding = 8;
    const barWidth = (width - padding * 2) / counts.length - 6;

    // sparkline path
    const points = counts.map((c, i) => {
      const x = padding + i * ((width - padding*2) / (counts.length-1 || 1));
      const y = padding + (1 - c / max) * (height - padding*2);
      return `${x},${y}`;
    });
    const sparkPath = points.map((p, i) => (i===0?`M ${p}`:`L ${p}`)).join(' ');

    return (
      <div className="w-full h-full flex flex-col">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* bars */}
          {counts.map((c,i) => {
            const x = padding + i * ((width - padding*2) / counts.length) + 3;
            const bh = (c / max) * (height - padding*2);
            const y = height - padding - bh;
            return (
              <rect key={i} x={x} y={y} width={barWidth} height={bh} rx="3" fill="#60a5fa" opacity="0.9" />
            );
          })}

          {/* sparkline */}
          <path d={sparkPath} fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          {days.map((d,i) => (
            <div key={i} className="text-center" style={{width: `${100/counts.length}%`}}>
              <div>{d.toLocaleDateString(undefined,{weekday:'short'})}</div>
              <div className="font-semibold">{counts[i]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }



export default DoctorDashboard;
