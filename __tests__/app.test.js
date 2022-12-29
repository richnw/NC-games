const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection");
const sorted = require("jest-sorted");

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
  test("status:404 Should respond with 'Resource not found' if passed an ID number not in database", () => {
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
        const { comments } = body;
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
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
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status:200 Should respond with an empty array if that review has no comments", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
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
  test("status:404 Should respond 'Resource not found' if passed an ID number not in the database", () => {
    return request(app)
      .get("/api/reviews/9999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Resource not found");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("status:201 should return the comment", () => {
    const newComment = {
      username: "dav3rid",
      body: "terrible",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            body: "terrible",
            review_id: 1,
            author: "dav3rid",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test('status:400 Should return "missing required fields" if the request body of the comment is malformed or is missing required fields', () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Missing required fields");
      });
  });
  test('status:404 Should return "Resource not found" if the username is not in the database', () => {
    const newComment = {
      username: "notUser",
      body: "terrible",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Resource not found");
      });
  });
  test('status:404 Should return "Resource not found" if there is no review with that ID', () => {
    const newComment = {
      username: "dav3rid",
      body: "terrible",
    };
    return request(app)
      .post("/api/reviews/99999999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Resource not found");
      });
  });
  test("Status:400 Should return 'Invalid input' if passed something that is not a number for a review ID", () => {
    const newComment = {
      username: "dav3rid",
      body: "terrible",
    };
    return request(app)
      .post("/api/reviews/notNumber/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid input");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("should return an object with increased number of votes when asked to increase votes by 1", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: 2,
          })
        );
      });
  });
  test("should return an object with a decreased number of votes when passed a negative number", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -1 })
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
            votes: 4,
          })
        );
      });
  });
  test("Status: 404 should return 'Resource not found' if given a review_id that is not in the database", () => {
    return request(app)
      .patch("/api/reviews/99999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
  test('Status: 400 Should return "Invalid input" if it is passed a review ID that is not a number', () => {
    return request(app)
      .patch("/api/reviews/notNumber")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid input");
      });
  });
  test('Status: 400 Should return "Invalid input" if it is passed something that is not a number in incVotes', () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "notNumber" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid input");
      });
  });
  test('Status: 400 Should return "Missing required fields" if it is passed something that is not incVotes with a number', () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ incorrect: 6 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Missing required fields");
      });
  });
});
describe("GET /api/users", () => {
  test("Status: 200 Should return an array of user objects with the correct prooperties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/reviews (queries)", () => {
  test("should return reviews of the category specified in the query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              category: "dexterity",
            })
          );
        });
      });
  });
  test("should sort the reviews by any valid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("designer", { descending: true });
      });
  });
  test("should default to sorting by date if no column is given ", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should also allow an order query which can be ascending or descending", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
});
