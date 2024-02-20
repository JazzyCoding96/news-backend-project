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
        expect(response.body.article.article_id).toBe(3);
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("icellusedkars");
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
        
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("should return a 404 if endpoint doesn't exist", () => {
    return request(app).get("/api/arcwtles").expect(404);
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with an array of comments", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
      });
  });
  test('should respond with a 200 if an article exists but there are no comments. Returns an empty array.', () => {
    return request(app).get("/api/articles/2/comments").expect(200).then((response) => {
        expect(response.body.comments.length).toBe(0) 
    })
  });
  test('should respond with a 400 if article_id is not a valid data type', () => {
    return request(app).get("/api/articles/notValidDataType/comments").expect(400).then((response) => {
        expect(response.body.msg).toBe("Invalid article");
    })
  });
  test("should respond with a 400 and a custom error message if article id requested does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with successfully inserted comment on a specified article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "test example body",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toHaveProperty("comment_id");
        expect(response.body.comment).toHaveProperty(
          "author",
          newComment.username
        );
        expect(response.body.comment).toHaveProperty("body", newComment.body);
      });
  });
  test("should respond with a 400 if either username or body are empty values", () => {
    const newComment = {
      username: "icellusedkars",
      body: "",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Username and body are required fields");
      });
  });
  test("should respond with a 400 if username does not exist", () => {
    const newComment = {
      username: "invalidUsername",
      body: "comment to add",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Username 'invalidUsername' does not exist"
        );
      });
  });
});

/*POST /api/articles/:article_id/comments
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.
*/

