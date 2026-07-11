import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid JWT access token',
})
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a service',
    description: 'Creates a new service. Authentication is required.',
  })
  @ApiCreatedResponse({
    description: 'Service created successfully',
  })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all services',
    description: 'Returns all available service records.',
  })
  @ApiOkResponse({
    description: 'Services retrieved successfully',
  })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a service by ID',
  })
  @ApiOkResponse({
    description: 'Service retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Service was not found',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a service',
  })
  @ApiOkResponse({
    description: 'Service updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Service was not found',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a service',
  })
  @ApiNoContentResponse({
    description: 'Service deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Service was not found',
  })
  @ApiConflictResponse({
    description:
      'Service cannot be deleted because it has existing bookings',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.remove(id);
  }
}