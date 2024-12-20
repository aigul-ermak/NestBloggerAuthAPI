import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from '../src/app.module';
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
        })
            .compile();

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

    // it('POST -> auth/login: should enforce throttling (429)', async () => {
    //
    //     for (let i = 0; i < 10; i++) {
    //         await request(httpServer)
    //             .post('/auth/login')
    //             .send({
    //                 loginOrEmail: 'example@example.com',
    //                 password: 'wrongpassword',
    //             });
    //     }
    //
    //     await request(httpServer)
    //         .post('/auth/login')
    //         .send({
    //             loginOrEmail: 'example@example.com',
    //             password: 'wrongpassword',
    //         })
    //         .expect(429);
    // });

    // password recovery

    it('POST -> "/auth/password-recovery": should return 204', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        const userEmailDto = {
            email: "example1@example.com"
        };

        await request(httpServer)
            .post(`/auth/password-recovery`)
            .send(userEmailDto)
            .expect(204);
    });

    it('POST -> "/auth/password-recovery": should return 400', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        const userEmailDto = {
            email: "222~.example.com"
        };

        await request(httpServer)
            .post(`/auth/password-recovery`)
            .send(userEmailDto)
            .expect(400);
    });

    // it('POST -> "/auth/password-recovery": should return 429', async () => {
    //
    //     const newUserDto = {
    //         login: "user1",
    //         password: "password",
    //         email: "example1@example.com"
    //     };
    //
    //     const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);
    //
    //     const userEmailDto = {
    //         email: "example1@example.com"
    //     };
    //
    //     for (let i = 0; i < 6; i++) {
    //         await request(httpServer)
    //             .post(`/auth/password-recovery`)
    //             .send(userEmailDto)
    //             .expect(429);
    //     }
    // });

    // new password

    it('POST -> "/auth/new-password": should return 204', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        await request(httpServer)
            .post(`/auth/password-recovery`)
            .send(newUserDto)
            .expect(204);

        const user = await usersQuerySession.findOneByEmail(newUserBody.email);
        const passwordRecoveryCode = user.accountData.passwordRecoveryCode;

        const newPasswordDto = {
            newPassword: "newPassword",
            recoveryCode: passwordRecoveryCode
        };

        await request(httpServer)
            .post(`/auth/new-password`)
            .send(newPasswordDto)
            .expect(204);
    });

    it('POST -> "/auth/new-password": should return 400: invalid new password', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        await request(httpServer)
            .post(`/auth/password-recovery`)
            .send(newUserDto)
            .expect(204);

        const user = await usersQuerySession.findOneByEmail(newUserBody.email)
        const passwordRecoveryCode = user.accountData.passwordRecoveryCode;

        const newPasswordDto = {
            newPassword: "",
            recoveryCode: passwordRecoveryCode
        };

        await request(httpServer)
            .post(`/auth/new-password`)
            .send(newPasswordDto)
            .expect(400);
    });

    it('POST -> "/auth/new-password": should return 400: wrong recovery code', async () => {

        const newUserDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
        };

        const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);

        await request(httpServer)
            .post(`/auth/password-recovery`)
            .send(newUserDto)
            .expect(204);

        const user = await usersQuerySession.findOneByEmail(newUserBody.email)
        const passwordRecoveryCode = "a1c423ba-54d8-4a8f-850a-34e6747a19d4";

        const newPasswordDto = {
            newPassword: "newPassword",
            recoveryCode: passwordRecoveryCode
        };

        await request(httpServer)
            .post(`/auth/new-password`)
            .send(newPasswordDto)
            .expect(400);
    });


    // it('POST -> "/auth/new-password": should return 429', async () => {
    //
    //     const newUserDto = {
    //         login: "user1",
    //         password: "password",
    //         email: "example1@example.com"
    //     };
    //
    //     const newUserBody = await usersTestingModule.createUser(httpServer, newUserDto);
    //
    //     await request(httpServer)
    //         .post(`/auth/password-recovery`)
    //         .send(newUserDto)
    //         .expect(204);
    //
    //     const user = await usersQuerySession.findOneByEmail(newUserBody.email)
    //     const passwordRecoveryCode = user.accountData.passwordRecoveryCode;
    //
    //     const newPasswordDto = {
    //         newPassword: "newPassword",
    //         recoveryCode: passwordRecoveryCode
    //     };
    //
    //     for (let i = 0; i < 10; i++) {
    //         await request(httpServer)
    //             .post(`/auth/new-password`)
    //             .send(newPasswordDto)
    //             .expect(429);
    //     }
    //
    // });

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

        // const delay = (milliseconds: number) => new Promise((resolve, reject): void => {
        //     setTimeout(() => {
        //         resolve(1)
        //     }, milliseconds)
        // })
        //
        // await delay(2000)

        const userLogin = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send({
                loginOrEmail: newUserBody.login,
                password: newUserDto.password
            })
            .expect(200);

        //const cookie = userLogin.headers['set-cookie'];
        const cookie = '';

        // await request(httpServer)
        //     .post('/auth/refresh-token')
        //     .set('Cookie', cookie)
        //     .send({})
        //     .expect(200);
        //
        // await delay(2000);

        await request(httpServer)
            .post('/auth/refresh-token')
            .set('Cookie', cookie)
            .send({})
            .expect(401);

    });

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

    // it('POST -> "/auth/registration-confirmation": should return 429', async () => {
    //     const userRegistrationDto = {
    //         login: "user",
    //         password: "password",
    //         email: "example@example.com"
    //     };
    //
    //     for (let i = 0; i < 10; i++) {
    //         await request(httpServer)
    //             .post('/auth/registration-confirmation')
    //             .send(userRegistrationDto)
    //             .expect(429);
    //     }
    //
    // });

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

    // it('POST -> "/auth/registration": return 429 for user registration', async () => {
    //
    //     const userRegistrationDto = {
    //         login: "user",
    //         password: "password",
    //         email: "example@example.com"
    //     };
    //
    //     for (let i = 0; i < 10; i++) {
    //         await request(httpServer)
    //             .post('/auth/registration')
    //             .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
    //             .send(userRegistrationDto)
    //             .expect(429);
    //     }
    //
    // });

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
            //.set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
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

        const cookie = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzA5MmVmZDkwMDM4N2NmNGFmODlkMmMiLCJkZXZpY2VJZCI6IjlmNjI2MGFjLWRmMzEtNDdiNi05YTBmLWJjNzFiNjRjMGJhOCIsInVzZXJJUCI6InRlc3R1c2VyaXAiLCJ1c2VyQWdlbnQiOiJ1c2VyLWFnZW50IiwiaWF0IjoxNzI4NjU1MTAxLCJleHAiOjE3Mjg2NTUxMjF9.bfaoQP6pSUgjtfmhQGU48h-QL2GWZjgsy6tpl8qjQS9";

        const response = await request(httpServer)
            .post(`/auth/logout`)
            .set('Cookie', cookie)
            .expect(401);

        expect(response.body).toEqual({
            error: "Unauthorized",
            message: 'No refresh token found',
            statusCode: 401
        });
    });

    // auth/me
    it('GET -> "/auth/me": should status 200', async () => {

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

        const loginUser = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(currentUserLoginDto)
            .expect(200);

        const accessToken = loginUser.body.accessToken;

        const response = await request(httpServer)
            .get(`/auth/me`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        const expectedResult = {
            email: userDto.email,
            login: userDto.login,
            userId: expect.any(String)
        };

        expect(response.body).toEqual(expectedResult);
    });


    it('GET -> "/auth/me": should status 401', async () => {

        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbk9yRW1haWwiOiJhaWcyIiwiaWQiOiI2NzA5M2ExNzk4YjEwY2NhZDE4OTEwMjkiLCJpYXQiOjE3Mjg2NTc5NDUsImV4cCI6MTcyODY1Nzk1NX0.B4lKhZD2XuzKjhUMX5CBicMT0lm_59VtkH5rKDMlf9U";

        const response = await request(httpServer)
            .get(`/auth/me`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(401);
    });
});
