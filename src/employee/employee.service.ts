import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as Sentry from '@sentry/node';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectQueue('emailQueue') private emailQueue: Queue,
  ) {}

  /**
   * Creates a new employee and adds a welcome email job to the queue
   * @param createEmployeeInput - The input data for creating an employee
   * @returns The created employee
   */
  async create(createEmployeeInput: CreateEmployeeInput): Promise<Employee> {
    try {
      const newEmployee = await this.employeeModel.create(createEmployeeInput);
      await this.emailQueue.add('sendWelcomeEmail', {
        email: createEmployeeInput.email,
        name: createEmployeeInput.name,
      });
      return newEmployee;
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  /**
   * Retrieves all employees
   * @returns A list of all employees
   */
  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeModel.find().exec();
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException('Failed to retrieve employees');
    }
  }

  /**
   * Retrieves an employee by their ID
   * @param id - The ID of the employee to retrieve
   * @returns The employee with the specified ID
   */
  async findOne(id: string): Promise<Employee> {
    try {
      const employee = await this.employeeModel.findById(id).exec();
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
   * Updates an existing employee
   * @param id - The ID of the employee to update
   * @param updateEmployeeInput - The input data for updating the employee
   * @returns The updated employee
   */
  async update(
    id: string,
    updateEmployeeInput: UpdateEmployeeInput,
  ): Promise<Employee> {
    try {
      const existingEmployee = await this.employeeModel.findByIdAndUpdate(
        id,
        updateEmployeeInput,
        { new: true },
      );
      if (!existingEmployee) {
        throw new NotFoundException(`Employee #${id} not found`);
      }
      return existingEmployee;
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update employee');
    }
  }

  /**
   * Removes an employee by their ID
   * @param id - The ID of the employee to remove
   * @returns The removed employee
   */
  async remove(id: string): Promise<Employee> {
    try {
      const deletedEmployee = await this.employeeModel.findByIdAndDelete(id);
      if (!deletedEmployee) {
        throw new NotFoundException(`Employee #${id} not found`);
      }
      return deletedEmployee;
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove employee');
    }
  }
}
