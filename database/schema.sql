CREATE DATABASE IF NOT EXISTS iot_medis_db;
USE iot_medis_db;

DROP TABLE IF EXISTS vitals_monitoring;

CREATE TABLE vitals_monitoring (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bpm FLOAT NOT NULL,
    spo2 FLOAT NOT NULL,
    status_kondisi VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);