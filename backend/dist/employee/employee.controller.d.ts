import { EmployeeService } from './employee.service';
import { CreateAttendanceDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeeController {
    private employeeService;
    constructor(employeeService: EmployeeService);
    findAll(): Promise<import("../entities/employee.entity").Employee[]>;
    findOne(id: number): Promise<import("../entities/employee.entity").Employee>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<import("../entities/employee.entity").Employee>;
    createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<import("../entities/attendance.entity").Attendance>;
    getAttendance(id: number): Promise<import("../entities/attendance.entity").Attendance[]>;
}
