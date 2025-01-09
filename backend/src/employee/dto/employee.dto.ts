import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;
}

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;
}
