import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmployeeService } from './employee.service';
import { CreateAttendanceDto, UpdateEmployeeDto } from './dto/employee.dto';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Post('attendance')
  createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.employeeService.createAttendance(
      createAttendanceDto.employeeId,
      createAttendanceDto.date,
    );
  }

  @Get(':id/attendance')
  getAttendance(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.getAttendance(id);
  }
}
