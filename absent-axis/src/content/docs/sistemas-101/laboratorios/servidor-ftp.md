---
title: "Ejercicio práctico: Instalación de un servidor FTP en Ubuntu"
description: "Instalación y configuración básica de un servidor FTP usando vsftpd en Ubuntu, incluyendo seguridad y acceso de usuarios."
sidebar:
  order: 13
---

Instalar y configurar un servidor FTP funcional en un sistema Ubuntu utilizando **vsftpd**, asegurando una configuración básica segura, control de acceso mediante usuarios locales y verificación del servicio.

---

### Paso 1: Actualizar los repositorios del sistema

Antes de instalar cualquier paquete, se actualiza la lista de repositorios para asegurar que se instalen las versiones más recientes disponibles.

    sudo apt update

---

### Paso 2: Instalar el servidor FTP (vsftpd)

Instalar el paquete `vsftpd`, uno de los servidores FTP más utilizados y seguros en entornos Linux.

    sudo apt install vsftpd -y

Verificar que el servicio se haya instalado correctamente:

    systemctl status vsftpd

---

### Paso 3: Realizar copia de seguridad de la configuración original

Antes de modificar la configuración, es una buena práctica guardar una copia del archivo original.

    sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak

---

### Paso 4: Configurar vsftpd

Editar el archivo de configuración principal del servidor FTP.

    sudo nano /etc/vsftpd.conf

Dentro del archivo, verificar o modificar las siguientes directivas:

- Deshabilitar acceso anónimo:

    anonymous_enable=NO

- Permitir acceso a usuarios locales del sistema:

    local_enable=YES

- Permitir escritura en el servidor (opcional, según el ejercicio):

    write_enable=YES

Guardar los cambios y cerrar el editor.

---

### Paso 5: Reiniciar el servicio vsftpd

Aplicar los cambios realizados reiniciando el servicio.

    sudo systemctl restart vsftpd

Verificar que el servicio esté activo:

    sudo systemctl status vsftpd

---

### Paso 6: Abrir puertos en el firewall (si aplica)

Si el sistema tiene UFW activo, permitir el tráfico FTP por el puerto 21.

    sudo ufw allow 21/tcp
    sudo ufw reload
    sudo ufw status

---

### Paso 7: Configuración de usuarios y permisos (opcional)

El acceso FTP se realiza mediante usuarios locales del sistema. Si es necesario, se puede crear un usuario específico para FTP:

    sudo adduser usuarioftp

Los permisos de acceso dependerán de los permisos del directorio personal del usuario.

---

### Paso 8: Conectar al servidor FTP

Desde un cliente FTP (por ejemplo, FileZilla), configurar la conexión con los siguientes datos:

- **Servidor / Host:** IP del servidor Ubuntu
- **Protocolo:** FTP
- **Puerto:** 21
- **Usuario:** usuario del sistema
- **Contraseña:** contraseña del usuario

Al conectarse correctamente, el usuario podrá navegar por su directorio asignado y, si está habilitado, subir o descargar archivos.

---

### Resultado esperado

Al finalizar el ejercicio se dispone de:

- Un servidor FTP operativo en Ubuntu.
- Acceso restringido a usuarios locales.
- Acceso anónimo deshabilitado.
- Posibilidad de transferencia de archivos mediante un cliente FTP gráfico o por línea de comandos.

Este servidor puede utilizarse como base para prácticas de transferencia de archivos y servicios de red en entornos controlados.