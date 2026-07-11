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

export class UpdateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'price must be a number with at most 2 decimal places',
    },
  )
  @Min(0)
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}