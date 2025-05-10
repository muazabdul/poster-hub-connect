
-- Create the database
CREATE DATABASE IF NOT EXISTS csc_portal
    CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

USE csc_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    csc_id VARCHAR(50),
    csc_name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- User sessions for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

-- Posters
CREATE TABLE IF NOT EXISTS posters (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    service_url VARCHAR(255),
    category_id VARCHAR(36),
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Downloads tracking
CREATE TABLE IF NOT EXISTS downloads (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    poster_id VARCHAR(36),
    downloaded_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poster_id) REFERENCES posters(id) ON DELETE CASCADE
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    interval VARCHAR(20) NOT NULL,
    features JSON,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    plan_id VARCHAR(36),
    status VARCHAR(20) NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL
);

-- Global settings
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(36) PRIMARY KEY,
    payment JSON,
    appearance JSON,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
VALUES (
    'admin-user-id',
    'admin@example.com',
    '$2y$10$xJ1rmMq5YGMbLYKJkP1pNelvBJUjy1Y1ZUkD.rP.dElPJOKe9n6w.',
    'Admin User',
    'admin',
    NOW(),
    NOW()
);

-- Create some sample categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
('c1', 'Government Schemes', 'Official government schemes and programs', NOW(), NOW()),
('c2', 'Digital Services', 'Digital and online services for citizens', NOW(), NOW()),
('c3', 'Banking', 'Banking and financial services', NOW(), NOW()),
('c4', 'Education', 'Educational programs and scholarships', NOW(), NOW()),
('c5', 'Agriculture', 'Agricultural schemes and subsidies', NOW(), NOW());

-- Create some sample plans
INSERT INTO plans (id, name, description, price, interval, features, active, created_at, updated_at) VALUES
('p1', 'Basic Plan', 'Access to essential features', 499, 'month', '["5 Posters per month", "Basic Analytics", "Email Support"]', TRUE, NOW(), NOW()),
('p2', 'Premium Plan', 'Enhanced features for growing businesses', 999, 'month', '["Unlimited Posters", "Advanced Analytics", "Priority Support", "Custom Branding"]', TRUE, NOW(), NOW()),
('p3', 'Enterprise Plan', 'Full access to all features', 4999, 'month', '["Unlimited Posters", "Premium Analytics", "24/7 Support", "Custom Branding", "API Access", "Dedicated Account Manager"]', TRUE, NOW(), NOW());
