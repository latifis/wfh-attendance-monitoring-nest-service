import {
    Controller,
    Post,
    Get,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    ClassSerializerInterceptor,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AttendancesService } from './attendances.service';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';

@Controller('attendances')
@UseInterceptors(ClassSerializerInterceptor)
export class AttendancesController {
    constructor(private attendancesService: AttendancesService) { }

    @Post('check-in')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYEE)
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: './uploads/attendances',
                filename: (req, file, cb) => {
                    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(
                        file.originalname,
                    )}`;
                    cb(null, uniqueName);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(new BadRequestException('Only image files are allowed'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    async checkIn(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User, @Body() checkInDto: CheckInDto) {
        if (!file) {
            throw new BadRequestException('Photo file is required');
        }

        const photoPath = `/uploads/attendances/${file.filename}`;
        const attendance = await this.attendancesService.checkIn(user.id, photoPath, checkInDto);

        return {
            status: 'success',
            message: 'Check-in successful',
            data: attendance,
        };
    }

    @Get('my')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYEE)
    async getMyAttendances(@CurrentUser() user: User) {
        const attendances = await this.attendancesService.findMyAttendances(user.id);
        return {
            status: 'success',
            message: 'Attendances retrieved successfully',
            data: attendances,
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll() {
        const attendances = await this.attendancesService.findAll();
        return {
            status: 'success',
            message: 'Attendances retrieved successfully',
            data: attendances,
        };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findOne(@Param('id') id: string) {
        const attendance = await this.attendancesService.findOne(id);
        return {
            status: 'success',
            message: 'Attendance retrieved successfully',
            data: attendance,
        };
    }
}
