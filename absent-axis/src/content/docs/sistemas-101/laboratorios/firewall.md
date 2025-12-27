---
title: "Firewall UFW"
description: "Configuración de seguridad con Uncomplicated Firewall"
sidebar:
  order: 5
---

En este capítulo configuraremos UFW (Uncomplicated Firewall), el firewall de Ubuntu. Un firewall controla qué tráfico de red puede entrar y salir de tu servidor, siendo una capa esencial de seguridad.

**Tiempo estimado:** 15-20 minutos

**¿Qué es un Firewall?**  
Un firewall es como un guardia de seguridad que decide qué conexiones están permitidas y cuáles bloqueadas. Solo permitiremos el tráfico necesario (SSH, HTTP, HTTPS).

**IMPORTANTE - Antes de empezar:**  
Si configuras mal el firewall, puedes perder acceso SSH a tu servidor. Sigue los pasos cuidadosamente y en orden.

## Paso 1: Verificar estado de UFW

### 1.1 Comprobar si UFW está instalado

UFW viene preinstalado en Ubuntu. Verifica su estado:

    sudo ufw status

Probablemente verás:

    Status: inactive

Esto significa que el firewall está instalado pero no activado (sin reglas aplicadas).

### 1.2 Ver estado detallado

    sudo ufw status verbose

## Paso 2: Configurar políticas por defecto

**Principio de seguridad:**  
Seguimos la regla de "denegar todo por defecto, permitir solo lo necesario". Esto minimiza la superficie de ataque.

### 2.1 Denegar todo el tráfico entrante

    sudo ufw default deny incoming

Esto bloquea todas las conexiones entrantes por defecto.

### 2.2 Permitir todo el tráfico saliente

    sudo ufw default allow outgoing

Esto permite que tu servidor pueda hacer peticiones salientes (actualizar paquetes, DNS, etc.).

Ahora todo está bloqueado por defecto. Vamos a permitir solo los servicios que necesitamos.

## Paso 3: Permitir servicios necesarios

CRÍTICO: Permite SSH ANTES de activar el firewall, o perderás acceso remoto.

### 3.1 Permitir SSH (puerto 22)

Para no perder acceso remoto:

    sudo ufw allow 22/tcp

O de forma más descriptiva:

    sudo ufw allow ssh

Nota: Ambos comandos hacen lo mismo. UFW reconoce nombres de servicios comunes como "ssh", "http", "https".

### 3.2 Permitir HTTP (puerto 80)

Para que tu servidor web sea accesible:

    sudo ufw allow 80/tcp

O usando el nombre del servicio:

    sudo ufw allow http

### 3.3 Permitir HTTPS (puerto 443)

Para conexiones seguras con SSL (lo usaremos después):

    sudo ufw allow 443/tcp

O:

    sudo ufw allow https

### 3.4 Verificar reglas añadidas

Antes de activar, verifica las reglas:

    sudo ufw show added

Deberías ver algo como:

    Added user rules:
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp

## Paso 4: Activar el firewall

Último check antes de activar:  
Asegúrate de que has permitido SSH (puerto 22). Si estás conectado por SSH y no has permitido el puerto 22, perderás la conexión.

### 4.1 Activar UFW

    sudo ufw enable

Te preguntará si estás seguro:

    Command may disrupt existing ssh connections. Proceed with operation (y|n)?

Escribe **y** y presiona Enter.

UFW está ahora activo y filtrando tráfico según las reglas configuradas.

### 4.2 Verificar estado

    sudo ufw status

Deberías ver:

    Status: active

    To                         Action      From
    --                         ------      ----
    22/tcp                     ALLOW       Anywhere
    80/tcp                     ALLOW       Anywhere
    443/tcp                    ALLOW       Anywhere
    22/tcp (v6)                ALLOW       Anywhere (v6)
    80/tcp (v6)                ALLOW       Anywhere (v6)
    443/tcp (v6)               ALLOW       Anywhere (v6)

### 4.3 Ver estado numerado

Para ver las reglas con números (útil para eliminarlas después):

    sudo ufw status numbered

## Paso 5: Reglas avanzadas (opcionales)

### 5.1 Limitar intentos de conexión SSH

Protección contra ataques de fuerza bruta en SSH:

    sudo ufw limit ssh

¿Qué hace limit?  
Permite máximo 6 conexiones por IP en 30 segundos. Después bloquea temporalmente esa IP. Protege contra ataques automatizados.

### 5.2 Permitir desde IP específica

Permitir SSH solo desde tu IP de casa:

    sudo ufw allow from 192.168.1.100 to any port 22

(Reemplaza 192.168.1.100 con tu IP)

### 5.3 Permitir rango de IPs

Permitir toda tu red local:

    sudo ufw allow from 192.168.1.0/24

### 5.4 Denegar IP específica

Bloquear una IP maliciosa:

    sudo ufw deny from 203.0.113.100

## Paso 6: Gestión de reglas

### 6.1 Ver reglas numeradas

    sudo ufw status numbered

### 6.2 Eliminar regla por número

Si quieres eliminar la regla número 3:

    sudo ufw delete 3

### 6.3 Eliminar regla por especificación

    sudo ufw delete allow 80/tcp

### 6.4 Resetear firewall

Para eliminar TODAS las reglas y empezar de cero:

    sudo ufw reset

Cuidado: Esto desactiva el firewall y elimina todas las reglas. Tendrás que configurarlo de nuevo.

## Comandos útiles de UFW

### Gestión del firewall

    sudo ufw enable
    sudo ufw disable
    sudo ufw status
    sudo ufw status verbose
    sudo ufw status numbered
    sudo ufw reload

### Permitir servicios

    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow https

    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp

    sudo ufw allow 1000:2000/tcp

    sudo ufw allow proto tcp from any to any

### Denegar tráfico

    sudo ufw deny 23/tcp
    sudo ufw deny from 203.0.113.100
    sudo ufw deny from 203.0.113.100 to any port 22

### Logs y diagnóstico

    sudo ufw logging on
    sudo ufw logging medium
    sudo tail -f /var/log/ufw.log
    sudo iptables -L -n -v

## Perfiles de aplicación

Perfiles de aplicación:  
Algunas aplicaciones crean perfiles UFW automáticamente con sus puertos necesarios. Es más cómodo usar el perfil que recordar puertos.

### Ver perfiles disponibles

    sudo ufw app list

Deberías ver algo como:

    Available applications:
      Apache
      Apache Full
      Apache Secure
      OpenSSH

### Información de un perfil

    sudo ufw app info "Apache Full"

Resultado:

    Profile: Apache Full
    Title: Web Server (HTTP,HTTPS)
    Description: Apache v2 is the next generation of the omnipresent Apache web server.

    Ports:
      80,443/tcp

### Usar un perfil

    sudo ufw allow "Apache Full"

Esto permite tanto HTTP (80) como HTTPS (443) automáticamente.

## Logging y monitoreo

### Activar logs

    sudo ufw logging on

### Niveles de logging

    sudo ufw logging low
    sudo ufw logging medium
    sudo ufw logging high

### Ver logs

    sudo tail -f /var/log/ufw.log
    sudo tail -50 /var/log/ufw.log
    sudo grep BLOCK /var/log/ufw.log

## Buenas prácticas de seguridad

### 1. Principio de mínimo privilegio

Solo abre los puertos estrictamente necesarios. Si no usas un servicio, no abras su puerto.

### 2. Usa reglas específicas

Cuando sea posible, limita por IP de origen en lugar de permitir desde cualquier lugar.

### 3. Limita SSH

    sudo ufw limit ssh

### 4. Revisa regularmente

Audita tus reglas periódicamente:

    sudo ufw status numbered

### 5. Monitorea logs

Revisa los logs para detectar intentos de acceso no autorizados:

    sudo grep BLOCK /var/log/ufw.log | tail -20

### 6. Mantén actualizado

Actualiza regularmente el sistema para tener los últimos parches de seguridad.

## Solución de problemas

### Perdí acceso SSH

- Accede físicamente a la VM desde VirtualBox
- Desactiva UFW: `sudo ufw disable`
- Permite SSH: `sudo ufw allow 22/tcp`
- Reactiva UFW: `sudo ufw enable`

### No puedo acceder a mi web

- Verifica que HTTP está permitido: `sudo ufw status | grep 80`
- Si no lo está: `sudo ufw allow 80/tcp`
- Recarga UFW: `sudo ufw reload`

### Cómo ver qué está bloqueando

    sudo grep BLOCK /var/log/ufw.log | tail -20
    sudo journalctl -u ufw -n 50

### Regla no funciona

- Verifica sintaxis: `sudo ufw status numbered`
- Orden importa: Las reglas se evalúan en orden
- Recarga: `sudo ufw reload`

## Configuración recomendada final

Este es un resumen de la configuración recomendada para tu servidor web:

    sudo ufw reset

    sudo ufw default deny incoming
    sudo ufw default allow outgoing

    sudo ufw limit 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp

    sudo ufw enable

    sudo ufw logging on

    sudo ufw status verbose

## Verificación final

Comprueba que tu configuración está correcta:

    sudo ufw status verbose
    curl http://localhost

    sudo tail -20 /var/log/ufw.log

Tu servidor está ahora protegido con UFW. Solo el tráfico SSH, HTTP y HTTPS está permitido. Todo lo demás está bloqueado.
