import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'hr-system.sqlite',
      entities: [Employee, Attendance],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    EmployeeModule,
  ],
})
export class AppModule {}
