import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      name
      jobTitle
      department
      email
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: String!) {
    employee(id: $id) {
      id
      name
      jobTitle
      department
      email
    }
  }
`;
