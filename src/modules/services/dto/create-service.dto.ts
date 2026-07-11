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
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  duration!: number;

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}