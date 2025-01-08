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

Endpoints
1. Get All Users
Method: GET
Endpoint: /users
Description: Retrieve a list of all users.
Response
Success: 200 OK
json
Copy code
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
2. Add a New User
Method: POST
Endpoint: /users
Description: Create a new user in the system.
Request Body
json
Copy code
{
  "email": "newuser@example.com",
  "password": "securepassword"
}
Response
Success: 201 Created
json
Copy code
{
  "id": "new-user-id",
  "email": "newuser@example.com",
  "createdAt": "2023-01-03T12:00:00Z"
}
Error: 400 Bad Request
json
Copy code
{
  "error": "Invalid data provided."
}
3. Delete a User
Method: DELETE
Endpoint: /users/{id}
Description: Delete a user by their unique ID.
Response
Success: 200 OK
json
Copy code
{
  "message": "User deleted successfully."
}
Error: 404 Not Found
json
Copy code
{
  "error": "User not found."
}
