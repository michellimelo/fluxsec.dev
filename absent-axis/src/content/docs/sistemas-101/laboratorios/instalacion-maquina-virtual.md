---
title: "Instalación de máquina virtual"
description: "Guía práctica para instalar y configurar una máquina virtual (VM) con Ubuntu Server 24.04 LTS usando VirtualBox, con verificaciones post-instalación y siguientes pasos hacia la configuración de red."
sidebar:
  order: 1
---

En esta sección aprenderás a instalar y configurar una máquina virtual (VM) con Ubuntu Server 24.04 LTS usando VirtualBox. La máquina virtual actuará como tu servidor web.

**Tiempo estimado:** 30-45 minutos

> **Nota: ¿Qué es una máquina virtual?**  
> Una máquina virtual es un ordenador simulado que funciona dentro de tu ordenador físico. Permite ejecutar sistemas operativos de forma aislada y segura sin afectar tu sistema principal.

## Requisitos previos

### Hardware mínimo

- **CPU:** Procesador de 64 bits con soporte de virtualización (Intel VT-x / AMD-V)
- **RAM:** 4GB mínimo (8GB recomendado)
- **Disco:** 20GB de espacio libre

### Software necesario

- **VirtualBox:** Versión 7.0 o superior
- **Ubuntu Server:** ISO 24.04 LTS

## Paso 1: Descargar VirtualBox

VirtualBox es un software gratuito de virtualización que nos permite crear y ejecutar máquinas virtuales.

1. Visita **https://www.virtualbox.org/**
2. Haz clic en **"Downloads"**
3. Descarga la versión correspondiente a tu sistema operativo:
   - Windows hosts
   - macOS hosts
   - Linux distributions
4. Ejecuta el instalador y sigue las instrucciones (instalación típica)

> **Advertencia:** Durante la instalación de VirtualBox, puede que se reinicie tu conexión de red temporalmente. Cierra aplicaciones importantes antes de continuar.

## Paso 2: Descargar Ubuntu Server

Ubuntu Server es la versión optimizada de Ubuntu para servidores, sin interfaz gráfica.

1. Visita **https://ubuntu.com/download/server**
2. Descarga **Ubuntu Server 24.04 LTS** (archivo .iso de ~2.5GB)
3. Guarda el archivo en una ubicación que recuerdes (por ejemplo: Descargas)

> **Nota: ¿Por qué LTS?**  
> LTS significa "Long Term Support" (Soporte a Largo Plazo). Estas versiones reciben actualizaciones de seguridad durante 5 años, siendo más estables y confiables para servidores.

## Paso 3: Crear la máquina virtual

Ahora vamos a crear la máquina virtual en VirtualBox.

### 3.1 Iniciar VirtualBox

1. Abre VirtualBox desde tu menú de aplicaciones
2. Haz clic en el botón **"Nueva"** (o "New") en la barra superior

### 3.2 Configuración básica

Se abrirá un asistente. Completa los siguientes campos:

    Nombre: ubuntu-server
    Carpeta de máquina: [dejar por defecto]
    ISO Image: [seleccionar el archivo .iso de Ubuntu descargado]
    Tipo: Linux
    Versión: Ubuntu (64-bit)

> **Nota:** Marca la opción "Skip Unattended Installation" para tener control total del proceso de instalación.

Haz clic en **"Siguiente"**.

### 3.3 Asignar recursos

**Memoria RAM:**

    RAM: 2048 MB (2GB mínimo)
    Recomendado: 4096 MB (4GB) si dispones de suficiente RAM

**Procesadores:**

    CPUs: 2 núcleos

> **Advertencia:** No asignes más del 50% de tu RAM total ni más del 50% de tus núcleos de CPU. Tu sistema anfitrión también necesita recursos.

Haz clic en **"Siguiente"**.

### 3.4 Configurar disco duro virtual

Selecciona las siguientes opciones:

- **Crear un disco duro virtual ahora**
- **Tamaño:** 25 GB mínimo (30 GB recomendado)
- **Tipo:** VDI (VirtualBox Disk Image)
- **Almacenamiento:** Reservado dinámicamente

> **Nota: Reservado dinámicamente vs Pre-asignado**  
> "Reservado dinámicamente" significa que el disco solo ocupará espacio real según lo vayas usando. "Pre-asignado" reserva todo el espacio de inmediato, siendo más rápido pero ocupando más espacio en tu disco físico.

Haz clic en **"Finalizar"**.

## Paso 4: Instalar Ubuntu Server

Con la máquina virtual creada, ahora instalaremos el sistema operativo.

### 4.1 Iniciar la instalación

1. Selecciona tu VM "ubuntu-server" en VirtualBox
2. Haz clic en el botón **"Iniciar"** (flecha verde)
3. La VM arrancará desde el ISO de Ubuntu

### 4.2 Proceso de instalación

**Paso 1: Idioma**

    Selecciona: English (recomendado para evitar problemas de caracteres)
    Presiona Enter

**Paso 2: Actualizar instalador (opcional)**

    Selecciona: Continue without updating

**Paso 3: Configuración de teclado**

    Layout: Spanish
    Variant: Spanish
    Presiona Done

**Paso 4: Tipo de instalación**

    Selecciona: Ubuntu Server (default)
    Presiona Done

**Paso 5: Configuración de red**

> **Nota:** Por ahora, acepta la configuración de red por defecto (DHCP). La configuraremos en detalle en el siguiente capítulo.

    Deja la configuración por defecto
    Presiona Done

**Paso 6: Proxy**

    Deja vacío (a menos que tu red requiera proxy)
    Presiona Done

**Paso 7: Mirror de Ubuntu**

    Deja el mirror por defecto
    Presiona Done

**Paso 8: Configuración de disco**

    Selecciona: Use an entire disk
    Disco: VBOX HARDDISK (el que creaste)
    [✓] Set up this disk as an LVM group
    Presiona Done

> **Advertencia:** Te mostrará un resumen del particionado. Verifica que todo sea correcto y presiona **Continue** para confirmar.

**Paso 9: Perfil de usuario**

Aquí configurarás tu usuario administrador. Ejemplo:

    Your name: Michelli
    Your server's name: ubuntu-server
    Pick a username: melux
    Choose a password: [contraseña segura]
    Confirm your password: [repetir contraseña]

> **Advertencia:** Anota tu usuario y contraseña. Los necesitarás para acceder al servidor.

Presiona **Done**.

**Paso 10: Configuración SSH**

    [✓] Install OpenSSH server
    Presiona Done

> **Nota: ¿Qué es SSH?**  
> SSH (Secure Shell) te permite conectarte remotamente a tu servidor de forma segura desde tu terminal.

**Paso 11: Paquetes adicionales (Featured Server Snaps)**

    No selecciones nada por ahora
    Presiona Done

**Paso 12: Instalación**

La instalación comenzará automáticamente. Este proceso puede tardar 10-15 minutos.

> **Correcto:** Cuando veas el mensaje "Installation complete!", presiona **Reboot Now**.

### 4.3 Primer arranque

Después del reinicio:

1. Verás una pantalla de login
2. Ingresa tu **username** (ejemplo: melux)
3. Presiona Enter
4. Ingresa tu **password**
5. Presiona Enter

> **Correcto:** Has instalado exitosamente Ubuntu Server en tu máquina virtual. Ahora deberías ver el prompt de comandos de tu servidor.

## Verificación post-instalación

Ejecuta los siguientes comandos para verificar que todo funciona correctamente:

### Verificar versión de Ubuntu

    lsb_release -a

Deberías ver información sobre Ubuntu 24.04 LTS.

### Verificar conectividad de red

    ip addr show

Deberías ver una dirección IP asignada (probablemente en el rango 10.0.2.x).

### Verificar conexión a Internet

    ping -c 4 google.com

Deberías recibir 4 respuestas exitosas.

> **Correcto:** Si todos los comandos funcionan correctamente, tu instalación está completa y lista para continuar con la configuración de red.

## Comandos útiles de VirtualBox

### Atajos de teclado

- **Host Key + F:** Modo pantalla completa
- **Host Key + C:** Modo escalado
- **Host Key:** Generalmente es la tecla Ctrl derecha

### Gestión de la VM

- **Apagar correctamente:** Desde Ubuntu ejecuta `sudo shutdown now`
- **Guardar estado:** Menú Máquina → Cerrar → Guardar estado
- **Apagado forzado:** Menú Máquina → Cerrar → Apagar (solo en emergencias)

## Próximos pasos

Ahora que tienes tu máquina virtual instalada, el siguiente paso es configurar la red en modo bridge para que tu servidor sea accesible desde tu red local.

[Siguiente: Configuración de red →](configuracion-red)

