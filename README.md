# NestJS Authentication API

API implementation based on Swagger for a bloggers platform with authentication, refresh tokens, device management, and IP restriction.

## Tech Stack
- Backend: Node.js, NestJS
- Database: MongoDB, MongoDB Atlas, Mongoose

## API Testing Tools
- Postman: Used to test API endpoints and validate functionality.

## Deployment
- The application is designed to be deployed on a Virtual Private Server (VPS).
- GitHub Actions is used for CI/CD to automate testing

## Features:

## Base URL 
The API is hosted at: http://5.253.188.129:3001

## API Endpoints
Method	Endpoint	Description
POST	/auth/registration	Register a new user
POST	/auth/registration-confirmation	Confirm user registration
POST	/auth/registration-email-resending	Resend confirmation email
POST	/auth/login	Login and receive access/refresh tokens
POST	/auth/refresh-token	Refresh access and refresh tokens
POST	/auth/logout	Logout and invalidate refresh token
POST	/auth/password-recovery	Initiate password recovery
POST	/auth/new-password	Set a new password using recovery code
GET	/auth/me	Get details of the currently logged-in user
