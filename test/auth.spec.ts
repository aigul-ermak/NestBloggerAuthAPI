import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";
import {usersTestingModule} from "./helpers/usersTestingModule";
import {UsersQueryRepository} from "../src/features/users/infrastructure/users.query-repository";

const request = require('supertest');


const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

export const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

describe('Auth controller', () => {
    let app: INestApplication;
    let httpServer;
    let usersQuerySession;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        applyAppSettings(app);
        await app.init();

        usersQuerySession = moduleFixture.get<UsersQueryRepository>(UsersQueryRepository);

        httpServer = app.getHttpServer();

    });

    afterEach(async () => {

        await request(httpServer)
            .delete('/testing/all-data')
            .expect(204);

    });

    afterAll(async () => {
        await app.close();
    });

    // auth/login

    it('POST -> auth/login: should return 200 for login user', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                loginOrEmail: newUserBody.login,
                password: newUserDto.password
            })
            .expect(200);

        const accessToken = response.body
        const expectedResult = {
            accessToken: expect.any(String)
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('POST -> auth/login: return 400, login and password are wrong', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        const invalidLoginOrEmail = "";
        const invalidPassword = "";


        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                loginOrEmail: invalidLoginOrEmail,
                password: invalidPassword
            })
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

    it('POST -> auth/login: should 401 return an error if password invalid; status 401\'return 401 for login user: wrong password', async () => {

        const newUserDto = {
            login: "user",
            password: "password",
            email: "example@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        const userLoginDto = {
            loginOrEmail: "example3@example.com",
            password: "passworddd",
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

    it('POST -> auth/login: should return 429, \t\n' +
        'More than 5 attempts from one IP-address during 10 seconds', async () => {
    });

    // auth/refresh-token

    it('POST -> "/auth/refresh-token": should return 200 ', async () => {

        const newUserDto = {
            login: "user",
            password: "password",
            email: "example@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer);

        const loginUser = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                loginOrEmail: newUserBody.login,
                password: newUserDto.password
            })
            .expect(200);

        const cookie = loginUser.headers['set-cookie'];

        const refreshToken = await request(httpServer)
            .post('/auth/refresh-token')
            .set('Cookie', cookie)
            .send({})
            .expect(200);

        expect(refreshToken.body).toEqual({
            accessToken: expect.any(String)
        })
    });

    it('POST -> "/auth/refresh-token": should return 401 ', async () => {

        const newUserDto = {
            login: "user",
            password: "password",
            email: "example@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer);

        const userLogin = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                loginOrEmail: newUserBody.login,
                password: newUserDto.password
            })
            .expect(200);

        const cookie = userLogin.headers['set-cookie'];
        const delay = (milliseconds: number) => new Promise((resolve, reject): void => {
            setTimeout(() => {
                resolve(1)
            }, milliseconds)
        })

        await delay(2000)

        await request(httpServer)
            .post('/auth/refresh-token')
            .set('Cookie', cookie)
            .send({})
            .expect(200);

        await delay(2000);

        await request(httpServer)
            .post('/auth/refresh-token')
            .set('Cookie', cookie)
            .send({})
            .expect(401);

    }, 10000);

    // auth/registration-confirmation

    it('POST -> "/auth/registration-confirmation": should return 204', async () => {

        const userRegistrationDto = {
            login: "user",
            password: "password",
            email: "example@example.com"
        };

        const registrationUser = await request(httpServer)
            .post(`/auth/registration`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userRegistrationDto)
            .expect(204);

        const user = await usersQuerySession.findOneByLoginOrEmail(userRegistrationDto.email);

        const code = user.emailConfirmation.confirmationCode;

        await request(httpServer)
            .post(`/auth/registration-confirmation`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                code: code
            })
            .expect(204);
    });

    it('POST -> "/auth/registration-confirmation": should return 400, already confirmed', async () => {
        const userRegistrationDto = {
            login: "user",
            password: "password",
            email: "example@example.com"
        };

        await request(httpServer)
            .post(`/auth/registration`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userRegistrationDto)
            .expect(204);

        const user = await usersQuerySession.findOneByLoginOrEmail(userRegistrationDto.email);

        const code = user.emailConfirmation.confirmationCode;

        await request(httpServer)
            .post(`/auth/registration-confirmation`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                code: code
            })
            .expect(204);

        const response = await request(httpServer)
            .post(`/auth/registration-confirmation`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                code: code
            })
            .expect(400);

        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Email already confirmed",
                    "field": "code"
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('POST -> "/auth/registration-confirmation": should return 400, wrong token', async () => {

        const code = '96766936-9ba4-4c33-8c07-e09ea02621bd';

        const response = await request(httpServer)
            .post(`/auth/registration-confirmation`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                code: code
            })
            .expect(400);

        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Confirmation code does not exist",
                    "field": "code"
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    },);

    it('POST -> "/auth/refresh-token", "/auth/logout": should return 429', async () => {


    });


    // auth/registration

    it('POST -> "/auth/registration": should return 204: user registered', async () => {

        const userRegistrationDto = {
            login: "user",
            password: "password",
            email: "example@example.com"
        };

        const registrationUser = await request(httpServer)
            .post(`/auth/registration`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userRegistrationDto)
            .expect(204);
    });

    it('POST -> "/auth/registration": return 400 for user registration', async () => {

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

    it('POST -> "/auth/registration": return 429 for user registration', async () => {


    });

    it('POST /auth/registration - should return 400 login already exists', async () => {

        const userDto = {
            login: 'testuser1',
            password: 'testpassword',
            email: 'testuser1@example.com'
        };

        await request(httpServer)
            .post('/auth/registration')
            .send(userDto)
            .expect(204);


        const duplicateUserDto = {
            login: 'testuser1',
            password: 'anotherpassword',
            email: 'testuser100@example.com'
        };

        const response = await request(httpServer)
            .post('/auth/registration')
            .send(duplicateUserDto)
            .expect(400);


        const expectedError = {
            errorsMessages: [
                {
                    message: 'User with this login already exists',
                    field: 'login',
                }
            ]
        };

        expect(response.body).toMatchObject(expectedError);
    });

    it('POST /auth/registration - should return 400 email already exists', async () => {

        const userDto = {
            login: 'testuser1',
            password: 'testpassword',
            email: 'testuser1@example.com'
        };

        await request(httpServer)
            .post('/auth/registration')
            .send(userDto)
            .expect(204);


        const duplicateUserDto = {
            login: 'testuser2',
            password: 'testpassword',
            email: 'testuser1@example.com'
        };

        const response = await request(httpServer)
            .post('/auth/registration')
            .send(duplicateUserDto)
            .expect(400);


        const expectedError = {
            errorsMessages: [
                {
                    message: 'User with this email already exists',
                    field: 'email',
                }
            ]
        };

        expect(response.body).toMatchObject(expectedError);
    });

// auth/logout
    it('POST -> "/auth/logout": should status 204;', async () => {

        const userDto = {
            login: "newUser",
            password: "password",
            email: "newUser@example.com"
        };

        const newUser = await request(httpServer)
            .post(`/users`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(201);

        const currentUserLoginDto = {
            loginOrEmail: "newUser@example.com",
            password: "password",
        };

        const currentUserLogin = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(currentUserLoginDto)
            .expect(200);

        const cookie = currentUserLogin.headers['set-cookie']

        await request(httpServer)
            .post(`/auth/logout`)
            .set('Cookie', cookie)
            .expect(204);

        const invalidLogoutAttempt = await request(httpServer)
            .post(`/auth/logout`)
            .set('Cookie', cookie)
            .expect(401);
    });

    it('POST -> "/auth/logout": should status 401 not authorized;', async () => {

        const userDto = {
            login: "newUser",
            password: "password",
            email: "newUser@example.com"
        };

        const newUser = await request(httpServer)
            .post(`/users`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto)
            .expect(201);

        const currentUserLoginDto = {
            loginOrEmail: "newUser@example.com",
            password: "password",
        };

        const currentUserLoginDto2 = {
            loginOrEmail: "newUser1@example.com",
            password: "password",
        };

        const currentUserLogin = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(currentUserLoginDto2)
            .expect(401);

        const cookie = currentUserLogin.headers['set-cookie']


        const response = await request(httpServer)
            .post(`/auth/logout`)
            .set('Cookie', cookie)
            .expect(401);

        expect(response.body).toEqual({
            message: 'Unauthorized',
            statusCode: 401
        });
    });


});
