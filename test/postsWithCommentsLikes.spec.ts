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

let blog, post, comment, user1, user2, user3, user4, accessToken1, accessToken2, accessToken3, accessToken4;

describe('Posts testing', () => {
    let app: INestApplication;
    let httpServer;

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

    it('return 201 for create blog', async () => {

        const blogDto = {
            name: 'testBlog',
            description: 'testDescription',
            websiteUrl: 'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V'
        };

        const response = await request(httpServer)
            .post('/blogs')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(blogDto)
            .expect(201);


        const expectedResult = {
            id: expect.any(String),
            name: blogDto.name,
            description: expect.any(String),
            websiteUrl: expect.any(String),
            createdAt: expect.any(String),
            isMembership: false
        };

        blog = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 201 for create post', async () => {

        const postDto = {
            title: 'testPost',
            shortDescription: 'testShortDescription',
            content: 'testContent',
            blogId: blog.id
        };

        const response = await request(httpServer)
            .post('/posts')
            .set('Authorization', getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS))
            .send(postDto)
            .expect(201);


        const expectedResult = {
            id: expect.any(String),
            title: postDto.title,
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }

        };

        post = response.body;
        expect(response.body).toEqual(expectedResult);

    });

    it('return 200 for get post', async () => {

        const postId = post.id;

        const response = await request(httpServer)
            .get(`/posts/${postId}`)
            .expect(200);


        const expectedResult = {
            id: expect.any(String),
            title: post.title,
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }

        };

        expect(response.body).toEqual(expectedResult);

    });

    it('return 201 for create user1', async () => {

        const userDto = {
            login: "user1",
            password: "password",
            email: "example1@example.com"
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

    it('return 201 for create user2', async () => {

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

    it('return 201 for create user3', async () => {

        const userDto = {
            login: "user3",
            password: "password",
            email: "example3@example.com"
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

        user3 = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 201 for create user4', async () => {

        const userDto = {
            login: "user4",
            password: "password",
            email: "example4@example.com"
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

        user4 = response.body;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 200 for login user1', async () => {


        const userLoginDto = {
            loginOrEmail: "user1",
            password: "password"
        };


        const response = await request(httpServer)
            .post(`/auth/login`)
            .send(userLoginDto)
            .expect(200);


        const expectedResult = {
            accessToken: expect.any(String)
        };

        accessToken1 = response.body.accessToken;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 200 for login user2', async () => {


        const userLoginDto = {
            loginOrEmail: "user2",
            password: "password"
        };


        const response = await request(httpServer)
            .post(`/auth/login`)
            .send(userLoginDto)
            .expect(200);


        const expectedResult = {
            accessToken: expect.any(String)
        };

        accessToken2 = response.body.accessToken;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 200 for login user3', async () => {


        const userLoginDto = {
            loginOrEmail: "user3",
            password: "password"
        };


        const response = await request(httpServer)
            .post(`/auth/login`)
            .send(userLoginDto)
            .expect(200);


        const expectedResult = {
            accessToken: expect.any(String)
        };

        accessToken3 = response.body.accessToken;

        expect(response.body).toEqual(expectedResult);

    });

    it('return 200 for login user4', async () => {


        const userLoginDto = {
            loginOrEmail: "user4",
            password: "password"
        };


        const response = await request(httpServer)
            .post(`/auth/login`)
            .send(userLoginDto)
            .expect(200);


        const expectedResult = {
            accessToken: expect.any(String)
        };

        accessToken4 = response.body.accessToken;

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 201 for add comment user1 to post', async () => {

        const postId = post.id;

        const commentDto = {
            content: "new comment for post"
        };

        const response = await request(httpServer)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(commentDto)
            .expect(201);

        const expectedResult = {
            id: expect.any(String),
            content: commentDto.content,
            commentatorInfo: {
                userId: user1.id,
                userLogin: user1.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
            }

        };

        comment = response.body;
        expect(response.body).toEqual(expectedResult);


    });

    it('return 200 for get posts comments', async () => {

        const postId = post.id;

        const response = await request(httpServer)
            .get(`/posts/${postId}/comments`)
            .expect(200);


        const expectedResult = {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: expect.any(String),
                content: comment.content,
                commentatorInfo: {
                    userId: user1.id,
                    userLogin: user1.login
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                }
            }
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('return 204 for update comment user1 to post', async () => {

        const commentId = comment.id;

        const commentDto = {
            content: "updated comment for post"
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(commentDto)
            .expect(204);
    });

    it('return 400 for update comment user1 to post', async () => {

        const commentId = comment.id;

        const commentDto = {
            content: ""
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(commentDto)
            .expect(400);

        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Length not correct",
                    "field": "content",
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('return 401 for update comment user1 to post', async () => {

        const commentId = comment.id;

        const commentDto = {
            content: "updated comment for post"
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}`)
            //.set('Authorization', `Bearer ${accessToken1}`)
            .send(commentDto)
            .expect(401);

        expect(response.body).toEqual({
            error: 'Unauthorized',
            message: 'Authorization header is missing',
            statusCode: 401
        });
    });

    it('return 404 for update comment user1 to post', async () => {

        const commentId = "66f43e5429cfec77b7e2e997";

        const commentDto = {
            content: "updated comment for post"
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(commentDto)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Comment not found',
            error: 'Not Found'
        });
    });

    it('return 403 for update comment user1 to post', async () => {

        const commentId = comment.id;

        const commentDto = {
            content: "updated comment for post"
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken3}`)
            .send(commentDto)
            .expect(403);

        expect(response.body).toEqual({
            statusCode: 403,
            message: 'User is not allowed to edit this comment',
            error: 'Forbidden'
        });
    });

    it('returns 204 for add like by user 1 to comment', async () => {

        const commentId = comment.id;

        const likeDto = {
            likeStatus: 'Like'
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(likeDto)
            .expect(204);
    });

    it('returns 400 for add like by user 1 to comment', async () => {

        const commentId = comment.id;

        const likeDto = {
            likeStatus: ''
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(likeDto)
            .expect(400);

        const expectedResult = {
            "errorsMessages": [
                {
                    "message": "Status must be one of Like, Dislike, or None",
                    "field": "likeStatus",
                },
            ]
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 401 for add like by user 1 to comment', async () => {

        const commentId = comment.id;

        const likeDto = {
            likeStatus: ''
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}/like-status`)
            //.set('Authorization', `Bearer ${accessToken1}`)
            .send(likeDto)
            .expect(401);

        expect(response.body).toEqual({
            error: 'Unauthorized',
            "message": "Authorization header is missing",
            statusCode: 401
        });

    });

    it('returns 404 for add like by user 1 to comment', async () => {

        const commentId = '66f94610f417e0eecf048a08';

        const likeDto = {
            likeStatus: 'Like'
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(likeDto)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Comment not found',
            error: 'Not Found',
        });

    });

    it('return 200 for get comment', async () => {

        const commentId = comment.id;

        const response = await request(httpServer)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(200);


        const expectedResult = {
            id: expect.any(String),
            content: expect.any(String),
            commentatorInfo: {
                userId: user1.id,
                userLogin: user1.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: "Like",
            }
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('return 404 for get comment', async () => {

        const commentId = '66f94610f417e0eecf048a08';

        const response = await request(httpServer)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Comment not found',
            error: 'Not Found',
        });

    });

    it('returns 204 for add dislike by user 1 to comment', async () => {

        const commentId = comment.id;

        const likeDto = {
            likeStatus: 'Dislike'
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(likeDto)
            .expect(204);


    });

    it('return 200 for get comment after dislike', async () => {

        const commentId = comment.id;

        const response = await request(httpServer)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(200);


        const expectedResult = {
            id: expect.any(String),
            content: expect.any(String),
            commentatorInfo: {
                userId: user1.id,
                userLogin: user1.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: "Dislike",
            }
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 204 for add none by user 1 to comment', async () => {

        const commentId = comment.id;

        const likeDto = {
            likeStatus: 'None'
        };

        const response = await request(httpServer)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .send(likeDto)
            .expect(204);


    });

    it('return 200 for get comment after none', async () => {

        const commentId = comment.id;

        const response = await request(httpServer)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(200);


        const expectedResult = {
            id: expect.any(String),
            content: expect.any(String),
            commentatorInfo: {
                userId: user1.id,
                userLogin: user1.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
            }
        };

        expect(response.body).toEqual(expectedResult);

    });

    it('returns 201 for delete comment: unauthorised user', async () => {

        const commentId = comment.id;

        const response = await request(httpServer)
            .delete(`/comments/${commentId}`)
            .expect(401);


    });

    it('returns 404 for delete comment: Not found', async () => {

        const commentId = '66f6a26adc4b81ea41af73f8';

        const response = await request(httpServer)
            .delete(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(404);

        expect(response.body).toEqual({
            statusCode: 404,
            message: 'Comment not found',
            error: 'Not Found',
        });

    });

    it('returns 403 for delete comment: Not found', async () => {

        const commentId = comment.id;

        const response = await request(httpServer)
            .delete(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .expect(403);

        expect(response.body).toEqual({
            statusCode: 403,
            message: 'User is not allowed to edit this comment',
            error: 'Forbidden',
        });

    });

    it('returns 204 for delete comment', async () => {

        const commentId = comment.id;

        const response = await request(httpServer)
            .delete(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(204);
    });

})
