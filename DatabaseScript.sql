CREATE DATABASE IF NOT EXISTS empresasublimacion_bordados;
USE empresasublimacion_bordados;
-- Tabla de usuarios para el inicio de sesión
CREATE TABLE IF NOT EXISTS usuarios_login (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
contrasena VARCHAR(255) NOT NULL
);
-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
id_cliente INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
telefono VARCHAR(15) NOT NULL
);
-- Tabla de productos
CREATE TABLE IF NOT EXISTS Registrarproducto (
id INT AUTO_INCREMENT PRIMARY KEY,
codigo_producto VARCHAR(50) UNIQUE,
nombre_producto VARCHAR(100) NOT NULL,
cantidad INT NOT NULL,
tipo_compra ENUM('unidad', 'docena') NOT NULL,
precio_unitario DECIMAL(10,2) NOT NULL,
precio_total DECIMAL(10,2) NOT NULL,
proveedor VARCHAR(100),
fecha_Registrarproducto DATETIME DEFAULT CURRENT_TIMESTAMP,
color VARCHAR(50),
dimensiones VARCHAR(50)
);
-- Tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
id INT AUTO_INCREMENT PRIMARY KEY,
id_cliente INT NOT NULL,
id_producto INT NOT NULL,
cantidad INT NOT NULL,
precio_unitario DECIMAL(10,2) NOT NULL,
precio_total DECIMAL(10,2) NOT NULL,
anticipo DECIMAL(10,2) NOT NULL,
saldo DECIMAL(10,2) NOT NULL,
fecha_pedido DATETIME NOT NULL,
fecha_entrega DATETIME NOT NULL,
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
FOREIGN KEY (id_producto) REFERENCES Registrarproducto(id) ON DELETE CASCADE
);
-- TABLAS CONTABLES Y FINANCIERAS (VERSIÓN SIMPLIFICADA)
-- Tabla de cuentas contables
CREATE TABLE IF NOT EXISTS cuentas_contables (
id_cuenta INT AUTO_INCREMENT PRIMARY KEY,
codigo_cuenta VARCHAR(20) UNIQUE NOT NULL,
nombre_cuenta VARCHAR(100) NOT NULL,
tipo_cuenta ENUM('Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto') NOT NULL,
saldo DECIMAL(15,2) DEFAULT 0.00,
fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de transacciones contables (partida doble)
CREATE TABLE IF NOT EXISTS transacciones (
id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
descripcion VARCHAR(255) NOT NULL,
id_cuenta_debito INT NOT NULL,
id_cuenta_credito INT NOT NULL,
monto DECIMAL(15,2) NOT NULL,
id_factura INT,
FOREIGN KEY (id_cuenta_debito) REFERENCES cuentas_contables(id_cuenta),
FOREIGN KEY (id_cuenta_credito) REFERENCES cuentas_contables(id_cuenta),
FOREIGN KEY (id_factura) REFERENCES facturas(id)
);
-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
id_empleado INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
cargo VARCHAR(50) NOT NULL,
salario_base DECIMAL(10,2) NOT NULL,
fecha_contratacion DATE NOT NULL
);
-- Tabla de nómina
CREATE TABLE IF NOT EXISTS nomina (
id_nomina INT AUTO_INCREMENT PRIMARY KEY,
id_empleado INT NOT NULL,
periodo DATE NOT NULL,
horas_trabajadas INT,
salario_bruto DECIMAL(10,2) NOT NULL,
deducciones DECIMAL(10,2) DEFAULT 0.00,
salario_neto DECIMAL(10,2) NOT NULL,
FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);
-- Tabla de impuestos
CREATE TABLE IF NOT EXISTS impuestos (
id_impuesto INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
tasa DECIMAL(5,2) NOT NULL,
tipo ENUM('IVA', 'Renta', 'Otros') NOT NULL
);
-- Tabla de transacciones fiscales
CREATE TABLE IF NOT EXISTS transacciones_fiscales (
id_transaccion_fiscal INT AUTO_INCREMENT PRIMARY KEY,
id_factura INT,
id_impuesto INT NOT NULL,
monto_base DECIMAL(15,2) NOT NULL,
monto_impuesto DECIMAL(15,2) NOT NULL,
fecha DATE NOT NULL,
FOREIGN KEY (id_factura) REFERENCES facturas(id),
FOREIGN KEY (id_impuesto) REFERENCES impuestos(id_impuesto)
);
-- Tabla de activos fijos
CREATE TABLE IF NOT EXISTS activos_fijos (
id_activo INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
tipo ENUM('Equipo', 'Mobiliario', 'Vehiculo', 'Edificio') NOT NULL,
fecha_adquisicion DATE NOT NULL,
valor DECIMAL(15,2) NOT NULL,
depreciacion DECIMAL(5,2) NOT NULL
);
-- Tabla de estados financieros
CREATE TABLE IF NOT EXISTS estados_financieros (
id_estado INT AUTO_INCREMENT PRIMARY KEY,
tipo ENUM('Balance General', 'Estado Resultados', 'Flujo Efectivo') NOT NULL,
periodo DATE NOT NULL,
contenido JSON NOT NULL
);
-- Modificación a la tabla de productos (eliminando proveedor)
ALTER TABLE Registrarproducto DROP COLUMN proveedor;
-- Índices optimizados
CREATE INDEX idx_facturas_cliente ON facturas(id_cliente);
CREATE INDEX idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX idx_productos_nombre ON Registrarproducto(nombre_producto);
-- MySQL dump 10.13 Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost Database: empresa_ej
-- ------------------------------------------------------
-- Server version 8.0.40
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
--
-- Table structure for table `clientes`
--
DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
`id_cliente` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(50) NOT NULL,
`apellido` varchar(50) NOT NULL,
`telefono` varchar(15) DEFAULT NULL,
PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `clientes`
--
LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'yesenia','valverde','84699303'),(2,'yesenia','val','84699303'),(3,'yesenia','val','84699303'),(4,'yesenias','val','84699303'),(5,'yesenias','val','84699303'),(6,'yesenias','val','84699303'),(7,'josue','daniel ','84699303'),(8,'yesenia','valverde','84699303'),(9,'yesenia','valverde','84699303'),(10,'josue ','daniel ','5588855225'),(11,'josue ','daniel ','5588855225'),(12,'josue ','daniel ','5588855225'),(13,'josue ','daniel ','5588855225'),(14,'josue ','daniel
','5588855225'),(15,'josue ','daniel ','5588855225'),(16,'josue ','daniel ','5588855225'),(17,'josue ','daniel ','5588855225'),(18,'josue ','daniel ','5588855225'),(19,'josue ','daniel ','5588855225'),(20,'josue ','daniel ','5588855225');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `facturas`
--
DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
`id` int NOT NULL AUTO_INCREMENT,
`id_cliente` int NOT NULL,
`id_producto` int DEFAULT NULL,
`cantidad` int NOT NULL,
`precio_unitario` decimal(10,2) NOT NULL,
`precio_total` decimal(10,2) NOT NULL,
`anticipo` decimal(10,2) DEFAULT '0.00',
`saldo` decimal(10,2) NOT NULL,
`fecha_pedido` date NOT NULL,
`fecha_entrega` date NOT NULL,
`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
KEY `id_cliente` (`id_cliente`),
KEY `id_producto` (`id_producto`),
CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `registrarproducto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `facturas`
--
LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
INSERT INTO `facturas` VALUES (1,13,1,250,250.00,62500.00,250.00,62250.00,'2025-03-07','2025-03-26','2025-03-07 21:02:02','2025-03-07 21:02:02'),(2,15,NULL,80,255.00,20400.00,250.00,20150.00,'2025-03-10','2025-03-28','2025-03-09 14:02:43','2025-03-09 14:02:43'),(3,16,NULL,80,255.00,20400.00,250.00,20150.00,'2025-03-09','2025-03-18','2025-03-09 14:10:55','2025-03-09 14:10:55'),(4,17,NULL,80,255.00,20400.00,250.00,20150.00,'2025-03-09','2025-03-24','2025-03-09 14:23:39','2025-03-09 14:23:39'),(5,19,1,2,250.00,500.00,500.00,0.00,'2025-03-12','2025-03-09','2025-03-12 22:05:20','2025-03-12 22:05:20'),(6,20,1,1,250.00,250.00,150.00,100.00,'2025-03-12','2025-03-19','2025-03-12 22:21:21','2025-03-12 22:21:21');
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `registrarproducto`
--
DROP TABLE IF EXISTS `registrarproducto`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrarproducto` (
`id` int NOT NULL AUTO_INCREMENT,
`codigo_producto` varchar(255) DEFAULT NULL,
`nombre_producto` varchar(255) NOT NULL,
`cantidad` int NOT NULL,
`tipo_compra` enum('unidad','docena') NOT NULL,
`precio_unitario` decimal(10,2) NOT NULL,
`precio_total` decimal(10,2) NOT NULL,
`proveedor` varchar(255) DEFAULT NULL,
`dimensiones` varchar(255) DEFAULT NULL,
`color` varchar(255) DEFAULT NULL,
`fecha_Registrarproducto` datetime DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `registrarproducto`
--
LOCK TABLES `registrarproducto` WRITE;
/*!40000 ALTER TABLE `registrarproducto` DISABLE KEYS */;
INSERT INTO `registrarproducto` VALUES (1,'jjajja','tasas - ',1,'unidad',250.00,250.00,'klasioc','s','rojo ','2025-03-03 00:00:00');
/*!40000 ALTER TABLE `registrarproducto` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `usuarios_login`
--
DROP TABLE IF EXISTS `usuarios_login`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_login` (
`id` int NOT NULL AUTO_INCREMENT,
`nombre_usuario` varchar(50) NOT NULL,
`contrasena` varchar(255) NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `nombre_usuario` (`nombre_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `usuarios_login`
--
LOCK TABLES `usuarios_login` WRITE;
/*!40000 ALTER TABLE `usuarios_login` DISABLE KEYS */;
INSERT INTO `usuarios_login` VALUES (1,'emerson','12345678');
/*!40000 ALTER TABLE `usuarios_login` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
-- Dump completed on 2025-03-19 14:15:48


INSERT INTO Registrarproducto 
(codigo_producto, nombre_producto, cantidad, tipo_compra, precio_unitario, precio_total, color, dimensiones)
VALUES
('P001', 'Taza sublimada', 50, 'unidad', 120.00, 6000.00, 'Blanco', '10x8 cm'),
('P002', 'Camisa bordada', 30, 'unidad', 250.00, 7500.00, 'Azul', 'M'),
('P003', 'Gorra bordada', 40, 'unidad', 150.00, 6000.00, 'Negro', 'Ajustable');