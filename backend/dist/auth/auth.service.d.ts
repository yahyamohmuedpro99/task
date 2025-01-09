import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Employee, EmployeeGroup } from '../entities/employee.entity';
export declare class AuthService {
    private employeeRepository;
    private jwtService;
    constructor(employeeRepository: Repository<Employee>, jwtService: JwtService);
    validateAndLogin(email: string, password: string): Promise<{
        access_token: string;
        employee: {
            id: number;
            email: string;
            name: string;
            group: EmployeeGroup.HR;
        };
    }>;
    createEmployee(name: string, email: string, password: string, group: EmployeeGroup): Promise<{
        id: number;
        name: string;
        email: string;
        group: EmployeeGroup;
        attendances: import("../entities/attendance.entity").Attendance[];
    }>;
}
