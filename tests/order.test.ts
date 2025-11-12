import request from "supertest";
import app from "../src/app";

describe("Orders endpoints", () => {
  it("GET /orders should return 401 without auth", async () => {
    const res = await request(app).get("/orders");
    expect(res.status).toBe(401);
  });
});
