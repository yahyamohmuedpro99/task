import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Employee, EmployeeGroup } from '../entities/employee.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // In production, use environment variable
    });
  }

  async validate(payload: { id: number }) {
    const employee = await this.employeeRepository.findOne({
      where: { id: payload.id },
    });

    if (!employee || employee.group !== EmployeeGroup.HR) {
      throw new UnauthorizedException('Access denied');
    }

    return employee;
  }
}
