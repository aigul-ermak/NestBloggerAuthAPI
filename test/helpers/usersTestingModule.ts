import {INestApplication} from "@nestjs/common";
import {getBasicAuthHeader} from "../auth.spec";

const request = require('supertest');

const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const reserveUserModel = {
    login: "user1",
    password: "password",
    email: "example@example.com"
};

export const usersTestingModule = {
    async createUser(httpServer: any, userDto?: any) {


        const createdUser = await request(httpServer)
            .post(`/users`)
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(userDto ?? reserveUserModel)
            .expect(201);

        const expectedCreatedUser = {
            id: expect.any(String),
            login: userDto.login,
            email: userDto.email,
            createdAt: expect.any(String),
        };

        return createdUser.body
    }
}