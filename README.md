# Full-Stack Authentication App

This is a full-stack authentication application built using Next.js on the frontend and NestJS on the backend. The app supports user sign-up, sign-in, sign-out, and JWT-based authentication, including access and refresh token handling.

## Table of Contents

1. Overview
2. Tech Stack
3. Folder Structure
4. Getting Started
   - Prerequisites
   - Installation
   - Running the App
5. Environment Variables
6. API Endpoints
7. Usage

## Overview

This application demonstrates a full-stack authentication system using a modern tech stack. Users can register, log in, log out, and be automatically redirected based on authentication status.

## Tech Stack

### Frontend

- Framework: Next.js
- UI Library: shadcn
- Language: TypeScript
- HTTP Client: Native fetch API

### Backend

- Framework: NestJS
- Database: MongoDB (using Docker)
- ORM: Mongoose
- Authentication: JWT (JSON Web Tokens)
- Cookie Management: cookie-parser

### Other Tools

- Docker: To run MongoDB locally
- Cookie Management: Using httpOnly cookies for secure authentication

## Folder Structure

```plaintext
project-root/
    ├── backend/
    │   ├── src/
    │   │   ├── auth/
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.service.ts
    │   │   │   ├── user.schema.ts
    │   │   │   ├── dto/
    │   │   │       ├── signin.dto.ts
    │   │   │       └── signup.dto.ts
    │   │   ├── app.module.ts
    │   │   └── main.ts
    │   └── package.json
    └── frontend/
        ├── pages/
        │   ├── index.tsx
        │   ├── signup.tsx
        │   └── signin.tsx
        ├── components/
        │   └── SignOutButton.tsx
        ├── hoc/
        │   └── withAuth.tsx
        └── package.json
```

## Getting Started

### Prerequisites

- Node.js: Version 14 or above
- npm or yarn
- Docker: To run MongoDB locally

### Installation

1. Clone the Repository:

```bash
git clone <repository-url>
cd project-root
```

2. Setup Frontend:

```bash
cd frontend
npm install
```

3. Setup Backend:

```bash
cd backend
npm install
```

### Running the App

#### Step 1: Run MongoDB with Docker

Use Docker to run MongoDB locally:

```bash
docker run --name user-auth-mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo:latest
```

#### Step 2: Configure Environment Variables

Create a .env file in the backend folder with the following content:

```plaintext
# backend/.env
MONGO_URI=mongodb://admin:secret@localhost:27017/user-auth-db?authSource=admin
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

Create a .env.local file in the frontend folder with the following content:

```plaintext
# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### Step 3: Start the Backend Server

Navigate to the backend folder and run the server:

```bash
cd backend
npm run start
```

The backend should now be running on `http://localhost:8000`.

#### Step 4: Start the Frontend

Navigate to the frontend folder and run the app:

```bash
cd frontend
npm run dev
```

The frontend should now be running on `http://localhost:3000`.

### Environment Variables

- Frontend (frontend/.env.local):

  - NEXT_PUBLIC_API_BASE_URL: Base URL for the backend API.

- Backend (backend/.env):

  - MONGO_URI: MongoDB connection string.
  - JWT_SECRET: Secret key for signing JWT access tokens.
  - JWT_EXPIRES_IN: Expiration time for JWT access tokens.
  - JWT_REFRESH_SECRET: Secret key for signing JWT refresh tokens.
  - JWT_REFRESH_EXPIRES_IN: Expiration time for JWT refresh tokens.

### API Endpoints

#### Authentication Endpoints

- POST /auth/signup: Sign up a new user.
  - Body: { email: string, name: string, password: string }
- POST /auth/signin: Sign in an existing user.
  - Body: { email: string, password: string }
- POST /auth/signout: Sign out the current user.
  - Cookies: refreshToken (required)
- GET /auth/check: Check if the user is authenticated.

### Usage

1. Sign Up: Navigate to http://localhost:3000/signup to register a new user.
2. Sign In: Navigate to http://localhost:3000/signin to log in.
3. Home Page: Visit http://localhost:3000/ to access the main application page. The app will redirect to the Sign-In page if not authenticated.
4. Sign Out: Click the "Sign Out" button on the application page to log out.
