import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import categoryRouter from "../api/routes/category.route";
import * as categoryService from "../services/category.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the category service
jest.mock("../services/category.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/categories", categoryRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payloads
const adminUser = {
  userId: 1,
  email: "admin@test.com",
  roles: ["admin"],
  permissions: [
    "categories.read",
    "categories.create",
    "categories.update",
    "categories.delete",
  ],
};

const authorizedUser = {
  userId: 2,
  email: "user@test.com",
  roles: ["user"],
  permissions: [
    "categories.read",
    "categories.create",
    "categories.update",
    "categories.delete",
  ],
};

const unauthorizedUser = {
  userId: 3,
  email: "limited@test.com",
  roles: ["user"],
  permissions: [], // No category permissions
};

describe("Category Routes - Public Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    const endpoint = "/api/categories";

    it("should return 200 and all categories without authentication", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Electronics",
          slug: "electronics",
          parentId: null,
          depth: 0,
        },
        {
          id: 2,
          name: "Laptops",
          slug: "laptops",
          parentId: 1,
          depth: 1,
        },
        {
          id: 3,
          name: "Fashion",
          slug: "fashion",
          parentId: null,
          depth: 0,
        },
      ];
      (categoryService.getAllCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategories);
      expect(categoryService.getAllCategories).toHaveBeenCalledTimes(1);
    });

    it("should return 200 with empty array when no categories exist", async () => {
      (categoryService.getAllCategories as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.data).toHaveLength(0);
    });

    it("should return hierarchical category structure", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Electronics",
          slug: "electronics",
          parentId: null,
          depth: 0,
        },
        {
          id: 2,
          name: "Computers",
          slug: "computers",
          parentId: 1,
          depth: 1,
        },
        {
          id: 3,
          name: "Gaming Laptops",
          slug: "gaming-laptops",
          parentId: 2,
          depth: 2,
        },
      ];
      (categoryService.getAllCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].depth).toBe(0);
      expect(response.body.data[1].depth).toBe(1);
      expect(response.body.data[2].depth).toBe(2);
    });

    it("should work without authentication token", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Electronics",
          slug: "electronics",
          parentId: null,
          depth: 0,
        },
      ];
      (categoryService.getAllCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      // Explicitly test without Authorization header
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategories);
    });
  });
});

describe("Category Routes - Admin Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/categories/admin", () => {
    const endpoint = "/api/categories/admin";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 403 when user lacks categories.read permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 200 and all categories for admin user", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Electronics",
          parentId: null,
          depth: 0,
          productCount: 10,
        },
        { id: 2, name: "Laptops", parentId: 1, depth: 1, productCount: 5 },
      ];
      (categoryService.getAllCategoriesForAdmin as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategories);
      expect(categoryService.getAllCategoriesForAdmin).toHaveBeenCalledTimes(1);
    });

    it("should return 200 and all categories for user with categories.read permission", async () => {
      const mockCategories = [
        {
          id: 1,
          name: "Electronics",
          parentId: null,
          depth: 0,
          productCount: 10,
        },
      ];
      (categoryService.getAllCategoriesForAdmin as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const token = generateToken(authorizedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategories);
    });
  });

  describe("GET /api/categories/admin/:id", () => {
    const endpoint = "/api/categories/admin";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get(`${endpoint}/1`);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks categories.read permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .get(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when id is not a valid number", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .get(`${endpoint}/invalid`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when id is not a positive integer", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .get(`${endpoint}/-1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and category data for valid id", async () => {
      const mockCategory = {
        id: 1,
        name: "Electronics",
        parentId: null,
        depth: 0,
        productCount: 10,
      };
      (categoryService.getCategoryById as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .get(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategory);
      expect(categoryService.getCategoryById).toHaveBeenCalledWith(1);
    });
  });

  describe("POST /api/categories/admin", () => {
    const endpoint = "/api/categories/admin";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ name: "New Category" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks categories.create permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Category" });

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when name is missing", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when name is empty string", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when name exceeds 100 characters", async () => {
      const token = generateToken(adminUser);
      const longName = "a".repeat(101);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: longName });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when parentId is not a positive integer", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Category", parentId: -1 });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 201 and create category with valid data (no parent)", async () => {
      const mockCategory = {
        id: 1,
        name: "Electronics",
        parentId: null,
        depth: 0,
        slug: "electronics",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (categoryService.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Electronics" });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockCategory);
      expect(categoryService.createCategory).toHaveBeenCalledWith({
        name: "Electronics",
      });
    });

    it("should return 201 and create category with valid data (with parent)", async () => {
      const mockCategory = {
        id: 2,
        name: "Laptops",
        parentId: 1,
        depth: 1,
        slug: "laptops",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (categoryService.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Laptops", parentId: 1 });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockCategory);
      expect(categoryService.createCategory).toHaveBeenCalledWith({
        name: "Laptops",
        parentId: 1,
      });
    });

    it("should trim whitespace from category name", async () => {
      const mockCategory = {
        id: 1,
        name: "Electronics",
        parentId: null,
        depth: 0,
        slug: "electronics",
      };
      (categoryService.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "  Electronics  " });

      expect(response.status).toBe(201);
      expect(categoryService.createCategory).toHaveBeenCalledWith({
        name: "Electronics",
      });
    });
  });

  describe("PATCH /api/categories/admin/:id", () => {
    const endpoint = "/api/categories/admin";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .send({ name: "Updated Category" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks categories.update permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Category" });

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when id is not a valid number", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/invalid`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Category" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when name is empty string", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when name exceeds 100 characters", async () => {
      const token = generateToken(adminUser);
      const longName = "a".repeat(101);
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: longName });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when parentId is not a positive integer", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({ parentId: -1 });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and update category name only", async () => {
      const mockUpdatedCategory = {
        id: 1,
        name: "Updated Electronics",
        parentId: null,
        depth: 0,
        slug: "updated-electronics",
        updatedAt: new Date().toISOString(),
      };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(
        mockUpdatedCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Electronics" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedCategory);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(1, {
        name: "Updated Electronics",
      });
    });

    it("should return 200 and update category parentId only", async () => {
      const mockUpdatedCategory = {
        id: 2,
        name: "Laptops",
        parentId: 5,
        depth: 1,
        slug: "laptops",
        updatedAt: new Date().toISOString(),
      };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(
        mockUpdatedCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/2`)
        .set("Authorization", `Bearer ${token}`)
        .send({ parentId: 5 });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedCategory);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(2, {
        parentId: 5,
      });
    });

    it("should return 200 and update both name and parentId", async () => {
      const mockUpdatedCategory = {
        id: 2,
        name: "Gaming Laptops",
        parentId: 3,
        depth: 2,
        slug: "gaming-laptops",
        updatedAt: new Date().toISOString(),
      };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(
        mockUpdatedCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/2`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Gaming Laptops", parentId: 3 });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedCategory);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(2, {
        name: "Gaming Laptops",
        parentId: 3,
      });
    });

    it("should return 200 and set parentId to null", async () => {
      const mockUpdatedCategory = {
        id: 2,
        name: "Laptops",
        parentId: null,
        depth: 0,
        slug: "laptops",
        updatedAt: new Date().toISOString(),
      };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(
        mockUpdatedCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/2`)
        .set("Authorization", `Bearer ${token}`)
        .send({ parentId: null });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedCategory);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(2, {
        parentId: null,
      });
    });

    it("should trim whitespace from updated category name", async () => {
      const mockUpdatedCategory = {
        id: 1,
        name: "Updated Electronics",
        parentId: null,
        depth: 0,
        slug: "updated-electronics",
      };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(
        mockUpdatedCategory
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "  Updated Electronics  " });

      expect(response.status).toBe(200);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(1, {
        name: "Updated Electronics",
      });
    });
  });

  describe("DELETE /api/categories/admin/:id", () => {
    const endpoint = "/api/categories/admin";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).delete(`${endpoint}/1`);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks categories.delete permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .delete(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when id is not a valid number", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .delete(`${endpoint}/invalid`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when id is not a positive integer", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .delete(`${endpoint}/-1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and delete category for valid id", async () => {
      (categoryService.deleteCategory as jest.Mock).mockResolvedValue(
        undefined
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .delete(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
    });

    it("should allow admin user to delete category", async () => {
      (categoryService.deleteCategory as jest.Mock).mockResolvedValue(
        undefined
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .delete(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(categoryService.deleteCategory).toHaveBeenCalledTimes(1);
    });

    it("should allow authorized user to delete category", async () => {
      (categoryService.deleteCategory as jest.Mock).mockResolvedValue(
        undefined
      );

      const token = generateToken(authorizedUser);
      const response = await request(app)
        .delete(`${endpoint}/1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(categoryService.deleteCategory).toHaveBeenCalledTimes(1);
    });
  });
});
