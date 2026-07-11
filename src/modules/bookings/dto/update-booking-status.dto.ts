import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'New status of the booking',
  })
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}