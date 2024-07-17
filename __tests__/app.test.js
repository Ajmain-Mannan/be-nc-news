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

describe("/api/articles", () => {
    test("GET:200 responds with an array containing all articles and corresponding properties, sorted by date descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(13);
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("GET:200 articles are sorted by date descending", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    test("GET:200 responds with an array of comments containing all comments for an article_id and all corresponding properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              article_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
            });
          });
        });
    });
    test("GET:200 comments are sorted in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) =>
            expect(body.comments).toBeSortedBy("created_at", { descending: true }),
          );
      });
      test("GET:200 returns an empty array when comments do not exist for existing article", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
         expect(body.comments).toEqual([]);
      });
  });
  test("GET:404 responds with error message and status when given article id that does not exist", () => {
    return request(app)
      .get("/api/articles/54321/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });

});