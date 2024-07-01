import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Model } from 'mongoose';

const mockEmployeeData = {
  _id: 'someId',
  name: 'John Doe',
  jobTitle: 'Developer',
  department: 'IT',
  email: 'john@example.com',
};

class MockEmployee {
  constructor(private data) {
    Object.assign(this, data);
  }

  save = jest.fn().mockResolvedValue(this.data);
}

const mockEmployeeModel = {
  create: jest.fn().mockImplementation((data) => new MockEmployee(data)),
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockEmployeeData]),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockEmployeeData),
  }),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockEmployeeData),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockEmployeeData),
};

describe('EmployeeService', () => {
  let service: EmployeeService;
  let model: Model<Employee>;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getModelToken(Employee.name),
          useValue: mockEmployeeModel,
        },
        {
          provide: getQueueToken('emailQueue'),
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    model = module.get<Model<Employee>>(getModelToken(Employee.name));
    queue = module.get<Queue>(getQueueToken('emailQueue'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee and add a job to the queue', async () => {
      const createEmployeeDto = {
        name: 'John Doe',
        jobTitle: 'Developer',
        department: 'IT',
        email: 'john@example.com',
      };

      jest.spyOn(mockEmployeeModel, 'create').mockResolvedValueOnce(mockEmployeeData);

      const result = await service.create(createEmployeeDto);

      expect(result).toEqual(mockEmployeeData);
      expect(queue.add).toHaveBeenCalledWith('sendWelcomeEmail', {
        email: createEmployeeDto.email,
        name: createEmployeeDto.name,
      });
    });
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockEmployeeData]);
    });
  });

  describe('findOne', () => {
    it('should return an employee by ID', async () => {
      const result = await service.findOne('someId');
      expect(result).toEqual(mockEmployeeData);
    });

    it('should throw an error if employee is not found', async () => {
      jest.spyOn(mockEmployeeModel, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne('someId')).rejects.toThrowError(
        `Employee #someId not found`,
      );
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateEmployeeDto = {
        id: 'someId',
        jobTitle: 'Senior Developer',
        department: 'Engineering',
      };

      const result = await service.update('someId', updateEmployeeDto);
      expect(result).toEqual(mockEmployeeData);
    });

    it('should throw an error if employee is not found', async () => {
      const updateEmployeeDto = {
        id: 'someId',
        jobTitle: 'Senior Developer',
        department: 'Engineering',
      };

      jest.spyOn(mockEmployeeModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(service.update('someId', updateEmployeeDto)).rejects.toThrowError(
        `Employee #someId not found`,
      );
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const result = await service.remove('someId');
      expect(result).toEqual(mockEmployeeData);
    });

    it('should throw an error if employee is not found', async () => {
      jest.spyOn(mockEmployeeModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

      await expect(service.remove('someId')).rejects.toThrowError(
        `Employee #someId not found`,
      );
    });
  });
});
