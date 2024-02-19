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

