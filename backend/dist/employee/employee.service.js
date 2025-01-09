"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../entities/employee.entity");
const attendance_entity_1 = require("../entities/attendance.entity");
let EmployeeService = class EmployeeService {
    constructor(employeeRepository, attendanceRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
    }
    async findAll() {
        return this.employeeRepository.find({
            select: ['id', 'name', 'email', 'group'],
        });
    }
    async findOne(id) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'group'],
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return employee;
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        Object.assign(employee, updateEmployeeDto);
        return this.employeeRepository.save(employee);
    }
    async createAttendance(employeeId, date) {
        const employee = await this.findOne(employeeId);
        const attendance = this.attendanceRepository.create({
            employee,
            date,
        });
        return this.attendanceRepository.save(attendance);
    }
    async getAttendance(employeeId) {
        const employee = await this.findOne(employeeId);
        return this.attendanceRepository.find({
            where: { employee: { id: employee.id } },
            relations: ['employee'],
            select: {
                id: true,
                date: true,
                createdAt: true,
                employee: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map