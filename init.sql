CREATE DATABASE IF NOT EXISTS `spherus-db`;

CREATE USER IF NOT EXISTS 'Lukasz'@'%' IDENTIFIED BY 'Pomidor@85';
GRANT ALL PRIVILEGES ON `spherus-db`.* TO 'Lukasz'@'%';
FLUSH PRIVILEGES;