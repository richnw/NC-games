const request = require("supertest");
const app = require("../app");
const db = require("../db/data/test-data/index");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());
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
