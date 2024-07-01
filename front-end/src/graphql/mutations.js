import { gql } from '@apollo/client';

export const CREATE_EMPLOYEE = gql`
    mutation CreateEmployee($createEmployeeInput: CreateEmployeeInput!) {
        createEmployee(createEmployeeInput: $createEmployeeInput) {
            id
            name
            jobTitle
            department
            email
        }
    }
`;

export const UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee($updateEmployeeInput: UpdateEmployeeInput!) {
        updateEmployee(updateEmployeeInput: $updateEmployeeInput) {
            id
            name
            jobTitle
            department
            email
        }
    }
`;

export const DELETE_EMPLOYEE = gql`
    mutation RemoveEmployee($id: String!) {
        removeEmployee(id: $id) {
            id
        }
    }
`;
