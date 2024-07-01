import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsEmail } from '../../validators/is-email';

@InputType()
export class CreateEmployeeInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  jobTitle: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  department: string;

  @Field(() => String)
  @IsEmail({ message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;
}
