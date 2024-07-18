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
    test("PATCH:200 responds with updated article", () => {
        return request(app)
      .patch("/api/articles/8")
      .send({ inc_votes: 100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
            author: "icellusedkars",
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 100,
            article_img_url: expect.any(String)
        });
        })  
    });
    test("PATCH:404 responds with error status and message when article id does not exist", () => {
        return request(app)
          .patch("/api/articles/54321")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) =>
            expect(body.message).toBe("Not Found"),
          );
      });
      test("PATCH:400 responds with error message and status when given invalid article id", () => {
        return request(app)
          .patch("/api/articles/invalid-id")
          .send({ inc_votes: 100 })
          .expect(400)
          .then(({ body }) => expect(body.message).toBe("Bad Request"));
      });
      test("PATCH:400 responds with error status and message when object is missing property", () => {
        return request(app)
          .patch("/api/articles/8")
          .send({})
          .expect(400)
          .then(({ body }) => expect(body.message).toBe("Bad Request"));
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
  test("POST:201 responds with new comment posted for an article", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "butter_bridge",
        body: "test comment",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          article_id: 5,
          comment_id: expect.any(Number),
          author: "butter_bridge",
          body: "test comment",
          votes:0,
          created_at: expect.any(String)
        });
      });
  });
  test("POST:400 responds with error message when article id is invalid", () => {
    return request(app)
      .post("/api/articles/invalid-id/comments")
      .send({
        username: "butter_bridge",
        body: "test comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("POST:400 responds with error status and message when object has a missing property", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        body: "test comment"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  })

 })

 describe("/api/comments/:comment_id", () => {
    test("DELETE:204 deletes a comment by a given id and returns no content", () => {
        return request(app)
            .delete("/api/comments/7")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            })
    });
    test("DELETE:404 returns error status and message when comment does not exist", () => {
        return request(app)
          .delete("/api/comments/54321")
          .expect(404)
          .then(({ body }) =>
            expect(body.message).toBe("Not Found"),
          );
      });
    test("DELETE:400 returns error status and message when comment id is invalid", () => {
        return request(app)
          .delete("/api/comments/invalid-id")
          .expect(400)
          .then(({ body }) => 
            expect(body.message).toBe("Bad Request"));
      });
});

describe("/api/users", () => {
    test("GET:200 responds with an array of users with all corresponding properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((eachUser) => {
            expect(eachUser).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });