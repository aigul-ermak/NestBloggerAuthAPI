# NestJS Authentication API

API implementation based on Swagger for a bloggers platform with authentication, refresh tokens, device management, and IP restriction.

---

## Tech Stack
- Backend: Node.js, NestJS
- Database: MongoDB, MongoDB Atlas, Mongoose

---

## API Testing Tools
- Postman: Used to test API endpoints and validate functionality.

---

## Deployment
- The application is designed to be deployed on a Virtual Private Server (VPS).
- GitHub Actions is used for CI/CD to automate testing

---

## Features:
- User authentication with registration and login.
- Token-based session management (access and refresh tokens).
- Password recovery via email.
- User management (CRUD operations).
- Device management and IP restriction for added security.

---

## Base URL 
The API is hosted at: http://5.253.188.129:3001

## **Users API**

## 1. Get All Users
**Method:** `GET`  
**Endpoint:** `/users`  
**Description:** Retrieve a list of all users.

### Response
**Success:** `200 OK`  
```json
[
  {
    "id": "user-id-1",
    "email": "user1@example.com",
    "createdAt": "2023-01-01T12:00:00Z"
  },
  {
    "id": "user-id-2",
    "email": "user2@example.com",
    "createdAt": "2023-01-02T12:00:00Z"
  }
]
