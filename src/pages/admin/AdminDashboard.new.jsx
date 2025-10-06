import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doctorServices } from '../../services/firebaseServices';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  IdentificationIcon,
  StarIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Doctor Card Component
const DoctorCard = ({ doctor, isPending = true, onApprove, onReject, onViewDetails }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {doctor.displayName?.charAt(0) || 'D'}
          </span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{doctor.displayName}</h3>
          <p className="text-blue-600 font-medium">{doctor.specialization}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {doctor.experience}
            </div>
            <div className="flex items-center gap-1">
              <IdentificationIcon className="h-4 w-4" />
              {doctor.licenseNumber}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewDetails(doctor)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <EyeIcon className="h-5 w-5" />
        </button>
        
        {isPending && (
          <>
            <button
              onClick={() => onApprove(doctor.id)}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              title="Approve"
            >
              <CheckCircleIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onReject(doctor.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Reject"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-700">
            In-person: <span className="font-medium">${doctor.consultationFee}</span>
          </span>
          <span className="text-gray-700">
            Video: <span className="font-medium">${doctor.videoConsultationFee}</span>
          </span>
        </div>
        {!isPending && (
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{doctor.rating || '5.0'}</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Doctor Detail Modal Component
const DoctorDetailModal = ({ doctor, onClose, onApprove, onReject }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Doctor Profile Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {doctor.displayName?.charAt(0) || 'D'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{doctor.displayName}</h3>
            <p className="text-blue-600 font-medium text-lg">{doctor.specialization}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                doctor.isApproved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {doctor.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Professional Info</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">License Number:</span>
                <span className="ml-2 font-medium">{doctor.licenseNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Experience:</span>
                <span className="ml-2 font-medium">{doctor.experience}</span>
              </div>
              <div>
                <span className="text-gray-600">Education:</span>
                <span className="ml-2 font-medium">{doctor.education}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Consultation Fees</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">In-person:</span>
                <span className="ml-2 font-medium">${doctor.consultationFee}</span>
              </div>
              <div>
                <span className="text-gray-600">Video Call:</span>
                <span className="ml-2 font-medium">${doctor.videoConsultationFee}</span>
              </div>
              <div>
                <span className="text-gray-600">Languages:</span>
                <span className="ml-2 font-medium">{doctor.languages?.join(', ') || 'English'}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Professional Bio</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
        </div>

        {doctor.clinicAddress && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Clinic Address</h4>
            <p className="text-gray-600 text-sm">{doctor.clinicAddress}</p>
          </div>
        )}

        {!doctor.isApproved && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onApprove(doctor.id);
                onClose();
              }}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              Approve Doctor
            </button>
            <button
              onClick={() => {
                onReject(doctor.id);
                onClose();
              }}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <XCircleIcon className="h-5 w-5" />
              Reject Application
            </button>
          </div>
        )}
      </div>
    </motion.div>
  </div>
);

const AdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const [stats, setStats] = useState({
    totalUsers: 1547,
    totalDoctors: 0,
    totalPatients: 1458,
    totalAppointments: 3246,
    pendingDoctors: 0,
    monthlyRevenue: 87500,
    activeSubscriptions: 1234,
    systemHealth: 99.2
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      await fetchDoctors();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const allDoctors = await doctorServices.getAllDoctors(false);
      
      const pending = allDoctors.filter(doctor => !doctor.isApproved);
      const approved = allDoctors.filter(doctor => doctor.isApproved);
      
      setPendingDoctors(pending);
      setApprovedDoctors(approved);
      
      setStats(prev => ({
        ...prev,
        pendingDoctors: pending.length,
        totalDoctors: approved.length
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await doctorServices.updateDoctorApproval(doctorId, true);
      toast.success('Doctor approved successfully!');
      fetchDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
      toast.error('Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await doctorServices.updateDoctorApproval(doctorId, false);
      toast.success('Doctor rejected');
      fetchDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Failed to reject doctor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage doctor applications and system overview</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  {stats.pendingDoctors} Pending Approvals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'overview'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'pending'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Doctors ({pendingDoctors.length})
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'approved'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approved Doctors ({approvedDoctors.length})
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Doctors</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalDoctors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BellIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingDoctors}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Doctors Tab */}
        {selectedTab === 'pending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingDoctors.length > 0 ? (
              pendingDoctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  isPending={true}
                  onApprove={handleApproveDoctor}
                  onReject={handleRejectDoctor}
                  onViewDetails={setSelectedDoctor}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
                <p className="text-gray-600">All doctor applications have been reviewed.</p>
              </div>
            )}
          </div>
        )}

        {/* Approved Doctors Tab */}
        {selectedTab === 'approved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedDoctors.length > 0 ? (
              approvedDoctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  isPending={false}
                  onViewDetails={setSelectedDoctor}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <CheckCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Doctors</h3>
                <p className="text-gray-600">No doctors have been approved yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <DoctorDetailModal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)}
          onApprove={handleApproveDoctor}
          onReject={handleRejectDoctor}
        />
      )}
    </div>
  );
};

export default AdminDashboard;