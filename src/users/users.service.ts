import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async createUser(email: string, name: string, password: string, role: UserRole): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            name,
            password: hashedPassword,
            role,
        });
        return this.userRepository.save(user);
    }

    async seedAdminUser(): Promise<void> {
        const adminEmail = 'admin@mail.com';
        const existingAdmin = await this.findByEmail(adminEmail);
        if (!existingAdmin) {
            await this.createUser(adminEmail, 'Admin', 'password', UserRole.ADMIN);
        }
    }
}
