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
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(255)
  customerEmail!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Matches(/^[+0-9().\-\s]{7,30}$/, {
    message: 'customerPhone must be a valid phone number',
  })
  customerPhone!: string;

  @IsUUID()
  serviceId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'bookingDate must use YYYY-MM-DD format',
  })
  bookingDate!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'bookingTime must use 24-hour HH:mm format',
  })
  bookingTime!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}