import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../attendances/entities/attendance.entity';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.employee, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column({ unique: true })
    employeeCode: string;

    @Column()
    department: string;

    @Column()
    position: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Attendance, (attendance) => attendance.employee)
    attendances?: Attendance[];
}
