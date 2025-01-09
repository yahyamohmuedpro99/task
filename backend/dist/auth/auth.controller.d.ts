import { AuthService } from './auth.service';
import { CreateEmployeeDto, LoginDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
export declare class AuthController {
    private authService;
    private employeeRepository;
    constructor(authService: AuthService, employeeRepository: Repository<Employee>);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        employee: {
            id: number;
            email: string;
            name: string;
            group: import("../entities/employee.entity").EmployeeGroup.HR;
        };
    }>;
    createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<{
        id: number;
        name: string;
        email: string;
        group: import("../entities/employee.entity").EmployeeGroup;
        attendances: import("../entities/attendance.entity").Attendance[];
    }>;
}
