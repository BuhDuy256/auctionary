# 📸 IMAGE UPLOAD FLOW - CREATE PRODUCT & TRANSACTION

## 🎯 Tổng quan: Frontend gửi File → Backend nhận → Backend upload lên Supabase

```
┌─────────────┐      FormData       ┌──────────────┐      Upload      ┌────────────┐
│  FRONTEND   │ ─────────────────▶  │   BACKEND    │ ───────────────▶ │  SUPABASE  │
│  Browser    │   (File objects)    │   Express    │   (file.buffer)  │  Storage   │
└─────────────┘                     └──────────────┘                  └────────────┘
     │                                      │                                │
     │ 1. User chọn file                    │                                │
     │ 2. Preview local (Blob URL)          │                                │
     │ 3. Submit form                       │                                │
     │ ────────────────────────────────▶    │                                │
     │    POST /products                    │ 4. Multer parse FormData       │
     │    Content-Type: multipart/form-data │ 5. File vào RAM (buffer)       │
     │                                      │ ────────────────────────────▶  │
     │                                      │    supabase.storage.upload()    │
     │                                      │                                │ 6. Lưu file
     │                                      │ ◀────────────────────────────  │
     │                                      │    Return: publicUrl            │
     │                                      │ 7. Save URL vào PostgreSQL     │
     │ ◀────────────────────────────────    │                                │
     │    Response: { productId, ... }      │                                │
     └──────────────────────────────────────┴────────────────────────────────┘
```

---

## 📦 LUỒNG CHI TIẾT - 7 BƯỚC

### **BƯỚC 1: Frontend - User chọn file**

```
Component: PostAuctionStep1.tsx
Action: User click "Browse" hoặc drag & drop
Result: File objects lưu trong state
```

- ✅ File được lưu trong **RAM của browser**
- ✅ Tạo preview bằng `URL.createObjectURL(file)` → Blob URL
- ❌ CHƯA upload lên server

---

### **BƯỚC 2: Frontend - Submit FormData**

```
File: productService.ts
Code:
  const formData = new FormData();
  formData.append("name", "Product Name");
  formData.append("images", file1);  // File object
  formData.append("images", file2);
  formData.append("images", file3);

API: POST /products
Content-Type: multipart/form-data
```

- ✅ FormData chứa File objects (binary data)
- ✅ Browser tự động set `Content-Type: multipart/form-data`
- ✅ Files được gửi qua HTTP request

---

### **BƯỚC 3: Backend - Route nhận request**

```
File: product.route.ts
Middleware: multer().array("images", 10)

Multer config:
- storage: memoryStorage()  ← File vào RAM, không lưu disk
- limits: 10 files max
```

- ✅ Multer parse multipart/form-data
- ✅ Extract files từ request
- ✅ Lưu file buffer vào `req.files`

---

### **BƯỚC 4: Backend - Controller nhận files**

```
File: product.controller.ts
Code:
  const files = req.files as Express.Multer.File[];
  // files = [
  //   { buffer: Buffer, mimetype: 'image/png', ... },
  //   { buffer: Buffer, mimetype: 'image/jpeg', ... }
  // ]

  await productService.createProduct(data, files);
```

- ✅ Files là array of Multer.File objects
- ✅ Mỗi file có `buffer` (binary data trong RAM)
- ✅ Truyền files xuống Service layer

---

### **BƯỚC 5: Backend - Service upload lên Supabase**

```
File: product.service.ts
Logic:
  1. Tạo folder path: products/{category}/{subcategory}/{slug}_{timestamp}
  2. Đặt tên file: main.png, ex_1.png, ex_2.png, ...
  3. Gọi storageService.uploadFile() cho TỪNG file
  4. Nhận về array of publicUrls
```

**Code flow:**

```typescript
const uploadedUrls = await Promise.all(
  files.map((file, index) => {
    const fileName = index === 0 ? "main.png" : `ex_${index}.png`;
    const fullPath = `products/electronics/cameras/leica-m6_1234567890/main.png`;
    return storageService.uploadFile(
      "auctionary-product-images",
      file,
      fullPath
    );
  })
);
// uploadedUrls = ["https://supabase.co/storage/.../main.png", "https://...ex_1.png"]
```

---

### **BƯỚC 6: Backend - Storage Service gọi Supabase API**

```
File: storage.service.ts
Supabase SDK:
  await supabase.storage
    .from("auctionary-product-images")  // Bucket name
    .upload(fullPath, file.buffer, {    // Upload binary buffer
      contentType: file.mimetype,
      upsert: true
    });

  const { data } = supabase.storage
    .from("auctionary-product-images")
    .getPublicUrl(fullPath);

  return data.publicUrl;  // "https://xyz.supabase.co/storage/v1/object/public/..."
```

- ✅ Upload `file.buffer` (binary data từ RAM)
- ✅ Supabase lưu file vào Cloud Storage
- ✅ Return về public URL để truy cập

---

### **BƯỚC 7: Backend - Lưu URLs vào PostgreSQL**

```
File: product.service.ts → product.repository.ts
Database:
  INSERT INTO products (
    name,
    thumbnail_url,    ← uploadedUrls[0]
    image_urls,       ← [url1, url2, url3] (JSON array)
    category_id,
    seller_id,
    ...
  )
```

- ✅ Lưu public URLs, KHÔNG lưu file binary
- ✅ `thumbnail_url`: URL ảnh đầu tiên
- ✅ `image_urls`: JSON array chứa tất cả URLs

---

## 🔑 CÁC ĐIỂM QUAN TRỌNG

### **1. Frontend KHÔNG upload trực tiếp lên Supabase**

```
❌ Frontend → Supabase (Direct upload)
✅ Frontend → Backend → Supabase (Qua Backend)
```

**Lý do:**

- Backend kiểm soát folder structure
- Backend validate files (size, type, số lượng)
- Backend tạo tên file có tổ chức
- Bảo mật: không expose Supabase keys ở client

---

### **2. Multer dùng Memory Storage**

```typescript
multer({ storage: multer.memoryStorage() });
```

**Tại sao?**

- File vào RAM (buffer), KHÔNG lưu vào disk của server
- Upload ngay lên Supabase → không cần cleanup disk
- Nhanh hơn disk I/O

---

### **3. File Flow trong RAM**

```
Browser RAM → HTTP Request → Express RAM → Multer Buffer → Supabase
```

- File KHÔNG bao giờ chạm disk của server
- Chỉ tồn tại tạm trong RAM cho đến khi upload xong

---

### **4. Folder Structure có tổ chức**

```
Supabase Storage:
  auctionary-product-images/
    └── products/
        └── electronics/
            └── cameras/
                └── leica-m6_1734700800000/
                    ├── main.png        ← Ảnh đầu tiên (thumbnail)
                    ├── ex_1.png        ← Ảnh phụ 1
                    ├── ex_2.png        ← Ảnh phụ 2
                    └── ex_3.png        ← Ảnh phụ 3
```

---

## 🔄 SO SÁNH: CREATE PRODUCT vs TRANSACTION PAYMENT

| Aspect             | Create Product                    | Transaction Payment             |
| ------------------ | --------------------------------- | ------------------------------- |
| **Số lượng file**  | Nhiều (3-10 ảnh)                  | 1 file (payment proof)          |
| **FormData key**   | `"images"` (append nhiều lần)     | `"paymentProof"` (append 1 lần) |
| **Bucket**         | `auctionary-product-images`       | `auctionary-transaction-proofs` |
| **Folder path**    | `products/{cat}/{subcat}/{slug}/` | `transactions/{id}/payment/`    |
| **File name**      | `main.png`, `ex_1.png`, ...       | `proof_{timestamp}.png`         |
| **Database field** | `image_urls` (JSON array)         | `payment_proof_url` (string)    |

---

## 💡 TRANSACTION PAYMENT - Tương tự nhưng đơn giản hơn

### **Frontend:**

```typescript
// TransactionRoomPayment.tsx
const formData = new FormData();
formData.append("paymentProof", file); // ← 1 file duy nhất
formData.append("shippingFullName", "John Doe");
formData.append("shippingAddress", "123 Street");
formData.append("shippingCity", "City");
formData.append("shippingPhoneNumber", "0901234567");

await apiClient.post(`/transactions/${id}/payment`, formData);
```

### **Backend:**

```typescript
// transaction.controller.ts
const file = req.file; // ← Single file (multer.single("paymentProof"))

// transaction.service.ts
const proofUrl = await storageService.uploadFile(
  "auctionary-transaction-proofs",
  file,
  `transactions/${transactionId}/payment/proof_${Date.now()}.png`
);

// Save to DB
await transactionRepository.update(transactionId, {
  payment_proof_url: proofUrl, // ← Lưu 1 URL string
});
```

---

## ✅ TÓM TẮT

1. **Frontend**: File objects → FormData → POST request
2. **Backend Route**: Multer middleware parse files vào RAM
3. **Backend Controller**: Nhận `req.files` hoặc `req.file`
4. **Backend Service**: Loop qua files, upload từng file lên Supabase
5. **Storage Service**: Gọi Supabase SDK với `file.buffer`
6. **Supabase**: Lưu file vào Cloud Storage, trả về public URL
7. **Backend**: Lưu URLs vào PostgreSQL

**Quan trọng:**

- ✅ Frontend GỬI file objects
- ✅ Backend NHẬN và UPLOAD lên Supabase
- ✅ Database chỉ lưu URLs, không lưu binary data
