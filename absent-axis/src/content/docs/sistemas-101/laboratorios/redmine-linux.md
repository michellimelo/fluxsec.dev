---
title: "Instalación de Redmine en Linux (Ubuntu/Debian)"
description: "Guía práctica paso a paso para instalar y configurar Redmine en un servidor Linux Ubuntu/Debian"
sidebar:
  order: 14
---

Instalar y dejar operativo **Redmine**, una herramienta de gestión de proyectos y seguimiento de incidencias, sobre un servidor Linux basado en **Ubuntu/Debian**, utilizando una arquitectura clásica **Redmine + Apache + MariaDB + Ruby**.

Al finalizar el ejercicio tendrás:
- Redmine funcionando vía navegador web  
- Base de datos configurada correctamente  
- Entorno Ruby preparado  
- Servicio listo para uso en producción o laboratorio  

**Tiempo estimado:** 60–90 minutos

---

## ¿Qué es Redmine?

Redmine es una aplicación web open-source escrita en Ruby on Rails que permite:
- Gestión de proyectos
- Seguimiento de tareas e incidencias
- Control de tiempos
- Gestión de usuarios y roles
- Integración con repositorios (Git, SVN, etc.)

Es muy utilizada en entornos técnicos, IT y de desarrollo.

---

## Arquitectura que vamos a montar

Redmine no es un servicio único, sino un conjunto de componentes:

| Componente | Función |
|------------|--------|
| Redmine | Aplicación web (Ruby on Rails) |
| Apache | Servidor web |
| MariaDB | Base de datos |
| Ruby | Lenguaje de ejecución |
| Bundler | Gestor de dependencias Ruby |

---

## Requisitos previos

Antes de comenzar, asegúrate de cumplir:

- Sistema Ubuntu Server o Debian actualizado
- Acceso SSH al servidor
- Usuario con permisos `sudo`
- Conexión a Internet
- Al menos 2 GB de RAM recomendados

---

## Paso 1: Actualizar el sistema

Siempre comenzamos con el sistema actualizado.

    sudo apt update
    sudo apt upgrade -y

---

## Paso 2: Instalar dependencias básicas

Redmine necesita varias librerías y herramientas de compilación.

    sudo apt install -y \
      build-essential \
      libssl-dev \
      libyaml-dev \
      libreadline-dev \
      zlib1g-dev \
      libgdbm-dev \
      libncurses5-dev \
      libffi-dev \
      libgmp-dev \
      imagemagick \
      libmagickwand-dev \
      curl \
      git

---

## Paso 3: Instalar y configurar MariaDB

### 3.1 Instalar MariaDB

    sudo apt install mariadb-server mariadb-client -y

### 3.2 Asegurar la base de datos

    sudo mysql_secure_installation

Recomendaciones:
- Establecer contraseña de root
- Eliminar usuarios anónimos
- Desactivar login remoto de root
- Eliminar base de datos de test

---

### 3.3 Crear base de datos para Redmine

Accede a MariaDB:

    sudo mysql -u root -p

Dentro del prompt de MariaDB:

    CREATE DATABASE redmine CHARACTER SET utf8mb4;
    CREATE USER 'redmine'@'localhost' IDENTIFIED BY 'redmine_password';
    GRANT ALL PRIVILEGES ON redmine.* TO 'redmine'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;

---

## Paso 4: Instalar Ruby

Redmine requiere Ruby. Usaremos la versión disponible en repositorios.

    sudo apt install ruby-full ruby-dev -y

Verifica la instalación:

    ruby -v

---

## Paso 5: Instalar Bundler

Bundler gestiona las dependencias Ruby de Redmine.

    sudo gem install bundler

Verificar:

    bundler -v

---

## Paso 6: Descargar Redmine

### 6.1 Crear directorio de trabajo

    sudo mkdir -p /opt/redmine
    sudo chown -R $USER:$USER /opt/redmine
    cd /opt/redmine

---

### 6.2 Descargar Redmine

    wget https://www.redmine.org/releases/redmine-5.1.3.tar.gz
    tar xzf redmine-5.1.3.tar.gz
    mv redmine-5.1.3 redmine

---

## Paso 7: Configurar la base de datos de Redmine

### 7.1 Crear archivo database.yml

    cd /opt/redmine/redmine
    cp config/database.yml.example config/database.yml
    nano config/database.yml

Contenido recomendado:

    production:
      adapter: mysql2
      database: redmine
      host: localhost
      username: redmine
      password: "redmine_password"
      encoding: utf8mb4

Guarda el archivo.

---

## Paso 8: Instalar dependencias de Redmine

Desde el directorio de Redmine:

    cd /opt/redmine/redmine

Ejecuta:

    bundle install --without development test

Este proceso puede tardar varios minutos.

---

## Paso 9: Generar claves y preparar la base de datos

### 9.1 Generar clave secreta

    bundle exec rake generate_secret_token

---

### 9.2 Crear estructura de base de datos

    RAILS_ENV=production bundle exec rake db:migrate

---

### 9.3 Cargar datos iniciales

    RAILS_ENV=production bundle exec rake redmine:load_default_data

Selecciona el idioma (por ejemplo `es`).

---

## Paso 10: Configurar permisos

    sudo chown -R www-data:www-data files log tmp public/plugin_assets
    sudo chmod -R 755 files log tmp public/plugin_assets

---

## Paso 11: Instalar y configurar Apache

### 11.1 Instalar Apache y Passenger

    sudo apt install apache2 libapache2-mod-passenger -y

---

### 11.2 Configurar VirtualHost

Crea el archivo:

    sudo nano /etc/apache2/sites-available/redmine.conf

Contenido:

    <VirtualHost *:80>
        ServerName redmine.local
        DocumentRoot /opt/redmine/redmine/public

        <Directory /opt/redmine/redmine/public>
            Require all granted
            AllowOverride all
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/redmine_error.log
        CustomLog ${APACHE_LOG_DIR}/redmine_access.log combined
    </VirtualHost>

---

### 11.3 Habilitar sitio y módulos

    sudo a2enmod passenger
    sudo a2ensite redmine
    sudo a2dissite 000-default.conf
    sudo systemctl reload apache2

---

## Paso 12: Acceder a Redmine

Desde el navegador:

    http://IP_DEL_SERVIDOR/

Credenciales por defecto:

| Usuario | Contraseña |
|-------|------------|
| admin | admin |

**Importante:** cambia la contraseña tras el primer acceso.

---

## Paso 13: Verificaciones finales

Comprueba:
- La web carga correctamente
- Puedes iniciar sesión
- Puedes crear proyectos y usuarios
- No hay errores en `/var/log/apache2/redmine_error.log`

---

## Problemas comunes

### Error de permisos
Solución:

    sudo chown -R www-data:www-data /opt/redmine/redmine

---

### Error de gemas
Solución:

    bundle install --without development test

---

### Apache no arranca
Verifica:

    sudo apachectl configtest

---

## Resultado final

Redmine queda instalado y operativo como:
- Herramienta de gestión de proyectos
- Plataforma de seguimiento de tareas
- Base para equipos técnicos o de desarrollo

---

## Próximos pasos recomendados

- Configurar HTTPS con Let's Encrypt
- Crear usuarios y roles
- Integrar repositorios Git
- Ajustar notificaciones por correo
- Personalizar apariencia y plugins