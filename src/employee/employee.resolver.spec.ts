import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { Employee } from './entities/employee.entity';

describe('EmployeeResolver', () => {
  let resolver: EmployeeResolver;
  let service: EmployeeService;

  const mockEmployeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeResolver,
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    resolver = module.get<EmployeeResolver>(EmployeeResolver);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeInput = {
        name: 'John Doe',
        jobTitle: 'Developer',
        department: 'IT',
        email: 'john@example.com',
      };
      const newEmployee: Partial<Employee> = {
        ...createEmployeeDto,
        _id: 'someId',
        id: 'someId',
      };

      jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(newEmployee as Employee);

      const result = await resolver.createEmployee(createEmployeeDto);
      expect(result).toEqual(newEmployee);
    });
  });

  describe('employees', () => {
    it('should return all employees', async () => {
      const employees: Partial<Employee>[] = [
        {
          _id: 'someId',
          id: 'someId',
          name: 'John Doe',
          jobTitle: 'Developer',
          department: 'IT',
          email: 'john@example.com',
        },
      ];
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce(employees as Employee[]);

      const result = await resolver.employees();
      expect(result).toEqual(employees);
    });
  });

  describe('employee', () => {
    it('should return an employee by ID', async () => {
      const employee: Partial<Employee> = {
        _id: 'someId',
        id: 'someId',
        name: 'John Doe',
        jobTitle: 'Developer',
        department: 'IT',
        email: 'john@example.com',
      };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(employee as Employee);

      const result = await resolver.employee('someId');
      expect(result).toEqual(employee);
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee', async () => {
      const updateEmployeeDto: UpdateEmployeeInput = {
        id: 'someId',
        jobTitle: 'Senior Developer',
        department: 'Engineering',
      };
      const updatedEmployee: Partial<Employee> = {
        ...updateEmployeeDto,
        _id: 'someId',
        name: 'John Doe',
        email: 'john@example.com',
      };

      jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce(updatedEmployee as Employee);

      const result = await resolver.updateEmployee(updateEmployeeDto);
      expect(result).toEqual(updatedEmployee);
    });
  });

  describe('removeEmployee', () => {
    it('should remove an employee', async () => {
      const employee: Partial<Employee> = {
        _id: 'someId',
        id: 'someId',
        name: 'John Doe',
        jobTitle: 'Developer',
        department: 'IT',
        email: 'john@example.com',
      };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(employee as Employee);

      const result = await resolver.removeEmployee('someId');
      expect(result).toEqual(employee);
    });
  });
});
