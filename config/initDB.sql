CREATE DATABASE IF NOT EXISTS nina_amarilla_db;
USE nina_amarilla_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(64) DEFAULT NULL 
);

CREATE TABLE sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE COMMENT '1 si el usuario destacó el mensaje',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subject VARCHAR(150) NOT NULL DEFAULT 'Sin asunto' AFTER receiver_id,
    status ENUM('sent', 'draft', 'trash') DEFAULT 'sent' AFTER content,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Definimos las relaciones (Foreign Keys)
    CONSTRAINT fk_sender
        FOREIGN KEY (sender_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE, -- Si se borra el usuario, se borran sus mensajes enviados
        
    CONSTRAINT fk_receiver
        FOREIGN KEY (receiver_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE -- Si se borra el usuario, se borran sus mensajes recibidos
);

-- Índice para buscar rápidamente los mensajes que he recibido
CREATE INDEX idx_receiver ON messages(receiver_id);

-- Índice para buscar rápidamente los mensajes que he enviado
CREATE INDEX idx_sender ON messages(sender_id);
