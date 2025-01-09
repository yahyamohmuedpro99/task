import { Attendance } from './attendance.entity';
export declare enum EmployeeGroup {
    HR = "HR",
    NORMAL = "NORMAL"
}
export declare class Employee {
    id: number;
    name: string;
    email: string;
    password: string;
    group: EmployeeGroup;
    attendances: Attendance[];
}
