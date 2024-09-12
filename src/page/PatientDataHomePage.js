import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API_BASE_URL = 'https://patient-register.onrender.com/api'; // Update this with your backend URL

const PatientDataHomePage = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterPaymentType, setFilterPaymentType] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/patients`);
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleSort = (column) => {
        const order = (column === sortColumn && sortOrder === 'asc') ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(order);
    };

    const sortPatients = (patients) => {
        if (!sortColumn) return patients;

        return [...patients].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const filteredPatients = patients.filter(patient =>
        (patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterGender === '' || patient.gender === filterGender) &&
        (filterPaymentType === '' || patient.paymentType === filterPaymentType)
    );

    const sortedPatients = sortPatients(filteredPatients);

    const handleEdit = (patient) => {
        navigate('/patient-form', { state: { patient } });
    };

    const handleDelete = async (patientId) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await axios.delete(`${API_BASE_URL}/patients/${patientId}`);
                fetchPatients(); // Refresh the patient list
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const downloadExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sortedPatients.map(patient => ({
            Name: `${patient.firstName} ${patient.lastName}`,
            'Date of Birth': patient.dateOfBirth,
            Gender: patient.gender,
            'Payment Type': patient.paymentType,
            'Payment Amount': patient.paymentAmount
        })));

        XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
        XLSX.writeFile(workbook, "patient_data.xlsx");
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Patient Data Dashboard</h1>

            <div className="mb-6 space-y-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-between items-center mb-4">
                <Link to={'/patient-form'}>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Add Patient
                    </button>
                </Link>
                <button
                    onClick={downloadExcel}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Download Excel
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th onClick={() => handleSort('firstName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Name {sortColumn === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th onClick={() => handleSort('dateOfBirth')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Date of Birth {sortColumn === 'dateOfBirth' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th onClick={() => handleSort('gender')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Gender {sortColumn === 'gender' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th onClick={() => handleSort('paymentType')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Payment Type {sortColumn === 'paymentType' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th onClick={() => handleSort('paymentAmount')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Payment Amount {sortColumn === 'paymentAmount' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedPatients.map((patient) => (
                            <tr key={patient._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{`${patient.firstName} ${patient.lastName}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{patient.paymentType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${patient.paymentAmount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => handleEdit(patient)}>Edit</button>
                                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(patient._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientDataHomePage;