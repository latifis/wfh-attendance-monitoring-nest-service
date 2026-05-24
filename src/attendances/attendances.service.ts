import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { EmployeesService } from '../employees/employees.service';
import { CheckInDto } from './dto/check-in.dto';

@Injectable()
export class AttendancesService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        private employeesService: EmployeesService,
    ) { }

    async checkIn(userId: string, photoPath: string, checkInDto: CheckInDto) {
        const employee = await this.employeesService.findByUserId(userId);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingCheckIn = await this.attendanceRepository.findOne({
            where: {
                employee: { id: employee.id },
                attendanceDate: today,
            },
        });

        if (existingCheckIn) {
            throw new BadRequestException('You have already checked in today');
        }

        const now = new Date();
        const attendance = this.attendanceRepository.create({
            employee,
            attendanceDate: today,
            checkInTime: now,
            photoPath,
            note: checkInDto.note || null,
        });

        return this.attendanceRepository.save(attendance);
    }

    async findMyAttendances(userId: string) {
        const employee = await this.employeesService.findByUserId(userId);
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        return this.attendanceRepository.find({
            where: { employee: { id: employee.id } },
            relations: { employee: { user: true } },
            order: { attendanceDate: 'DESC' },
        });
    }

    async findAll() {
        return this.attendanceRepository.find({
            relations: { employee: { user: true } },
            order: { attendanceDate: 'DESC' },
        });
    }

    async findOne(id: string) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: { employee: { user: true } },
        });
        if (!attendance) {
            throw new NotFoundException('Attendance not found');
        }
        return attendance;
    }
}
