---
title: "Actualización de Paquetes & SSH"
description: "Preparar el sistema y configurar acceso remoto seguro"
sidebar:
  order: 3
---

En este capítulo actualizaremos todos los paquetes del sistema para tener las últimas versiones de seguridad y configuraremos SSH para poder acceder remotamente a tu servidor desde tu PC Windows.

**Tiempo estimado:** 20-30 minutos

**¿Por qué actualizar primero?**  
Las actualizaciones incluyen parches de seguridad críticos, correcciones de bugs y mejoras de rendimiento. Es esencial actualizar antes de instalar servicios.

## Parte 1: Actualización del Sistema

### Paso 1.1: Actualizar Lista de Paquetes

El primer comando actualiza la lista de paquetes disponibles desde los repositorios de Ubuntu:

    sudo apt update

**¿Qué hace este comando?**  
`apt update` descarga la información de los paquetes disponibles pero NO instala nada todavía. Solo actualiza el índice de paquetes.

Deberías ver algo como:

    Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
    Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
    ...
    Fetched 4,256 kB in 3s (1,234 kB/s)
    Reading package lists... Done
    Building dependency tree... Done

### Paso 1.2: Actualizar Paquetes Instalados

Ahora actualizamos todos los paquetes que tienen nuevas versiones disponibles:

    sudo apt upgrade -y

**Sobre el parámetro -y:**  
El flag `-y` responde automáticamente "yes" a todas las preguntas. Sin él, tendrías que confirmar manualmente cada actualización.

Este proceso puede tardar 5-10 minutos dependiendo de cuántos paquetes necesiten actualización.

### Paso 1.3: Actualización Completa (Opcional)

Para una actualización más completa que también maneja dependencias:

    sudo apt full-upgrade -y

**Diferencia upgrade vs full-upgrade:**

- `upgrade`: Actualiza paquetes sin eliminar ninguno
- `full-upgrade`: Puede eliminar paquetes obsoletos si es necesario

### Paso 1.4: Limpiar Paquetes Innecesarios

Después de actualizar, limpia paquetes que ya no se necesitan:

    sudo apt autoremove -y

Y limpia la caché de paquetes descargados:

    sudo apt clean

### Paso 1.5: Reiniciar (Si es Necesario)

Si se actualizó el kernel, necesitarás reiniciar. Verifica si es necesario:

    ls /var/run/reboot-required

Si el archivo existe, reinicia:

    sudo reboot

Espera unos minutos y vuelve a iniciar sesión.

**Sistema Actualizado**  
Tu sistema Ubuntu ahora tiene todos los paquetes actualizados con las últimas versiones de seguridad.

## Parte 2: Configuración de SSH

**¿Qué es SSH?**  
SSH (Secure Shell) es un protocolo que permite conectarte de forma segura a tu servidor desde otro ordenador. Todos los datos viajan encriptados.

### Paso 2.1: Verificar Instalación de SSH

Durante la instalación de Ubuntu, ya instalaste OpenSSH Server. Vamos a verificar que esté activo:

    sudo systemctl status ssh

Deberías ver:

    ● ssh.service - OpenBSD Secure Shell server
         Loaded: loaded (/lib/systemd/system/ssh.service; enabled)
         Active: active (running) since ...

Si ves **"active (running)"**, SSH está funcionando correctamente.

### Paso 2.2: Si SSH No Está Instalado

Si por alguna razón SSH no está instalado, instálalo:

    sudo apt install openssh-server -y

Habilita el servicio para que arranque automáticamente:

    sudo systemctl enable ssh
    sudo systemctl start ssh

### Paso 2.3: Verificar Puerto SSH

SSH por defecto usa el puerto 22. Verifica que esté escuchando:

    sudo ss -tulpn | grep :22

Deberías ver algo como:

    tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*    users:(("sshd",pid=1234,fd=3))

### Paso 2.4: Obtener tu IP para SSH

Necesitas saber la IP de tu VM para conectarte desde tu PC:

    ip addr show | grep inet

Busca tu IP local (ejemplo: 192.168.1.250).

## Parte 3: Conectarse por SSH desde Windows

### Paso 3.1: Abrir PowerShell en Windows

1. En tu PC Windows, presiona **Windows + X**
2. Selecciona **Windows PowerShell** o **Terminal**

### Paso 3.2: Conectarse al Servidor

Usa este comando (reemplaza con tu usuario e IP):

    ssh usuario@192.168.1.250

Ejemplo con usuario "melux":

    ssh melux@192.168.1.250

### Paso 3.3: Primera Conexión

La primera vez que te conectas, verás un mensaje como este:

    The authenticity of host '192.168.1.250' can't be established.
    ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxx
    Are you sure you want to continue connecting (yes/no)?

Escribe **yes** y presiona Enter.

Luego te pedirá tu contraseña:

    melux@192.168.1.250's password:

Escribe tu contraseña (no se verá mientras escribes) y presiona Enter.

**Conectado**  
Si todo funciona, verás el prompt de tu servidor Ubuntu. Ahora estás trabajando remotamente desde tu PC Windows.

## Configuración de Seguridad SSH (Recomendado)

### Paso 4.1: Editar Configuración SSH

Vamos a mejorar la seguridad de SSH editando su archivo de configuración:

    sudo nano /etc/ssh/sshd_config

### Paso 4.2: Configuraciones Recomendadas

Busca y modifica estas líneas (usa Ctrl+W para buscar):

    # Deshabilitar login de root por SSH (seguridad)
    PermitRootLogin no

    # Usar solo autenticación por contraseña por ahora
    PasswordAuthentication yes

    # Opcional: Cambiar puerto por defecto (ej: 2222)
    # Port 22

    # Número máximo de intentos de autenticación
    MaxAuthTries 3

    # Tiempo máximo para completar login
    LoginGraceTime 30

**Importante:**  
Si cambias el puerto, recuerda usar el nuevo puerto al conectarte:

    ssh -p 2222 usuario@ip

Guarda los cambios: **Ctrl+O**, Enter, **Ctrl+X**

### Paso 4.3: Reiniciar Servicio SSH

Para aplicar los cambios:

    sudo systemctl restart ssh

Verifica que siga funcionando:

    sudo systemctl status ssh

## Autenticación con Clave SSH (Avanzado - Opcional)

**Autenticación con clave vs contraseña**  
Las claves SSH son más seguras que las contraseñas porque son prácticamente imposibles de adivinar. Esta sección es opcional pero muy recomendada.

### Paso 5.1: Generar Par de Claves (Desde Windows)

En tu PC Windows (PowerShell):

    ssh-keygen -t ed25519 -C "tu_email@ejemplo.com"

Presiona Enter para aceptar la ubicación por defecto. Opcionalmente, crea una passphrase para mayor seguridad.

### Paso 5.2: Copiar Clave Pública al Servidor

Copia tu clave pública al servidor:

    type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh melux@192.168.1.250 "cat >> ~/.ssh/authorized_keys"

### Paso 5.3: Ajustar Permisos (En el Servidor)

Conecta por SSH y ejecuta:

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys

### Paso 5.4: Deshabilitar Autenticación por Contraseña (Opcional)

Una vez que confirmes que las claves funcionan, puedes deshabilitar contraseñas:

    sudo nano /etc/ssh/sshd_config

Cambia:

    PasswordAuthentication no

Reinicia SSH:

    sudo systemctl restart ssh

**Advertencia:**  
Asegúrate de que las claves funcionen ANTES de deshabilitar contraseñas. Si no, perderás acceso al servidor.

## Comandos Útiles de Mantenimiento

### Actualización Regular

    sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

### Ver Espacio en Disco

    df -h

### Ver Uso de Memoria

    free -h

### Ver Procesos Activos

    top

(Presiona `q` para salir)

### Ver Logs del Sistema

    sudo journalctl -n 50

## Solución de Problemas SSH

### No puedo conectarme por SSH

- Verifica que SSH esté corriendo: `sudo systemctl status ssh`
- Verifica tu IP: `ip addr show`
- Prueba ping desde Windows: `ping 192.168.1.250`
- Verifica el firewall (lo veremos en el próximo capítulo)

### Connection refused

- SSH no está corriendo: `sudo systemctl start ssh`
- Puerto incorrecto: Verifica el puerto en `/etc/ssh/sshd_config`
- Firewall bloqueando: Verifica reglas UFW

### Permission denied

- Contraseña incorrecta
- Usuario no existe en el servidor
- Permisos incorrectos en `~/.ssh/authorized_keys`

### Connection timed out

- IP incorrecta
- Servidor apagado
- Problema de red (verifica modo bridge en VirtualBox)
- Firewall del router bloqueando

## Resumen y Verificación Final

Ejecuta estos comandos para verificar que todo está correctamente configurado:

    # Ver versión de Ubuntu
    lsb_release -a

    # Ver servicios activos
    systemctl list-units --type=service --state=running | grep ssh

    # Ver última actualización
    ls -la /var/lib/apt/periodic/

    # Ver espacio disponible
    df -h /

**Sistema Preparado**  
Tu servidor Ubuntu está actualizado y configurado con SSH. Ahora puedes trabajar remotamente desde tu PC Windows de forma segura.
