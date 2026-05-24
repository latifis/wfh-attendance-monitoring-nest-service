import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, (employee) => employee.attendances, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    employee: Employee;

    @Column({ type: 'date' })
    attendanceDate: Date;

    @Column({ type: 'timestamp' })
    checkInTime: Date;

    @Column()
    photoPath: string;

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
