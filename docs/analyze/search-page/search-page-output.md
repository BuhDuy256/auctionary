Dưới đây là file `.md` được định dạng chuẩn kỹ thuật (Software Requirement Specification - SRS). Bạn có thể copy nội dung này vào file `README.md` hoặc `SPECS.md` trong dự án của bạn để team cùng theo dõi.

-----

````markdown
# FEATURE SPECIFICATION: SEARCH, FILTER & DISPLAY LOGIC
**Project:** Auctionary (Auction Platform)
**Module:** Browse & Search

---

## 1. CATEGORY FILTER LOGIC (SIDEBAR)
**Mục tiêu:** Cho phép người dùng chọn nhiều danh mục (Multi-select) với cấu trúc cây 2 cấp (Cha - Con), đảm bảo trải nghiệm chọn nhóm nhanh chóng và trực quan.

### 1.1. Trạng thái hiển thị (UI States)
Mỗi **Category Cha** (Parent) có 3 trạng thái dựa trên sự lựa chọn của các **Category Con** (Children):

| Trạng thái | Visual | Điều kiện Logic | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| **Checked** | `[✓]` | **TẤT CẢ** con trực thuộc đều được chọn. | Chọn toàn bộ nhóm. |
| **Unchecked** | `[ ]` | **KHÔNG CÓ** con nào được chọn. | Không chọn nhóm này. |
| **Indeterminate**| `[-]` | **MỘT SỐ** con được chọn (nhưng không hết). | Chọn một phần. |

### 1.2. Luồng tương tác (Interaction Flow)

#### A. Khi User click vào CHA (Parent)
* **Nếu Cha đang Checked `[✓]` hoặc Indeterminate `[-]`**:
    * Action: Bỏ chọn Cha.
    * Effect: **Bỏ chọn tất cả** các Con (Reset về `[ ]`).
* **Nếu Cha đang Unchecked `[ ]`**:
    * Action: Chọn Cha.
    * Effect: **Chọn tất cả** các Con (Set về `[✓]`).

#### B. Khi User click vào CON (Child)
1.  **Toggle:** Đổi trạng thái của Con vừa được click (Checked $\leftrightarrow$ Unchecked).
2.  **Update Parent:** Kiểm tra lại tất cả anh em (siblings) của nó:
    * Tất cả anh em đều `Checked` $\rightarrow$ Set Cha thành **Checked**.
    * Tất cả anh em đều `Unchecked` $\rightarrow$ Set Cha thành **Unchecked**.
    * Có `Checked`, có `Unchecked` $\rightarrow$ Set Cha thành **Indeterminate**.

### 1.3. Ràng buộc dữ liệu (Data Constraints)
* **Filter Logic:** Sử dụng phép **OR (Hợp)** giữa các mục được chọn.
    * *Ví dụ:* Chọn `Laptops` và `Phones`.
    * *Kết quả:* Sản phẩm là Laptop **HOẶC** là Phone.
* **Request Params:** Frontend gửi lên danh sách ID của các node lá (con) được chọn.

---

## 2. DISPLAY & SORTING LOGIC (MAIN CONTENT)
**Mục tiêu:** Tối ưu hóa cho tính chất đấu giá (Urgency) nhưng vẫn làm nổi bật sản phẩm mới (Discovery).

### 2.1. Logic Sắp xếp (Sorting)
* **Mặc định (Default Sort):** Luôn sắp xếp theo **Time Ending Soon** (Thời gian kết thúc tăng dần).
    * *Lý do:* Sản phẩm sắp hết giờ cần hiển thị đầu tiên để thúc đẩy hành vi Bid giá.
    * *Query:* `ORDER BY end_time ASC`
* **User Override:** User có thể chủ động đổi sang Sort theo Giá, Tên, v.v.

### 2.2. Logic "New Arrival" (Hàng mới về)
* **Định nghĩa:** Sản phẩm có `created_at` nằm trong khoảng thời gian $T$ (Ví dụ: `Now - created_at < 24h`).
* **Hiển thị:**
    * **KHÔNG** thay đổi thứ tự sắp xếp (Vẫn nằm dưới các sản phẩm sắp hết giờ).
    * **BẮT BUỘC** có Visual Badge (Nhãn dán) nổi bật (Ví dụ: Tag vàng **"New Arrival"** trên thẻ sản phẩm).

---

## 3. SEARCH LOGIC (FULL-TEXT SEARCH)
**Mục tiêu:** Tìm kiếm chính xác theo từ khóa và hỗ trợ lọc sâu (Faceted Search).

### 3.1. Hành vi tìm kiếm
* **Input:** User nhập từ khóa (Ví dụ: "Sony") và Enter.
* **Category Checkbox:**
    * **KHÔNG** tự động tick vào checkbox.
    * **HIỂN THỊ SỐ LƯỢNG (Count):** Cập nhật số lượng kết quả tìm thấy tương ứng cạnh mỗi Category.
    * *Ví dụ:* `[ ] Electronics (20)`, `[ ] Fashion (0)`.

### 3.2. Query Constraints
Kết quả trả về phải thỏa mãn đồng thời:
1.  **Keyword:** Chứa từ khóa tìm kiếm.
2.  **Active Filters:** Thuộc vào các category đang được tick (nếu có).

> **Formula:** `Result = (Name CONTAINS Keyword) AND (CategoryID IN SelectedList)`

---

## 4. TECHNICAL SUMMARY (FOR DEV)

### Backend Query Strategy (Pseudo-SQL)

**Scenario 1: Default Load (Homepage)**
```sql
SELECT * FROM products
WHERE status = 'active'
  AND end_time > CURRENT_TIMESTAMP
ORDER BY end_time ASC -- Ưu tiên hàng sắp hết giờ
LIMIT 20 OFFSET 0;
````

**Scenario 2: Filtered & Search**
*Input: keyword="macbook", categories=[11, 12] (Laptop, Phone)*

```sql
-- Option 1: Simple ILIKE (Current implementation)
SELECT * FROM products
WHERE 
  status = 'active'
  AND end_time > CURRENT_TIMESTAMP
  AND name ILIKE '%macbook%' -- Simple text search
  AND category_id IN (11, 12) -- Filter Logic
ORDER BY end_time ASC;

-- Option 2: Full-text search using fts column (Recommended for better performance)
SELECT * FROM products
WHERE 
  status = 'active'
  AND end_time > CURRENT_TIMESTAMP
  AND fts @@ to_tsquery('macbook:*') -- PostgreSQL full-text search
  AND category_id IN (11, 12)
ORDER BY end_time ASC;
```

**Scenario 3: Facet Count (Cho Sidebar khi search)**

```sql
SELECT category_id, COUNT(*) as total
FROM products
WHERE status = 'active'
  AND end_time > CURRENT_TIMESTAMP
  AND name ILIKE '%macbook%' -- Chỉ đếm trên tập kết quả tìm kiếm
GROUP BY category_id;
```