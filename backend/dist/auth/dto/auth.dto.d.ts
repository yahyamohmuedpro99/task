import { EmployeeGroup } from '../../entities/employee.entity';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class CreateEmployeeDto {
    name: string;
    email: string;
    password: string;
    group: EmployeeGroup;
}
