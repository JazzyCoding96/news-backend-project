const request = require('supertest');
const app = require("./app");
const seed = require("./db/seeds/seed");
const db = require("./db/connection");
const testData = require("./db/data/test-data/index");
const fs = require('fs/promises');
const { log } = require('console');

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
        expect(response.body.articles.length).toBe(13);
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
        expect(response.body.comment).toHaveProperty("votes")
        expect(response.body.comment).toHaveProperty("created_at")
        
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
describe("PATCH /api/articles/:article_id", () => {
  test("should increment votes on specific article by requested number", () => {
    const patchRequest = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(patchRequest)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle[0].votes).toBe(101);
        expect(response.body.updatedArticle[0]).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("should return a 400 psql error if incorrect data type inputted into the inc_votes property", () => {
    const patchRequest = { inc_votes: "invalid data" };

    return request(app)
      .patch("/api/articles/1")
      .send(patchRequest)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should return a custom error message if votes is valid data type but article does not exist", () => {
    const patchRequest = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/9999")
      .send(patchRequest)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("should return a 400 if article_id is invalid data type", () => {
    const patchRequest = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/invalid_data")
      .send(patchRequest)
      .expect(400)
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("should respond with a status code 204 if comment successfully deleted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should respond with a status code 404 if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment does not exist");
      });
  });
  test("should respond with a status code 400 if comment_id is an invalid data type", () => {
    return request(app)
      .delete("/api/comments/invalidData")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("GET/api/users", () => {
  test("should respond with an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        expect(response.body.users[0]).toHaveProperty("username");
        expect(response.body.users[0]).toHaveProperty("name");
        expect(response.body.users[0]).toHaveProperty("avatar_url");
      });
  });
  test("should respond with an error 404 if endpoint does not exist", () => {
    return request(app).get("/api/useeeers").expect(404);
  });
});
describe("GET /api/articles (topic query)", () => {
  test("should filter articles by topic value ", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {

        response.body.filteredArticles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("should respond with all articles if query is omitted ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
      });
  });
  test('should return a 404 if query is invalid ', () => {
    return request(app)
      .get("/api/articles?invalid342=mitch")
      .expect(404).then((response) => {
        expect(response.body.msg).toBe("Invalid query");
      })
  });
  test('should return a 400 if query is valid but query value does not exist', () => {
    return request(app)
      .get("/api/articles?topic=notHere")
      .expect(400).then((response) => {
        expect(response.body.msg).toBe("Not found");
      })
  });
});
/*#
You should not have to amend any previous tests.

Remember to add a description of this endpoint to your /api endpoint.*/

