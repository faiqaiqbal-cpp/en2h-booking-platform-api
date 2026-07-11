import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ServiceEntity } from '../../services/entities/service.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity({ name: 'bookings' })
@Index('IDX_booking_service_date_time', [
  'serviceId',
  'bookingDate',
  'bookingTime',
])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 150,
  })
  customerName!: string;

  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 255,
  })
  customerEmail!: string;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 30,
  })
  customerPhone!: string;

  @Column({
    name: 'service_id',
    type: 'uuid',
  })
  serviceId!: string;

  @ManyToOne(() => ServiceEntity, (service) => service.bookings, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service!: ServiceEntity;

  @Column({
    name: 'booking_date',
    type: 'date',
  })
  bookingDate!: string;

  @Column({
    name: 'booking_time',
    type: 'time',
  })
  bookingTime!: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    enumName: 'booking_status_enum',
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;
}