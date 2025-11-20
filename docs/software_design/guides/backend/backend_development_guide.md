# Backend Development Guide

## Quy tắc khi thêm API mới

### 1. Kiến trúc 3 lớp (Controller → Service → Repository)

**Controller**: Xử lý request/response

```typescript
export const yourController = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await yourService.method(request.body);
    formatResponse(response, 200, result);
  } catch (error) {
    logger.error("ControllerName", "Error message", error);
    next(error);
  }
};
```

**Service**: Business logic, chuyển đổi camelCase ↔ snake_case

```typescript
export const yourService = async (data: {
  productName: string;
  currentPrice: number;
}): Promise<YourType> => {
  const dbResult = await yourRepository.findById({
    product_name: data.productName,
    current_price: data.currentPrice,
  });

  if (!dbResult) {
    throw new NotFoundError("Resource not found");
  }

  return {
    id: dbResult.product_id,
    productName: dbResult.product_name,
    currentPrice: dbResult.current_price,
  };
};
```

**Repository**: Truy vấn database

```typescript
const mapToResponse = (data: any) => {
  if (!data) return null;
  return {
    product_id: data.product_id,
    product_name: data.product_name,
    current_price: toNum(data.current_price),
  };
};

export const findById = async (id: number) => {
  const result = await prisma.products.findUnique({
    where: { product_id: id },
  });
  return mapToResponse(result);
};
```

### 2. Request Validation

Sử dụng Zod schema trong `src/api/schemas/` (camelCase) và validate middleware:

```typescript
export const yourSchema = z.object({
  productName: z.string().min(1),
  bidAmount: z.number().positive(),
});
```

Validation được xử lý bởi middleware `validate()`, không cần parse trong controller.

### 3. Response Format chuẩn

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

**⚠️ QUAN TRỌNG: Quy tắc đặt tên biến và interface**

- **camelCase**: Sử dụng cho tất cả biến, parameters, và interfaces trong Controller, Service, Types
- **snake_case**: CHỈ sử dụng trong Repository layer (tương ứng với database schema)

Định nghĩa interfaces trong `src/types/` (camelCase):

```typescript
export interface YourType {
  id: number;
  productName: string;
  currentPrice: number;
}
```

Repository trả về snake_case, Service chuyển sang camelCase:

```typescript
// Repository (snake_case)
const dbResult = await prisma.products.findUnique({
  where: { product_id: id },
});

return dbResult
  ? {
      product_id: dbResult.product_id,
      product_name: dbResult.product_name,
      current_price: toNum(dbResult.current_price),
    }
  : null;

// Service (chuyển sang camelCase)
const data = await productRepository.findById(id);
return {
  id: data.product_id,
  productName: data.product_name,
  currentPrice: data.current_price,
};
```

Thêm explicit return types cho tất cả functions:

```typescript
export const yourService = async (id: number): Promise<YourType> => {
  // ...
};
```

### 6. Constants

Extract magic numbers vào `src/utils/constant.util.ts`:

```typescript
export const YOUR_CONSTANTS = {
  MAX_VALUE: 100,
  MIN_VALUE: 0,
} as const;
```

### 7. Database Transactions

Wrap multiple DB operations trong transaction:

```typescript
await prisma.$transaction(async (tx) => {
    await tx.table1.create({...});
    await tx.table2.update({...});
});
```

### 8. Repository Layer

- Chỉ export functions, không export types
- Sử dụng Prisma client
- Convert Decimal sang number với `toNum()`
- **Sử dụng snake_case** cho tất cả biến (tương ứng database schema)
- Có thể tạo helper function `mapToResponse()` để transform data

```typescript
const mapUserToResponse = (user: any) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    is_verified: user.is_verified,
  };
};

export const findById = async (id: number) => {
  const result = await prisma.users.findUnique({
    where: { id },
  });
  return mapUserToResponse(result);
};
```

### 9. Logging

Sử dụng `logger` thay vì `console.log/error`:

```typescript
logger.info("Component", "message");
logger.error("Component", "message", error);
```

### 10. Route Registration

```typescript
router.post("/", validate(yourSchema, "body"), yourController);
router.get("/:id", validate(idParamSchema, "params"), yourController);
```

Middleware `validate(schema, location)` sẽ parse và validate request trước khi đến controller.

### 11. Không sử dụng

- ❌ Comments trong code
- ❌ Icons/emojis trong code
- ❌ `console.log/error` (dùng logger)
- ❌ Inline response formatting (dùng formatResponse)
- ❌ Export interfaces từ repository

### 12. Error Classes

Sử dụng custom errors:

- `NotFoundError` - Resource not found (404)
- `ForbiddenError` - Access denied (403)
- `ValidationError` - Invalid input (400)
- `UnauthorizedError` - Auth required (401)

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

// 3. Repository (src/repositories/product.repository.ts) - snake_case
interface DbProduct {
  product_id: number;
  product_name: string;
  current_price: Decimal;
}

export const create = async (data: {
  product_name: string;
  current_price: number;
}): Promise<DbProduct> => {
  return await prisma.products.create({
    data: {
      product_name: data.product_name,
      current_price: data.current_price,
    },
  });
};

// 4. Service (src/services/product.service.ts) - camelCase
export const createProduct = async (data: {
  productName: string;
  currentPrice: number;
}): Promise<Product> => {
  const dbResult = await productRepository.create({
    product_name: data.productName,
    current_price: data.currentPrice,
  });

  return {
    id: dbResult.product_id,
    productName: dbResult.product_name,
    currentPrice: toNum(dbResult.current_price),
  };
};

// 5. Controller (src/api/controllers/product.controller.ts) - camelCase
export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.createProduct(request.body);
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
```
