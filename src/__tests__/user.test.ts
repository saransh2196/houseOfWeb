import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import User from "../models/user";
import "mocha";

describe("User API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || "");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /api/users", () => {
    it("should return an empty array when there are no users", async () => {
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return an array of users", async () => {
      const user1 = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      });
      const user2 = new User({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password",
      });
      await user1.save();
      await user2.save();

      const res = await request(app).get("/api/users");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body).toContainEqual(
        expect.objectContaining({ name: "John Doe", email: "john@example.com" })
      );
      expect(res.body).toContainEqual(
        expect.objectContaining({
          name: "Jane Smith",
          email: "jane@example.com",
        })
      );
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      };
      const res = await request(app).post("/api/users").send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toMatchObject(userData);
    });

    it("should return 400 if email is already in use", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      };
      await new User(userData).save();
      const res = await request(app).post("/api/users").send(userData);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user by id", async () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      });
      await user.save();
      const res = await request(app).get(`/api/users/${user._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should return 404 if user is not found", async () => {
      const res = await request(app).get("/api/users/invalidid");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user by id", async () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      });
      await user.save();
      const updatedData = {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "newpassword",
      };
      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(updatedData);
    });

    it("should return 404 if user is not found", async () => {
      const updatedData = {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "newpassword",
      };
      const res = await request(app)
        .put("/api/users/invalidid")
        .send(updatedData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user by id", async () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      });
      await user.save();
      const res = await request(app).delete(`/api/users/${user._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted successfully");
    });

    it("should return 404 if user is not found", async () => {
      const res = await request(app).delete("/api/users/invalidid");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });
});
