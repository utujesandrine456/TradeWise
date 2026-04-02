# TradeWise Backend API Documentation

## Overview
This document describes the REST and GraphQL APIs provided by the TradeWise backend application.  
It covers the available endpoints, modules, and their purposes based on the application logs and routes mapped at startup.

---

## REST API Endpoints

All REST endpoints are available under the `/api` prefix.

### General Application Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api`   | Application health check / root endpoint |

---

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/auth`              | Retrieve current user profile (requires authentication) |
| POST   | `/api/auth/register`     | Register a new user account |
| POST   | `/api/auth/login`        | User login |
| POST   | `/api/auth/logout`       | User logout |
| PATCH  | `/api/auth`              | Update user profile (requires authentication) |
| POST   | `/api/auth/onboarding`   | Complete user onboarding process |

### Password Management Routes (`/api/auth/password`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/password/forget` | Request password reset OTP |
| POST   | `/api/auth/password/reset`  | Reset password using OTP |

### Account Verification Routes (`/api/auth/account`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/account/send`   | Send account verification OTP |
| POST   | `/api/auth/account/verify` | Verify account using OTP |

---

## GraphQL API

**Endpoint:** `POST /graphql`  
**Purpose:** Handle complex queries and mutations for the frontend application.  
**Modules Covered:**
- Authentication
- Communication
- Management
- Analysis
- Financials
- Stock
- Transactions

**Notes:**
- Provides advanced querying and mutation capabilities.
- Used internally by the frontend for operations that require complex relationships or aggregations.

---

## Modules Overview

Based on the NestJS startup logs, the backend consists of the following modules:

| Module | Purpose |
|--------|---------|
| PrismaModule        | Database access via Prisma ORM |
| CurrencyModule      | Currency-related operations and conversions |
| CommunicationModule | Handles email, notifications, and messaging services |
| ManagementModule    | Business logic for managing users, roles, and resources |
| ConfigHostModule    | Environment configuration and app settings |
| JwtModule           | JWT-based authentication and token management |
| DiscoveryModule     | Service discovery and metadata inspection |
| ConfigModule        | Application-wide configuration management |
| ScheduleModule      | Task scheduling (cron jobs, background tasks) |
| FinancialsModule    | Financial transactions, accounts, and reporting |
| AnalysisModule      | Analytics, reporting, and metrics |
| EmailModule         | Email sending service (Nodemailer + SMTP) |
| NotificationModule  | Push notifications or alerts |
| TransactionModule   | Handling user and system transactions |
| StockModule         | Stock management and related operations |
| AuthModule          | Authentication and authorization logic |
| GraphQLModule       | GraphQL API setup and schema mapping |
| AppModule           | Main application module integrating all other modules |

---

## Startup Notes

- REST API base URL in development: `http://localhost:2015/api`
- GraphQL endpoint in development: `http://localhost:2015/graphql`
- Prisma connected to the database successfully
- All modules initialized successfully

---

## Security Considerations

1. Environment variables are used for API keys, secrets, and credentials.
2. Input validation is enforced via NestJS ValidationPipe.
3. Errors and exceptions are properly handled and logged.
4. API usage can be monitored via logs for debugging and analytics.

---

## Future Enhancements

- Integration with third-party APIs (e.g., payment gateways, SMS providers)
- Additional GraphQL queries and mutations for new modules
- Improved logging and monitoring capabilities
