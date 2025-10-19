import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  UserCircleIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  HeartIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const DoctorPatientRecords = () => {
  const { user, userProfile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [prescription, setPrescription] = useState({
    diagnosis: '',
    healthCondition: '',
    medicines: [
      { name: '', dosage: '', frequency: '', duration: '', timing: 'After meals' }
    ],
    instructions: '',
    nextVisit: ''
  });

  // Load patients
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      // TODO: Fetch from Firebase - patients who had appointments with this doctor
      setPatients([
        {
          id: 'P001',
          name: 'Rahul Sharma',
          age: 35,
          gender: 'Male',
          phone: '+91 98765 43210',
          email: 'rahul@example.com',
          lastVisit: '2025-10-15',
          bloodGroup: 'O+',
          appointments: 5
        },
        {
          id: 'P002',
          name: 'Priya Patel',
          age: 28,
          gender: 'Female',
          phone: '+91 98765 43211',
          email: 'priya@example.com',
          lastVisit: '2025-10-18',
          bloodGroup: 'B+',
          appointments: 3
        }
      ]);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [
        ...prescription.medicines,
        { name: '', dosage: '', frequency: '', duration: '', timing: 'After meals' }
      ]
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = prescription.medicines.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = prescription.medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const handleSubmitPrescription = async () => {
    try {
      // TODO: Save to Firebase
      const medicalRecord = {
        patientId: selectedPatient.id,
        doctorId: user.uid,
        doctorName: userProfile.name,
        date: new Date().toISOString(),
        ...prescription
      };

      console.log('Saving medical record:', medicalRecord);
      // After saving, this record will be visible to:
      // 1. Patient in their History page
      // 2. Medicine seller for fulfilling prescription
      
      alert('Prescription saved successfully!');
      setShowPrescriptionModal(false);
      resetPrescription();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Error saving prescription. Please try again.');
    }
  };

  const resetPrescription = () => {
    setPrescription({
      diagnosis: '',
      healthCondition: '',
      medicines: [
        { name: '', dosage: '', frequency: '', duration: '', timing: 'After meals' }
      ],
      instructions: '',
      nextVisit: ''
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <p className="mt-2 text-gray-600">View patient history and add prescriptions</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Patients Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      {patient.bloodGroup}
                    </span>
                    <span className="text-sm text-gray-600">
                      {patient.age}y, {patient.gender}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4" />
                  Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DocumentTextIcon className="w-4 h-4" />
                  Total appointments: {patient.appointments}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    // TODO: Load patient's medical history
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  View History
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPrescriptionModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                >
                  Add Prescription
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Prescription Modal */}
        {showPrescriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 my-8"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Prescription</h2>
                  <p className="text-gray-600 mt-1">
                    Patient: {selectedPatient?.name} ({selectedPatient?.id})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    resetPrescription();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    value={prescription.diagnosis}
                    onChange={(e) => setPrescription({ ...prescription, diagnosis: e.target.value })}
                    placeholder="e.g., Common Cold, Viral Fever"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Health Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Health Condition
                  </label>
                  <textarea
                    value={prescription.healthCondition}
                    onChange={(e) => setPrescription({ ...prescription, healthCondition: e.target.value })}
                    placeholder="Describe patient's current condition, symptoms, vital signs..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Medicines */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Medicines
                    </label>
                    <button
                      onClick={addMedicine}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Medicine
                    </button>
                  </div>

                  <div className="space-y-4">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Medicine {index + 1}
                          </span>
                          {prescription.medicines.length > 1 && (
                            <button
                              onClick={() => removeMedicine(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Medicine Name"
                              value={medicine.name}
                              onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Dosage (e.g., 500mg, 2 tablets)"
                              value={medicine.dosage}
                              onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <select
                              value={medicine.frequency}
                              onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="">Select Frequency</option>
                              <option value="Once daily">Once daily</option>
                              <option value="Twice daily">Twice daily (Morning & Night)</option>
                              <option value="Three times daily">Three times daily</option>
                              <option value="Four times daily">Four times daily</option>
                              <option value="Every 4 hours">Every 4 hours</option>
                              <option value="Every 6 hours">Every 6 hours</option>
                              <option value="As needed">As needed</option>
                            </select>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Duration (e.g., 5 days, 2 weeks)"
                              value={medicine.duration}
                              onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <select
                              value={medicine.timing}
                              onChange={(e) => updateMedicine(index, 'timing', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="Before meals">Before meals</option>
                              <option value="After meals">After meals</option>
                              <option value="With meals">With meals</option>
                              <option value="Empty stomach">Empty stomach</option>
                              <option value="Before sleep">Before sleep</option>
                              <option value="Anytime">Anytime</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Instructions
                  </label>
                  <textarea
                    value={prescription.instructions}
                    onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })}
                    placeholder="Diet restrictions, lifestyle advice, precautions..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Next Visit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Visit (Optional)
                  </label>
                  <input
                    type="date"
                    value={prescription.nextVisit}
                    onChange={(e) => setPrescription({ ...prescription, nextVisit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    resetPrescription();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPrescription}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Save Prescription
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {filteredPatients.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No patients found' : 'No patients yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'Patients will appear here after their first appointment'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientRecords;
