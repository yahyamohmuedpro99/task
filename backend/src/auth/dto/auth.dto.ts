import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EmployeeGroup } from '../../entities/employee.entity';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(EmployeeGroup)
  @IsNotEmpty()
  group: EmployeeGroup;
}
