import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeForm from './EmployeeForm';
import './EmployeeList.css';

const EmployeeList = () => {
    const { employees, loading, error, deleteEmployee } = useEmployees();
    const [editingEmployee, setEditingEmployee] = useState(null);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleDelete = (id) => {
        deleteEmployee({ variables: { id } });
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
    };

    const handleCompleted = () => {
        setEditingEmployee(null);
    };

    return (
        <div className="employee-list">
            {employees.map((employee) => (
                <div key={employee.id} className="employee">
                    <p>Name: {employee.name}</p>
                    <p>Job Title: {employee.jobTitle}</p>
                    <p>Department: {employee.department}</p>
                    <p>Email: {employee.email}</p>
                    <button onClick={() => handleEdit(employee)}>Edit</button>
                    <button onClick={() => handleDelete(employee.id)}>Delete</button>
                </div>
            ))}
            {editingEmployee && (
                <EmployeeForm employee={editingEmployee} onCompleted={handleCompleted} />
            )}
        </div>
    );
};

export default EmployeeList;
