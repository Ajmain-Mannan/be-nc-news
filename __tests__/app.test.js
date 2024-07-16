const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

describe('/api',() => {
    test('GET 200: Responds with a json representation of all the available endpoints of the api', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            })
    })
})


describe("/api/topics", () => {
    test("GET:200 returns array with slug and description properties", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
        })
    })
})
});

describe("/api/articles/:article_id", () => {
    test("GET200: responds with correct article id with corresponding properties", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });
    test("GET400: responds with error status and message when given invalid article id", () => {
        return request(app)
            .get("/api/articles/invalid-id")
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("Bad Request");
            });
    });
    test("GET404: responds with error status and message when given article id that does not exist", () => {
        return request(app)
            .get("/api/articles/54321")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("Not Found");
            });
    });
});