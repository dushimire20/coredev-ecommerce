import request from "supertest";
import app from "../src/app";

describe("Products endpoints", () => {
  it("GET /products should return list", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
