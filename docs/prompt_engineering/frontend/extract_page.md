# Mô tả

Đây là prompt mẫu để phân tách một file Page lớn thành những component nhỏ hơn.
Ví dụ: **ProductListPage.tsx** có ban đầu là một file khoảng 400-500 dòng code, trong đó có logic để lấy dữ liệu, render UI, và các component con khác.
=> Có thể phân tách thành các component con như:

- ProductListCard.tsx (Card sản phẩm)
- ProductFilters.tsx (Filter sản phẩm ở bên trái)
- ProductGrid.tsx (Table hiển thị các sản phẩm)
- ProductPagination.tsx (Phân trang sản phẩm)
- ActiveFilters.tsx (Những cái tag filter hiển thị ở phía trên table sản phẩm)

## Một số lưu ý

- Các prompt đều ở dưới dạng template, cần điều chỉnh một số vị trí để phù hợp với ngữ cảnh.
- Khuyến khích prompt bằng tiếng anh để có khả năng đạt hiệu quả cao hơn.
- Cần xác định rõ quy mô công việc để prompt cho hợp lí. Nếu như công việc quá lớn thì yêu cầu AI lập ra một file kế hoạch cài đặt, và những prompt sau đó sẽ dựa vào file kế hoạch đó.

# Template Prompt

## Step 1: Component Split Strategy

### Mục đích

Để xác định các component con cần tách ra từ file Page lớn. Không vội code.

### Prompt

```
Role: Senior React Architect & Refactoring Specialist.

Context:
I have a "God Component" (a very large Page file) that violates the **Single Responsibility Principle**.
I want to decompose this file into smaller, manageable sub-components following my **Frontend Development Guide** (specifically Section 12: Split-on-Integration).

Input Code:
[KÉO FILE PAGE LỚN VÀO ĐÂY]

Task:
**DO NOT WRITE CODE YET.**
Analyze the provided code and propose a **Refactoring Strategy**.

Please identify logical sections in the UI that should be extracted into sub-components. For each proposed component, provide:
1.  **Component Name:** (e.g., `ProductFilters`, `ProductGrid`).
2.  **Responsibility:** What does this component do?
3.  **Props Interface:** What data/functions does it need from the parent?
4.  **Destination Path:** Where should this file be created? (e.g., `src/pages/product/components/...`).

**Goal:**
The main parent component should effectively become a **Layout/Container** that mainly handles:
- Fetching data (via Hooks).
- Passing props down.
- Managing layout structure (Grid/Flex).
It should contain very little JSX markup directly.

Waiting for your analysis plan.
```

## Step 2: Execution

### Mục đích

Bắt đầu code theo như kế hoạch đã soạn.

## Prompt

```
Role: Senior React Developer.

Context:
I approve the Refactoring Strategy you just proposed.
Now, let's execute the split.

**Constraint:**
1.  **Copy Logic:** Do not change the UI styling (Tailwind classes). Keep it exactly as the original.
2.  **Strict Separation:** Ensure the sub-components are "Dumb/Presentational" (UI only). They should receive data via Props. Logic stays in the Custom Hook (used by the Parent).
3.  **Imports:** Use correct relative imports.

Task:
Please generate the code for:
1.  [Tên Component Con 1 - ví dụ: ProductFilters.tsx]
2.  [Tên Component Con 2 - ví dụ: ProductPagination.tsx]
3.  ... (Các component con khác)
4.  **The Refactored Parent Component** (Cleaned up, importing the above components).
[ĐOẠN NÀY LIỆT KÊ CÁC FILE TỪ TRONG KẾ HOẠCH NÓ ĐÃ SOẠN Ở PROMPT TRƯỚC]

Waiting for your clean code.
```
