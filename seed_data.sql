USE foodshare_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE food_requests;
TRUNCATE TABLE food_donations;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Users (Password is 'password123')
INSERT INTO users (username, email, password, full_name, phone_number, address, role, is_active, created_at, updated_at) 
VALUES 
('donor1', 'donor@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uyzREXBJQpc29y6WByZ9.fYf7V5nTWZ.', 'John Donor', '9876543210', '123 Donor Lane, City Center', 'DONOR', 1, NOW(), NOW()),
('receiver1', 'receiver@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uyzREXBJQpc29y6WByZ9.fYf7V5nTWZ.', 'Mary Receiver', '9123456789', '456 Receiver St, NGO Colony', 'RECEIVER', 1, NOW(), NOW()),
('delivery1', 'delivery@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uyzREXBJQpc29y6WByZ9.fYf7V5nTWZ.', 'David Delivery', '9988776655', '789 Delivery Rd, Hub Area', 'DELIVERY_PARTNER', 1, NOW(), NOW());

-- Insert Food Donation
INSERT INTO food_donations (donor_id, event_name, description, food_items, quantity, unit, pickup_location, available_from, available_until, status, price, created_at, updated_at)
VALUES 
(1, 'Grand Wedding', 'Excess biryani and sweets from wedding', 'Chicken Biryani, Gulab Jamun', 20, 'KG', 'Crystal Palace, MG Road', NOW(), DATE_ADD(NOW(), INTERVAL 5 HOUR), 'AVAILABLE', 0, NOW(), NOW());

-- Insert Food Request (Approved so it shows up for delivery)
INSERT INTO food_requests (donation_id, receiver_id, quantity_requested, message, status, requested_at, updated_at)
VALUES 
(1, 2, 10, 'Need for orphanage', 'APPROVED', NOW(), NOW());
