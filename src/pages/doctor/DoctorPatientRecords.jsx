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
  BeakerIcon,
  PrinterIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast from 'react-hot-toast';

const DoctorPatientRecords = () => {
  const { user, userProfile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

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
    if (user) {
      loadPatients();
    }
  }, [user]);

  const loadPatients = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch patient records where this doctor treated the patient
      const recordsQuery = query(
        collection(db, 'patientRecords'),
        where('doctorId', '==', user.uid)
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      const recordsMap = new Map();
      
      // Group records by patientId and get latest visit
      recordsSnapshot.forEach(doc => {
        const record = { id: doc.id, ...doc.data() };
        const patientId = record.patientId;
        
        if (!recordsMap.has(patientId) || 
            record.visitDate?.toMillis() > recordsMap.get(patientId).lastVisit?.toMillis()) {
          recordsMap.set(patientId, {
            id: patientId,
            name: record.patientName || 'Unknown Patient',
            lastVisit: record.visitDate,
            recordId: doc.id,
            ...record
          });
        }
      });

      // Convert map to array and add appointment count
      const patientsData = await Promise.all(
        Array.from(recordsMap.values()).map(async (patient) => {
          // Count total visits for this patient with this doctor
          const patientRecordsQuery = query(
            collection(db, 'patientRecords'),
            where('doctorId', '==', user.uid),
            where('patientId', '==', patient.id)
          );
          const patientRecordsSnapshot = await getDocs(patientRecordsQuery);
          
          return {
            ...patient,
            appointments: patientRecordsSnapshot.size,
            lastVisit: patient.lastVisit?.toDate().toISOString().split('T')[0] || 'N/A'
          };
        })
      );

      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patient records');
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
      const prescriptionData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctorId: user.uid,
        doctorName: userProfile?.name || 'Doctor',
        specialty: userProfile?.specialty || 'General Physician',
        hospital: userProfile?.hospital || 'HealthBridge',
        visitDate: Timestamp.now(),
        diagnosis: prescription.diagnosis,
        healthCondition: prescription.healthCondition,
        medicines: prescription.medicines.filter(m => m.name.trim() !== ''), // Only save non-empty medicines
        instructions: prescription.instructions,
        nextVisit: prescription.nextVisit,
        status: 'prescribed',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Update the patient record with prescription
      if (selectedPatient.recordId) {
        const recordRef = doc(db, 'patientRecords', selectedPatient.recordId);
        await updateDoc(recordRef, {
          ...prescriptionData,
          updatedAt: Timestamp.now()
        });
        toast.success('✅ Prescription updated successfully!');
      } else {
        // Create new record if none exists
        await addDoc(collection(db, 'patientRecords'), prescriptionData);
        toast.success('✅ Prescription saved successfully!');
      }
      
      setShowPrescriptionModal(false);
      resetPrescription();
      loadPatients(); // Refresh patient list
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription. Please try again.');
    }
  };

  const handlePrintPrescription = () => {
    const printWindow = window.open('', '_blank');
    const patient = selectedPatient;
    const doctor = userProfile;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${patient.name}</title>
        <style>
          @media print {
            @page { margin: 20mm; }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #2563eb;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .info-box {
            flex: 1;
          }
          .info-box h3 {
            margin: 0 0 10px 0;
            color: #334155;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: bold;
          }
          .info-box p {
            margin: 3px 0;
            color: #475569;
          }
          .section {
            margin: 20px 0;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .medicines-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .medicines-table th {
            background: #2563eb;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
          }
          .medicines-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          .medicines-table tr:nth-child(even) {
            background: #f8fafc;
          }
          .instructions {
            padding: 15px;
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            margin: 15px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: right;
          }
          .signature {
            margin-top: 50px;
            text-align: right;
          }
          .signature-line {
            border-top: 2px solid #000;
            width: 200px;
            margin-left: auto;
            margin-top: 60px;
          }
          .print-date {
            text-align: center;
            color: #64748b;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 HealthBridge</h1>
          <p><strong>Dr. ${doctor?.name || 'Doctor'}</strong></p>
          <p>${doctor?.specialization || 'General Physician'} | ${doctor?.qualification || 'MBBS'}</p>
          <p>📞 ${doctor?.phone || 'N/A'} | 📧 ${doctor?.email || ''}</p>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age || 'N/A'}</p>
            <p><strong>Gender:</strong> ${patient.gender || 'N/A'}</p>
            <p><strong>Blood Group:</strong> ${patient.bloodGroup || 'N/A'}</p>
          </div>
          <div class="info-box" style="text-align: right;">
            <h3>Prescription Details</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            <p><strong>Patient ID:</strong> ${patient.id}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Diagnosis</div>
          <p>${prescription.diagnosis || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">Health Condition</div>
          <p>${prescription.healthCondition || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">Prescription (Rx)</div>
          <table class="medicines-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Timing</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medicines.map((med, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${med.name}</strong></td>
                  <td>${med.dosage}</td>
                  <td>${med.frequency}</td>
                  <td>${med.duration}</td>
                  <td>${med.timing}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${prescription.instructions ? `
          <div class="instructions">
            <strong>⚠️ Instructions:</strong><br>
            ${prescription.instructions}
          </div>
        ` : ''}

        ${prescription.nextVisit ? `
          <div class="section">
            <div class="section-title">Next Visit</div>
            <p><strong>Date:</strong> ${new Date(prescription.nextVisit).toLocaleDateString('en-IN')}</p>
          </div>
        ` : ''}

        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>Dr. ${doctor?.name || 'Doctor'}</strong></p>
          <p>${doctor?.specialization || 'General Physician'}</p>
          <p>Medical Registration No: ${doctor?.registrationNumber || 'XXXX'}</p>
        </div>

        <div class="print-date">
          This prescription was generated on ${new Date().toLocaleString('en-IN')}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
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

  const loadPatientHistory = async (patientId) => {
    setHistoryLoading(true);
    try {
      const historyQuery = query(
        collection(db, 'patientRecords'),
        where('doctorId', '==', user.uid),
        where('patientId', '==', patientId)
      );
      
      const historySnapshot = await getDocs(historyQuery);
      const history = historySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        visitDate: doc.data().visitDate?.toDate()
      }));
      
      // Sort by date (newest first)
      history.sort((a, b) => b.visitDate - a.visitDate);
      
      setPatientHistory(history);
    } catch (error) {
      console.error('Error loading patient history:', error);
      toast.error('Failed to load patient history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewHistory = async (patient) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
    await loadPatientHistory(patient.id);
  };

  const handlePrintRecord = (record) => {
    const printWindow = window.open('', '_blank');
    const doctor = userProfile;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Record - ${record.patientName}</title>
        <style>
          @media print {
            @page { margin: 20mm; }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #2563eb;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .section {
            margin: 20px 0;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .medicines-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .medicines-table th {
            background: #2563eb;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
          }
          .medicines-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          .instructions {
            padding: 15px;
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            margin: 15px 0;
          }
          .signature {
            margin-top: 50px;
            text-align: right;
          }
          .signature-line {
            border-top: 2px solid #000;
            width: 200px;
            margin-left: auto;
            margin-top: 60px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 HealthBridge</h1>
          <p><strong>Dr. ${doctor?.name || 'Doctor'}</strong></p>
          <p>${doctor?.specialization || 'General Physician'}</p>
        </div>

        <div class="info-section">
          <div>
            <h3>Patient: ${record.patientName}</h3>
            <p>Visit Date: ${record.visitDate ? new Date(record.visitDate).toLocaleDateString('en-IN') : 'N/A'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Diagnosis</div>
          <p>${record.diagnosis || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">Health Condition</div>
          <p>${record.healthCondition || 'N/A'}</p>
        </div>

        ${record.medicines && record.medicines.length > 0 ? `
          <div class="section">
            <div class="section-title">Medicines</div>
            <table class="medicines-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Timing</th>
                </tr>
              </thead>
              <tbody>
                ${record.medicines.map((med, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${med.name}</strong></td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                    <td>${med.duration}</td>
                    <td>${med.timing}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${record.instructions ? `
          <div class="instructions">
            <strong>Instructions:</strong><br>
            ${record.instructions}
          </div>
        ` : ''}

        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>Dr. ${doctor?.name || 'Doctor'}</strong></p>
          <p>${doctor?.specialization || 'General Physician'}</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
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
                  onClick={() => handleViewHistory(patient)}
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
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrintPrescription}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                >
                  <PrinterIcon className="w-5 h-5" />
                  Print
                </button>
                <button
                  onClick={handleSubmitPrescription}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Save Prescription
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 my-8"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
                  <p className="text-gray-600 mt-1">
                    Patient: {selectedPatient?.name} ({selectedPatient?.id})
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* History Content */}
              <div className="max-h-[70vh] overflow-y-auto pr-2">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-3 text-gray-600">Loading history...</span>
                  </div>
                ) : patientHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No medical history yet
                    </h3>
                    <p className="text-gray-600">
                      Add a prescription to start building this patient's medical history
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientHistory.map((record, index) => (
                      <div key={record.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Visit {patientHistory.length - index}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {record.visitDate ? record.visitDate.toLocaleDateString('en-IN', { 
                                day: 'numeric',
                                month: 'long', 
                                year: 'numeric' 
                              }) : 'Date not available'}
                            </p>
                          </div>
                          <button
                            onClick={() => handlePrintRecord(record)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <PrinterIcon className="w-4 h-4" />
                            Print
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Diagnosis</p>
                            <p className="text-gray-900">{record.diagnosis || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {record.status || 'Completed'}
                            </span>
                          </div>
                        </div>

                        {record.healthCondition && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Health Condition</p>
                            <p className="text-gray-900">{record.healthCondition}</p>
                          </div>
                        )}

                        {record.medicines && record.medicines.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Medicines</p>
                            <div className="space-y-2">
                              {record.medicines.map((med, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{med.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {med.dosage} • {med.frequency} • {med.duration} • {med.timing}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.instructions && (
                          <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Instructions</p>
                            <p className="text-gray-900 text-sm">{record.instructions}</p>
                          </div>
                        )}

                        {record.nextVisit && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Next Visit</p>
                            <p className="text-gray-900">{new Date(record.nextVisit).toLocaleDateString('en-IN')}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowHistoryModal(false);
                    setShowPrescriptionModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Add New Prescription
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
