import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Attendance } from '../entities/attendance.entity';
import { UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll() {
    return this.employeeRepository.find({
      select: ['id', 'name', 'email', 'group'],
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'group'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async createAttendance(employeeId: number, date: Date) {
    const employee = await this.findOne(employeeId);
    
    const attendance = this.attendanceRepository.create({
      employee,
      date,
    });

    return this.attendanceRepository.save(attendance);
  }

  async getAttendance(employeeId: number) {
    const employee = await this.findOne(employeeId);
    
    return this.attendanceRepository.find({
      where: { employee: { id: employee.id } },
      relations: ['employee'],
      select: {
        id: true,
        date: true,
        createdAt: true,
        employee: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }
}
