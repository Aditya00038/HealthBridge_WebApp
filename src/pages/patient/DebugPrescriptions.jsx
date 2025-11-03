import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

const DebugPrescriptions = () => {
  const { user } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [userRecords, setUserRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get ALL records (no filter)
        console.log('🔍 Fetching ALL records...');
        const allQuery = query(collection(db, 'patientRecords'));
        const allSnapshot = await getDocs(allQuery);
        const all = allSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllRecords(all);
        console.log('📊 Total records in database:', all.length);

        // Get records for current user
        if (user) {
          console.log('👤 Fetching records for user:', user.uid);
          const userQuery = query(
            collection(db, 'patientRecords'),
            where('patientId', '==', user.uid)
          );
          const userSnapshot = await getDocs(userQuery);
          const userDocs = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserRecords(userDocs);
          console.log('📋 Records for current user:', userDocs.length);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Prescription Debug Page</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Current User Info</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>User ID:</strong> {user?.uid || 'Not logged in'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          </div>
        </div>

        {/* All Records */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            All Patient Records in Database ({allRecords.length})
          </h2>
          {allRecords.length === 0 ? (
            <p className="text-gray-600">No records found in patientRecords collection</p>
          ) : (
            <div className="space-y-4">
              {allRecords.map((record, idx) => (
                <div key={record.id} className="border rounded p-4 bg-gray-50">
                  <p className="font-bold text-blue-600">Record #{idx + 1}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <strong>Document ID:</strong> {record.id}
                    </div>
                    <div>
                      <strong>Patient ID:</strong> {record.patientId || 'Missing'}
                    </div>
                    <div>
                      <strong>Patient Name:</strong> {record.patientName || 'Missing'}
                    </div>
                    <div>
                      <strong>Doctor Name:</strong> {record.doctorName || 'Missing'}
                    </div>
                    <div>
                      <strong>Diagnosis:</strong> {record.diagnosis || 'Missing'}
                    </div>
                    <div>
                      <strong>Visit Date:</strong> {record.visitDate?.toDate().toLocaleDateString() || 'Missing'}
                    </div>
                  </div>
                  <div className="mt-2">
                    <strong>Matches current user?</strong>{' '}
                    <span className={record.patientId === user?.uid ? 'text-green-600 font-bold' : 'text-red-600'}>
                      {record.patientId === user?.uid ? '✅ YES' : '❌ NO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Records */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Records for Current User ({userRecords.length})
          </h2>
          {userRecords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-bold text-xl mb-2">
                ❌ No prescriptions found for this user
              </p>
              <p className="text-gray-600 mb-4">
                Patient ID: <code className="bg-gray-100 px-2 py-1 rounded">{user?.uid}</code>
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-left">
                <p className="font-bold mb-2">💡 Possible Reasons:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Doctor hasn't created any prescriptions for this patient yet</li>
                  <li>Doctor created prescription for a different patient ID</li>
                  <li>Data hasn't synced yet (wait a few seconds and refresh)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userRecords.map((record, idx) => (
                <div key={record.id} className="border rounded p-4 bg-green-50">
                  <p className="font-bold text-green-600">✅ Prescription #{idx + 1}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <strong>Doctor:</strong> {record.doctorName}
                    </div>
                    <div>
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </div>
                    <div>
                      <strong>Medicines:</strong> {record.medicines?.length || 0}
                    </div>
                    <div>
                      <strong>Date:</strong> {record.visitDate?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-lg mb-2">📋 How to Fix</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>If no records exist: Doctor needs to create a prescription first</li>
            <li>If records exist but don't match: Check patientId matches current user ID</li>
            <li>Login as doctor → Go to Patient Records → Add prescription</li>
            <li>Make sure doctor selects the correct patient</li>
            <li>After saving, come back to this page and refresh</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DebugPrescriptions;
