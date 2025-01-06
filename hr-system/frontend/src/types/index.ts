export enum EmployeeGroup {
  HR = 'HR',
  NORMAL = 'NORMAL',
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  group: EmployeeGroup;
}

export interface Attendance {
  id: number;
  date: string;
  createdAt: string;
  employee: Employee;
}

export interface LoginResponse {
  access_token: string;
  employee: Employee;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  group: EmployeeGroup;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
}

export interface CreateAttendanceData {
  employeeId: number;
  date: Date;
}
