import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('employees')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeesController {
    constructor(private employeesService: EmployeesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        const employee = await this.employeesService.create(createEmployeeDto);
        return {
            status: 'success',
            message: 'Employee created successfully',
            data: employee,
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll() {
        const employees = await this.employeesService.findAll();
        return {
            status: 'success',
            message: 'Employees retrieved successfully',
            data: employees,
        };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findOne(@Param('id') id: string) {
        const employee = await this.employeesService.findOne(id);
        return {
            status: 'success',
            message: 'Employee retrieved successfully',
            data: employee,
        };
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        const employee = await this.employeesService.update(id, updateEmployeeDto);
        return {
            status: 'success',
            message: 'Employee updated successfully',
            data: employee,
        };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        await this.employeesService.remove(id);
        return {
            status: 'success',
            message: 'Employee deleted successfully',
            data: null,
        };
    }
}
