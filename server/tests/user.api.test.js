import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("POST /api/user/register", () => {
  it("rejects a request with a missing password (Zod validation)", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({ name: "Test User", email: "test@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects an invalid email format", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "not-an-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
  });

  it("creates a new user with valid input", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/api/user/register").send({
      name: "First",
      email: "dupe@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/user/register").send({
      name: "Second",
      email: "dupe@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/user/login", () => {
  it("logs in successfully with correct credentials", async () => {
    await request(app).post("/api/user/register").send({
      name: "Login Test",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/user/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("rejects a wrong password with 401", async () => {
    await request(app).post("/api/user/register").send({
      name: "Wrong Pass",
      email: "wrongpass@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/user/login").send({
      email: "wrongpass@example.com",
      password: "totally-wrong",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("rejects a nonexistent email with 401", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "doesnotexist@example.com",
      password: "whatever123",
    });

    expect(res.status).toBe(401);
  });
});