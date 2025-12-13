import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import productRouter from "../api/routes/product.route";
import * as productService from "../services/product.service";
import * as bidService from "../services/bid.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the product service
jest.mock("../services/product.service");
// Mock the bid service
jest.mock("../services/bid.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/products", productRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payloads
const bidderUser = {
  id: 1,
  userId: 1,
  email: "bidder@test.com",
  roles: ["bidder"],
  permissions: ["auctions.bid"],
};

const sellerUser = {
  id: 2,
  userId: 2,
  email: "seller@test.com",
  roles: ["seller"],
  permissions: ["products.create", "products.update"],
};

const unauthorizedUser = {
  id: 3,
  userId: 3,
  email: "limited@test.com",
  roles: ["bidder"],
  permissions: [],
};

describe("Product Routes - Public Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    const endpoint = "/api/products";

    it("should return 200 and products with default pagination", async () => {
      const mockProducts = {
        products: [
          {
            productId: 1,
            name: "Laptop",
            description: "Gaming laptop",
            startingPrice: 1000,
            currentPrice: 1200,
            endTime: new Date(Date.now() + 86400000).toISOString(),
            status: "active",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };
      (productService.searchProducts as jest.Mock).mockResolvedValue(
        mockProducts
      );

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockProducts);
      expect(productService.searchProducts).toHaveBeenCalledTimes(1);
    });

    it("should return 200 and apply search query", async () => {
      const mockProducts = {
        products: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
      (productService.searchProducts as jest.Mock).mockResolvedValue(
        mockProducts
      );

      const response = await request(app).get(`${endpoint}?q=laptop`);

      expect(response.status).toBe(200);
      expect(productService.searchProducts).toHaveBeenCalled();
    });

    it("should return 200 and apply category filter", async () => {
      const mockProducts = {
        products: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
      (productService.searchProducts as jest.Mock).mockResolvedValue(
        mockProducts
      );

      const response = await request(app).get(
        `${endpoint}?categories=electronics`
      );

      expect(response.status).toBe(200);
      expect(productService.searchProducts).toHaveBeenCalled();
    });

    it("should return 400 when page is not a positive integer", async () => {
      const response = await request(app).get(`${endpoint}?page=-1`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when limit exceeds maximum (100)", async () => {
      const response = await request(app).get(`${endpoint}?limit=101`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });
  });

  describe("GET /api/products/:id", () => {
    const endpoint = "/api/products";

    it("should return 200 and product details for valid id", async () => {
      const mockProduct = {
        productId: 1,
        name: "Laptop",
        description: "Gaming laptop",
        startingPrice: 1000,
        currentPrice: 1200,
        buyNowPrice: 1500,
        endTime: new Date(Date.now() + 86400000).toISOString(),
        status: "active",
        seller: {
          id: 2,
          fullName: "John Seller",
          email: "seller@test.com",
        },
      };
      (productService.getProductDetail as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const response = await request(app).get(`${endpoint}/1`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockProduct);
      expect(productService.getProductDetail).toHaveBeenCalledWith(
        1,
        undefined
      );
    });
  });

  describe("GET /api/products/:id/bids", () => {
    const endpoint = "/api/products";

    it("should return 200 and bid history for valid product id", async () => {
      const mockBids = [
        {
          bidId: 1,
          amount: 1200,
          bidder: {
            id: 1,
            fullName: "John Bidder",
          },
          createdAt: new Date().toISOString(),
        },
      ];
      (productService.getProductBidHistory as jest.Mock).mockResolvedValue(
        mockBids
      );

      const response = await request(app).get(`${endpoint}/1/bids`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockBids);
      expect(productService.getProductBidHistory).toHaveBeenCalledWith(
        1,
        1,
        20
      );
    });
  });

  describe("GET /api/products/:id/questions", () => {
    const endpoint = "/api/products";

    it("should return 200 and product questions for valid id", async () => {
      const mockQuestions = [
        {
          questionId: 1,
          content: "What is the warranty?",
          askedBy: {
            id: 1,
            fullName: "John Doe",
          },
          createdAt: new Date().toISOString(),
        },
      ];
      (productService.getProductQuestions as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      const response = await request(app).get(`${endpoint}/1/questions`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockQuestions);
      expect(productService.getProductQuestions).toHaveBeenCalledWith(1, 1, 10);
    });
  });
});

describe("Product Routes - Authenticated Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/products", () => {
    const endpoint = "/api/products";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ name: "Test Product" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer invalid-token")
        .send({ name: "Test Product" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    // Note: Multipart form data testing requires special setup with multer
    // This is a simplified version
    it("should return 201 and create product for authenticated seller", async () => {
      const mockProduct = {
        productId: 1,
        name: "New Product",
        description: "Test description",
        startingPrice: 100,
      };
      (productService.createProduct as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .field("name", "New Product")
        .field("categoryId", "1")
        .field("startingPrice", "100")
        .field("description", "Test description");

      expect(response.status).toBe(201);
    });
  });

  describe("POST /api/products/:id/bid", () => {
    const endpoint = "/api/products";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(`${endpoint}/1/bid`)
        .send({ maxBid: 1500 });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks auctions.bid permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .post(`${endpoint}/1/bid`)
        .set("Authorization", `Bearer ${token}`)
        .send({ maxBid: 1500 });

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when amount is missing", async () => {
      const token = generateToken(bidderUser);
      const response = await request(app)
        .post(`${endpoint}/1/bid`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when amount is not a positive number", async () => {
      const token = generateToken(bidderUser);
      const response = await request(app)
        .post(`${endpoint}/1/bid`)
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and place bid successfully", async () => {
      const mockResponse = {
        status: "winning",
        bidId: 1,
        amount: 1500,
      };
      (bidService.placeBid as jest.Mock).mockResolvedValue(mockResponse);

      const token = generateToken(bidderUser);
      const response = await request(app)
        .post(`${endpoint}/1/bid`)
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 1500 });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(bidService.placeBid).toHaveBeenCalledWith(1, 1, 1500);
    });
  });

  describe("POST /api/products/:id/descriptions", () => {
    const endpoint = "/api/products";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(`${endpoint}/1/descriptions`)
        .send({ content: "New description", lang: "en" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks products.update permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .post(`${endpoint}/1/descriptions`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "New description", lang: "en" });

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when content is missing", async () => {
      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/descriptions`)
        .set("Authorization", `Bearer ${token}`)
        .send({ lang: "en" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and append description successfully", async () => {
      (productService.appendProductDescription as jest.Mock).mockResolvedValue(
        null
      );

      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/descriptions`)
        .set("Authorization", `Bearer ${token}`)
        .send({ sellerId: 2, content: "New description" });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(productService.appendProductDescription).toHaveBeenCalledWith(1, {
        sellerId: 2,
        content: "New description",
      });
    });
  });

  describe("POST /api/products/:id/questions", () => {
    const endpoint = "/api/products";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(`${endpoint}/1/questions`)
        .send({ content: "What is the warranty?" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks products.update permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .post(`${endpoint}/1/questions`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "What is the warranty?" });

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it(" should return 400 when content is missing", async () => {
      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/questions`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionerId: 1 });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and append question successfully", async () => {
      (productService.appendProductQuestion as jest.Mock).mockResolvedValue(
        null
      );

      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/questions`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionerId: 1, content: "What is the warranty?" });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(productService.appendProductQuestion).toHaveBeenCalledWith(1, {
        questionerId: 1,
        content: "What is the warranty?",
      });
    });
  });

  describe("POST /api/products/:id/answers", () => {
    const endpoint = "/api/products";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(`${endpoint}/1/answers`)
        .send({ questionId: 1, content: "1 year warranty" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user lacks products.update permission", async () => {
      const token = generateToken(unauthorizedUser);
      const response = await request(app)
        .post(`${endpoint}/1/answers`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: 1, content: "1 year warranty" });

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when questionId is missing", async () => {
      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/answers`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "1 year warranty" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when content is missing", async () => {
      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/answers`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: 1, answererId: 2 });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and append answer successfully", async () => {
      (productService.appendProductAnswer as jest.Mock).mockResolvedValue(null);

      const token = generateToken(sellerUser);
      const response = await request(app)
        .post(`${endpoint}/1/answers`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: 1, answererId: 2, content: "1 year warranty" });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(productService.appendProductAnswer).toHaveBeenCalledWith(1, {
        questionId: 1,
        answererId: 2,
        content: "1 year warranty",
      });
    });
  });
});
