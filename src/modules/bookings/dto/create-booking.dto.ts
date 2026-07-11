import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 'Faiqa Iqbal',
    description: 'Full name of the customer',
    maxLength: 150,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName!: string;

  @ApiProperty({
    example: 'faiqa@example.com',
    description: 'Customer email address',
    maxLength: 255,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(255)
  customerEmail!: string;

  @ApiProperty({
    example: '+92 310 8490333',
    description: 'Customer contact number',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Matches(/^[+0-9().\-\s]{7,30}$/, {
    message: 'customerPhone must be a valid phone number',
  })
  customerPhone!: string;

  @ApiProperty({
    example: '7bb1de61-066e-46ec-8c7d-a986b452ef61',
    description: 'UUID of the service being booked',
    format: 'uuid',
  })
  @IsUUID()
  serviceId!: string;

  @ApiProperty({
    example: '2026-07-15',
    description: 'Booking date in YYYY-MM-DD format',
    format: 'date',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'bookingDate must use YYYY-MM-DD format',
  })
  bookingDate!: string;

  @ApiProperty({
    example: '15:30',
    description: 'Booking time in 24-hour HH:mm format',
  })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'bookingTime must use 24-hour HH:mm format',
  })
  bookingTime!: string;

  @ApiPropertyOptional({
    example: 'Please contact me before the appointment',
    description: 'Optional notes for the booking',
    maxLength: 2000,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}