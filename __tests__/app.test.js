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
        expect(categories).toBeInstanceOf(Array);
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
        expect(reviews).toBeInstanceOf(Array);
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
        });
      });
  });
});

// a reviews array of review objects, each of which should have the following properties:

// owner
// title
// review_id
// category
// review_img_url
// created_at
// votes
// designer
// comment_count which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this.
// the reviews should be sorted by date in descending order.
