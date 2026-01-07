-- Kiểm tra tổng số products trong DB
SELECT COUNT(*) as total_products FROM products;

-- Kiểm tra có duplicate products không (cùng id xuất hiện nhiều lần)
SELECT id, COUNT(*) as count
FROM products
GROUP BY id
HAVING COUNT(*) > 1;

-- Xem tất cả products với status active/sold/expired
SELECT id, name, status, seller_id, highest_bidder_id, created_at, end_time
FROM products
WHERE status IN ('active', 'sold', 'expired')
ORDER BY id;

-- Test count query giống như trong code
SELECT COUNT(products.id) as total
FROM products
WHERE products.status IN ('active', 'sold', 'expired');

-- Test count DISTINCT
SELECT COUNT(DISTINCT products.id) as total
FROM products
WHERE products.status IN ('active', 'sold', 'expired');

-- Kiểm tra có data rác không
SELECT status, COUNT(*) as count
FROM products
GROUP BY status;
