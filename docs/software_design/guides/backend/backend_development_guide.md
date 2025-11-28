# Backend Development Guide

## Step-by-Step API Development Process

To develop a new API, follow these steps in order:

1.  **Database & Repository (Data Layer)**
    *   Identify relevant tables in the Database.
    *   Write functions in the **Repository** (`src/repositories/`) using Knex.
    *   **Input**: Function parameters (can be an object or separate variables).
    *   **Output**: Return raw data from the DB (in `snake_case`). **DO NOT** map data here.

2.  **Zod Schema & Types (Definition Layer)**
    *   Create or update Schema files in `src/api/schemas/`.
    *   Define Zod Schema for Request Body/Query/Params (in `camelCase`).
    *   Export type from schema: `export type MySchema = z.infer<typeof mySchema>;`.

3.  **Service (Logic Layer)**
    *   Write functions in the **Service** (`src/services/`).
    *   **Input**: Use the type exported from the Schema (e.g., `data: MySchema`).
    *   **Logic**:
        *   Call Repository to fetch data (`snake_case`).
        *   Perform business logic (calculations, validations...).
        *   Map data from `snake_case` (DB) to `camelCase` (Response).
    *   **Output**: Return a clean `camelCase` object to the Controller. The response type interface should be defined in `src/types/`.

4.  **Controller (Interface Layer)**
    *   Write functions in the **Controller** (`src/api/controllers/`).
    *   **Input**: Type cast `req.body`, `req.query` to the Schema's type (e.g., `const body = req.body as MySchema`).
    *   **Logic**: Call Service.
    *   **Output**: Use `formatResponse` to return the result.
    *   **Error**: Wrap in `try/catch` and call `next(error)`.

5.  **Route (Path Registration)**
    *   Register routes in `src/api/routes/`.
    *   Use `validate(schema, 'body' | 'query' | 'params')` middleware.
    *   Assign the Controller to the route.

---

## Detailed Rules

### 1. 3-Layer Architecture (Controller → Service → Repository)

**Controller**: Handles request/response, type casting from request

```typescript
import { CreateProductSchema } from "../schemas/product.schema";

export const yourController = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Type cast data from the validated request
    const body = request.body as CreateProductSchema;
    const result = await yourService.method(body);
    formatResponse(response, 200, result);
  } catch (error) {
    logger.error("ControllerName", "Error message", error);
    next(error);
  }
};
```

**Service**: Business logic, converts camelCase ↔ snake_case

```typescript
export const yourService = async (data: {
  productName: string;
  currentPrice: number;
}): Promise<YourType> => {
  // Mapping camelCase -> snake_case for Repository
  const dbResult = await yourRepository.findById({
    product_name: data.productName,
    current_price: data.currentPrice,
  });

  if (!dbResult) {
    throw new NotFoundError("Resource not found");
  }

  // Mapping snake_case (DB) -> camelCase (Response)
  return {
    id: dbResult.product_id,
    productName: dbResult.product_name,
    currentPrice: dbResult.current_price,
  };
};
```

**Repository**: Queries database, returns raw data (snake_case)

```typescript
import db from "../database/db";

export const findById = async (id: number) => {
  return await db("products").where({ product_id: id }).first();
};
```

### 2. Request Validation

Use Zod schema in `src/api/schemas/` (camelCase) and validate middleware.
The middleware will **overwrite** data in the request with the parsed/validated data.

```typescript
export const yourSchema = z.object({
  productName: z.string().min(1),
  bidAmount: z.number().positive(),
});

export type YourSchema = z.infer<typeof yourSchema>;
```

### 3. Standard Response Format

```typescript
formatResponse(response, 200, data);

formatPaginatedResponse(response, 200, data, pagination);
```

### 4. Error Handling

```typescript
try {
  // logic
} catch (error) {
  logger.error("ControllerName", "Error message", error);
  next(error);
}
```

### 5. Type Safety & Naming Conventions

IMPORTANT: Variable and Interface Naming Rules

-   **camelCase**: Use for all variables, parameters, and interfaces in Controller, Service, Types
-   **snake_case**: ONLY use in the Repository layer (corresponding to the database schema)

Define interfaces in `src/types/` (camelCase):

```typescript
export interface YourType {
  id: number;
  productName: string;
  currentPrice: number;
}
```

### 6. Constants

Extract magic numbers into `src/utils/constant.util.ts`:

```typescript
export const YOUR_CONSTANTS = {
  MAX_VALUE: 100,
  MIN_VALUE: 0,
} as const;
```

### 7. Database Transactions

Wrap multiple DB operations in a transaction with Knex:

```typescript
await db.transaction(async (trx) => {
    await trx("table1").insert({...});
    await trx("table2").update({...});
});
```

### 8. Repository Layer

-   Only export functions, do not export types
-   Use **Knex** query builder
-   Return **snake_case** (raw DB format), DO NOT map data here
-   Use `db` instance from `src/database/db.ts`

```typescript
import db from "../database/db";

export const findById = async (id: number) => {
  return await db("users").where({ id }).first();
};
```

### 9. Logging

Use `logger` instead of `console.log/error`:

```typescript
logger.info("Component", "message");
logger.error("Component", "message", error);
```

### 10. Route Registration

```typescript
router.post("/", validate(yourSchema, "body"), yourController);
router.get("/:id", validate(idParamSchema, "params"), yourController);
```

The `validate(schema, location)` middleware will parse and validate the request, then assign the validated data back to `req[location]`.

### 11. Do Not Use

-   Comments in code
-   Icons/emojis in code
-   `console.log/error` (use logger)
-   Inline response formatting (use formatResponse)
-   Export interfaces from repository
-   Mapping data in Repository

### 12. Error Classes

Use custom errors:

-   `NotFoundError` - Resource not found (404)
-   `ForbiddenError` - Access denied (403)
-   `ValidationError` - Invalid input (400)
-   `UnauthorizedError` - Auth required (401)

```typescript
import { NotFoundError, ForbiddenError } from "../errors";

throw new NotFoundError("Product not found");
throw new ForbiddenError("Access denied");
```

## Example: Complete Flow

```typescript
// 1. Define Type (src/types/product.types.ts) - camelCase
export interface Product {
  id: number;
  productName: string;
  currentPrice: number;
}

// 2. Create Schema (src/api/schemas/product.schema.ts) - camelCase
export const createProductSchema = z.object({
  productName: z.string().min(1),
  currentPrice: z.number().positive(),
});
export type CreateProductSchema = z.infer<typeof createProductSchema>;

// 3. Repository (src/repositories/product.repository.ts) - snake_case
export const create = async (data: {
  product_name: string;
  current_price: number;
}) => {
  const [product] = await db("products")
    .insert({
      product_name: data.product_name,
      current_price: data.current_price,
    })
    .returning("*");
  return product;
};

// 4. Service (src/services/product.service.ts) - camelCase
export const createProduct = async (data: CreateProductSchema): Promise<Product> => {
  // Mapping camelCase -> snake_case
  const dbResult = await productRepository.create({
    product_name: data.productName,
    current_price: data.currentPrice,
  });

  // Mapping snake_case -> camelCase
  return {
    id: dbResult.product_id,
    productName: dbResult.product_name,
    currentPrice: dbResult.current_price,
  };
};

// 5. Controller (src/api/controllers/product.controller.ts) - camelCase
export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Type casting
    const body = request.body as CreateProductSchema;
    const result = await productService.createProduct(body);
    formatResponse(response, 201, result);
  } catch (error) {
    logger.error("ProductController", "Failed to create product", error);
    next(error);
  }
};

// 6. Route (src/api/routes/product.route.ts)
router.post(
  "/",
  validate(createProductSchema, "body"),
  productController.createProduct
);
