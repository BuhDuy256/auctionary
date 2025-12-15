import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import watchlistRouter from "../api/routes/watchlist.route";
import * as watchlistService from "../services/watchlist.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the watchlist service
jest.mock("../services/watchlist.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/watchlist", watchlistRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payloads
const authenticatedUser = {
  id: 1,
  userId: 1,
  email: "user@test.com",
  roles: ["bidder"],
  permissions: [],
};

describe("Watchlist Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/watchlist/", () => {
    const endpoint = "/api/watchlist/";

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

    it("should return 200 and watchlist products for authenticated user", async () => {
      const mockWatchlist = {
        products: [
          {
            id: 1,
            name: "Vintage Camera",
            currentPrice: 250,
            imageUrl: "/images/camera.jpg",
            endTime: new Date(Date.now() + 86400000).toISOString(),
            bidCount: 12,
            status: "active",
          },
          {
            id: 2,
            name: "Antique Watch",
            currentPrice: 500,
            imageUrl: "/images/watch.jpg",
            endTime: new Date(Date.now() + 172800000).toISOString(),
            bidCount: 8,
            status: "active",
          },
        ],
      };
      (watchlistService.getWatchlist as jest.Mock).mockResolvedValue(
        mockWatchlist
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockWatchlist);
      expect(response.body.data.products).toHaveLength(2);
      expect(watchlistService.getWatchlist).toHaveBeenCalledWith(1);
    });

    it("should return 200 with empty array when watchlist is empty", async () => {
      const mockWatchlist = {
        products: [],
      };
      (watchlistService.getWatchlist as jest.Mock).mockResolvedValue(
        mockWatchlist
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockWatchlist);
      expect(response.body.data.products).toHaveLength(0);
    });
  });

  describe("POST /api/watchlist/", () => {
    const endpoint = "/api/watchlist/";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).post(endpoint).send({ productId: 1 });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer invalid-token")
        .send({ productId: 1 });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 201 and add product to watchlist", async () => {
      const productId = 5;
      (watchlistService.addProductToWatchlist as jest.Mock).mockResolvedValue(
        productId
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ productId });

      expect(response.status).toBe(201);
      expect(response.body.data).toBe(productId);
      expect(watchlistService.addProductToWatchlist).toHaveBeenCalledWith(
        1,
        productId
      );
    });

    it("should handle adding product with numeric string id", async () => {
      const productId = 10;
      (watchlistService.addProductToWatchlist as jest.Mock).mockResolvedValue(
        productId
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "10" });

      expect(response.status).toBe(201);
      expect(response.body.data).toBe(productId);
    });
  });

  describe("DELETE /api/watchlist/:productId", () => {
    const endpoint = "/api/watchlist";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).delete(`${endpoint}/1`);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .delete(`${endpoint}/1`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 200 and remove product from watchlist", async () => {
      const productId = 3;
      (
        watchlistService.removeProductFromWatchlist as jest.Mock
      ).mockResolvedValue(productId);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .delete(`${endpoint}/${productId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(productId);
      expect(watchlistService.removeProductFromWatchlist).toHaveBeenCalledWith(
        1,
        productId
      );
    });

    it("should handle removing product with numeric string id", async () => {
      const productId = 15;
      (
        watchlistService.removeProductFromWatchlist as jest.Mock
      ).mockResolvedValue(productId);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .delete(`${endpoint}/15`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(productId);
      expect(watchlistService.removeProductFromWatchlist).toHaveBeenCalledWith(
        1,
        15
      );
    });
  });
});
