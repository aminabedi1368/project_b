import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsEmail } from '../../validators/is-email';

@ObjectType({
  description: 'Employee entity representing an employee in the company',
})
@Schema()
export class Employee extends Document {
  @Field(() => ID, { description: 'The unique identifier of the employee' })
  id: string;

  @Field(() => String, { description: 'The name of the employee' })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field(() => String, { description: 'The job title of the employee' })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  jobTitle: string;

  @Field(() => String, { description: 'The department of the employee' })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  department: string;

  @Field(() => String, { description: 'The email of the employee' })
  @Prop({ required: true })
  @IsEmail({ message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
