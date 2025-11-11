### `users` # rbac
(`user_id`, `full_name`, `email`, `password`, `positive_reviews`, `negative_reviews`, `status`, `password_updated_at`, `failed_login_attempts`, `last_login_at`, `created_at`)

* **Data Type:** `user_id` (INT), `full_name` (VARCHAR), `email` (VARCHAR), `password` (VARCHAR - Hash), `positive_reviews` (INT), `negative_reviews` (INT), `status` (ENUM('pending_verification', 'active', 'pending_upgrade', 'suspended')), `password_updated_at` (TIMESTAMP), `failed_login_attempts` (INT), `last_login_at` (TIMESTAMP), `created_at` (TIMESTAMP)
* **PK:** `user_id`
* **FK:** (None)
* **Constraint:**
    * `full_name`: NOT NULL
    * `email`: NOT NULL, UNIQUE
    * `password`: NOT NULL
    * `positive_reviews`: NOT NULL, DEFAULT 0
    * `negative_reviews`: NOT NULL, DEFAULT 0
    * `status`: NOT NULL, DEFAULT 'pending_verification'
    * `password_updated_at`: Nullable
    * `failed_login_attempts`: NOT NULL, DEFAULT 0
    * `last_login_at`: Nullable
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP

---

### `roles` # rbac
(`role_id`, `name`)

* **Data Type:** `role_id` (INT), `name` (VARCHAR)
* **PK:** `role_id`
* **FK:** (Không có)
* **Constraint:** `name` (NOT NULL, UNIQUE)

---

### `permissions` # rbac
(`permission_id`, `name`)

* **Data Type:** `permission_id` (INT), `name` (VARCHAR)
* **PK:** `permission_id`
* **FK:** (Không có)
* **Constraint:** `name` (NOT NULL, UNIQUE)

---

### `users_roles` # rbac
(`user_id`, `role_id`)

* **Data Type:** `user_id` (INT), `role_id` (INT)
* **PK:** `PRIMARY KEY (user_id, role_id)` (PK kép)
* **FK:**
    * `user_id` $\rightarrow$ `users(user_id)`
    * `role_id` $\rightarrow$ `roles(role_id)`
* **Constraint:** (Không có)

---

### `roles_permissions` # rbac
(`role_id`, `permission_id`)

* **Data Type:** `role_id` (INT), `permission_id` (INT)
* **PK:** `PRIMARY KEY (role_id, permission_id)` (PK kép)
* **FK:**
    * `role_id` $\rightarrow$ `roles(role_id)`
    * `permission_id` $\rightarrow$ `permissions(permission_id)`
* **Constraint:** (Không có)

---

### `categories`
(`category_id`, `name`, `slug`, `parent_id`)

* **Data Type:** `category_id` (INT), `name` (VARCHAR), `parent_id` (INT), `slug` (VARCHAR)
* **PK:** `category_id`
* **FK:** `parent_id` → `category(category_id)`
* **Constraint in DB:**
    * `name`: NOT NULL
    * `parent_id`: Nullable
    * `slug`: Nullable
    * `CHECK ("left" < "right")`
    * UNIQUE(parent_id, slug) => a category with different parent can have the same slug
* **Constraint in Application:**
    * A child category must have a parent with parent_id = null
* **Trigger:**
    * auto_generate_slug() when inserting and updating
* **Notes:**
    * What is a slug? Read document: https://itnext.io/whats-a-slug-f7e74b6c23e0

---

### `products`
(`product_id`, `category_id`, `seller_id`, `highest_bidder_id`, `name`, `current_price`, `buy_now_price`, `start_price`, `step_price`, `start_time`, `end_time`, `bid_count`, `auto_extend`, `status`)

* **Data Type:** `product_id` (INT), `category_id` (INT), `seller_id` (INT), `highest_bidder_id` (INT), `name` (VARCHAR), thumbnail_url (STRING) `current_price` (DECIMAL), `buy_now_price` (DECIMAL), `start_price` (DECIMAL), `step_price` (DECIMAL), `start_time` (TIMESTAMP), `end_time` (TIMESTAMP), bid_count (INT), `auto_extend` (BOOLEAN), `status` (ENUM('active', 'sold', 'expired', 'removed'))
* **PK:** `product_id`
* **FK:**
    * `category_id` → `category(category_id)`
    * `seller_id` → `users(user_id)`
    * `highest_bidder_id` → `users(user_id)`
* **Constraint:**
    * `highest_bidder_id`: Nullable
    * `name`: NOT NULL
    * `current_price`: NOT NULL
    * `buy_now_price`: Nullable
    * `start_price`: NOT NULL
    * `step_price`: NOT NULL
    * `start_time`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
    * `end_time`: NOT NULL
    * `bid_count`: DEFAULT VALUE = 0
    * `auto_extend`: NOT NULL, DEFAULT false
    * `status`: NOT NULL, DEFAULT 'active'
    * `CHECK (end_time > start_time)`
    * `CHECK (step_price > 0)`
    * `CHECK (start_price > 0)`
    * `CHECK (current_price >= start_price)`
    * `CHECK (buy_now_price IS NULL OR buy_now_price >= start_price)`

---

### `auto_bids`
(`auto_bid_id`, `product_id`, `bidder_id`, `max_amount`, `created_at`)

* **Data Type:** `auto_bid_id` (INT), `product_id` (INT), `bidder_id` (INT), `max_amount` (DECIMAL), `created_at` (TIMESTAMP)
* **PK:** `auto_bid_id`
* **FK:**
    * `product_id` → `products(product_id)`
    * `bidder_id` → `users(user_id)`
* **Constraint:**
    * `max_amount`: NOT NULL
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
    * `UNIQUE (product_id, bidder_id)`
* **Index:**
    * INDEX (product_id, created_at ASC) - tie-breaker for equal max amounts (earlier bid wins)
* **Trigger**:
    * When a valid entity was added to the auto_bids table, the bids_count in table products will increase 1 (Trigger: auto_increase_bid_cnt)

---

### `bids`
(`bid_id`, `product_id`, `bidder_id`, `amount`, `is_auto`, `created_at`)

* **Data Type:** `bid_id` (INT), `product_id` (INT), `bidder_id` (INT), `amount` (DECIMAL), `is_auto` (BOOLEAN), `created_at` (TIMESTAMP)
* **PK:** `bid_id`
* **FK:**
    * `product_id` → `products(product_id)`
    * `bidder_id` → `users(user_id)`
* **Constraint:**
    * `amount`: NOT NULL, CHECK (amount > 0)
    * `is_auto`: NOT NULL, DEFAULT false
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
* **Index:**
    * INDEX (product_id, created_at DESC) - helps fast query bid history by product
    * INDEX (bidder_id) - supports query bid history by bidder

---

### `product_descriptions`
(`description_id`, `product_id`, `author_id`, `content`, `lang`, `created_at`)

* **Data Type:** `description_id` (INT), `product_id` (INT), `author_id` (INT), `content` (TEXT), `lang` (VARCHAR), `created_at` (TIMESTAMP)
* **PK:** `description_id`
* **FK:**
    * `product_id` → `products(product_id)`
    * `author_id` → `users(user_id)`
* **Constraint:**
    * `content`: NOT NULL
    * `author_id`: NOT NULL
    * `lang`: NOT NULL, DEFAULT 'en'
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP

---

### `product_images`
(`image_id`, `product_id`, `image_url`)

* **Data Type:** `image_id` (INT), `product_id` (INT), `image_url` (VARCHAR)
* **PK:** `image_id`
* **FK:** `product_id` $\rightarrow$ `products(product_id)`
* **Constraint:** `image_url` (NOT NULL)

---

### `watchlist`
(`user_id`, `product_id`)

* **Data Type:** `user_id` (INT), `product_id` (INT)
* **PK:** `PRIMARY KEY (user_id, product_id)` (Composite PK)
* **FK:**
    * `user_id` → `users(user_id)`
    * `product_id` → `products(product_id)`
* **Constraint:** (None)

---

### `product_rejections`
(`rejection_id`, `product_id`, `bidder_id`, `reason`, `created_at`)

* **Data Type:** `rejection_id` (INT), `product_id` (INT), `bidder_id` (INT), `reason` (TEXT), `created_at` (TIMESTAMP)
* **PK:** `rejection_id`
* **FK:**
    * `product_id` → `products(product_id)`
    * `bidder_id` → `users(user_id)`
* **Constraint:**
    * `reason`: Nullable
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
    * `UNIQUE (product_id, bidder_id)`

---

### `questions` # Chat 1 - 1
(`question_id`, `product_id`, `asker_id`, `question_text`, `answer_text`, `asked_at`, `answered_at`)

* **Data Type:** `question_id` (INT), `product_id` (INT), `asker_id` (INT), `question_text` (TEXT), `answer_text` (TEXT), `asked_at` (TIMESTAMP), `answered_at` (TIMESTAMP)
* **PK:** `question_id`
* **FK:**
    * `product_id` → `products(product_id)`
    * `asker_id` → `users(user_id)`
* **Constraint:**
    * `question_text`: NOT NULL
    * `answer_text`: Nullable
    * `asked_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
    * `answered_at`: Nullable

---

### `orders`
(`order_id`, `product_id`, `winner_id`, `seller_id`, `final_price`, `status`, `cancellation_reason`, `created_at`)

* **Data Type:** `order_id` (INT), `product_id` (INT), `winner_id` (INT), `seller_id` (INT), `final_price` (DECIMAL), `status` (ENUM('pending', 'contract_provided', 'payment_confirmed', 'shipped', 'completed', 'cancelled')), `cancellation_reason` (TEXT), `created_at` (TIMESTAMP)
* **PK:** `order_id`
* **FK:**
    * `product_id` → `products(product_id)`
    * `winner_id` → `users(user_id)`
    * `seller_id` → `users(user_id)`
* **Constraint:**
    * `product_id`: UNIQUE
    * `final_price`: NOT NULL
    * `status`: NOT NULL, DEFAULT 'pending'
    * `cancellation_reason`: Nullable
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP 

---

### `invoices`
(invoice_id, order_id, shipping_address, payment_proof_url, shipping_tracking_code, created_at)

* **Data Type:**
    * `invoice_id` (INT, PK)
    * `order_id` (INT, FK -> orders, UNIQUE)
    * `shipping_address` (TEXT, Nullable)     
    * `payment_proof_url` (VARCHAR, Nullable) 
    * `shipping_tracking_code` (VARCHAR, Nullable) 
    * `created_at` (TIMESTAMP)
    * `updated_at` (TIMESTAMP)
* **PK:** `invoice_id`
* **FK:** `order_id` → `orders(order_id)`
* **Constraint:**
    * order_id: UNIQUE (Rất quan trọng, để đảm bảo mối quan hệ 1-1 với bảng orders).
    * shipping_address: Nullable (Cho phép NULL).
    * payment_proof_url: Nullable (Cho phép NULL).
    * shipping_tracking_code: Nullable (Cho phép NULL).
    * created_at: NOT NULL, DEFAULT CURRENT_TIMESTAMP

---

### `reviews`
(`review_id`, `order_id`, `reviewer_id`, `reviewered_id`, `rating`, `content`, `created_at`)

* **Data Type:** `review_id` (INT), `order_id` (INT), `reviewer_id` (INT), `reviewered_id` (INT), `rating` (INT), `content` (TEXT), `created_at` (TIMESTAMP)
* **PK:** `review_id`
* **FK:**
    * `order_id` → `orders(order_id)`
    * `reviewer_id` → `users(user_id)`
    * `reviewered_id` → `users(user_id)`
* **Constraint:**
    * `rating`: NOT NULL
    * `CHECK (rating = 1 OR rating = -1)`
    * `content`: Nullable
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
    * `UNIQUE (order_id, reviewer_id, reviewered_id)` - ensures each review direction only has 1 record

---

### `user_otps`
(`otp_id`, `user_id`, `otp_code`, `purpose`, `expires_at`, `consumed_at`)

* **Data Type:** `otp_id` (INT), `user_id` (INT), `otp_code` (VARCHAR), `purpose` (ENUM('signup', 'reset_password', 'other')), `created_at` (TIMESTAMP), `expires_at` (TIMESTAMP), `consumed_at` (TIMESTAMP)
* **PK:** `otp_id`
* **FK:** `user_id` → `users(user_id)`
* **Constraint:**
    * `otp_code`: NOT NULL
    * `purpose`: NOT NULL
    * `expires_at`: NOT NULL
    * `consumed_at`: Nullable
    * `UNIQUE (user_id, purpose) WHERE consumed_at IS NULL` - only one active OTP per purpose

---

### `upgrade_requests`
(`request_id`, `user_id`, `status`, `created_at`, `approved_at`)

* **Data Type:** `request_id` (INT), `user_id` (INT), `status` (ENUM('pending', 'approved', 'rejected')), `created_at` (TIMESTAMP), `approved_at` (TIMESTAMP)
* **PK:** `request_id`
* **FK:** `user_id` → `users(user_id)`
* **Constraint:**
    * `status`: NOT NULL, DEFAULT 'pending'
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP
    * `approved_at`: Nullable

---

### `order_chat`
(`message_id`, `order_id`, `sender_id`, `receiver_id`, `content`, `created_at`)

* **Data Type:** `message_id` (INT), `order_id` (INT), `sender_id` (INT), `receiver_id` (INT), `content` (TEXT), `created_at` (TIMESTAMP)
* **PK:** `message_id`
* **FK:**
    * `order_id` → `orders(order_id)`
    * `sender_id` → `users(user_id)`
    * `receiver_id` → `users(user_id)`
* **Constraint:**
    * `content`: NOT NULL
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP

---

### `notifications`
(`notification_id`, `user_id`, `type`, `channel`, `content`, `is_read`, `read_at`, `action_url`, `created_at`)

* **Data Type:** `notification_id` (INT), `user_id` (INT), `type` (VARCHAR), `channel` (ENUM('email', 'in_app')), `content` (TEXT), `is_read` (BOOLEAN), `read_at` (TIMESTAMP), `action_url` (VARCHAR(255)), `created_at` (TIMESTAMP)
* **PK:** `notification_id`
* **FK:** `user_id` → `users(user_id)`
* **Constraint:**
    * `type`: NOT NULL
    * `channel`: NOT NULL, DEFAULT 'in_app'
    * `content`: NOT NULL
    * `is_read`: NOT NULL, DEFAULT false
    * `read_at`: Nullable
    * `action_url`: Nullable
    * `created_at`: NOT NULL, DEFAULT CURRENT_TIMESTAMP