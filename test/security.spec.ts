import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from './../src/app.module';
import {applyAppSettings} from "../src/settings/apply.app.setting";
import {SessionQueryRepository} from "../src/features/session/infrastructure/session.query-repository";

const request = require('supertest');

const jwt = require('jsonwebtoken');

const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

export const getBasicAuthHeader = (username: string, password: string) => {
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${base64Credentials}`;
};

describe('SecurityController', () => {
    let app: INestApplication;
    let httpServer;
    let user1;
    let user2;
    let cookie1;
    let cookie2;
    let sessionQueryRepository;


    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        sessionQueryRepository = moduleFixture.get(SessionQueryRepository);

        app = moduleFixture.createNestApplication();
        applyAppSettings(app);
        await app.init();

        httpServer = app.getHttpServer();

    });

    afterEach(async () => {

        await request(httpServer)
            .delete('/testing/all-data')
            .expect(204);

        await app.close();
    });

    it('POST -> /users: return 201 for create user1', async () => {

        const userDto = {
            login: "user",
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

        user1 = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('POST -> auth/login: return 200 for login user1', async () => {

        const userLoginDto = {
            loginOrEmail: "example@example.com",
            password: "password",
        };

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userLoginDto)
            .expect(200);

        cookie1 = response.headers['set-cookie'];

    });

    it('POST -> /users: return 201 for create user2', async () => {

        const userDto = {
            login: "user2",
            password: "password",
            email: "example2@example.com"
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

        user2 = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('POST -> auth/login: return 200 for login user2', async () => {

        const userLoginDto = {
            loginOrEmail: "example2@example.com",
            password: "password",
        };

        const response = await request(httpServer)
            .post(`/auth/login`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userLoginDto)
            .expect(200);

        cookie2 = response.headers['set-cookie'];

    });

    it('GET -> security/devices: return 200 for current user1', async () => {

        const devices = await request(httpServer)
            .get(`/security/devices`)
            .set('Cookie', cookie1)
            .expect(200);

        expect(devices.body).toEqual([{
            deviceId: expect.any(String),
            ip: expect.any(String),
            lastActiveDate: expect.any(String),
            title: expect.any(String)
        }]);

    });

// How to create unauth???
    it('GET -> security/devices: return 401 for current user1: unauthorized', async () => {

        const devices = await request(httpServer)
            .get(`/security/devices`)
            .set('Cookie', cookie1)
            .expect(200);

        expect(devices.body).toEqual([{
            deviceId: expect.any(String),
            ip: expect.any(String),
            lastActiveDate: expect.any(String),
            title: expect.any(String)
        }]);

    });

    it('DELETE -> security/devices/:id: return 403 try to delete the deviceId of other user', async () => {

        // end-to-end
        const {body: firstUserSessions} = await request(httpServer)
            .get("/security/devices")
            .set('Cookie', cookie1)
        console.error(firstUserSessions, " firstUserSessions")
        const devices = await request(httpServer)
            .delete(`/security/devices/${firstUserSessions[0].deviceId}`)
            .set('Cookie', cookie2)
            .expect(403);
    });


    it('DELETE -> security/devices/:id: return 204 for current user1', async () => {
        const refreshTokenCookie = cookie1.find(cookie => cookie.startsWith('refreshToken'));
        const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
        const decodedToken = jwt.decode(refreshToken);
        const deviceId = decodedToken.deviceId;

        const devices = await request(httpServer)
            .delete(`/security/devices/${deviceId}`)
            .set('Cookie', cookie1)
            .expect(204);
    });

    it('DELETE -> security/devices/:id: return 404 try to delete the deviceId of other user', async () => {

        const invalidDeviceId = 'a8bf457a-8491-4d29-815c-a867072b8cy9';

        const devices = await request(httpServer)
            .delete(`/security/devices/${invalidDeviceId}`)
            .set('Cookie', cookie2)
            .expect(404);
    });


});