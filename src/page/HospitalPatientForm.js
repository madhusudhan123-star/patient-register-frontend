import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://patient-register.onrender.com/api'; // Update this with your backend URL

const HospitalPatientForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phoneNumber: '',
        email: '',
        emergencyContact: '',
        emergencyPhone: '',
        insuranceProvider: '',
        paymentType: '',
        paymentAmount: '',
    });

    useEffect(() => {
        if (location.state && location.state.patient) {
            setFormData(location.state.patient);
            setIsEditing(true);
        }
    }, [location.state]);
    useEffect(() => {
        if (location.state && location.state.patient) {
            const patient = location.state.patient;

            // Convert dateOfBirth to YYYY-MM-DD format
            const formattedDateOfBirth = new Date(patient.dateOfBirth).toISOString().split('T')[0];

            setFormData({
                ...patient,
                dateOfBirth: formattedDateOfBirth
            });
            setIsEditing(true);
        }
    }, [location.state]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            emergencyContact: formData.emergencyContact,
            emergencyPhone: formData.emergencyPhone,
            insuranceProvider: formData.insuranceProvider,
            paymentType: formData.paymentType,
            paymentAmount: formData.paymentAmount
        };

        try {
            let response;
            if (isEditing) {
                // Update existing patient
                response = await axios.put(`${API_BASE_URL}/patients/${formData._id}`, dataToSend, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Patient data updated successfully:', response.data);
            } else {
                // Create new patient
                response = await axios.post(`${API_BASE_URL}/patients`, dataToSend, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('New patient data submitted successfully:', response.data);
            }
            navigate('/'); // Redirect back to the dashboard after submission
        } catch (error) {
            console.error('Error submitting patient data:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800" >
                {isEditing ? 'Edit Patient Information' : 'New Patient Information Form'}
            </h2>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="text"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                <input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                <input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    type="text"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                    id="paymentType"
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Type</option>
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                <input
                    id="paymentAmount"
                    name="paymentAmount"
                    type="number"
                    value={formData.paymentAmount}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {isEditing ? 'Update Patient' : 'Add Patient'}
            </button>
        </form >
    );
};

export default HospitalPatientForm;