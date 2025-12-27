---
title: "Ejercicio práctico: Backup de configuración de Apache2 en Ubuntu"
description: "Realizar una copia de seguridad de la configuración de Apache2 utilizando rsync, compresión y automatización mediante cron."
sidebar:
  order: 9
---

Realizar un backup completo y verificable de la configuración de Apache2 ubicada en `/etc/apache2`, utilizando herramientas estándar de sistemas Linux. El ejercicio incluye la instalación de `rsync`, la validación del backup, la compresión del mismo y su automatización mediante `cron`.

---

### Paso 1: Instalación de rsync

Actualizar los repositorios de paquetes e instalar la herramienta `rsync`, que se utilizará para realizar copias de seguridad incrementales y fiables.

    sudo apt update
    sudo apt install rsync -y

Verificar que la instalación se haya realizado correctamente:

    rsync --version

---

### Paso 2: Preparar el directorio de backup

Crear un directorio específico donde se almacenarán las copias de seguridad de Apache2. En este ejercicio se utilizará `/backup/apache2`.

    sudo mkdir -p /backup/apache2
    sudo chown root:root /backup/apache2
    sudo chmod 700 /backup/apache2

---

### Paso 3: Realizar el backup de la configuración de Apache2

Ejecutar `rsync` para copiar de forma recursiva y preservando permisos todo el contenido del directorio `/etc/apache2`.

    sudo rsync -av /etc/apache2/ /backup/apache2/

Parámetros utilizados:
- `-a`: modo archivo (preserva permisos, enlaces simbólicos, fechas).
- `-v`: salida detallada del proceso.

---

### Paso 4: Verificar que el backup se ha realizado correctamente

Comprobar que el contenido del directorio de backup coincide con el original:

    ls /backup/apache2
    ls /etc/apache2

Verificar que existen archivos clave como:

- `apache2.conf`
- `ports.conf`
- `sites-available/`
- `sites-enabled/`

También se puede verificar el tamaño aproximado:

    sudo du -sh /etc/apache2
    sudo du -sh /backup/apache2

---

### Paso 5: Comprimir el backup en un archivo `.tar.gz`

Crear un archivo comprimido del backup para facilitar su almacenamiento o traslado.

    sudo tar -czvf /backup/apache2_backup_$(date +%F).tar.gz -C /backup apache2

Esto generará un archivo con nombre basado en la fecha actual, por ejemplo:

    apache2_backup_2025-01-15.tar.gz

Verificar el archivo comprimido:

    ls -lh /backup/*.tar.gz

---

### Paso 6: Automatizar el backup usando cron

Editar el crontab del usuario root para programar el backup automático.

    sudo crontab -e

Añadir la siguiente línea para ejecutar el backup diariamente a las 02:00 de la madrugada:

    0 2 * * * rsync -av /etc/apache2/ /backup/apache2/ && tar -czf /backup/apache2_backup_$(date +\%F).tar.gz -C /backup apache2

Guardar y cerrar el editor.

Verificar que la tarea está programada correctamente:

    sudo crontab -l

---

### Paso 7: Verificación de la automatización

Comprobar que cron está activo:

    sudo systemctl status cron

Opcionalmente, se puede forzar la ejecución manual del comando para validar que no existen errores.

---

### Resultado esperado

Al finalizar el ejercicio se dispone de:

- Un backup funcional del directorio `/etc/apache2`.
- Un archivo comprimido `.tar.gz` con la configuración.
- Un proceso automático diario de backup mediante `cron`.
- Una base sólida para aplicar políticas de backup en servicios críticos.

Este procedimiento es aplicable a otros servicios del sistema siguiendo la misma metodología.