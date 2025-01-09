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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const employee_entity_1 = require("../entities/employee.entity");
let AuthService = class AuthService {
    constructor(employeeRepository, jwtService) {
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
    }
    async validateAndLogin(email, password) {
        const employee = await this.employeeRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'group', 'name'],
        });
        if (!employee || employee.group !== employee_entity_1.EmployeeGroup.HR) {
            throw new common_1.UnauthorizedException('Invalid credentials or not HR');
        }
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { id: employee.id };
        return {
            access_token: this.jwtService.sign(payload),
            employee: {
                id: employee.id,
                email: employee.email,
                name: employee.name,
                group: employee.group,
            },
        };
    }
    async createEmployee(name, email, password, group) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = this.employeeRepository.create({
            name,
            email,
            password: hashedPassword,
            group,
        });
        try {
            await this.employeeRepository.save(employee);
            const { password: _, ...result } = employee;
            return result;
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new common_1.UnauthorizedException('Email already exists');
            }
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map