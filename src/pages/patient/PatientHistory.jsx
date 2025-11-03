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
  ShoppingBagIcon,
  HeartIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PrinterIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast from 'react-hot-toast';

const HealthHistoryPage = () => {
  const { user, userProfile } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [wellnessSummary, setWellnessSummary] = useState({});
  const [vaccinationRecords, setVaccinationRecords] = useState([]);

  useEffect(() => {
    if (user) {
      loadMedicalHistory();
    }
  }, [user]);

  const loadMedicalHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch from Firebase - medical records for this patient
      const recordsQuery = query(
        collection(db, 'patientRecords'),
        where('patientId', '==', user.uid),
        orderBy('visitDate', 'desc')
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      const records = recordsSnapshot.docs.map(doc => {
        const data = doc.data();
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
          prescriptionSharedWith: ['patient', 'medicine-seller'],
          reason: data.reason || '',
          visitDate: data.visitDate?.toDate()
        };
      });
      
      console.log('📋 Loaded medical records:', records);
      setMedicalRecords(records);

      setLabResults([
        {
          id: 'LAB-1205',
          testName: 'Complete Blood Count',
          labName: 'Apollo Diagnostics',
          date: '2025-10-17',
          status: 'Normal',
          highlights: 'All parameters within normal range',
          trend: 'Stable'
        },
        {
          id: 'LAB-1178',
          testName: 'HbA1C',
          labName: 'Metropolis Labs',
          date: '2025-09-10',
          status: 'Slightly High',
          highlights: 'HbA1C at 6.2% - monitor diet',
          trend: 'Improving'
        }
      ]);

      setWellnessSummary({
        weight: '68.4 kg',
        bmi: '22.1',
        bloodPressure: '118 / 76 mmHg',
        heartRate: '72 bpm',
        sleep: '7h 20m avg',
        activity: '5,600 steps avg'
      });

      setVaccinationRecords([
        {
          name: 'Influenza Vaccine',
          status: 'Due Soon',
          dueDate: '2025-11-05',
          lastDose: '2024-10-30'
        },
        {
          name: 'COVID-19 Booster',
          status: 'Completed',
          dueDate: null,
          lastDose: '2025-02-12'
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

  const handlePrintPrescription = (record) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${record.doctorName}</title>
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
          <p><strong>${record.doctorName}</strong></p>
          <p>${record.specialty} | ${record.hospital}</p>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${userProfile?.name || 'Patient'}</p>
            <p><strong>Age:</strong> ${userProfile?.age || 'N/A'}</p>
            <p><strong>Gender:</strong> ${userProfile?.gender || 'N/A'}</p>
          </div>
          <div class="info-box" style="text-align: right;">
            <h3>Prescription Details</h3>
            <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString('en-IN')}</p>
            <p><strong>Record ID:</strong> ${record.id}</p>
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
            <strong>⚠️ Instructions:</strong><br>
            ${record.instructions}
          </div>
        ` : ''}

        ${record.nextVisit ? `
          <div class="section">
            <div class="section-title">Next Visit</div>
            <p><strong>Date:</strong> ${new Date(record.nextVisit).toLocaleDateString('en-IN')}</p>
          </div>
        ` : ''}

        <div class="signature">
          <div class="signature-line"></div>
          <p><strong>${record.doctorName}</strong></p>
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
          <p className="text-gray-600">Loading your medical history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Health History & Wellness Records</h1>
          <p className="mt-2 text-gray-600">
            Monitor doctor visits, prescriptions, lab reports, and day-to-day wellness insights in one secure place.
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

        {/* Wellness Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vital Trends</h2>
                <p className="text-sm text-gray-500">Latest readings from your recent visits</p>
              </div>
              <div className="bg-red-50 text-red-500 p-2 rounded-full">
                <HeartIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500">Weight</p>
                <p className="text-lg font-semibold text-gray-900">{wellnessSummary.weight || '--'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500">BMI</p>
                <p className="text-lg font-semibold text-gray-900">{wellnessSummary.bmi || '--'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500">Blood Pressure</p>
                <p className="text-lg font-semibold text-gray-900">{wellnessSummary.bloodPressure || '--'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500">Resting Heart Rate</p>
                <p className="text-lg font-semibold text-gray-900">{wellnessSummary.heartRate || '--'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Lifestyle & Habits</h2>
                <p className="text-sm text-gray-500">Daily habits supporting your health goals</p>
              </div>
              <div className="bg-purple-50 text-purple-500 p-2 rounded-full">
                <SparklesIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <span>Sleep Quality</span>
                <span className="font-semibold text-gray-900">{wellnessSummary.sleep || '--'}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <span>Daily Activity</span>
                <span className="font-semibold text-gray-900">{wellnessSummary.activity || '--'}</span>
              </div>
              <p className="text-xs text-gray-500">
                Tip: Maintain consistent sleep and light cardio to keep vitals within the ideal range.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vaccinations & Preventive Care</h2>
                <p className="text-sm text-gray-500">Upcoming boosters and completed shots</p>
              </div>
              <div className="bg-green-50 text-green-500 p-2 rounded-full">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-3">
              {vaccinationRecords.map((shot, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{shot.name}</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${shot.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {shot.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last dose: {shot.lastDose ? new Date(shot.lastDose).toLocaleDateString('en-IN') : 'N/A'}</p>
                  {shot.dueDate && (
                    <p className="text-xs text-amber-600 mt-1">Due on {new Date(shot.dueDate).toLocaleDateString('en-IN')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Lab Results */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Lab Results</h2>
              <p className="text-sm text-gray-500">Key highlights from partner diagnostics centres</p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all reports
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labResults.map((result) => (
              <div key={result.id} className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-white to-blue-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{result.labName}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${result.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tested on {new Date(result.date).toLocaleDateString('en-IN')}</p>
                <p className="mt-3 text-sm text-gray-700 bg-white/70 rounded-xl px-4 py-3 border border-blue-100">
                  {result.highlights}
                </p>
                <p className="mt-2 text-xs text-blue-600 font-semibold">Trend: {result.trend}</p>
              </div>
            ))}
          </div>
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
                      {record.doctorName.charAt(0)}
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
                      <button
                        onClick={() => handlePrintPrescription(record)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <PrinterIcon className="w-4 h-4" />
                        Print Prescription
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

export default HealthHistoryPage;
