import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee, EmployeeGroup } from '../entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
  ) {}

  async validateAndLogin(email: string, password: string) {
    const employee = await this.employeeRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'group', 'name'],
    });

    if (!employee || employee.group !== EmployeeGroup.HR) {
      throw new UnauthorizedException('Invalid credentials or not HR');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: employee.id };
    return {
      access_token: this.jwtService.sign(payload),
      employee: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        group: employee.group,
      },
    };
  }

  async createEmployee(
    name: string,
    email: string,
    password: string,
    group: EmployeeGroup,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = this.employeeRepository.create({
      name,
      email,
      password: hashedPassword,
      group,
    });
    
    try {
      await this.employeeRepository.save(employee);
      const { password: _, ...result } = employee;
      return result;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new UnauthorizedException('Email already exists');
      }
      throw error;
    }
  }
}
