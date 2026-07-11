import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking } from '../bookings/entities/booking.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly servicesRepository: Repository<ServiceEntity>,

    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
    const service = this.servicesRepository.create({
      title: createServiceDto.title.trim(),
      description: createServiceDto.description?.trim() || null,
      duration: createServiceDto.duration,
      price: createServiceDto.price,
      isActive: createServiceDto.isActive ?? true,
    });

    return this.servicesRepository.save(service);
  }

  findAll(): Promise<ServiceEntity[]> {
    return this.servicesRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<ServiceEntity> {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} was not found`);
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    const service = await this.findOne(id);

    if (updateServiceDto.title !== undefined) {
      service.title = updateServiceDto.title.trim();
    }

    if (updateServiceDto.description !== undefined) {
      service.description = updateServiceDto.description.trim() || null;
    }

    if (updateServiceDto.duration !== undefined) {
      service.duration = updateServiceDto.duration;
    }

    if (updateServiceDto.price !== undefined) {
      service.price = updateServiceDto.price;
    }

    if (updateServiceDto.isActive !== undefined) {
      service.isActive = updateServiceDto.isActive;
    }

    return this.servicesRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);

    const bookingCount = await this.bookingsRepository.count({
      where: {
        serviceId: id,
      },
    });

    if (bookingCount > 0) {
      throw new ConflictException(
        'This service cannot be deleted because it has existing bookings',
      );
    }

    await this.servicesRepository.remove(service);
  }
}