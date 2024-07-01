import { useQuery, useMutation } from '@apollo/client';
import { GET_EMPLOYEES } from '../graphql/queries';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../graphql/mutations';

export const useEmployees = () => {
  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES);

  const [createEmployee, { error: createError }] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => refetch(),
  });

  const [updateEmployee, { error: updateError }] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => refetch(),
  });

  const [deleteEmployee, { error: deleteError }] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => refetch(),
  });

  return {
    employees: data?.employees || [],
    loading,
    error,
    createEmployee,
    createError,
    updateEmployee,
    updateError,
    deleteEmployee,
    deleteError,
  };
};
