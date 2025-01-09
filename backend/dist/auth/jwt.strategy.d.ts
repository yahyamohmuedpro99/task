import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private employeeRepository;
    constructor(employeeRepository: Repository<Employee>);
    validate(payload: {
        id: number;
    }): Promise<Employee>;
}
export {};
