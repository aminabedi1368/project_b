import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    QueueModule,
  ],
  providers: [EmployeeService, EmployeeResolver],
})
export class EmployeeModule {}
