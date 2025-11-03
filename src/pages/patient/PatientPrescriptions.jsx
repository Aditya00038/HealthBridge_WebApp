import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BeakerIcon,
  PrinterIcon,
  ArrowPathIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast from 'react-hot-toast';

const PatientPrescriptions = () => {
  const { user, userProfile } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    if (user) {
      loadPrescriptions();
    }
  }, [user]);

  const loadPrescriptions = async () => {
    if (!user) {
      console.log('❌ No user logged in');
      return;
    }
    
    console.log('👤 Loading prescriptions for user:', user.uid);
    setLoading(true);
    
    try {
      // Fetch prescriptions from Firebase
      console.log('🔍 Querying patientRecords collection...');
      const recordsQuery = query(
        collection(db, 'patientRecords'),
        where('patientId', '==', user.uid),
        orderBy('visitDate', 'desc')
      );
      
      console.log('📡 Executing Firebase query...');
      const recordsSnapshot = await getDocs(recordsQuery);
      console.log('✅ Query successful! Documents found:', recordsSnapshot.size);
      
      if (recordsSnapshot.empty) {
        console.log('📭 No prescriptions found for this patient');
        console.log('💡 Tip: Make sure doctor created prescription for patientId:', user.uid);
      }
      
      const records = recordsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Processing document:', doc.id, data);
        return {
          id: doc.id,
          date: data.visitDate?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          doctorName: data.doctorName || 'Unknown Doctor',
          specialty: data.specialty || 'General Physician',
          hospital: data.hospital || 'HealthBridge',
          diagnosis: data.diagnosis || 'Consultation',
          healthCondition: data.healthCondition || 'No details provided',
          medicines: data.medicines || [],
          instructions: data.instructions || '',
          nextVisit: data.nextVisit || null,
          visitDate: data.visitDate?.toDate()
        };
      });
      
      console.log('📋 Loaded prescriptions:', records);
      console.log('📊 Total prescriptions found:', records.length);
      setPrescriptions(records);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading prescriptions:', error);
      console.error('Error details:', error.message);
      console.error('Error code:', error.code);
      toast.error(`Failed to load prescriptions: ${error.message}`);
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  const handlePrintPrescription = (record) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${userProfile?.name || 'Patient'}</title>
        <style>
          @media print {
            @page { margin: 20mm; }
            body { margin: 0; }
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 4px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            font-size: 32px;
            margin-bottom: 5px;
            font-weight: bold;
          }
          .header p {
            color: #666;
            font-size: 14px;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            gap: 20px;
          }
          .info-box {
            flex: 1;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .info-box h3 {
            color: #2563eb;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-box p {
            font-size: 13px;
            margin: 5px 0;
            color: #333;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            color: #2563eb;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e2e8f0;
          }
          .medicines-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
          }
          .medicines-table thead {
            background: #2563eb;
            color: white;
          }
          .medicines-table th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
          }
          .medicines-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          .medicines-table tbody tr:hover {
            background: #f8fafc;
          }
          .medicines-table tbody tr:last-child td {
            border-bottom: 2px solid #2563eb;
          }
          .instructions {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.8;
          }
          .signature {
            margin-top: 50px;
            text-align: right;
          }
          .signature-line {
            border-top: 2px solid #333;
            width: 250px;
            margin-left: auto;
            margin-bottom: 10px;
          }
          .signature p {
            margin: 2px 0;
            font-size: 14px;
          }
          .print-date {
            text-align: center;
            color: #666;
            font-size: 11px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 HealthBridge</h1>
          <p>Digital Healthcare Platform</p>
        </div>

        <h2 style="text-align: center; color: #1e40af; margin-bottom: 20px; font-size: 20px;">
          MEDICAL PRESCRIPTION
        </h2>

        <div class="info-section">
          <div class="info-box">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${userProfile?.name || 'Patient'}</p>
            <p><strong>Age:</strong> ${userProfile?.age || 'N/A'}</p>
            <p><strong>Gender:</strong> ${userProfile?.gender || 'N/A'}</p>
          </div>
          <div class="info-box">
            <h3>Doctor Information</h3>
            <p><strong>Dr. ${record.doctorName}</strong></p>
            <p>${record.specialty}</p>
            <p>${record.hospital}</p>
          </div>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Prescription Details</h3>
            <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString('en-IN')}</p>
            <p><strong>Record ID:</strong> ${record.id}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📋 Diagnosis</div>
          <p>${record.diagnosis || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">🩺 Health Condition</div>
          <p>${record.healthCondition || 'N/A'}</p>
        </div>

        ${record.medicines && record.medicines.length > 0 ? `
          <div class="section">
            <div class="section-title">💊 Prescription (Rx)</div>
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
            <strong>⚠️ Important Instructions:</strong><br>
            ${record.instructions}
          </div>
        ` : ''}

        ${record.nextVisit ? `
          <div class="section">
            <div class="section-title">📅 Next Visit</div>
            <p><strong>Follow-up Date:</strong> ${new Date(record.nextVisit).toLocaleDateString('en-IN')}</p>
          </div>
        ` : ''}

        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>Dr. ${record.doctorName}</strong></p>
          <p>${record.specialty}</p>
        </div>

        <div class="print-date">
          This prescription was issued on ${new Date(record.date).toLocaleString('en-IN')}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your prescriptions...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPrescriptions = prescriptions.length;
  const totalMedicines = prescriptions.reduce((sum, p) => sum + (p.medicines?.length || 0), 0);
  const uniqueDoctors = new Set(prescriptions.map(p => p.doctorName)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💊 My Prescriptions
          </h1>
          <p className="text-gray-600">
            View all your medical prescriptions and doctor consultations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Prescriptions</p>
                <p className="text-3xl font-bold text-blue-600">{totalPrescriptions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Medicines</p>
                <p className="text-3xl font-bold text-purple-600">{totalMedicines}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BeakerIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Doctors Consulted</p>
                <p className="text-3xl font-bold text-green-600">{uniqueDoctors}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Prescriptions Timeline */}
        <div className="space-y-6">
          {prescriptions.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Prescription Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(record.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {record.doctorName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Dr. {record.doctorName}</h3>
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
                        {record.medicines?.length > 0 && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            {record.medicines.length} {record.medicines.length === 1 ? 'Medicine' : 'Medicines'}
                          </span>
                        )}
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
                    {record.medicines && record.medicines.length > 0 && (
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
                    )}

                    {/* Instructions */}
                    {record.instructions && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          ⚠️ Additional Instructions
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handlePrintPrescription(record)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <PrinterIcon className="w-5 h-5" />
                        Print Prescription
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {prescriptions.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
              <DocumentTextIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Prescriptions Yet</h3>
              <p className="text-gray-600 mb-6">
                Your prescriptions will appear here after doctor consultations
              </p>
              <button
                onClick={() => window.location.href = '/appointment/book'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <CalendarIcon className="w-5 h-5" />
                Book Your First Appointment
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
