---
title: "Implementación de Zabbix en Docker"
description: "Sistema de monitoreo profesional usando contenedores"
sidebar:
  order: 11
---

Desplegar una instancia funcional de **Zabbix Server + Frontend + Base de Datos MySQL** utilizando Docker Compose para monitorear equipos o servicios locales.

**Tiempo estimado:** 45-60 minutos

## ¿Qué es Zabbix?

Zabbix es una solución de monitoreo empresarial open-source que permite supervisar redes, servidores, aplicaciones y servicios. Proporciona alertas, gráficos y reportes en tiempo real.

## ¿Qué es Docker?

### Contenedores - explicación simple

Un contenedor es como una **caja aislada** que contiene una aplicación y todo lo que necesita para funcionar (código, librerías, dependencias).

**Analogía:**

- **Máquina virtual:** Es como tener una casa completa dentro de otra casa (pesado, lento)
- **Contenedor:** Es como tener habitaciones separadas en la misma casa (ligero, rápido)

### Ventajas de Docker

- Portabilidad: Funciona igual en cualquier sistema
- Aislamiento: Cada aplicación en su propio entorno
- Rapidez: Se inicia en segundos
- Eficiencia: Usa menos recursos que VMs

## Componentes del proyecto Zabbix

### 1. Zabbix Server

El cerebro del sistema. Recopila datos, procesa información y almacena métricas.

### 2. Zabbix Frontend (web)

La interfaz gráfica web donde visualizas dashboards, gráficos y configuraciones.

### 3. MySQL Database

Base de datos que almacena toda la configuración, históricos y métricas.

### Comunicación entre contenedores

Docker Compose crea una red virtual donde los contenedores se comunican:

- Frontend → Server: Consulta datos y configuración
- Server → Database: Lee/escribe métricas y configuración
- Server → Hosts monitoreados: Recopila métricas

## Requisitos previos

- Ubuntu Server funcionando (ejemplo: 192.168.1.250)
- Acceso sudo
- Conexión a Internet
- Mínimo 2GB RAM libre
- 10GB espacio en disco

## Paso 1: Actualizar el sistema

Siempre comenzamos actualizando el sistema:

    sudo apt update
    sudo apt upgrade -y

## Paso 2: Instalar Docker

### 2.1 Instalar dependencias

    sudo apt install ca-certificates curl gnupg lsb-release -y

### 2.2 Añadir repositorio oficial de Docker

    # Crear directorio para claves GPG
    sudo mkdir -p /etc/apt/keyrings

    # Descargar clave GPG de Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # Añadir repositorio
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

### 2.3 Instalar Docker Engine

    sudo apt update
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

### 2.4 Verificar instalación

    sudo docker run hello-world

Deberías ver:

    Hello from Docker!
    This message shows that your installation appears to be working correctly.

Si ves el mensaje de “Hello from Docker”, la instalación fue exitosa.

## Paso 3: Configurar permisos de usuario

Para usar Docker sin sudo:

    # Añadir tu usuario al grupo docker
    sudo usermod -aG docker $USER

    # Aplicar cambios (o reinicia sesión)
    newgrp docker

Verifica que funcione sin sudo:

    docker ps

## Paso 4: Crear directorio del proyecto

    # Crear directorio
    mkdir -p ~/zabbix-docker

    # Entrar al directorio
    cd ~/zabbix-docker

## Paso 5: Crear docker-compose.yml

Este archivo define toda la infraestructura de Zabbix:

    nano docker-compose.yml

Pega este contenido:

    version: '3.8'

    services:
      # Base de datos MySQL
      db:
        image: mysql:8.0
        container_name: zabbix-mysql
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: zabbix
          MYSQL_USER: zabbix
          MYSQL_PASSWORD: zabbixpassword
        command:
          - --character-set-server=utf8mb4
          - --collation-server=utf8mb4_bin
          - --default-authentication-plugin=mysql_native_password
          - --log-bin-trust-function-creators=1
        volumes:
          - zbx-db-data:/var/lib/mysql
        networks:
          - zabbix-net

      # Servidor Zabbix
      zabbix-server:
        image: zabbix/zabbix-server-mysql:latest
        container_name: zabbix-server
        restart: always
        environment:
          DB_SERVER_HOST: db
          MYSQL_DATABASE: zabbix
          MYSQL_USER: zabbix
          MYSQL_PASSWORD: zabbixpassword
        ports:
          - "10051:10051"
        depends_on:
          - db
        networks:
          - zabbix-net

      # Frontend Web
      zabbix-web:
        image: zabbix/zabbix-web-nginx-mysql:latest
        container_name: zabbix-web
        restart: always
        environment:
          DB_SERVER_HOST: db
          MYSQL_DATABASE: zabbix
          MYSQL_USER: zabbix
          MYSQL_PASSWORD: zabbixpassword
          ZBX_SERVER_HOST: zabbix-server
          PHP_TZ: Europe/Madrid
        ports:
          - "8080:8080"
        depends_on:
          - db
          - zabbix-server
        networks:
          - zabbix-net

    networks:
      zabbix-net:
        driver: bridge

    volumes:
      zbx-db-data:

Guarda: **Ctrl+O**, Enter, **Ctrl+X**

Explicación del archivo:

- **services:** Define los 3 contenedores
- **image:** Imagen Docker a usar
- **environment:** Variables de configuración
- **ports:** Puertos expuestos (8080 para web)
- **volumes:** Almacenamiento persistente
- **networks:** Red privada entre contenedores

## Paso 6: Iniciar los contenedores

    sudo docker compose up -d

El parámetro `-d` ejecuta en segundo plano (detached).

Docker comenzará a descargar las imágenes. Esto puede tardar varios minutos dependiendo de tu conexión.

Ejemplo de salida:

    [+] Running 26/26
     ✔ zabbix-web Pulled
     ✔ zabbix-server Pulled
     ✔ db Pulled
    [+] Running 4/4
     ✔ Network zabbix-docker_zabbix-net    Created
     ✔ Container zabbix-mysql               Started
     ✔ Container zabbix-server              Started
     ✔ Container zabbix-web                 Started

Problema común: “MySQL server is not available”

Al iniciar por primera vez, puedes ver en logs:

    **** MySQL server is not available. Waiting 5 seconds...

Esto es normal: MySQL tarda en inicializar (1-2 minutos). Zabbix reintentará hasta que MySQL esté listo.

Monitorear el progreso:

    sudo docker logs -f zabbix-server

Cuando veas que está creando el esquema/tablas, puede tardar 3-5 minutos.

## Paso 7: Verificar que los contenedores están corriendo

    sudo docker compose ps

Deberías ver los 3 contenedores con STATUS “Up”:

    NAME            IMAGE                                  STATUS
    zabbix-mysql    mysql:8.0                              Up
    zabbix-server   zabbix/zabbix-server-mysql:latest      Up
    zabbix-web      zabbix/zabbix-web-nginx-mysql:latest   Up (healthy)

Problema: contenedor zabbix-server no inicia

Verifica logs:

    sudo docker logs zabbix-server | tail -30

Error 1: “users table is empty”

    cannot use database "zabbix": its "users" table is empty (is this the Zabbix proxy database?)

Causa: BD corrupta o mal inicializada.

Solución:

    # 1. Detener todo
    sudo docker compose down

    # 2. Eliminar volumen de base de datos (borra datos)
    sudo docker volume rm zabbix-docker_zbx-db-data

    # 3. Iniciar de nuevo (recrea la BD limpia)
    sudo docker compose up -d

    # 4. Esperar 3-5 minutos y verificar
    sudo docker compose ps

Error 2: “You do not have the SUPER privilege”

    ERROR 1419 (HY000): You do not have the SUPER privilege and binary logging is enabled

Causa: MySQL necesita permisos especiales para crear triggers.

Solución: En este compose ya se incluye:

    - --log-bin-trust-function-creators=1

Si aún aparece, revisa que el `docker-compose.yml` coincida exactamente con el del Paso 5.

## Paso 8: Acceder al frontend de Zabbix

Abre tu navegador y ve a:

    http://192.168.1.250:8080

O si estás en la misma máquina:

    http://localhost:8080

Deberías ver la pantalla de login de Zabbix.

Problema: no se puede acceder a http://192.168.1.250:8080

1) Verificar que el contenedor web está corriendo:

    sudo docker compose ps

El contenedor `zabbix-web` debe estar “Up (healthy)”.

2) Verificar que el puerto 8080 está escuchando:

    sudo ss -tulnp | grep 8080

Deberías ver `0.0.0.0:8080`.

3) Verificar firewall UFW:

    sudo ufw status

Si UFW está activo y no ves el puerto 8080, ábrelo:

    sudo ufw allow 8080/tcp

4) Ver logs del frontend:

    sudo docker logs zabbix-web | tail -20

5) Probar desde el mismo servidor:

    curl -I http://localhost:8080

Si esto funciona pero desde tu PC no, es problema de red/firewall.

Nota: dominio vs IP local

- En LAN normalmente usas: `http://192.168.1.250:8080`
- Dependiendo del router/ISP, acceder con `http://tu-dominio:8080` desde dentro puede fallar (NAT loopback).

### Credenciales por defecto

    Usuario: Admin
    Contraseña: zabbix

La “A” de Admin es mayúscula.

## Paso 9: Configuración inicial de Zabbix

### 9.1 Cambiar contraseña del Admin

1. Icono de usuario (arriba derecha)
2. **User settings**
3. Pestaña **Password**
4. Cambiar contraseña
5. **Update**

### 9.2 Configurar idioma

1. **User settings**
2. Pestaña **User**
3. **Language** → “Spanish”
4. **Update**

## Paso 10: Monitorear tu servidor Apache

### 10.1 Instalar Zabbix Agent en tu servidor

En tu servidor Ubuntu (SSH):

    sudo apt update
    sudo apt install zabbix-agent -y

### 10.2 Configurar Zabbix Agent

Edita la configuración:

    sudo nano /etc/zabbix/zabbix_agentd.conf

Importante: si el agente está en el host (Ubuntu) y el server está en Docker en la misma máquina, normalmente el agente debe permitir conexiones desde el host o desde la red Docker. Una forma simple es permitir la red Docker.

Obtén la subred Docker del proyecto (opcional pero recomendado):

    sudo docker network inspect zabbix-docker_zabbix-net | grep Subnet -n

O bien obtener la IP del contenedor Zabbix Server (si quieres permitir IP exacta):

    sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' zabbix-server

Ajusta estas líneas en la configuración del agente, por ejemplo:

    # Permitir al servidor Zabbix (red docker del proyecto)
    Server=172.18.0.0/16
    ServerActive=172.18.0.0/16

    # Hostname debe coincidir con el Host en Zabbix (si usas el host por defecto)
    Hostname=Zabbix server

Guarda y aplica:

    sudo systemctl restart zabbix-agent
    sudo systemctl enable zabbix-agent

Verifica:

    sudo systemctl status zabbix-agent

### 10.3 Abrir puerto en firewall

    sudo ufw allow 10050/tcp
    sudo ufw status

### 10.4 Crear/usar Host en Zabbix Frontend

En `http://192.168.1.250:8080`:

- Ve a **Data collection → Hosts**
- Puedes usar el host por defecto “Zabbix server” o crear uno nuevo.
- Si creas uno nuevo, el **Hostname** del host debe coincidir con `Hostname=` del agente.

Ejemplo de interfaz Agent del host:

    Host name: Zabbix server
    Interfaces:
      - Type: Agent
      - IP address: 192.168.1.250
      - Port: 10050

Espera 1-2 minutos: el indicador **ZBX** debería pasar a verde.

## Comandos útiles de Docker

    # Contenedores corriendo
    sudo docker compose ps

    # Logs (últimos eventos)
    sudo docker logs zabbix-server | tail -20

    # Probar acceso web local
    curl -I http://localhost:8080

    # Ver recursos consumidos
    sudo docker stats --no-stream

## Mantenimiento y gestión

### Backup de la base de datos

    # Backup
    sudo docker exec zabbix-mysql mysqldump -u zabbix -pzabbixpassword zabbix > zabbix_backup_$(date +%F).sql

    # Restore
    sudo docker exec -i zabbix-mysql mysql -u zabbix -pzabbixpassword zabbix < zabbix_backup_2025-11-13.sql

### Actualizar Zabbix (imágenes)

    sudo docker compose down
    sudo docker compose pull
    sudo docker compose up -d

### Uso de recursos / espacio

    sudo docker stats
    sudo docker system df -v

## Resumen del ejercicio

- Docker y Docker Compose instalados
- 3 contenedores funcionando (MySQL, Zabbix Server, Zabbix Web)
- Base de datos inicializada correctamente
- Frontend accesible en puerto 8080
- Sistema de monitoreo listo para usar

### Arquitectura final

    ┌─────────────────────────────────────────┐
    │        Navegador (Puerto 8080)          │
    └──────────────────┬──────────────────────┘
                       │
                       ↓
    ┌──────────────────────────────────────────┐
    │     Contenedor: zabbix-web               │
    │     (Frontend Nginx + PHP)               │
    └──────────────┬───────────────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────────────┐
    │     Contenedor: zabbix-server            │
    │     (Recopilación y procesamiento)       │
    └──────────────┬───────────────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────────────┐
    │     Contenedor: zabbix-mysql             │
    │     (Base de datos persistente)          │
    │     Volumen: zbx-db-data                 │
    └──────────────────────────────────────────┘

## Referencias y recursos

- Documentación oficial Zabbix: https://www.zabbix.com/documentation
- Docker Hub - Zabbix: https://hub.docker.com/u/zabbix
- Docker Documentation: https://docs.docker.com/
- Zabbix Community: https://www.zabbix.com/forum/