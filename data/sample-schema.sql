-- Sample schema for A/B Index Optimizer Demo
-- This creates realistic tables for testing index strategies

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    age INTEGER,
    city VARCHAR(100),
    country VARCHAR(100)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_address TEXT,
    payment_method VARCHAR(50)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, name, age, city, country, status) VALUES
('john.doe@example.com', 'John Doe', 28, 'New York', 'USA', 'active'),
('jane.smith@example.com', 'Jane Smith', 34, 'London', 'UK', 'active'),
('bob.johnson@example.com', 'Bob Johnson', 45, 'Toronto', 'Canada', 'inactive'),
('alice.brown@example.com', 'Alice Brown', 29, 'Sydney', 'Australia', 'active'),
('charlie.wilson@example.com', 'Charlie Wilson', 52, 'Berlin', 'Germany', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (name, description, price, category, stock_quantity) VALUES
('Laptop Pro', 'High-performance laptop', 1299.99, 'Electronics', 50),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 'Electronics', 200),
('Coffee Mug', 'Ceramic coffee mug', 12.99, 'Home', 100),
('Running Shoes', 'Comfortable running shoes', 89.99, 'Sports', 75),
('Notebook', 'Spiral-bound notebook', 5.99, 'Office', 300)
ON CONFLICT DO NOTHING;

INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES
(1, 1329.98, 'completed', 'credit_card'),
(2, 42.98, 'completed', 'paypal'),
(1, 89.99, 'pending', 'credit_card'),
(3, 18.98, 'cancelled', 'debit_card'),
(4, 1299.99, 'completed', 'credit_card')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1299.99),
(1, 2, 1, 29.99),
(2, 3, 2, 12.99),
(2, 5, 1, 5.99),
(3, 4, 1, 89.99),
(4, 3, 1, 12.99),
(4, 5, 1, 5.99),
(5, 1, 1, 1299.99)
ON CONFLICT DO NOTHING;

-- Add some additional sample data for more realistic testing
DO $$
BEGIN
    -- Add more users if table is small
    IF (SELECT COUNT(*) FROM users) < 100 THEN
        INSERT INTO users (email, name, age, city, country, status)
        SELECT 
            'user' || generate_series || '@example.com',
            'User ' || generate_series,
            20 + (generate_series % 50),
            CASE (generate_series % 5)
                WHEN 0 THEN 'New York'
                WHEN 1 THEN 'London'
                WHEN 2 THEN 'Toronto'
                WHEN 3 THEN 'Sydney'
                ELSE 'Berlin'
            END,
            CASE (generate_series % 5)
                WHEN 0 THEN 'USA'
                WHEN 1 THEN 'UK'
                WHEN 2 THEN 'Canada'
                WHEN 3 THEN 'Australia'
                ELSE 'Germany'
            END,
            CASE WHEN generate_series % 10 = 0 THEN 'inactive' ELSE 'active' END
        FROM generate_series(6, 100)
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;