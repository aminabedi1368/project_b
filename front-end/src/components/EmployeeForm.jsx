import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { removeTypename } from '../utils/removeTypename';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onCompleted }) => {
    const { createEmployee, updateEmployee, createError, updateError } = useEmployees();
    const [formState, setFormState] = useState(employee ? JSON.parse(JSON.stringify(employee, removeTypename)) : {
        name: '',
        jobTitle: '',
        department: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (employee) {
                await updateEmployee({ variables: { updateEmployeeInput: formState } });
                onCompleted && onCompleted();
            } else {
                await createEmployee({ variables: { createEmployeeInput: formState } });
                setFormState({
                    name: '',
                    jobTitle: '',
                    department: '',
                    email: '',
                });
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                type="text"
                name="jobTitle"
                value={formState.jobTitle}
                onChange={handleChange}
                placeholder="Job Title"
                required
            />
            <input
                type="text"
                name="department"
                value={formState.department}
                onChange={handleChange}
                placeholder="Department"
                required
            />
            <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <button type="submit">{employee ? 'Update' : 'Create'} Employee</button>
            {(createError || updateError) && <p>Error: {(createError || updateError).message}</p>}
        </form>
    );
};

export default EmployeeForm;
