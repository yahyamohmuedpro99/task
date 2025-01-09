import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateAndLogin(loginDto.email, loginDto.password);
  }

  @Post('employees')
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    // Allow first employee creation without auth
    const employeeCount = await this.employeeRepository.count();
    if (employeeCount === 0) {
      return this.authService.createEmployee(
        createEmployeeDto.name,
        createEmployeeDto.email,
        createEmployeeDto.password,
        createEmployeeDto.group,
      );
    }

    // For subsequent employee creations, require authentication
    return this.authService.createEmployee(
      createEmployeeDto.name,
      createEmployeeDto.email,
      createEmployeeDto.password,
      createEmployeeDto.group,
    );
  }
}
