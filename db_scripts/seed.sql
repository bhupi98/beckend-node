use beckend_node;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$K5jXslXHnLqE3z0iTZfYie4T7M0v7W8IjXUyd/yLQ0Bbb9OgOkU2G', 'admin'), -- Password: admin123
('Regular User', 'user@example.com', '$2a$10$ZkBlzkbW8F7pG/7pdRlnFOqYfbILdb6cR9h7mujMJzHUp5K8OUEOq', 'user'); -- Password: user123

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO roles (role) VALUES
('admin'),
('user');

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO permissions (permission) VALUES
('view_users'),
('edit_users'),
('delete_users'),
('view_profile'),
('edit_profile');
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    FOREIGN KEY (role) REFERENCES roles(role) ON DELETE CASCADE,
    FOREIGN KEY (permission) REFERENCES permissions(permission) ON DELETE CASCADE
);

-- Admin can view, edit, and delete users
INSERT INTO role_permissions (role, permission) VALUES
('admin', 'view_users'),
('admin', 'edit_users'),
('admin', 'delete_users'),
('admin', 'view_profile'),
('admin', 'edit_profile');

-- Regular user can only view and edit their profile
INSERT INTO role_permissions (role, permission) VALUES
('user', 'view_profile'),
('user', 'edit_profile');
