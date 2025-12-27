---
title: "Servidor Web Apache"
description: "Instalación y configuración de Apache HTTP Server"
sidebar:
  order: 4
---

Apache es uno de los servidores web más populares del mundo. En este capítulo instalaremos Apache, crearemos nuestra primera página web y configuraremos un VirtualHost personalizado.

**Tiempo estimado:** 30-40 minutos

**¿Qué es Apache?**  
Apache HTTP Server es un software de código abierto que sirve páginas web. Cuando alguien visita tu dominio, Apache entrega los archivos HTML, CSS, imágenes, etc.

## Paso 1: Instalación de Apache

### 1.1 Instalar Apache2

Instalamos el paquete Apache2:

    sudo apt install apache2 -y

La instalación debería tardar 1-2 minutos.

### 1.2 Verificar estado del servicio

Comprueba que Apache se ha instalado y está corriendo:

    sudo systemctl status apache2

Deberías ver:

    ● apache2.service - The Apache HTTP Server
         Loaded: loaded (/lib/systemd/system/apache2.service; enabled)
         Active: active (running) since ...

Si ves **"active (running)"**, Apache está funcionando correctamente.

### 1.3 Habilitar Apache al inicio

Asegúrate de que Apache arranque automáticamente al reiniciar:

    sudo systemctl enable apache2

## Paso 2: Verificar instalación

### 2.1 Verificar desde el servidor

Prueba que Apache responde localmente:

    curl http://localhost

Deberías ver código HTML de la página por defecto de Apache.

### 2.2 Verificar desde tu PC

Desde tu navegador en Windows, accede a la IP de tu VM:

    http://192.168.1.250

(Reemplaza con la IP de tu servidor)

Deberías ver la página por defecto de Apache que dice  
**"Apache2 Ubuntu Default Page - It works!"**

## Paso 3: Estructura de directorios de Apache

### Directorios importantes

    /var/www/html/                  → Directorio web por defecto
    /etc/apache2/                   → Configuración principal
    /etc/apache2/sites-available/   → Sitios disponibles
    /etc/apache2/sites-enabled/     → Sitios activos
    /var/log/apache2/               → Logs (access.log, error.log)

### Archivos clave

- **/etc/apache2/apache2.conf** – Configuración principal  
- **/etc/apache2/ports.conf** – Configuración de puertos  
- **/etc/apache2/sites-available/000-default.conf** – VirtualHost por defecto  

## Paso 4: Crear tu sitio web

### 4.1 Crear directorio para tu sitio

Vamos a crear un directorio específico para tu sitio web:

    sudo mkdir -p /var/www/biotonic

### 4.2 Asignar permisos correctos

Cambia el propietario del directorio al usuario de Apache:

    sudo chown -R www-data:www-data /var/www/biotonic

Ajusta los permisos:

    sudo chmod -R 755 /var/www/biotonic

**Sobre permisos:**

- **www-data:** usuario que ejecuta Apache  
- **755:** lectura y ejecución para todos, escritura solo para el propietario  

### 4.3 Crear página HTML

Crea tu primera página web:

    sudo nano /var/www/biotonic/index.html

Pega este contenido:

    ¡Bienvenido a Biotonic!
    Esta es mi primera web publicada en Internet.

    Proyecto de Ciberseguridad
    Curso: KeeCoding
    Estudiante: Michelli Melo
    Objetivo: Publicar servidor web con Apache + SSL

    Tecnologías Utilizadas
    - Ubuntu Server 24.04 LTS
    - Apache HTTP Server
    - DuckDNS (DNS Dinámico)
    - Cloudflare Tunnel

    Servidor funcionando correctamente

Guarda el archivo: **Ctrl+O**, Enter, **Ctrl+X**

## Paso 5: Configurar VirtualHost

**¿Qué es un VirtualHost?**  
Un VirtualHost permite que Apache sirva múltiples sitios web desde el mismo servidor. Cada VirtualHost tiene su propia configuración independiente.

### 5.1 Crear archivo de configuración

Crea un nuevo archivo de configuración para tu sitio:

    sudo nano /etc/apache2/sites-available/biotonic.conf

Pega esta configuración:

    <VirtualHost *:80>
        ServerName biotonic.duckdns.org
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/biotonic

        ErrorLog ${APACHE_LOG_DIR}/biotonic-error.log
        CustomLog ${APACHE_LOG_DIR}/biotonic-access.log combined

        <Directory /var/www/biotonic>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>
    </VirtualHost>

**Explicación de las directivas:**

- **ServerName:** nombre de dominio  
- **DocumentRoot:** carpeta donde están tus archivos web  
- **ErrorLog / CustomLog:** archivos de registro  
- **Directory:** permisos y opciones del directorio  

Guarda: **Ctrl+O**, Enter, **Ctrl+X**

### 5.2 Activar el sitio

    sudo a2ensite biotonic.conf

### 5.3 Desactivar sitio por defecto (opcional)

    sudo a2dissite 000-default.conf

### 5.4 Verificar configuración

    sudo apache2ctl configtest

Deberías ver:

    Syntax OK

Si ves algún error, revisa la configuración del VirtualHost antes de continuar.

### 5.5 Recargar Apache

    sudo systemctl reload apache2

## Paso 6: Verificar tu sitio

### 6.1 Probar localmente

    curl http://localhost

Deberías ver el HTML de tu página personalizada.

### 6.2 Probar desde tu navegador

Accede desde Windows a:

    http://192.168.1.250

Deberías ver tu página personalizada con el diseño verde y toda la información.

## Comandos útiles de Apache

### Gestión del servicio

    sudo systemctl status apache2
    sudo systemctl start apache2
    sudo systemctl stop apache2
    sudo systemctl restart apache2
    sudo systemctl reload apache2

### Gestión de sitios

    sudo a2ensite nombre-sitio.conf
    sudo a2dissite nombre-sitio.conf
    ls /etc/apache2/sites-available/
    ls /etc/apache2/sites-enabled/

### Gestión de módulos

    sudo a2enmod nombre-modulo
    sudo a2dismod nombre-modulo
    apache2ctl -M

### Logs y diagnóstico

    sudo tail -f /var/log/apache2/error.log
    sudo tail -f /var/log/apache2/access.log
    sudo tail -f /var/log/apache2/biotonic-error.log
    sudo apache2ctl configtest
    sudo apache2ctl -S

## Módulos útiles de Apache

### Activar mod_rewrite

    sudo a2enmod rewrite
    sudo systemctl reload apache2

### Activar mod_ssl

    sudo a2enmod ssl
    sudo systemctl reload apache2

### Activar mod_headers

    sudo a2enmod headers
    sudo systemctl reload apache2

## Mejores prácticas de seguridad

### Ocultar versión de Apache

    sudo nano /etc/apache2/conf-available/security.conf

Modificar:

    ServerTokens Prod
    ServerSignature Off

### Deshabilitar listado de directorios

Asegúrate de no incluir `Indexes` en Options:

    Options FollowSymLinks

### Limitar métodos HTTP

    <Directory /var/www/biotonic>
        <LimitExcept GET POST HEAD>
            Deny from all
        </LimitExcept>
    </Directory>

## Solución de problemas Apache

### Apache no arranca

    sudo journalctl -xeu apache2
    sudo apache2ctl configtest
    sudo ss -tulpn | grep :80

### Error 403 Forbidden

    ls -la /var/www/biotonic

Verificar:
- Propietario www-data
- Directiva `Require all granted`

### Error 404 Not Found

- Verificar que existe `index.html`
- Verificar `DocumentRoot`
- Verificar sitio activo en `/etc/apache2/sites-enabled/`

### Cambios no se aplican

    sudo systemctl reload apache2

Limpiar caché del navegador y verificar el archivo editado.

## Verificación final

    sudo systemctl status apache2
    ls -la /etc/apache2/sites-enabled/
    ls -la /var/www/biotonic/
    curl -I http://localhost
    sudo tail -20 /var/log/apache2/access.log

Apache está instalado, configurado y sirviendo tu página personalizada.
