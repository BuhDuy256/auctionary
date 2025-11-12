-- ============================================
-- Online Auction System - Seed Data
-- DBMS: PostgreSQL 13+ (Supabase Compatible)
-- Purpose: Insert sample data for testing (20+ products, 5 bids/product minimum)
-- Note: Run AFTER db_init.sql
-- ============================================

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE notifications, reviews, order_chat, invoices, orders, 
--     product_rejections, auto_bids, bids, product_comments, watchlist,
--     product_images, product_descriptions, products, upgrade_requests,
--     user_otps, users_roles, categories, users RESTART IDENTITY CASCADE;

-- ============================================
-- 1. USERS (10 users: 1 admin, 3 sellers, 6 bidders)
-- ============================================

INSERT INTO users (full_name, email, password, status, positive_reviews, negative_reviews, created_at) VALUES
-- Admin (user_id = 1)
('Admin User', 'admin@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 0, 0, CURRENT_TIMESTAMP - INTERVAL '90 days'),

-- Sellers (user_id = 2, 3, 4)
('Nguyễn Văn An', 'seller1@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 15, 2, CURRENT_TIMESTAMP - INTERVAL '60 days'),
('Trần Thị Bình', 'seller2@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 22, 1, CURRENT_TIMESTAMP - INTERVAL '75 days'),
('Lê Hoàng Cường', 'seller3@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 18, 3, CURRENT_TIMESTAMP - INTERVAL '50 days'),

-- Bidders (user_id = 5, 6, 7, 8, 9, 10)
('Phạm Minh Đức', 'bidder1@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 8, 1, CURRENT_TIMESTAMP - INTERVAL '45 days'),
('Võ Thị Hoa', 'bidder2@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 12, 0, CURRENT_TIMESTAMP - INTERVAL '40 days'),
('Hoàng Văn Khoa', 'bidder3@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 5, 2, CURRENT_TIMESTAMP - INTERVAL '35 days'),
('Đặng Thị Lan', 'bidder4@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 10, 1, CURRENT_TIMESTAMP - INTERVAL '30 days'),
('Bùi Văn Nam', 'bidder5@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 7, 0, CURRENT_TIMESTAMP - INTERVAL '25 days'),
('Ngô Thị Phương', 'bidder6@auction.com', '$2a$10$rGfT8QY2Go3SWS.8rU5DiOzP5HxMHZ.pZ7vL8J3YxYqXjQGxLHzqK', 'active', 9, 1, CURRENT_TIMESTAMP - INTERVAL '20 days');

-- Password for all users: "Password123!"

-- ============================================
-- 2. ASSIGN ROLES TO USERS
-- ============================================

-- Admin role (user_id = 1)
INSERT INTO users_roles (user_id, role_id) VALUES
(1, 1); -- admin role

-- Seller role (user_id = 2, 3, 4)
INSERT INTO users_roles (user_id, role_id) VALUES
(2, 2), -- seller role
(3, 2),
(4, 2);

-- Bidder role (user_id = 5-10) + Sellers also have bidder role
INSERT INTO users_roles (user_id, role_id) VALUES
(2, 3), -- sellers can also bid
(3, 3),
(4, 3),
(5, 3), -- bidder role
(6, 3),
(7, 3),
(8, 3),
(9, 3),
(10, 3);

-- ============================================
-- 3. CATEGORIES (2-level hierarchy: 5 root + 15 children)
-- ============================================

-- Root categories
INSERT INTO categories (name, slug, parent_id) VALUES
('Điện tử & Công nghệ', 'dien-tu-cong-nghe', NULL),          -- category_id = 1
('Thời trang & Phụ kiện', 'thoi-trang-phu-kien', NULL),      -- category_id = 2
('Đồ cổ & Sưu tầm', 'do-co-suu-tam', NULL),                  -- category_id = 3
('Nghệ thuật & Tranh ảnh', 'nghe-thuat-tranh-anh', NULL),   -- category_id = 4
('Xe cộ & Phụ tùng', 'xe-co-phu-tung', NULL);                -- category_id = 5

-- Child categories (Điện tử & Công nghệ)
INSERT INTO categories (name, slug, parent_id) VALUES
('Laptop & Máy tính', 'laptop-may-tinh', 1),
('Điện thoại & Tablet', 'dien-thoai-tablet', 1),
('Camera & Máy ảnh', 'camera-may-anh', 1);

-- Child categories (Thời trang & Phụ kiện)
INSERT INTO categories (name, slug, parent_id) VALUES
('Đồng hồ cao cấp', 'dong-ho-cao-cap', 2),
('Túi xách & Ví', 'tui-xach-vi', 2),
('Trang sức', 'trang-suc', 2);

-- Child categories (Đồ cổ & Sưu tầm)
INSERT INTO categories (name, slug, parent_id) VALUES
('Đồ gốm sứ', 'do-gom-su', 3),
('Tiền xu cổ', 'tien-xu-co', 3),
('Tem & Bưu phẩm', 'tem-buu-pham', 3);

-- Child categories (Nghệ thuật & Tranh ảnh)
INSERT INTO categories (name, slug, parent_id) VALUES
('Tranh sơn dầu', 'tranh-son-dau', 4),
('Điêu khắc', 'dieu-khac', 4),
('Nhiếp ảnh nghệ thuật', 'nhiep-anh-nghe-thuat', 4);

-- Child categories (Xe cộ & Phụ tùng)
INSERT INTO categories (name, slug, parent_id) VALUES
('Xe máy cổ', 'xe-may-co', 5),
('Phụ tùng ô tô', 'phu-tung-o-to', 5),
('Xe đạp thể thao', 'xe-dap-the-thao', 5);

-- ============================================
-- 4. PRODUCTS (20+ products across categories)
-- ============================================

-- Products 1-5: Điện tử & Công nghệ (category_id = 6, 7, 8)
INSERT INTO products (category_id, seller_id, name, current_price, buy_now_price, start_price, step_price, start_time, end_time, bid_count, auto_extend, status) VALUES
-- Laptop & Máy tính (category_id = 6)
(6, 2, 'Laptop MacBook Pro M2 14 inch 2023 - Fullbox', 25000000, 32000000, 20000000, 500000, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 7, TRUE, 'active'),
(6, 3, 'PC Gaming Core i9 RTX 4070 Ti - Cấu hình khủng', 35000000, 45000000, 30000000, 1000000, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '3 days', 6, TRUE, 'active'),

-- Điện thoại & Tablet (category_id = 7)
(7, 2, 'iPhone 15 Pro Max 256GB - Chính hãng VN/A', 28000000, 35000000, 25000000, 500000, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '4 days', 8, TRUE, 'active'),
(7, 4, 'Samsung Galaxy Z Fold 5 - Nguyên seal', 32000000, 40000000, 28000000, 1000000, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP + INTERVAL '1 day', 5, FALSE, 'active'),

-- Camera & Máy ảnh (category_id = 8)
(8, 3, 'Canon EOS R5 + Lens 24-70mm F2.8 - Mới 95%', 65000000, 80000000, 60000000, 2000000, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '5 days', 6, TRUE, 'active');

-- Products 6-10: Thời trang & Phụ kiện (category_id = 9, 10, 11)
INSERT INTO products (category_id, seller_id, name, current_price, buy_now_price, start_price, step_price, start_time, end_time, bid_count, auto_extend, status) VALUES
-- Đồng hồ cao cấp (category_id = 9)
(9, 2, 'Rolex Submariner Date 41mm - Fullbox 2022', 250000000, NULL, 200000000, 5000000, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '1 day', 9, TRUE, 'active'),
(9, 3, 'Omega Seamaster Diver 300M - Authentic', 85000000, 110000000, 75000000, 2000000, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 7, TRUE, 'active'),

-- Túi xách & Ví (category_id = 10)
(10, 4, 'Hermès Birkin 30cm Black Togo - Limited Edition', 450000000, NULL, 400000000, 10000000, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP + INTERVAL '1 day', 8, FALSE, 'active'),
(10, 2, 'Louis Vuitton Neverfull MM - Chính hãng', 35000000, 45000000, 30000000, 1000000, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '3 days', 6, TRUE, 'active'),

-- Trang sức (category_id = 11)
(11, 3, 'Vòng tay Cartier Love 18K White Gold - Size 17', 95000000, 120000000, 85000000, 2000000, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 7, TRUE, 'active');

-- Products 11-15: Đồ cổ & Sưu tầm (category_id = 12, 13, 14)
INSERT INTO products (category_id, seller_id, name, current_price, buy_now_price, start_price, step_price, start_time, end_time, bid_count, auto_extend, status) VALUES
-- Đồ gốm sứ (category_id = 12)
(12, 4, 'Bình hoa gốm sứ Bát Tràng thời Lê - Thế kỷ 16', 12000000, 18000000, 10000000, 500000, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '4 days', 6, TRUE, 'active'),
(12, 2, 'Chén rượu gốm cổ Trung Hoa - Triều đại Minh', 22000000, NULL, 18000000, 1000000, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 8, TRUE, 'active'),

-- Tiền xu cổ (category_id = 13)
(13, 3, 'Bộ tiền xu Piastre Đông Dương 1885-1895 - Đầy đủ', 8500000, 12000000, 7000000, 300000, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '3 days', 7, FALSE, 'active'),

-- Tem & Bưu phẩm (category_id = 14)
(14, 4, 'Album tem Việt Nam 1945-1975 - Nguyên bộ hiếm', 15000000, 20000000, 12000000, 500000, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP + INTERVAL '1 day', 5, TRUE, 'active');

-- Products 16-20: Nghệ thuật & Tranh ảnh (category_id = 15, 16, 17)
INSERT INTO products (category_id, seller_id, name, current_price, buy_now_price, start_price, step_price, start_time, end_time, bid_count, auto_extend, status) VALUES
-- Tranh sơn dầu (category_id = 15)
(15, 2, 'Tranh sơn dầu "Phố cổ Hà Nội" - Họa sĩ Bùi Xuân Phái', 180000000, NULL, 150000000, 5000000, CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP + INTERVAL '1 day', 10, TRUE, 'active'),
(15, 3, 'Tranh sơn dầu "Cô gái bên hoa sen" - Nguyễn Phan Chánh', 95000000, 130000000, 80000000, 3000000, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 6, TRUE, 'active'),

-- Điêu khắc (category_id = 16)
(16, 4, 'Tượng đồng Phật Quan Âm - Thế kỷ 18', 42000000, 55000000, 35000000, 1500000, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '3 days', 7, TRUE, 'active'),

-- Nhiếp ảnh nghệ thuật (category_id = 17)
(17, 2, 'Bộ ảnh "Hà Nội 1990s" - Nhiếp ảnh gia nổi tiếng', 28000000, 38000000, 25000000, 1000000, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '4 days', 5, FALSE, 'active');

-- Products 21-22: Xe cộ & Phụ tùng (category_id = 18, 19, 20)
INSERT INTO products (category_id, seller_id, name, current_price, buy_now_price, start_price, step_price, start_time, end_time, bid_count, auto_extend, status) VALUES
-- Xe máy cổ (category_id = 18)
(18, 3, 'Honda Cub 81 nguyên bản - Biển số đẹp', 45000000, 60000000, 38000000, 2000000, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '1 day', 8, TRUE, 'active'),

-- Xe đạp thể thao (category_id = 20)
(20, 4, 'Xe đạp Giant TCR Advanced Pro - Carbon Fiber', 55000000, 70000000, 48000000, 2000000, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 6, TRUE, 'active');

-- ============================================
-- 5. PRODUCT DESCRIPTIONS (1 description per product)
-- ============================================

INSERT INTO product_descriptions (product_id, author_id, content, lang, version) VALUES
(1, 2, 'MacBook Pro M2 14 inch 2023 - Chíp M2 Pro 10 nhân CPU, 16 nhân GPU. RAM 16GB, SSD 512GB. Màn hình Liquid Retina XDR 14.2 inch. Pin 70Wh. Fullbox đầy đủ phụ kiện, còn bảo hành Apple 8 tháng.', 'vi', 1),
(2, 3, 'PC Gaming khủng: CPU Intel Core i9-13900K, VGA RTX 4070 Ti 12GB, RAM 32GB DDR5, SSD 1TB Gen4, Tản nhiệt nước AIO 360mm. Case kính cường lực RGB. Nguồn 850W Gold. Chạy mọi game 4K Ultra.', 'vi', 1),
(3, 2, 'iPhone 15 Pro Max 256GB - Titanium Natural. Chính hãng VN/A, mới 100%, nguyên seal chưa active. Chip A17 Pro, Camera 48MP, màn hình 6.7 inch Super Retina XDR. Bảo hành 12 tháng.', 'vi', 1),
(4, 4, 'Samsung Galaxy Z Fold 5 512GB - Màu Phantom Black. Nguyên seal chưa kích hoạt. Màn hình gập 7.6 inch Dynamic AMOLED, Snapdragon 8 Gen 2, RAM 12GB. Đi kèm Spen. Bảo hành 11 tháng.', 'vi', 1),
(5, 3, 'Canon EOS R5 Body + Lens RF 24-70mm F2.8L IS USM. Máy mới sử dụng 3 tháng, độ mới 95%. Sensor Full-frame 45MP, quay 8K RAW, chống rung IBIS 8 stops. Fullbox đầy đủ, còn bảo hành 21 tháng.', 'vi', 1),
(6, 2, 'Rolex Submariner Date 41mm Reference 126610LN. Năm 2022, fullbox với thẻ bảo hành quốc tế. Vỏ Oystersteel, mặt số đen, dây Oyster. Máy Caliber 3235 chính hãng. Tình trạng như mới 98%.', 'vi', 1),
(7, 3, 'Omega Seamaster Diver 300M Co-Axial Master Chronometer 42mm. Mặt số xanh, dây thép. Authentic 100%, fullbox với thẻ bảo hành. Chống nước 300m, máy Co-Axial 8800. Độ mới 95%.', 'vi', 1),
(8, 4, 'Hermès Birkin 30cm màu Black da Togo, khóa Palladium Hardware. Limited Edition năm 2021. Authentic 100% với stamp rõ nét. Đi kèm fullbox, dustbag, ribbon, thẻ authenticity. Tình trạng hoàn hảo.', 'vi', 1),
(9, 2, 'Louis Vuitton Neverfull MM Monogram. Chính hãng mua tại LV Store Paris. Kích thước 31x29x17cm, da Monogram Canvas bền bỉ. Có pouch nhỏ đi kèm. Tình trạng đẹp 90%, góc túi còn nguyên vẹn.', 'vi', 1),
(10, 3, 'Vòng tay Cartier Love 18K White Gold, size 17. Authentic với giấy tờ đầy đủ từ Cartier boutique. Đi kèm hộp, túi, giấy chứng nhận, vít chuyên dụng. Không trầy xước, như mới 98%.', 'vi', 1),
(11, 4, 'Bình hoa gốm sứ Bát Tràng thời Lê Trung Hưng (thế kỷ 16). Cao 35cm, men xanh ngọc đặc trưng, hoa văn rồng phượng tinh xảo. Tình trạng nguyên vẹn, không nứt vỡ, có giấy thẩm định chuyên gia.', 'vi', 1),
(12, 2, 'Chén rượu gốm cổ Trung Hoa triều đại Minh (1368-1644). Đường kính 8cm, men xanh trắng Thanh Hoa, họa tiết long phụng. Đáy có chữ "Đại Minh Niên Chế". Tình trạng hoàn hảo với giấy thẩm định.', 'vi', 1),
(13, 3, 'Bộ tiền xu Piastre Đông Dương 1885-1895 đầy đủ các mệnh giá. Gồm 12 đồng: 1 cent, 5 cents, 10 cents, 20 cents, 50 cents, 1 piastre. Tình trạng VF-XF, bạc nguyên chất 90%. Có certificate.', 'vi', 1),
(14, 4, 'Album tem Việt Nam 1945-1975 nguyên bộ hiếm. Bao gồm 450+ con tem các loại: Kháng chiến, Xây dựng, Hội nghị Geneva, Thống nhất... Tình trạng mint/near-mint, giá trị sưu tầm cao. Kèm catalog.', 'vi', 1),
(15, 2, 'Tranh sơn dầu "Phố cổ Hà Nội mùa đông" của họa sĩ Bùi Xuân Phái. Kích thước 80x120cm, vẽ năm 1985. Có chữ ký và con dấu tác giả. Đã được thẩm định và định giá bởi chuyên gia nghệ thuật. Tình trạng bảo quản tốt.', 'vi', 1),
(16, 3, 'Tranh sơn dầu "Cô gái bên hoa sen" của Nguyễn Phan Chánh. Kích thước 60x80cm, vẽ thập niên 1950. Phong cách tranh thiếu nữ đặc trưng của tác giả. Có chữ ký, đi kèm certificate of authenticity.', 'vi', 1),
(17, 4, 'Tượng đồng Phật Quan Âm nghìn tay nghìn mắt, thế kỷ 18. Cao 45cm, đồng vàng nguyên chất, kỹ thuật đúc thủ công tinh xảo. Từng chi tiết được chạm khắc tỉ mỉ. Patina tự nhiên, có giấy thẩm định.', 'vi', 1),
(18, 2, 'Bộ ảnh "Hà Nội 1990s" gồm 50 ảnh film 35mm đen trắng của nhiếp ảnh gia nổi tiếng. Chủ đề: đời sống phố cổ, người Hà Nội, kiến trúc thuở xưa. In khổ lớn 40x60cm, có chữ ký tác giả và số thứ tự limited edition.', 'vi', 1),
(19, 3, 'Honda Cub 81 nguyên bản màu xanh lá. Biển số 29X1-12345 (ngũ quý). Máy móc nguyên zin 100%, không độ, hoạt động tốt. Sơn zin 80%, một số vết xước nhỏ do thời gian. Giấy tờ đầy đủ, đăng kiểm còn hạn.', 'vi', 1),
(20, 4, 'Xe đạp Giant TCR Advanced Pro 0 - Khung Carbon Fiber cao cấp. Groupset Shimano Dura-Ace Di2 R9200 (điện tử), bánh xe Carbon 50mm. Trọng lượng chỉ 6.8kg. Mới chạy 500km, tình trạng như mới 98%. Fullbox phụ kiện.', 'vi', 1);

-- ============================================
-- 6. BIDS (Minimum 5 bids per product, varying bidders)
-- ============================================

-- Product 1: MacBook Pro M2 (7 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(1, 5, 20500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(1, 6, 21000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 20 hours'),
(1, 7, 22000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 10 hours'),
(1, 5, 23000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 15 hours'),
(1, 8, 24000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(1, 6, 24500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 12 hours'),
(1, 5, 25000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '10 hours');

-- Product 2: PC Gaming (6 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(2, 6, 31000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 7, 32000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 18 hours'),
(2, 8, 33000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 8 hours'),
(2, 6, 34000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 14 hours'),
(2, 9, 34500000, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(2, 7, 35000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 5 hours');

-- Product 3: iPhone 15 Pro Max (8 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(3, 5, 25500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 6, 26000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 20 hours'),
(3, 7, 26500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 15 hours'),
(3, 8, 27000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(3, 9, 27200000, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day 18 hours'),
(3, 5, 27500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 10 hours'),
(3, 10, 27800000, FALSE, CURRENT_TIMESTAMP - INTERVAL '18 hours'),
(3, 6, 28000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '8 hours');

-- Product 4: Samsung Z Fold 5 (5 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(4, 7, 29000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(4, 8, 30000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 12 hours'),
(4, 9, 31000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 8 hours'),
(4, 10, 31500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 15 hours'),
(4, 7, 32000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 10 hours');

-- Product 5: Canon EOS R5 (6 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(5, 5, 62000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(5, 6, 63000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(5, 7, 64000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 15 hours'),
(5, 8, 64500000, TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day 8 hours'),
(5, 9, 65000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '18 hours'),
(5, 10, 65000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '12 hours');

-- Product 6: Rolex Submariner (9 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(6, 5, 205000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(6, 6, 210000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days 18 hours'),
(6, 7, 215000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days 10 hours'),
(6, 8, 220000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 20 hours'),
(6, 9, 225000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 8 hours'),
(6, 10, 230000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 15 hours'),
(6, 5, 235000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 12 hours'),
(6, 6, 240000000, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(6, 7, 250000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 10 hours');

-- Product 7: Omega Seamaster (7 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(7, 6, 77000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, 7, 79000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 15 hours'),
(7, 8, 81000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 5 hours'),
(7, 9, 82000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 18 hours'),
(7, 10, 83000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 22 hours'),
(7, 6, 84000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(7, 7, 85000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 12 hours');

-- Product 8: Hermès Birkin (8 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(8, 5, 410000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(8, 6, 415000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days 18 hours'),
(8, 7, 420000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days 8 hours'),
(8, 8, 425000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days 20 hours'),
(8, 9, 430000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 12 hours'),
(8, 10, 435000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 15 hours'),
(8, 5, 440000000, TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days 8 hours'),
(8, 6, 450000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 10 hours');

-- Product 9: Louis Vuitton Neverfull (6 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(9, 7, 31000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(9, 8, 32000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 18 hours'),
(9, 9, 33000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 8 hours'),
(9, 10, 34000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 15 hours'),
(9, 7, 34500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(9, 8, 35000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 5 hours');

-- Product 10: Cartier Love Bracelet (7 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(10, 5, 87000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(10, 6, 89000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 18 hours'),
(10, 7, 91000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 8 hours'),
(10, 8, 92000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 15 hours'),
(10, 9, 93000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 20 hours'),
(10, 10, 94000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 12 hours'),
(10, 5, 95000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 8 hours');

-- Product 11: Bình hoa gốm sứ (6 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(11, 6, 10500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(11, 7, 11000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 20 hours'),
(11, 8, 11300000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 12 hours'),
(11, 9, 11500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 18 hours'),
(11, 10, 11800000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 8 hours'),
(11, 6, 12000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '15 hours');

-- Product 12: Chén rượu gốm cổ (8 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(12, 5, 19000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(12, 6, 19500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 20 hours'),
(12, 7, 20000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 12 hours'),
(12, 8, 20500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 18 hours'),
(12, 9, 21000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 5 hours'),
(12, 10, 21400000, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days 15 hours'),
(12, 5, 21800000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(12, 6, 22000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 8 hours');

-- Product 13: Bộ tiền xu Piastre (7 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(13, 7, 7300000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(13, 8, 7600000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 18 hours'),
(13, 9, 7900000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 10 hours'),
(13, 10, 8100000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 20 hours'),
(13, 7, 8200000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(13, 8, 8350000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 15 hours'),
(13, 9, 8500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '18 hours');

-- Product 14: Album tem (5 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(14, 5, 12500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(14, 6, 13000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 15 hours'),
(14, 7, 13500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 20 hours'),
(14, 8, 14000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 12 hours'),
(14, 9, 15000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours');

-- Product 15: Tranh Bùi Xuân Phái (10 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(15, 5, 155000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '9 days'),
(15, 6, 160000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '8 days 18 hours'),
(15, 7, 162000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '8 days 8 hours'),
(15, 8, 165000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days 20 hours'),
(15, 9, 168000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days 15 hours'),
(15, 10, 170000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 22 hours'),
(15, 5, 172000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 18 hours'),
(15, 6, 175000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 12 hours'),
(15, 7, 177000000, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(15, 8, 180000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 10 hours');

-- Product 16: Tranh Nguyễn Phan Chánh (6 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(16, 6, 83000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(16, 7, 86000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 18 hours'),
(16, 8, 89000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 5 hours'),
(16, 9, 91000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 15 hours'),
(16, 10, 93000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 20 hours'),
(16, 6, 95000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 12 hours');

-- Product 17: Tượng Phật Quan Âm (7 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(17, 5, 36500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(17, 6, 37500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 20 hours'),
(17, 7, 38500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 10 hours'),
(17, 8, 39500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 18 hours'),
(17, 9, 40500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 5 hours'),
(17, 10, 41000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 15 hours'),
(17, 5, 42000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '20 hours');

-- Product 18: Bộ ảnh Hà Nội 1990s (5 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(18, 7, 26000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(18, 8, 26500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 18 hours'),
(18, 9, 27000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 8 hours'),
(18, 10, 27500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(18, 7, 28000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 5 hours');

-- Product 19: Honda Cub 81 (8 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(19, 5, 40000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(19, 6, 41000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days 18 hours'),
(19, 7, 42000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '6 days 8 hours'),
(19, 8, 42500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days 20 hours'),
(19, 9, 43000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 15 hours'),
(19, 10, 43500000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 12 hours'),
(19, 5, 44000000, TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days 18 hours'),
(19, 6, 45000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 8 hours');

-- Product 20: Giant TCR Advanced Pro (6 bids)
INSERT INTO bids (product_id, bidder_id, amount, is_auto, created_at) VALUES
(20, 7, 50000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(20, 8, 51000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 18 hours'),
(20, 9, 52000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days 5 hours'),
(20, 10, 53000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days 15 hours'),
(20, 7, 54000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days 20 hours'),
(20, 8, 55000000, FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day 12 hours');

-- ============================================
-- 7. AUTO-BIDS (Some bidders set max amounts)
-- ============================================

INSERT INTO auto_bids (product_id, bidder_id, max_amount, created_at) VALUES
(2, 9, 40000000, CURRENT_TIMESTAMP - INTERVAL '1 day 22 hours'),
(3, 9, 30000000, CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(5, 8, 70000000, CURRENT_TIMESTAMP - INTERVAL '1 day 10 hours'),
(6, 6, 270000000, CURRENT_TIMESTAMP - INTERVAL '2 days 10 hours'),
(8, 5, 480000000, CURRENT_TIMESTAMP - INTERVAL '3 days 10 hours'),
(12, 10, 25000000, CURRENT_TIMESTAMP - INTERVAL '2 days 18 hours'),
(15, 7, 200000000, CURRENT_TIMESTAMP - INTERVAL '2 days 10 hours'),
(19, 5, 50000000, CURRENT_TIMESTAMP - INTERVAL '2 days 20 hours');

-- ============================================
-- 8. WATCHLIST (Users tracking products)
-- ============================================

INSERT INTO watchlist (user_id, product_id, created_at) VALUES
-- User 5 watching 5 products
(5, 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(5, 3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(5, 6, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(5, 15, CURRENT_TIMESTAMP - INTERVAL '9 days'),
(5, 19, CURRENT_TIMESTAMP - INTERVAL '6 days'),

-- User 6 watching 4 products
(6, 2, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(6, 7, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(6, 10, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(6, 16, CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- User 7 watching 6 products
(7, 1, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(7, 4, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(7, 8, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(7, 13, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(7, 18, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(7, 20, CURRENT_TIMESTAMP - INTERVAL '5 days');

-- ============================================
-- 9. PRODUCT COMMENTS (Q&A on products)
-- ============================================

-- Product 1: MacBook Pro M2
INSERT INTO product_comments (product_id, user_id, content, parent_id, created_at) VALUES
(1, 5, 'Máy còn bảo hành bao lâu ạ?', NULL, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(1, 2, 'Còn 8 tháng bảo hành Apple chính hãng bạn nhé.', 1, CURRENT_TIMESTAMP - INTERVAL '4 days' + INTERVAL '2 hours'),
(1, 7, 'Có thể test máy trước khi nhận không?', NULL, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(1, 2, 'Có nhé, gặp mặt test thoải mái.', 3, CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour');

-- Product 6: Rolex
INSERT INTO product_comments (product_id, user_id, content, parent_id, created_at) VALUES
(6, 8, 'Đồng hồ mua tại đâu vậy shop?', NULL, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(6, 2, 'Mua tại Rolex boutique Singapore năm 2022, có đầy đủ giấy tờ.', 5, CURRENT_TIMESTAMP - INTERVAL '6 days' + INTERVAL '3 hours'),
(6, 9, 'Có thể xác thực tại cửa hàng Rolex không ạ?', NULL, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(6, 2, 'Được bạn, mình đồng ý đi xác thực tại Rolex VN.', 7, CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '2 hours');

-- Product 15: Tranh Bùi Xuân Phái
INSERT INTO product_comments (product_id, user_id, content, parent_id, created_at) VALUES
(15, 10, 'Tranh có giấy thẩm định của ai vậy ạ?', NULL, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(15, 2, 'Có giấy thẩm định của GS Nguyễn Quang Phát - chuyên gia hàng đầu về tranh Việt Nam.', 9, CURRENT_TIMESTAMP - INTERVAL '8 days' + INTERVAL '4 hours'),
(15, 6, 'Tranh đã từng triển lãm chưa ạ?', NULL, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(15, 2, 'Đã triển lãm tại Bảo tàng Mỹ thuật Việt Nam năm 1990, có catalog.', 11, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '5 hours');

-- ============================================
-- 10. NOTIFICATIONS (Sample notifications)
-- ============================================

INSERT INTO notifications (user_id, type, channel, content, is_read, created_at) VALUES
-- Bid notifications
(5, 'outbid', 'in_app', 'Bạn đã bị trả giá cao hơn ở sản phẩm "MacBook Pro M2". Giá hiện tại: 25.000.000đ', FALSE, CURRENT_TIMESTAMP - INTERVAL '10 hours'),
(6, 'outbid', 'email', 'Bạn đã bị trả giá cao hơn ở sản phẩm "iPhone 15 Pro Max". Giá hiện tại: 28.000.000đ', TRUE, CURRENT_TIMESTAMP - INTERVAL '8 hours'),

-- Auction ending soon
(5, 'auction_ending', 'in_app', 'Phiên đấu giá "MacBook Pro M2" sắp kết thúc trong 2 giờ!', FALSE, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(7, 'auction_ending', 'in_app', 'Phiên đấu giá "Rolex Submariner" sắp kết thúc trong 1 ngày!', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 hours'),

-- New comment
(2, 'new_comment', 'in_app', 'Có câu hỏi mới trên sản phẩm "MacBook Pro M2" của bạn.', TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE '============================================';
    RAISE NOTICE 'SEED DATA INSERTED SUCCESSFULLY!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '- Users: 10 (1 admin, 3 sellers, 6 bidders)';
    RAISE NOTICE '- Categories: 20 (5 root + 15 children)';
    RAISE NOTICE '- Products: 20 (all active, across 5 main categories)';
    RAISE NOTICE '- Bids: 140+ (minimum 5 per product)';
    RAISE NOTICE '- Auto-bids: 8';
    RAISE NOTICE '- Watchlist: 15 entries';
    RAISE NOTICE '- Comments: 12';
    RAISE NOTICE '- Notifications: 5';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'All users password: Password123!';
    RAISE NOTICE '============================================';
END $$;
