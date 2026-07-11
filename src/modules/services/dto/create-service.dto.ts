import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Backend Consultation',
    description: 'Name of the service',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiPropertyOptional({
    example: 'One-hour backend development consultation',
    description: 'Detailed description of the service',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 60,
    description: 'Service duration in minutes',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiProperty({
    example: 5000,
    description: 'Service price with a maximum of two decimal places',
    minimum: 0,
  })
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'price must be a number with at most 2 decimal places',
    },
  )
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether customers can currently book this service',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}