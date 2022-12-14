const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection");
const sorted = require("jest-sorted");
const { expect } = require("@jest/globals");

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

describe("GET /api/reviews", () => {
  test("should respond with an array of review objects with the appropriate properties and the correct values for the comment count ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews[0].comment_count).toEqual("0");
        expect(reviews[5].comment_count).toEqual("3");
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
          expect(review).toEqual(
            expect.not.objectContaining({
              review_body: expect.any(String),
            })
          );
        });
      });
  });
  test("should respond with an array sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
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
        expect(body.msg).toEqual("Resource not found");
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
  test("status:200 The array of comments should be sorted in date order with the most recent first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("status:200 Should respond with an empty array if that review has no comments", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(0);
      });
  });
  test('status:400 Should respond with "Invalid input" if passed a review ID that is not a number', () => {
    return request(app)
      .get("/api/reviews/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid input");
      });
  });
  test("status:404 Should respond 'There is no review with that ID number' if passed an ID number not in the database", () => {
    return request(app)
      .get("/api/reviews/9999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Resource not found");
      });
  });
});
