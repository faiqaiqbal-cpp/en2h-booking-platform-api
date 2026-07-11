import 'dotenv/config';

import { DataSource } from 'typeorm';

import { Booking } from '../modules/bookings/entities/booking.entity';
import { ServiceEntity } from '../modules/services/entities/service.entity';
import { User } from '../modules/users/entities/user.entity';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export default new DataSource({
  type: 'postgres',
  host: getRequiredEnvironmentVariable('DB_HOST'),
  port: Number(getRequiredEnvironmentVariable('DB_PORT')),
  username: getRequiredEnvironmentVariable('DB_USERNAME'),
  password: getRequiredEnvironmentVariable('DB_PASSWORD'),
  database: getRequiredEnvironmentVariable('DB_NAME'),

  entities: [User, ServiceEntity, Booking],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
  logging: false,
});