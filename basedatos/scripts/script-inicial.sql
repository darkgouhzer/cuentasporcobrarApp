-- =============================================
-- BASE DE DATOS: coreflow_db
-- Versión: 1.0
-- Fecha: 2026-03-08
-- =============================================

CREATE DATABASE IF NOT EXISTS coreflow_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE coreflow_db;

-- =============================================
-- TABLA: usuarios
-- =============================================
CREATE TABLE usuarios (
    idUsuario       INT             NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100)    NOT NULL,
    email           VARCHAR(100)    NOT NULL,
    passwordHash    VARCHAR(255)    NOT NULL,
    rol             ENUM('ADMIN', 'USUARIO') NOT NULL DEFAULT 'USUARIO',
    activo          TINYINT(1)      NOT NULL DEFAULT 1,
    fechaRegistro   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuarios PRIMARY KEY (idUsuario),
    CONSTRAINT uq_usuarios_email UNIQUE (email)
);

-- =============================================
-- TABLA: clientes
-- =============================================
CREATE TABLE clientes (
    idCliente           INT             NOT NULL AUTO_INCREMENT,
    idUsuario           INT             NOT NULL,
    nombre              VARCHAR(100)    NOT NULL,
    apellidoPaterno     VARCHAR(100)    NOT NULL,
    apellidoMaterno     VARCHAR(100),
    telefono            VARCHAR(15),
    email               VARCHAR(100),
    tipo                ENUM('CLIENTE', 'PROVEEDOR', 'AMBOS') NOT NULL DEFAULT 'CLIENTE',
    activo              TINYINT(1)      NOT NULL DEFAULT 1,
    fechaRegistro       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion  DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_clientes PRIMARY KEY (idCliente),
    CONSTRAINT fk_clientes_usuario FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- =============================================
-- TABLA: conceptos
-- =============================================
CREATE TABLE conceptos (
    idConcepto      INT             NOT NULL AUTO_INCREMENT,
    idUsuario       INT,
    nombre          VARCHAR(100)    NOT NULL,
    tipo            ENUM('PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO') NOT NULL DEFAULT 'OTRO',
    precioDefault   DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    activo          TINYINT(1)      NOT NULL DEFAULT 1,
    CONSTRAINT pk_conceptos PRIMARY KEY (idConcepto),
    CONSTRAINT fk_conceptos_usuario FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- =============================================
-- TABLA: cuentas
-- =============================================
CREATE TABLE cuentas (
    idCuenta            INT             NOT NULL AUTO_INCREMENT,
    idCliente           INT             NOT NULL,
    tipo                ENUM('POR_COBRAR', 'POR_PAGAR') NOT NULL DEFAULT 'POR_COBRAR',
    estado              ENUM('ABIERTA', 'PAGADA', 'VENCIDA', 'CANCELADA') NOT NULL DEFAULT 'ABIERTA',
    descripcion         VARCHAR(200),
    importeTotal        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    importePagado       DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    saldo               DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    fechaEmision        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaVencimiento    DATETIME,
    fechaActualizacion  DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_cuentas PRIMARY KEY (idCuenta),
    CONSTRAINT fk_cuentas_cliente FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
);

-- =============================================
-- TABLA: cuenta_detalle
-- =============================================
CREATE TABLE cuenta_detalle (
    idDetalle       INT             NOT NULL AUTO_INCREMENT,
    idCuenta        INT             NOT NULL,
    idConcepto      INT,
    descripcion     VARCHAR(200),
    tipoConcepto    ENUM('PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO') NOT NULL DEFAULT 'OTRO',
    cantidad        DECIMAL(10,2)   NOT NULL DEFAULT 1.00,
    precioUnitario  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    importe         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    fecha           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_cuenta_detalle PRIMARY KEY (idDetalle),
    CONSTRAINT fk_detalle_cuenta FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta),
    CONSTRAINT fk_detalle_concepto FOREIGN KEY (idConcepto) REFERENCES conceptos(idConcepto)
);

-- =============================================
-- TABLA: movimientos
-- =============================================
CREATE TABLE movimientos (
    idMovimiento    INT             NOT NULL AUTO_INCREMENT,
    idCuenta        INT             NOT NULL,
    tipo            ENUM('ABONO', 'CARGO', 'AJUSTE', 'CANCELACION') NOT NULL,
    importe         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    referencia      VARCHAR(100),
    notas           VARCHAR(200),
    fecha           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_movimientos PRIMARY KEY (idMovimiento),
    CONSTRAINT fk_movimientos_cuenta FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta)
);

-- =============================================
-- TRIGGERS
-- =============================================
DELIMITER $$
CREATE TRIGGER trg_detalle_insert
AFTER INSERT ON cuenta_detalle
FOR EACH ROW
BEGIN
    UPDATE cuentas
    SET importeTotal = importeTotal + NEW.importe,
        saldo        = (importeTotal + NEW.importe) - importePagado
    WHERE idCuenta = NEW.idCuenta;
END$$

CREATE TRIGGER trg_movimiento_insert
AFTER INSERT ON movimientos
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'ABONO' THEN
        UPDATE cuentas
        SET importePagado = importePagado + NEW.importe,
            saldo         = importeTotal - (importePagado + NEW.importe),
            estado        = CASE
                                WHEN importeTotal <= (importePagado + NEW.importe) THEN 'PAGADA'
                                ELSE estado
                            END
        WHERE idCuenta = NEW.idCuenta;
    ELSEIF NEW.tipo = 'CARGO' THEN
        UPDATE cuentas
        SET importeTotal = importeTotal + NEW.importe,
            saldo        = (importeTotal + NEW.importe) - importePagado
        WHERE idCuenta = NEW.idCuenta;
    END IF;
END$$
DELIMITER ;

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX idx_clientes_usuario   ON clientes(idUsuario);
CREATE INDEX idx_cuentas_cliente    ON cuentas(idCliente);
CREATE INDEX idx_cuentas_estado     ON cuentas(estado);
CREATE INDEX idx_detalle_cuenta     ON cuenta_detalle(idCuenta);
CREATE INDEX idx_movimientos_cuenta ON movimientos(idCuenta);

-- =============================================
-- DATOS INICIALES
-- =============================================
INSERT INTO usuarios (nombre, email, passwordHash, rol)
VALUES ('Administrador', 'admin@coreflow.app', 'CAMBIAR_POR_HASH_REAL', 'ADMIN');

INSERT INTO conceptos (idUsuario, nombre, tipo, precioDefault) VALUES
(NULL, 'Hora de trabajo',  'HORA_TRABAJO', 0.00),
(NULL, 'Consultoría',      'SERVICIO',     0.00),
(NULL, 'Producto general', 'PRODUCTO',     0.00);
