import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';

const request = require('supertest');
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";


const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

describe('Auth testing', () => {
    let app: INestApplication;
    let httpServer;

    let user, newUser2, accessToken;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();


        app = moduleFixture.createNestApplication();
        applyAppSettings(app);
        await app.init();

        httpServer = app.getHttpServer();


    });

    afterAll(async () => {

        await request(httpServer)
            .delete('/testing/all-data')
            .expect(204);

        await app.close();
    });

    it('return 201 for create user', async () => {

        const userDto = {
            login: "user1",
            password: "password",
            email: "example@example.com"
        };

        const response = await request(httpServer)
            .post(`/users`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(201);


        const expectedResult = {
            id: expect.any(String),
            login: userDto.login,
            email: userDto.email,
            createdAt: expect.any(String),
        };

        user = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 200 for login user', async () => {

        const userLoginDto = {
            loginOrEmail: "example@example.com",
            password: "password",
        };

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userLoginDto)
            .expect(200);


        const expectedResult = {
            accessToken: expect.any(String)
        };

        accessToken = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 400 for login user', async () => {

        const userLoginDto = {
            loginOrEmail: "",
            password: "",
        };

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userLoginDto)
            .expect(400);


        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "loginOrEmail should not be empty",
                    "field": "loginOrEmail"
                },
                {
                    "message": "password should not be empty",
                    "field": "password"
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('return 401 for login user: wrong email', async () => {

        const userLoginDto = {
            loginOrEmail: "example1@example.com",
            password: "password",
        };

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userLoginDto)
            .expect(401);

        expect(response.body).toEqual({
            error: 'Unauthorized',
            message: 'Invalid credentials',
            statusCode: 401
        });

    });

    it('return 401 for login user: wrong password', async () => {

        const userLoginDto = {
            loginOrEmail: "example@example.com",
            password: "passwordd",
        };

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userLoginDto)
            .expect(401);

        expect(response.body).toEqual({
            error: 'Unauthorized',
            message: 'Invalid credentials',
            statusCode: 401
        });

    });

    it('return 204 for user registration', async () => {

        const userRegistrationDto = {
            login: 'user1',
            password: 'password',
            email: 'example@example.com'
        };

        const response = await request(httpServer)
            .post('/auth/registration')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userRegistrationDto)
            .expect(204);

        expect(response.body).toEqual({});

    });


    it('return 400 for user registration', async () => {

        const userRegistrationDto = {
            login: '',
            password: '',
            email: ''
        };

        const response = await request(httpServer)
            .post('/auth/registration')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userRegistrationDto)
            .expect(400);

        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Length not correct",
                    "field": "login"
                },
                {
                    "message": "Length not correct",
                    "field": "password"
                },
                {
                    "message": "email must be an email",
                    "field": "email"
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });


    it('return 429 for user registration', async () => {

       
    });


    // it('POST /auth/registration - should return 400 login already exists', async () => {
    //
    //     const userDto = {
    //         login: 'testuser1',
    //         password: 'testpassword',
    //         email: 'testuser1@example.com'
    //     };
    //
    //     await request(httpServer)
    //         .post('/auth/registration')
    //         .send(userDto)
    //         .expect(204);
    //
    //
    //     const duplicateUserDto = {
    //         login: 'testuser1',
    //         password: 'anotherpassword',
    //         email: 'testuser100@example.com'
    //     };
    //
    //     const response = await request(httpServer)
    //         .post('/auth/registration')
    //         .send(duplicateUserDto)
    //         .expect(400);
    //
    //
    //     const expectedError = {
    //         errorsMessages: [
    //             {
    //                 message: 'Length not correct',
    //                 field: 'login',
    //             }
    //         ]
    //     };
    //
    //     expect(response.body).toMatchObject(expectedError);
    // });

    // it('POST /auth/registration - should return 400 email already exists', async () => {
    //     // First, register a user with valid data
    //     const userDto = {
    //         login: 'testuser1',
    //         password: 'testpassword',
    //         email: 'testuser1@example.com'
    //     };
    //
    //     await request(httpServer)
    //         .post('/auth/registration')
    //         .send(userDto)
    //         .expect(204);
    //
    //
    //     const duplicateUserDto = {
    //         login: 'testuser100',
    //         password: 'testpassword',
    //         email: 'testuser1@example.com'
    //     };
    //
    //     const response = await request(httpServer)
    //         .post('/auth/registration')
    //         .send(duplicateUserDto)
    //         .expect(400);
    //
    //
    //     const expectedError = {
    //         errorsMessages: [
    //             {
    //                 message: 'User with this email already exists',
    //                 field: 'email',
    //             }
    //         ]
    //     };
    //
    //     expect(response.body).toMatchObject(expectedError);
    // });


    // it('/registration User registration - existing login or email', async () => {
    //
    //     const userDto = {
    //         login: 'testuser',
    //         password: 'testpassword',
    //         email: 'testuser@example.com'
    //     };

    // await request(httpServer)
    //     .post('/registration')
    //     .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
    //     .send(userDto)
    //     .expect(204);

    // Second registration with the same email/login
    //     const response = await request(httpServer)
    //         .post('/registration')
    //         .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
    //         .send(userDto)
    //         .expect(400);
    //
    //     const expectedError = {
    //         errorsMessages: [
    //             { message: 'User with this email or login already exists', field: 'email' }
    //         ]
    //     };
    //
    //     expect(response.body).toMatchObject(expectedError);
    // });

});
