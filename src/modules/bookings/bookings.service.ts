import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { ServiceEntity } from '../services/entities/service.entity';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(ServiceEntity)
    private readonly servicesRepository: Repository<ServiceEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const service = await this.servicesRepository.findOne({
      where: {
        id: createBookingDto.serviceId,
      },
    });

    if (!service) {
      throw new NotFoundException(
        `Service with ID ${createBookingDto.serviceId} was not found`,
      );
    }

    if (!service.isActive) {
      throw new BadRequestException(
        'Bookings cannot be created for an inactive service',
      );
    }

    this.validateFutureBookingDateTime(
      createBookingDto.bookingDate,
      createBookingDto.bookingTime,
    );

    const normalizedBookingTime = `${createBookingDto.bookingTime}:00`;

    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: normalizedBookingTime,
        status: Not(BookingStatus.CANCELLED),
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'This service is already booked for the selected date and time',
      );
    }

    const booking = this.bookingsRepository.create({
      customerName: createBookingDto.customerName,
      customerEmail: createBookingDto.customerEmail,
      customerPhone: createBookingDto.customerPhone,
      serviceId: createBookingDto.serviceId,
      bookingDate: createBookingDto.bookingDate,
      bookingTime: normalizedBookingTime,
      status: BookingStatus.PENDING,
      notes: createBookingDto.notes || null,
    });

    return this.bookingsRepository.save(booking);
  }

  async findAll(query: BookingQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service');

    if (query.status) {
      queryBuilder.andWhere('booking.status = :status', {
        status: query.status,
      });
    }

    if (query.search?.trim()) {
      const search = `%${query.search.trim()}%`;

      queryBuilder.andWhere(
        `(
          booking.customer_name ILIKE :search
          OR booking.customer_email ILIKE :search
          OR booking.customer_phone ILIKE :search
          OR service.title ILIKE :search
        )`,
        { search },
      );
    }

    queryBuilder
      .orderBy('booking.booking_date', 'ASC')
      .addOrderBy('booking.booking_time', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} was not found`);
    }

    return booking;
  }

  async updateStatus(
    id: string,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (
      booking.status === BookingStatus.CANCELLED &&
      updateBookingStatusDto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'A cancelled booking cannot be marked as completed',
      );
    }

    booking.status = updateBookingStatusDto.status;

    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'A completed booking cannot be cancelled',
      );
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return booking;
    }

    booking.status = BookingStatus.CANCELLED;

    return this.bookingsRepository.save(booking);
  }

  private validateFutureBookingDateTime(
    bookingDate: string,
    bookingTime: string,
  ): void {
    const [year, month, day] = bookingDate.split('-').map(Number);
    const [hour, minute] = bookingTime.split(':').map(Number);

    const bookingDateTime = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0,
      0,
    );

    const isInvalidDate =
      Number.isNaN(bookingDateTime.getTime()) ||
      bookingDateTime.getFullYear() !== year ||
      bookingDateTime.getMonth() !== month - 1 ||
      bookingDateTime.getDate() !== day ||
      bookingDateTime.getHours() !== hour ||
      bookingDateTime.getMinutes() !== minute;

    if (isInvalidDate) {
      throw new BadRequestException('Invalid booking date or time');
    }

    if (bookingDateTime.getTime() <= Date.now()) {
      throw new BadRequestException(
        'Booking date and time cannot be in the past',
      );
    }
  }
}