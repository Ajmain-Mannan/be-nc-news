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