-- FoodShare Database Schema

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS foodshare_db;
USE foodshare_db;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address TEXT,
    role ENUM('ADMIN', 'DONOR', 'RECEIVER', 'DELIVERY_PARTNER') NOT NULL,
    is_active BIT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6)
);

-- 3. Create Food Donations Table
CREATE TABLE IF NOT EXISTS food_donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    food_items TEXT NOT NULL,
    quantity DOUBLE NOT NULL,
    unit VARCHAR(255) NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    available_from DATETIME(6) NOT NULL,
    available_until DATETIME(6) NOT NULL,
    price DOUBLE DEFAULT 0.0,
    payment_type VARCHAR(255),
    image_path VARCHAR(255),
    status ENUM('AVAILABLE', 'PARTIALLY_CLAIMED', 'CLAIMED', 'EXPIRED') NOT NULL DEFAULT 'AVAILABLE',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create Food Requests Table
CREATE TABLE IF NOT EXISTS food_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    quantity_requested DOUBLE NOT NULL,
    message TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    requested_at DATETIME(6) NOT NULL,
    responded_at DATETIME(6),
    pickup_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (donation_id) REFERENCES food_donations(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
