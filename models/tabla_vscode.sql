-- Crear tabla de preguntas
CREATE TABLE PreguntasRecuperacion (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    pregunta NVARCHAR(500) NOT NULL UNIQUE
);

-- Insertar preguntas
INSERT INTO PreguntasRecuperacion (pregunta) VALUES 
('Nombre de tu mascota'),
('¿Cual es tu color favorito?'),
('¿Hobby favorito?');

-- Crear tabla de usuarios con fecha automática
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20) NOT NULL,
    correo NVARCHAR(200) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    preguntarc INT NOT NULL,
    respuestarc NVARCHAR(255) NOT NULL,
    fechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (preguntarc) REFERENCES PreguntasRecuperacion(Id)
);

-- Insertar usuario (sin especificar fechaRegistro)
INSERT INTO Users (nombre, Telefono, correo, password, preguntarc, respuestarc)
VALUES ('yuvia', '521234567890', 'abigail_yuvia@gmail.com', 
        'hola123', 
        1, 
        'kaisa');

INSERT INTO Users (nombre, Telefono, correo, password, preguntarc, respuestarc)
VALUES ('alex', '525538846512', 'alex@gmail.com', 
        'secreto098', 
        2, 
        'rojo');

-- Consultar para ver la fecha automática
SELECT * FROM Users;

SELECT * FROM PreguntasRecuperacion;

DROP TABLE Users, PreguntasRecuperacion;

CREATE DATABASE Users;