-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.auto_bids (
  id integer NOT NULL DEFAULT nextval('auto_bids_auto_bid_id_seq'::regclass),
  product_id integer NOT NULL,
  bidder_id integer NOT NULL,
  max_amount numeric NOT NULL CHECK (max_amount > 0::numeric),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT auto_bids_pkey PRIMARY KEY (id),
  CONSTRAINT auto_bids_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.users(id),
  CONSTRAINT auto_bids_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.bids (
  id integer NOT NULL DEFAULT nextval('bids_bid_id_seq'::regclass),
  product_id integer NOT NULL,
  bidder_id integer NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bids_pkey PRIMARY KEY (id),
  CONSTRAINT bids_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.users(id),
  CONSTRAINT bids_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_category_id_seq'::regclass),
  name character varying NOT NULL,
  slug character varying NOT NULL,
  parent_id integer,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);
CREATE TABLE public.invoices (
  id integer NOT NULL DEFAULT nextval('invoices_invoice_id_seq'::regclass),
  order_id integer NOT NULL UNIQUE,
  shipping_address text,
  payment_proof_url character varying,
  shipping_tracking_code character varying,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone,
  CONSTRAINT invoices_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id integer NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
  user_id integer NOT NULL,
  type character varying NOT NULL,
  channel USER-DEFINED NOT NULL DEFAULT 'in_app'::notification_channel_enum,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamp without time zone,
  action_url character varying,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.otp_verifications (
  id integer NOT NULL DEFAULT nextval('otp_verifications_id_seq'::regclass),
  user_id integer NOT NULL,
  otp character varying NOT NULL,
  is_used boolean DEFAULT false,
  created_at timestamp with time zone,
  CONSTRAINT otp_verifications_pkey PRIMARY KEY (id),
  CONSTRAINT otp_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.permissions (
  id integer NOT NULL DEFAULT nextval('permissions_permission_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT permissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_comments (
  id integer NOT NULL DEFAULT nextval('product_comments_comment_id_seq'::regclass),
  product_id integer NOT NULL,
  user_id integer NOT NULL,
  content text NOT NULL,
  parent_id integer,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT product_comments_pkey PRIMARY KEY (id),
  CONSTRAINT product_comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.product_comments(id),
  CONSTRAINT product_comments_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT product_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.product_descriptions (
  id integer NOT NULL DEFAULT nextval('product_descriptions_description_id_seq'::regclass),
  product_id integer NOT NULL,
  author_id integer NOT NULL,
  content text NOT NULL,
  lang character varying NOT NULL DEFAULT 'vi'::character varying,
  version integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT product_descriptions_pkey PRIMARY KEY (id),
  CONSTRAINT product_descriptions_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id),
  CONSTRAINT product_descriptions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.product_images (
  id integer NOT NULL DEFAULT nextval('product_images_image_id_seq'::regclass),
  product_id integer NOT NULL,
  image_url character varying NOT NULL,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.product_rejections (
  id integer NOT NULL DEFAULT nextval('product_rejections_rejection_id_seq'::regclass),
  product_id integer NOT NULL,
  bidder_id integer NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT product_rejections_pkey PRIMARY KEY (id),
  CONSTRAINT product_rejections_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.users(id),
  CONSTRAINT product_rejections_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id integer NOT NULL DEFAULT nextval('products_product_id_seq'::regclass),
  category_id integer NOT NULL,
  seller_id integer NOT NULL,
  highest_bidder_id integer,
  name character varying NOT NULL,
  thumbnail_url character varying,
  current_price numeric NOT NULL,
  buy_now_price numeric,
  start_price numeric NOT NULL CHECK (start_price > 0::numeric),
  step_price numeric NOT NULL CHECK (step_price > 0::numeric),
  end_time timestamp with time zone NOT NULL,
  bid_count integer NOT NULL DEFAULT 0,
  auto_extend boolean NOT NULL DEFAULT false,
  status USER-DEFINED NOT NULL DEFAULT 'active'::product_status_enum,
  fts tsvector,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  slug text,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT products_highest_bidder_id_fkey FOREIGN KEY (highest_bidder_id) REFERENCES public.users(id),
  CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id)
);
CREATE TABLE public.refresh_tokens (
  id integer NOT NULL DEFAULT nextval('refresh_tokens_token_id_seq'::regclass),
  user_id integer NOT NULL,
  token_hash character varying NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  device_info text,
  ip_address character varying,
  created_at timestamp with time zone NOT NULL,
  last_used_at timestamp without time zone,
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.reviews (
  id integer NOT NULL DEFAULT nextval('reviews_review_id_seq'::regclass),
  order_id integer NOT NULL,
  reviewer_id integer NOT NULL,
  reviewered_id integer NOT NULL,
  rating integer NOT NULL CHECK (rating = ANY (ARRAY[1, '-1'::integer])),
  content text,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id),
  CONSTRAINT reviews_reviewered_id_fkey FOREIGN KEY (reviewered_id) REFERENCES public.users(id)
);
CREATE TABLE public.roles (
  id integer NOT NULL DEFAULT nextval('roles_role_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.roles_permissions (
  role_id integer NOT NULL,
  permission_id integer NOT NULL,
  CONSTRAINT roles_permissions_pkey PRIMARY KEY (role_id, permission_id),
  CONSTRAINT roles_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id),
  CONSTRAINT roles_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE TABLE public.social_accounts (
  id integer NOT NULL DEFAULT nextval('social_accounts_id_seq'::regclass),
  user_id integer NOT NULL,
  provider character varying NOT NULL,
  provider_id character varying NOT NULL,
  email character varying,
  name character varying,
  avatar_url character varying,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT social_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT social_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.system_settings (
  setting_key character varying NOT NULL,
  setting_value character varying NOT NULL,
  description text,
  updated_at timestamp with time zone NOT NULL,
  CONSTRAINT system_settings_pkey PRIMARY KEY (setting_key)
);
CREATE TABLE public.transaction_messages (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  transaction_id integer NOT NULL,
  sender_id integer NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transaction_messages_pkey PRIMARY KEY (id),
  CONSTRAINT fk_transaction FOREIGN KEY (transaction_id) REFERENCES public.transactions(id),
  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES public.users(id)
);
CREATE TABLE public.transactions (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id integer,
  buyer_id integer,
  seller_id integer,
  final_price numeric NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'payment_pending'::transaction_status_enum,
  payment_proof_url text,
  shipping_address text,
  seller_confirmed_at timestamp with time zone,
  shipping_proof_url text,
  buyer_received_at timestamp with time zone,
  buyer_rating integer CHECK (buyer_rating = ANY (ARRAY[1, '-1'::integer])),
  buyer_comment text,
  seller_rating integer CHECK (seller_rating = ANY (ARRAY[1, '-1'::integer])),
  seller_comment text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT transactions_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id),
  CONSTRAINT transactions_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id)
);
CREATE TABLE public.upgrade_requests (
  id integer NOT NULL DEFAULT nextval('upgrade_requests_request_id_seq'::regclass),
  user_id integer NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::upgrade_status_enum,
  created_at timestamp with time zone NOT NULL,
  approved_at timestamp with time zone,
  expires_at timestamp with time zone,
  message text DEFAULT 'I want to be a Seller'::text,
  CONSTRAINT upgrade_requests_pkey PRIMARY KEY (id),
  CONSTRAINT upgrade_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_otps (
  id integer NOT NULL DEFAULT nextval('user_otps_otp_id_seq'::regclass),
  user_id integer NOT NULL,
  otp_code character varying NOT NULL,
  purpose USER-DEFINED NOT NULL,
  created_at timestamp with time zone NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  consumed_at timestamp with time zone,
  CONSTRAINT user_otps_pkey PRIMARY KEY (id),
  CONSTRAINT user_otps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  full_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying,
  address character varying,
  is_verified boolean NOT NULL DEFAULT false,
  positive_reviews integer NOT NULL DEFAULT 0,
  negative_reviews integer NOT NULL DEFAULT 0,
  status USER-DEFINED NOT NULL DEFAULT 'pending_verification'::user_status_enum,
  password_updated_at timestamp without time zone,
  failed_login_attempts integer NOT NULL DEFAULT 0,
  last_login_at timestamp without time zone,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users_roles (
  user_id integer NOT NULL,
  role_id integer NOT NULL,
  CONSTRAINT users_roles_pkey PRIMARY KEY (user_id, role_id),
  CONSTRAINT users_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT users_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.watchlist (
  user_id integer NOT NULL,
  product_id integer NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT watchlist_pkey PRIMARY KEY (user_id, product_id),
  CONSTRAINT watchlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);