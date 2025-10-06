import React, { useState, useEffect } from 'react';
import { doctorServices } from '../services/firebaseServices';

const DoctorTest = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testDoctorService = async () => {
      try {
        console.log('DoctorTest: Starting test...');
        const doctorData = await doctorServices.getAllDoctors();
        console.log('DoctorTest: Got doctors:', doctorData);
        setDoctors(doctorData);
      } catch (err) {
        console.error('DoctorTest: Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testDoctorService();
  }, []);

  if (loading) return <div className="p-4">Loading doctors...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Doctor Service Test</h3>
      <p className="mb-2">Total doctors: {doctors.length}</p>
      
      {doctors.map((doctor, index) => (
        <div key={doctor.id || index} className="mb-2 p-2 bg-white rounded">
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Status:</strong> {doctor.profileStatus}</p>
          <p><strong>Approved:</strong> {doctor.isApproved ? 'Yes' : 'No'}</p>
          <p><strong>Available:</strong> {doctor.available ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default DoctorTest;