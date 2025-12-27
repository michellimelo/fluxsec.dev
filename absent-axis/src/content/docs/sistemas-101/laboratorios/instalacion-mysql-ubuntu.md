---
title: "Instalación de MySQL en Ubuntu y creación de una base de datos"
description: "Ejercicio práctico paso a paso para instalar MySQL Server en Ubuntu y crear una base de datos desde cero"
sidebar:
  order: 6
---

Instalar **MySQL Server** en un sistema Ubuntu, asegurar la instalación siguiendo buenas prácticas básicas de seguridad y crear una base de datos funcional desde la línea de comandos.

Al finalizar el ejercicio serás capaz de:
- Instalar MySQL correctamente
- Verificar que el servicio está activo
- Acceder al cliente MySQL como administrador
- Crear y seleccionar una base de datos para su uso

**Tiempo estimado:** 20–30 minutos

---

## Parte 1: Instalación de MySQL

### 1. Actualizar los repositorios de paquetes

Antes de instalar cualquier software, es obligatorio actualizar la información de los paquetes disponibles.

    sudo apt update

---

### 2. Instalar MySQL Server

Instala el servidor MySQL desde los repositorios oficiales de Ubuntu.

    sudo apt install mysql-server -y

Durante la instalación no se pedirá contraseña; MySQL utiliza autenticación mediante el sistema en versiones recientes.

---

### 3. Configurar y asegurar la instalación de MySQL

Ejecuta el script de seguridad incluido con MySQL para aplicar configuraciones recomendadas.

    sudo mysql_secure_installation

Durante el proceso:
- Puedes establecer contraseña para el usuario root (recomendado)
- Elimina usuarios anónimos
- Deshabilita el acceso remoto de root
- Elimina la base de datos de pruebas
- Recarga las tablas de privilegios

Estas opciones refuerzan la seguridad básica del servidor MySQL.

---

### 4. Verificar que el servicio MySQL está en funcionamiento

Comprueba el estado del servicio.

    sudo systemctl status mysql

Debes ver el estado como:

    Active: active (running)

Si no está activo, puedes iniciarlo manualmente:

    sudo systemctl start mysql

---

## Parte 2: Configuración y creación de la base de datos

### 5. Acceder al cliente MySQL como usuario root

En sistemas Ubuntu modernos, el usuario root accede mediante autenticación por socket.

    sudo mysql

Si configuraste contraseña para root:

    mysql -u root -p

---

### 6. Crear una nueva base de datos

Una vez dentro del prompt de MySQL, crea una base de datos.

    CREATE DATABASE ejemplo_db;

Para verificar que se ha creado correctamente:

    SHOW DATABASES;

---

### 7. Seleccionar la base de datos recién creada

Selecciona la base de datos para comenzar a trabajar con ella.

    USE ejemplo_db;

Si todo es correcto, MySQL mostrará:

    Database changed

A partir de este momento, cualquier tabla que crees pertenecerá a esta base de datos.

---

## Verificaciones finales

Desde MySQL, confirma:
- Que la base de datos existe
- Que puedes seleccionarla sin errores

Opcionalmente, sal del cliente MySQL:

    EXIT;

---

## Resultado del ejercicio

El sistema queda con:
- MySQL Server instalado y funcionando
- Instalación asegurada con configuraciones básicas
- Una base de datos creada y lista para uso

Este ejercicio es la base para trabajos posteriores como:
- Crear usuarios y permisos
- Conectar aplicaciones (Apache, PHP, Redmine, Zabbix, etc.)
- Diseñar tablas y esquemas de datos