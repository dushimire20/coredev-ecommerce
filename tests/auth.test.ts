import request from "supertest";
import app from "../src/app";  // we'll export app for testing

describe("Auth Endpoints", () => {
  it("should reject weak password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "joe", email: "joe@example.com", password: "123" });
    expect(res.status).toBe(400);
  });
});
