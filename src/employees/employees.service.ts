import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private usersService: UsersService,
    ) { }

    async create(createEmployeeDto: CreateEmployeeDto) {
        const existingUser = await this.usersService.findByEmail(createEmployeeDto.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const existingEmployee = await this.employeeRepository.findOne({
            where: { employeeCode: createEmployeeDto.employeeCode },
        });
        if (existingEmployee) {
            throw new BadRequestException('Employee code already exists');
        }

        const user = await this.usersService.createUser(
            createEmployeeDto.email,
            createEmployeeDto.name,
            createEmployeeDto.password,
            UserRole.EMPLOYEE,
        );

        const employee = this.employeeRepository.create({
            user,
            employeeCode: createEmployeeDto.employeeCode,
            department: createEmployeeDto.department,
            position: createEmployeeDto.position,
        });

        return this.employeeRepository.save(employee);
    }

    async findAll() {
        return this.employeeRepository.find({
            relations: { user: true },
        });
    }

    async findOne(id: string) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        return employee;
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
        const employee = await this.findOne(id);

        if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.user.email) {
            const existingUser = await this.usersService.findByEmail(updateEmployeeDto.email);
            if (existingUser) {
                throw new BadRequestException('Email already exists');
            }
            employee.user.email = updateEmployeeDto.email;
        }

        if (updateEmployeeDto.name) {
            employee.user.name = updateEmployeeDto.name;
        }

        if (updateEmployeeDto.password) {
            employee.user.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }

        if (updateEmployeeDto.employeeCode && updateEmployeeDto.employeeCode !== employee.employeeCode) {
            const existingEmployee = await this.employeeRepository.findOne({
                where: { employeeCode: updateEmployeeDto.employeeCode },
            });
            if (existingEmployee) {
                throw new BadRequestException('Employee code already exists');
            }
            employee.employeeCode = updateEmployeeDto.employeeCode;
        }

        if (updateEmployeeDto.department) {
            employee.department = updateEmployeeDto.department;
        }

        if (updateEmployeeDto.position) {
            employee.position = updateEmployeeDto.position;
        }

        await this.userRepository.save(employee.user);
        return this.employeeRepository.save(employee);
    }

    async remove(id: string) {
        const employee = await this.findOne(id);
        return this.employeeRepository.remove(employee);
    }

    async findByUserId(userId: string) {
        return this.employeeRepository.findOne({
            where: { user: { id: userId } },
            relations: { user: true },
        });
    }
}
