const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection");

afterAll(() => connection.end());
beforeEach(() => seed(testData));

describe("status:404", () => {
  test("should respond with a status 404 and a message if the path is invalid", () => {
    return request(app)
      .get("/apx")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("The requested path was not found");
      });
  });
});

describe("GET /api/categories", () => {
  test("should respond with an array of category objects with the slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe.only("GET /api/reviews/:review_id", () => {
  test("status:200, should respond with a review object corresponding to the ID requested", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            review_id: 2,
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status:404 Should respond with 'There is no review with that ID number' if passed an ID number not in database", () => {
    return request(app)
      .get("/api/reviews/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("There is no review with that ID number");
      });
  });
  test("status:400 Should respond with 'Invalid input' if passed something that is not a number", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid input");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status:200 Should respond with an array of comments with the appropriate properties ", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        body.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
});
