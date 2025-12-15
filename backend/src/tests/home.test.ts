import request from "supertest";
import express from "express";
import homeRouter from "../api/routes/home.route";
import * as homeService from "../services/home.service";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the home service
jest.mock("../services/home.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/home", homeRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

describe("Home Routes - Public Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/home/sections", () => {
    const endpoint = "/api/home/sections";

    it("should return 200 and all home sections with populated data", async () => {
      const mockSections = {
        endingSoon: [
          {
            id: 1,
            name: "Vintage Camera",
            currentPrice: 250,
            imageUrl: "/images/camera.jpg",
            endTime: new Date(Date.now() + 3600000).toISOString(),
            bidCount: 12,
          },
          {
            id: 2,
            name: "Antique Watch",
            currentPrice: 500,
            imageUrl: "/images/watch.jpg",
            endTime: new Date(Date.now() + 7200000).toISOString(),
            bidCount: 8,
          },
        ],
        mostActive: [
          {
            id: 3,
            name: "Gaming Console",
            currentPrice: 400,
            imageUrl: "/images/console.jpg",
            endTime: new Date(Date.now() + 86400000).toISOString(),
            bidCount: 45,
          },
        ],
        highestPrice: [
          {
            id: 4,
            name: "Rare Painting",
            currentPrice: 5000,
            imageUrl: "/images/painting.jpg",
            endTime: new Date(Date.now() + 172800000).toISOString(),
            bidCount: 20,
          },
        ],
      };
      (homeService.getHomeSections as jest.Mock).mockResolvedValue(
        mockSections
      );

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockSections);
      expect(response.body.data.endingSoon).toHaveLength(2);
      expect(response.body.data.mostActive).toHaveLength(1);
      expect(response.body.data.highestPrice).toHaveLength(1);
      expect(homeService.getHomeSections).toHaveBeenCalledTimes(1);
    });

    it("should return 200 with empty arrays when no auctions exist", async () => {
      const mockSections = {
        endingSoon: [],
        mostActive: [],
        highestPrice: [],
      };
      (homeService.getHomeSections as jest.Mock).mockResolvedValue(
        mockSections
      );

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockSections);
      expect(response.body.data.endingSoon).toHaveLength(0);
      expect(response.body.data.mostActive).toHaveLength(0);
      expect(response.body.data.highestPrice).toHaveLength(0);
    });

    it("should work without authentication token", async () => {
      const mockSections = {
        endingSoon: [],
        mostActive: [],
        highestPrice: [],
      };
      (homeService.getHomeSections as jest.Mock).mockResolvedValue(
        mockSections
      );

      // Explicitly test without Authorization header
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockSections);
    });
  });
});
