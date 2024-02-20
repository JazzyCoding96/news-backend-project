const request = require('supertest');
const app = require("./app");
const seed = require("./db/seeds/seed");
const db = require("./db/connection");
const testData = require("./db/data/test-data/index");
const fs = require('fs/promises')

beforeEach(() => {
  return seed(testData);
}); // runs this before each test

afterAll(() => db.end());
// ends the connection

describe("GET /api/topics", () => {
  test("responds with a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("responds with an array of correct topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual([
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" },
        ]);
      });
  });
  test("should return a 404 error if incorrect request made to api", () => {
    return request(app).get("/api/notAtopic").expect(404);
  });
});
describe("GET /api", () => {
  test("should respond with an object describing all available endpoints", () => {
    return fs.readFile("endpoints.json", "utf8").then((endpointsData) => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(JSON.parse(endpointsData));
        });
    });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should return an object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("should return correct values on object corresponding to requested article by id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        expect(response.body.article_id).toBe(3);
        expect(response.body.topic).toBe("mitch");
        expect(response.body.author).toBe("icellusedkars");
      });
  });
  test("should return a custom error message if article does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});
describe("GET /api/articles", () => {
  test("should respond with an array of all article objects that include column comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        console.log(response.body[0]);
        response.body.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });
  test("should return a 404 if endpoint doesn't exist", () => {
    return request(app).get("/api/arcwtles").expect(404)
  });
});



