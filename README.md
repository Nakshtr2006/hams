# HAMS - Hierarchy Access Management System

A Spring Boot backend application implementing secure user management with role-based hierarchy, JWT authentication, BCrypt password encryption, validation, and REST APIs.

## Features

- User CRUD Operations
- Spring Security
- JWT Authentication
- BCrypt Password Encryption
- Role Management
- Input Validation
- Global Exception Handling
- MySQL Database Integration
- JPA/Hibernate

## Tech Stack

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- JWT
- BCrypt
- Maven
- Git & GitHub

## Current Roles

- ROOT
- SUPER_ADMIN
- ADMIN
- MANAGER
- EMPLOYEE

## API Endpoints

### Authentication

```http
POST /auth/login
```

### Users

```http
GET /users
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

## Authentication Flow

1. User logs in using email and password.
2. Password is verified using BCrypt.
3. JWT token is generated.
4. Token is sent in Authorization header.

```http
Authorization: Bearer <token>
```

## Project Status

Currently under active development as a learning and internship portfolio project.

Future plans:

- Role Based Access Control (RBAC)
- Audit Logging
- DTO Architecture
- Pagination & Search
- Docker Support
- Cloud Deployment