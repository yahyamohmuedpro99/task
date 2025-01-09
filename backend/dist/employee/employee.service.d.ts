import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Attendance } from '../entities/attendance.entity';
import { UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeeService {
    private employeeRepository;
    private attendanceRepository;
    constructor(employeeRepository: Repository<Employee>, attendanceRepository: Repository<Attendance>);
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    createAttendance(employeeId: number, date: Date): Promise<Attendance>;
    getAttendance(employeeId: number): Promise<Attendance[]>;
}
