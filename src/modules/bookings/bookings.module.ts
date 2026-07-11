import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceEntity } from '../services/entities/service.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, ServiceEntity])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}