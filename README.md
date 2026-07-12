# EN2H Booking Platform API

Hi! This is my submission for the EN2H Software Engineer Intern technical assignment.

I built a REST API for managing services and customer bookings using NestJS, TypeScript, PostgreSQL, and TypeORM.

My main focus was to keep the project structure clean, handle the required business rules properly, and make the API easy to understand and test.

## What the API does

### Authentication

Users can:

- Register an account
- Login using email and password
- Receive a JWT access token

Passwords are hashed using bcrypt and are never returned in API responses.

### Service Management

Authenticated users can:

- Create a service
- Get all services
- Get a service by ID
- Update a service
- Delete a service

### Booking Management

Customers can create a booking without logging in.

Authenticated users can:

- Get all bookings
- Get a booking by ID
- Update booking status
- Cancel a booking

The booking list also supports:

- Pagination
- Search
- Filtering by booking status

## Business Rules

The following rules are handled by the API:

- A booking must belong to an existing service
- Bookings cannot be created for inactive services
- Booking date and time cannot be in the past
- Every new booking starts with `PENDING` status
- A cancelled booking cannot be marked as completed
- A completed booking cannot be cancelled
- The same service cannot be booked twice for the same date and time
- A service with existing bookings cannot be deleted

## Technologies Used

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Passport
- bcrypt
- class-validator
- Swagger

## Project Structure

```text
src/
├── database/
│   ├── data-source.ts
│   └── migrations/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── services/
│   └── bookings/
│
├── app.module.ts
└── main.ts
