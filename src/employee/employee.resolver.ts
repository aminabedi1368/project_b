import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import * as Sentry from '@sentry/node';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * Mutation to create a new employee
   * @param createEmployeeInput - The input data for creating an employee
   * @returns The created employee
   */
  @Mutation(() => Employee, { description: 'Create a new employee' })
  async createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
  ): Promise<Employee> {
    try {
      return await this.employeeService.create(createEmployeeInput);
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  /**
   * Query to retrieve all employees
   * @returns A list of all employees
   */
  @Query(() => [Employee], { description: 'Retrieve all employees' })
  async employees(): Promise<Employee[]> {
    try {
      return await this.employeeService.findAll();
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException('Failed to retrieve employees');
    }
  }

  /**
   * Query to retrieve an employee by their ID
   * @param id - The ID of the employee to retrieve
   * @returns The employee with the specified ID
   */
  @Query(() => Employee, { description: 'Retrieve an employee by their ID' })
  async employee(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Employee> {
    try {
      const employee = await this.employeeService.findOne(id);
      if (!employee) {
        throw new NotFoundException(`Employee #${id} not found`);
      }
      return employee;
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve employee');
    }
  }

  /**
   * Mutation to update an existing employee
   * @param updateEmployeeInput - The input data for updating an employee
   * @returns The updated employee
   */
  @Mutation(() => Employee, { description: 'Update an existing employee' })
  async updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
  ): Promise<Employee> {
    try {
      return await this.employeeService.update(
        updateEmployeeInput.id,
        updateEmployeeInput,
      );
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update employee');
    }
  }

  /**
   * Mutation to remove an employee by their ID
   * @param id - The ID of the employee to remove
   * @returns The removed employee
   */
  @Mutation(() => Employee, { description: 'Remove an employee by their ID' })
  async removeEmployee(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Employee> {
    try {
      return await this.employeeService.remove(id);
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove employee');
    }
  }
}
