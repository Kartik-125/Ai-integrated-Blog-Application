import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/blog/all", () => {
  it("returns an empty list with correct pagination shape when there are no blogs yet", async () => {
    const res = await request(app).get("/api/blog/all");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blogs).toEqual([]);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      totalBlogs: 0,
      totalPages: 1,
    });
  });

  it("rejects a non-positive page number", async () => {
    const res = await request(app).get("/api/blog/all?page=-1");

    expect(res.status).toBe(400);
  });

  it("rejects a limit above the cap of 50", async () => {
    const res = await request(app).get("/api/blog/all?limit=999");

    expect(res.status).toBe(400);
  });
});