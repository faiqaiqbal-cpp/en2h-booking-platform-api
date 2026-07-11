import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Public: customers can create bookings without authentication.
  @Post()
  @ApiOperation({
    summary: 'Create a public booking',
    description:
      'Creates a customer booking without requiring authentication.',
  })
  @ApiCreatedResponse({
    description: 'Booking created successfully',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid request, inactive service, or booking date/time is in the past',
  })
  @ApiNotFoundResponse({
    description: 'Selected service was not found',
  })
  @ApiConflictResponse({
    description:
      'The selected service is already booked for this date and time',
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all bookings',
    description:
      'Returns bookings with pagination, search, and status filtering.',
  })
  @ApiOkResponse({
    description: 'Bookings retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT access token',
  })
  findAll(@Query() query: BookingQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a booking by ID',
  })
  @ApiOkResponse({
    description: 'Booking retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Booking was not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT access token',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update booking status',
    description:
      'Updates the booking status using PENDING, CONFIRMED, CANCELLED, or COMPLETED.',
  })
  @ApiOkResponse({
    description: 'Booking status updated successfully',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid status or a cancelled booking was marked as completed',
  })
  @ApiNotFoundResponse({
    description: 'Booking was not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT access token',
  })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(
      id,
      updateBookingStatusDto,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel a booking',
  })
  @ApiOkResponse({
    description: 'Booking cancelled successfully',
  })
  @ApiBadRequestResponse({
    description: 'A completed booking cannot be cancelled',
  })
  @ApiNotFoundResponse({
    description: 'Booking was not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT access token',
  })
  cancel(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookingsService.cancel(id);
  }
}