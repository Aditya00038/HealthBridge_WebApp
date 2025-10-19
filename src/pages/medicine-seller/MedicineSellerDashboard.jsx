import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BeakerIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const MedicineSellerDashboard = () => {
  const { user, userProfile } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, fulfilled
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      // TODO: Fetch from Firebase - all prescriptions shared with medicine sellers
      setPrescriptions([
        {
          id: 'RX001',
          patientId: 'P001',
          patientName: 'Rahul Sharma',
          patientPhone: '+91 98765 43210',
          doctorName: 'Dr. Amit Kumar',
          hospital: 'Apollo Hospital, Mumbai',
          date: '2025-10-18',
          diagnosis: 'Viral Fever',
          medicines: [
            {
              name: 'Paracetamol 500mg',
              dosage: '2 tablets',
              frequency: 'Three times daily',
              duration: '5 days',
              timing: 'After meals',
              inStock: true,
              price: 25
            },
            {
              name: 'Azithromycin 500mg',
              dosage: '1 tablet',
              frequency: 'Once daily',
              duration: '3 days',
              timing: 'After meals',
              inStock: true,
              price: 180
            }
          ],
          status: 'pending', // pending, fulfilled, cancelled
          totalAmount: 205
        },
        {
          id: 'RX002',
          patientId: 'P002',
          patientName: 'Priya Patel',
          patientPhone: '+91 98765 43211',
          doctorName: 'Dr. Priya Mehta',
          hospital: 'Lilavati Hospital, Mumbai',
          date: '2025-10-17',
          diagnosis: 'Hypertension',
          medicines: [
            {
              name: 'Amlodipine 5mg',
              dosage: '1 tablet',
              frequency: 'Once daily',
              duration: '30 days',
              timing: 'After breakfast',
              inStock: true,
              price: 150
            }
          ],
          status: 'fulfilled',
          totalAmount: 150,
          fulfilledDate: '2025-10-17'
        }
      ]);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions
    .filter(rx => {
      const matchesSearch = 
        rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' || rx.status === filter;
      
      return matchesSearch && matchesFilter;
    });

  const handleFulfillPrescription = async (prescriptionId) => {
    try {
      // TODO: Update in Firebase
      setPrescriptions(prescriptions.map(rx =>
        rx.id === prescriptionId
          ? { ...rx, status: 'fulfilled', fulfilledDate: new Date().toISOString() }
          : rx
      ));
      alert('Prescription marked as fulfilled!');
    } catch (error) {
      console.error('Error fulfilling prescription:', error);
      alert('Error fulfilling prescription. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const pendingCount = prescriptions.filter(rx => rx.status === 'pending').length;
  const fulfilledCount = prescriptions.filter(rx => rx.status === 'fulfilled').length;
  const totalRevenue = prescriptions
    .filter(rx => rx.status === 'fulfilled')
    .reduce((sum, rx) => sum + rx.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Medicine Seller Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage prescriptions and medicine orders</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold mt-1">{pendingCount}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-amber-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Fulfilled Orders</p>
                <p className="text-3xl font-bold mt-1">{fulfilledCount}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">₹{totalRevenue}</p>
              </div>
              <ShoppingBagIcon className="w-12 h-12 text-blue-200" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or prescription ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === 'pending'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('fulfilled')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === 'fulfilled'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Fulfilled
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-6">
          {filteredPrescriptions.map((rx, index) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Prescription Header */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {rx.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{rx.patientName}</h3>
                      <p className="text-sm text-gray-600">Prescription ID: {rx.id}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{rx.patientPhone}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(rx.status)}`}>
                    {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <UserCircleIcon className="w-4 h-4" />
                    <span>Dr. {rx.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>{rx.diagnosis}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{new Date(rx.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Medicines List */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <BeakerIcon className="w-5 h-5 text-blue-500" />
                  Prescribed Medicines
                </h4>

                <div className="space-y-3 mb-6">
                  {rx.medicines.map((medicine, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{medicine.name}</h5>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Dosage: {medicine.dosage}</span>
                          <span>•</span>
                          <span>{medicine.frequency}</span>
                          <span>•</span>
                          <span>{medicine.duration}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Timing: {medicine.timing}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{medicine.price}</p>
                        {medicine.inStock ? (
                          <span className="text-xs text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{rx.totalAmount}</p>
                  </div>

                  {rx.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleFulfillPrescription(rx.id)}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        Mark as Fulfilled
                      </button>
                      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        Contact Patient
                      </button>
                    </div>
                  )}

                  {rx.status === 'fulfilled' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Fulfilled on</p>
                      <p className="text-sm font-medium text-green-600">
                        {new Date(rx.fulfilledDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrescriptions.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BeakerIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No prescriptions found' : 'No prescriptions yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'Prescriptions will appear here when doctors share them'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MedicineSellerDashboard;
