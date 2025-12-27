---
title: Comandos Linux
description: "Referencia rápida de comandos Linux. Parte 1: información del sistema, sistema de archivos, manipulación de archivos y texto, permisos y gestión básica de usuarios."
sidebar:
  order: 2
---

## 1. Información del sistema

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| uname | Información del kernel | uname -a | Identifica kernel, arquitectura y versión |
| hostname | Nombre del host | hostname | Relevante en red y logs |
| uptime | Tiempo en ejecución | uptime | Incluye carga media |
| whoami | Usuario efectivo | whoami | Útil para verificar contexto |
| id | UID y grupos | id | Clave para permisos |
| date | Fecha y hora | date | Importante para logs |
| free | Uso de memoria | free -h | Memoria RAM y swap |
| df | Uso de disco | df -h | Por sistema de archivos |
| lsblk | Dispositivos de bloque | lsblk | Vista lógica de discos |

---

## 2. Navegación y gestión básica del sistema de archivos

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| pwd | Directorio actual | pwd | Ruta absoluta |
| cd | Cambiar directorio | cd /etc | Afecta al contexto |
| ls | Listar archivos | ls -la | Permisos y ocultos |
| tree | Vista jerárquica | tree /var | No siempre instalado |
| stat | Metadatos de archivo | stat fichero | Inodos y tiempos |

---

## 3. Visualización y manipulación de archivos y texto

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| cat | Mostrar contenido | cat archivo | No paginado |
| less | Visualización paginada | less archivo | Ideal para logs |
| head | Primeras líneas | head -n 10 archivo | Útil en inspección |
| tail | Últimas líneas | tail -f log | Seguimiento en tiempo real |
| wc | Conteo | wc -l archivo | Líneas, palabras, bytes |
| grep | Búsqueda de texto | grep error log | Base del análisis |
| sort | Ordenar texto | sort archivo | Uso frecuente en pipes |
| uniq | Eliminar duplicados | uniq -c | Requiere sort previo |
| cut | Extraer columnas | cut -d: -f1 /etc/passwd | Tratamiento estructural |
| awk | Procesado avanzado | awk '{print $1}' | Potente pero complejo |
| sed | Edición de flujo | sed 's/a/b/' | Transformaciones |

---

## 4. Permisos y propiedades de archivos

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| ls -l | Ver permisos | ls -l | rwx y propietarios |
| chmod | Cambiar permisos | chmod 644 archivo | Modo simbólico/numérico |
| chown | Cambiar propietario | chown user archivo | Requiere privilegios |
| chgrp | Cambiar grupo | chgrp grupo archivo | Gestión colaborativa |
| umask | Máscara por defecto | umask | Afecta a creación |
| getfacl | Ver ACL | getfacl archivo | Control fino |
| setfacl | Definir ACL | setfacl -m u:x:r archivo | Seguridad avanzada |

---

## 5. Gestión de usuarios y grupos

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| useradd | Crear usuario | useradd ana | Administración |
| userdel | Eliminar usuario | userdel ana | Puede borrar home |
| passwd | Cambiar contraseña | passwd ana | Autenticación |
| groupadd | Crear grupo | groupadd dev | Organización |
| groupdel | Eliminar grupo | groupdel dev | Uso cuidadoso |
| usermod | Modificar usuario | usermod -aG sudo ana | Gestión de grupos |
| su | Cambiar usuario | su root | Cambia contexto |
| sudo | Ejecutar como root | sudo apt update | Controlado por sudoers |
| login | Inicio de sesión | login | Usado por sistema |
| logout | Cerrar sesión | logout | Finaliza sesión |


## 6. Procesos y gestión de ejecución

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| ps | Listar procesos | ps aux | Vista completa del sistema |
| top | Monitorización interactiva | top | CPU y memoria en tiempo real |
| htop | Monitor avanzado | htop | Requiere instalación |
| kill | Enviar señal a proceso | kill 1234 | SIGTERM por defecto |
| killall | Matar por nombre | killall nginx | Uso cuidadoso |
| pgrep | Buscar PID | pgrep sshd | Útil en scripts |
| pkill | Señal por nombre | pkill -9 proc | Puede ser peligroso |
| bg | Reanudar en segundo plano | bg %1 | Control de jobs |
| fg | Traer a primer plano | fg %1 | Shell interactiva |
| jobs | Ver trabajos | jobs | Contexto de shell |

---

## 7. Memoria y rendimiento

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| free | Uso de memoria | free -h | RAM y swap |
| vmstat | Estadísticas de memoria | vmstat 1 | Diagnóstico bajo carga |
| top | Uso de CPU | top | Visión global |
| mpstat | CPU por núcleo | mpstat -P ALL | Requiere sysstat |
| iotop | E/S por proceso | iotop | Requiere privilegios |
| uptime | Carga del sistema | uptime | Load average |
| watch | Ejecutar periódico | watch free -h | Supervisión simple |

---

## 8. Almacenamiento y discos

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| lsblk | Ver discos | lsblk | Vista jerárquica |
| blkid | Identificar sistemas | blkid | UUID y tipos |
| df | Espacio en disco | df -h | Por filesystem |
| du | Uso por directorio | du -sh /var | Análisis de consumo |
| mount | Montar sistema | mount /dev/sda1 /mnt | Manual |
| umount | Desmontar | umount /mnt | Requiere cuidado |
| mountpoint | Ver punto de montaje | mountpoint /mnt | Validación |
| fsck | Comprobar FS | fsck /dev/sda1 | Uso en frío |
| mkfs | Crear FS | mkfs.ext4 /dev/sdb1 | Destructivo |

---

## 9. Redes y conectividad

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| ip | Gestión de red | ip addr | Sustituye ifconfig |
| ss | Sockets y puertos | ss -tuln | Diagnóstico moderno |
| ping | Conectividad | ping google.com | ICMP |
| traceroute | Ruta de red | traceroute 8.8.8.8 | Diagnóstico |
| nmcli | NetworkManager | nmcli dev status | Sistemas desktop |
| hostnamectl | Hostname | hostnamectl set-hostname srv1 | Persistente |
| curl | Cliente HTTP | curl https://example.com | APIs y tests |
| wget | Descarga | wget url | Scripts |

---

## 10. Servicios y arranque del sistema

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| systemctl | Gestión de servicios | systemctl status ssh | systemd |
| systemctl start | Iniciar servicio | systemctl start nginx | Requiere root |
| systemctl stop | Parar servicio | systemctl stop nginx | Control |
| systemctl enable | Activar arranque | systemctl enable ssh | Persistente |
| systemctl disable | Desactivar arranque | systemctl disable ssh | Gestión limpia |
| journalctl | Logs systemd | journalctl -xe | Diagnóstico |
| shutdown | Apagar sistema | shutdown -h now | Controlado |
| reboot | Reiniciar | reboot | Planificado |

---

## 11. Programación de tareas y tiempo

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| crontab | Tareas programadas | crontab -e | Usuario |
| at | Tarea puntual | at 22:00 | Ejecución diferida |
| atq | Ver cola at | atq | Administración |
| atrm | Borrar tarea | atrm 3 | Control |
| date | Fecha/hora | date +"%F %T" | Formato |
| timedatectl | Hora del sistema | timedatectl | Sincronización |

## 12. Gestión de paquetes y software

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| apt | Gestor de paquetes | apt update | Debian/Ubuntu |
| apt install | Instalar paquete | apt install nginx | Resuelve dependencias |
| apt remove | Eliminar paquete | apt remove nginx | Mantiene config |
| apt purge | Eliminar completo | apt purge nginx | Borra config |
| apt search | Buscar paquete | apt search curl | Catálogo |
| apt show | Info paquete | apt show curl | Metadatos |
| dpkg | Paquetes locales | dpkg -l | Bajo nivel |
| snap | Paquetes snap | snap list | Aislados |
| snap install | Instalar snap | snap install code | Canonical |
| flatpak | Paquetes flatpak | flatpak list | Desktop |

---

## 13. Compresión y archivado

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| tar | Archivar | tar -cvf a.tar dir | Sin compresión |
| tar.gz | Comprimir gzip | tar -czvf a.tar.gz dir | Común |
| tar.xz | Comprimir xz | tar -cJvf a.tar.xz dir | Alta compresión |
| gzip | Comprimir archivo | gzip file | Reemplaza original |
| gunzip | Descomprimir | gunzip file.gz | Inverso |
| zip | Crear zip | zip a.zip file | Multiplataforma |
| unzip | Extraer zip | unzip a.zip | Uso común |
| sha256sum | Hash | sha256sum file | Integridad |
| md5sum | Hash MD5 | md5sum file | No seguro |

---

## 14. Seguridad básica

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| sudo | Ejecución privilegiada | sudo apt update | Controlado |
| su | Cambio de usuario | su root | Cambia entorno |
| passwd | Contraseñas | passwd user | Autenticación |
| login | Inicio sesión | login | Bajo nivel |
| logout | Cierre sesión | logout | Terminal |
| faillog | Fallos login | faillog -a | Auditoría |
| last | Historial accesos | last | Forense |
| who | Usuarios conectados | who | Tiempo real |
| groups | Grupos usuario | groups user | Permisos |
| getcap | Capacidades | getcap bin | Seguridad avanzada |

---

## 15. Virtualización y contenedores

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| virt-install | Crear VM | virt-install ... | KVM |
| virsh | Gestión VM | virsh list | Libvirt |
| virt-manager | GUI VM | virt-manager | Escritorio |
| docker | Gestión contenedores | docker ps | Runtime |
| docker run | Ejecutar contenedor | docker run nginx | Prueba |
| docker exec | Ejecutar comando | docker exec -it c bash | Diagnóstico |
| docker logs | Logs contenedor | docker logs c | Observabilidad |
| docker images | Imágenes | docker images | Catálogo |
| docker rm | Borrar contenedor | docker rm c | Limpieza |
| podman | Contenedores rootless | podman ps | Más seguro |

---

## 16. Automatización y scripting

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| bash | Shell | bash script.sh | Predeterminado |
| sh | Shell POSIX | sh script.sh | Portabilidad |
| env | Variables entorno | env | Contexto |
| export | Exportar variables | export VAR=1 | Subshell |
| source | Cargar script | source env.sh | Mismo shell |
| xargs | Argumentos | xargs rm | Pipes |
| find | Búsqueda avanzada | find / -name f | Automatización |
| tee | Doble salida | cmd | tee file | Logging |
| watch | Ejecución periódica | watch date | Supervisión |

---

## 17. Diagnóstico y resolución de problemas

| Comando | Función | Ejemplo | Notas técnicas |
|--------|---------|---------|---------------|
| dmesg | Mensajes kernel | dmesg | Arranque |
| journalctl | Logs sistema | journalctl -b | Forense |
| strace | Trazar syscalls | strace cmd | Depuración |
| lsof | Archivos abiertos | lsof -i | Puertos |
| tcpdump | Captura red | tcpdump -i eth0 | Forense |
| ss | Sockets | ss -tulnp | Puertos |
| uptime | Estado carga | uptime | Salud |
| free | Memoria | free -h | Recursos |
| df | Disco | df -h | Capacidad |

