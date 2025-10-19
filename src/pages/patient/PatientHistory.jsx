import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  DocumentTextIcon,
  UserCircleIcon,
  BeakerIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const PatientHistory = () => {
  const { user, userProfile } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    loadMedicalHistory();
  }, []);

  const loadMedicalHistory = async () => {
    setLoading(true);
    try {
      // TODO: Fetch from Firebase - medical records for this patient
      setMedicalRecords([
        {
          id: 'MR001',
          date: '2025-10-18',
          doctorName: 'Dr. Amit Kumar',
          specialty: 'General Physician',
          hospital: 'Apollo Hospital, Mumbai',
          diagnosis: 'Viral Fever',
          healthCondition: 'Patient presented with high fever (102°F), body ache, and fatigue. Vitals stable. No respiratory distress.',
          medicines: [
            {
              name: 'Paracetamol 500mg',
              dosage: '2 tablets',
              frequency: 'Three times daily',
              duration: '5 days',
              timing: 'After meals'
            },
            {
              name: 'Azithromycin 500mg',
              dosage: '1 tablet',
              frequency: 'Once daily',
              duration: '3 days',
              timing: 'After meals'
            }
          ],
          instructions: 'Take plenty of fluids. Rest for 3-4 days. Avoid cold beverages.',
          nextVisit: '2025-10-25',
          prescriptionSharedWith: ['patient', 'medicine-seller']
        },
        {
          id: 'MR002',
          date: '2025-10-10',
          doctorName: 'Dr. Priya Mehta',
          specialty: 'Cardiologist',
          hospital: 'Lilavati Hospital, Mumbai',
          diagnosis: 'Routine Checkup',
          healthCondition: 'BP: 120/80, Pulse: 72 bpm. ECG normal. Overall cardiovascular health is good.',
          medicines: [
            {
              name: 'Aspirin 75mg',
              dosage: '1 tablet',
              frequency: 'Once daily',
              duration: '30 days',
              timing: 'After dinner'
            }
          ],
          instructions: 'Continue regular exercise. Low salt diet recommended. Follow-up in 3 months.',
          nextVisit: '2026-01-10',
          prescriptionSharedWith: ['patient', 'medicine-seller']
        }
      ]);
    } catch (error) {
      console.error('Error loading medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
          <p className="mt-2 text-gray-600">
            View your past appointments, prescriptions, and health records
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Appointments</p>
                <p className="text-3xl font-bold mt-1">{medicalRecords.length}</p>
              </div>
              <CalendarIcon className="w-12 h-12 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Prescriptions</p>
                <p className="text-3xl font-bold mt-1">
                  {medicalRecords.reduce((sum, record) => sum + record.medicines.length, 0)}
                </p>
              </div>
              <BeakerIcon className="w-12 h-12 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Doctors Consulted</p>
                <p className="text-3xl font-bold mt-1">
                  {new Set(medicalRecords.map(r => r.doctorName)).size}
                </p>
              </div>
              <UserCircleIcon className="w-12 h-12 text-green-200" />
            </div>
          </motion.div>
        </div>

        {/* Medical Records Timeline */}
        <div className="space-y-6">
          {medicalRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Record Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(record.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {record.doctorName.charAt(3)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{record.doctorName}</h3>
                      <p className="text-sm text-gray-600">{record.specialty} • {record.hospital}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(record.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {record.diagnosis}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    {expandedRecord === record.id ? (
                      <ChevronUpIcon className="w-6 h-6" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedRecord === record.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 space-y-6">
                    {/* Health Condition */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-500" />
                        Health Condition
                      </h4>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {record.healthCondition}
                      </p>
                    </div>

                    {/* Medicines */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <BeakerIcon className="w-5 h-5 text-purple-500" />
                        Prescribed Medicines
                      </h4>
                      <div className="space-y-3">
                        {record.medicines.map((medicine, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{medicine.name}</h5>
                              <span className="px-2 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                {medicine.duration}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500">Dosage:</span>
                                <p className="text-gray-900 font-medium">{medicine.dosage}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Frequency:</span>
                                <p className="text-gray-900 font-medium">{medicine.frequency}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Timing:</span>
                                <p className="text-gray-900 font-medium">{medicine.timing}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <p className="text-gray-900 font-medium">{medicine.duration}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    {record.instructions && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Additional Instructions
                        </h4>
                        <p className="text-gray-600 bg-amber-50 p-4 rounded-lg border border-amber-100">
                          {record.instructions}
                        </p>
                      </div>
                    )}

                    {/* Next Visit */}
                    {record.nextVisit && (
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Next visit scheduled for:{' '}
                          <span className="font-semibold text-gray-900">
                            {new Date(record.nextVisit).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Shared With */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Prescription shared with: {' '}
                        <span className="font-medium text-gray-900">
                          You & Medicine Pharmacy
                        </span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm">
                        Download Prescription
                      </button>
                      <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                        Share with Doctor
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {medicalRecords.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No medical history yet</h3>
            <p className="text-gray-600 mb-6">
              Your medical records and prescriptions will appear here after doctor consultations
            </p>
            <button
              onClick={() => window.location.href = '/appointment/book'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <CalendarIcon className="w-5 h-5" />
              Book Your First Appointment
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
