import api from './axios';
import {
  LoginCredentials,
  LoginResponse,
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
  Attendance,
  CreateAttendanceData,
} from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },
};

export const employeeApi = {
  create: async (employeeData: CreateEmployeeData) => {
    const { data } = await api.post<Employee>('/auth/employees', employeeData);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get<Employee[]>('/employees');
    return data;
  },

  getOne: async (id: number) => {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  },

  update: async (id: number, updateData: UpdateEmployeeData) => {
    const { data } = await api.patch<Employee>(`/employees/${id}`, updateData);
    return data;
  },

  createAttendance: async (attendanceData: CreateAttendanceData) => {
    const { data } = await api.post<Attendance>('/employees/attendance', attendanceData);
    return data;
  },

  getAttendance: async (employeeId: number) => {
    const { data } = await api.get<Attendance[]>(`/employees/${employeeId}/attendance`);
    return data;
  },
};
