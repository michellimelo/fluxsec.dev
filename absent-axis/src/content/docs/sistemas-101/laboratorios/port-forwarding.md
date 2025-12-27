---
title: "Port Forwarding"
description: "Configurar tu router para permitir acceso desde Internet"
sidebar:
  order: 7
---

Port forwarding es el proceso de configurar tu router para redirigir tráfico de Internet hacia tu servidor local. Sin esto, tu servidor no será accesible desde fuera de tu red. Esta es la pieza clave para publicar tu web en Internet.

**Tiempo estimado:** 20-30 minutos

**¿Qué es Port Forwarding?**  
Tu router actúa como una puerta de entrada entre Internet y tu red local. Port forwarding abre puertos específicos en esa puerta y dice: "cuando llegue tráfico al puerto 80, envíalo a 192.168.1.X (tu servidor)".

## Conceptos fundamentales

### Cómo funciona tu red

    Internet (IP pública: X.X.X.X)
        ↓
    Router (Gateway: 192.168.1.1)
        ↓
    Red local (192.168.1.0/24)
        ├── Tu PC: 192.168.1.X
        ├── Tu VM: 192.168.1.X ← Aquí queremos el tráfico
        └── Otros dispositivos...

### Sin Port Forwarding

- Alguien intenta acceder a http://tudominio.duckdns.org
- El tráfico llega a tu IP pública (X.X.X.X)
- El router NO SABE qué hacer con ese tráfico
- El router RECHAZA la conexión
- Tu web no es accesible

### Con Port Forwarding

- Alguien intenta acceder a http://tudominio.duckdns.org
- El tráfico llega a tu IP pública puerto 80
- El router tiene una regla: "Puerto 80 → 192.168.1.X:80"
- El router REENVÍA el tráfico a tu servidor
- Tu web es accesible desde Internet

## Información necesaria

Antes de configurar, necesitas tener clara esta información:

    IP local del servidor: 192.168.1.X
    Gateway (router): 192.168.1.1
    Modelo router: (modelo de tu router)

    Puertos a abrir:
    - Puerto 80 (HTTP)
    - Puerto 443 (HTTPS)
    - Puerto 22 (SSH) - opcional, solo si quieres SSH desde Internet

**Seguridad - Puerto SSH:**  
No recomendamos abrir el puerto 22 (SSH) a Internet sin medidas de seguridad adicionales. Si necesitas acceso SSH remoto, considera usar un puerto personalizado o VPN.

## Paso 1: Acceder al router

### 1.1 Conectarse al router

Desde tu navegador (en tu PC Windows), accede a la interfaz del router:

    http://192.168.1.1

Alternativas comunes si no funciona:

- http://router.asus.com
- http://192.168.50.1

### 1.2 Iniciar sesión

Te pedirá usuario y contraseña. Las credenciales por defecto en algunos routers suelen ser:

    Usuario: admin
    Contraseña: admin

**Contraseña del router:**  
Si cambiaste la contraseña del router y no la recuerdas, tendrás que resetear el router a valores de fábrica (botón reset en el router por 10 segundos).

### 1.3 Interfaz de administración

Deberías ver el panel de administración con el menú lateral.

## Paso 2: Configurar Port Forwarding

### 2.1 Navegar a Port Forwarding

En el menú lateral del router:

1. Haz clic en **"WAN"** (en el menú lateral izquierdo)
2. Ve a la pestaña **"Virtual Server / Port Forwarding"**
3. O en inglés: **"Servidor Virtual / Reenvío de Puertos"**

### 2.2 Habilitar Port Forwarding

Asegúrate de que el port forwarding esté habilitado:

- Busca el switch **"Enable Port Forwarding"**
- Asegúrate de que esté en **"Yes"** o activado

### 2.3 Añadir regla para HTTP (puerto 80)

Completa los campos de la siguiente manera:

    Service Name: Apache-HTTP
    Port Range: 80
    Local IP: 192.168.1.X
    Local Port: 80
    Protocol: TCP
    Source IP: (dejar vacío o 0.0.0.0)

**Explicación de campos:**

- **Service Name:** Nombre descriptivo (cualquiera)
- **Port Range:** Puerto externo (desde Internet)
- **Local IP:** IP de tu servidor en red local
- **Local Port:** Puerto interno en tu servidor
- **Protocol:** TCP para HTTP/HTTPS

Haz clic en el botón **"+"** o **"Add"** para añadir la regla.

### 2.4 Añadir regla para HTTPS (puerto 443)

Repite el proceso para HTTPS:

    Service Name: Apache-HTTPS
    Port Range: 443
    Local IP: 192.168.1.X
    Local Port: 443
    Protocol: TCP
    Source IP: (dejar vacío)

Haz clic en **"Add"**.

### 2.5 Guardar configuración

Después de añadir ambas reglas:

1. Verifica que ambas reglas aparezcan en la lista
2. Haz clic en el botón **"Apply"** al final de la página
3. Espera unos segundos mientras el router aplica los cambios

Port Forwarding configurado  
Tu router ahora redirigirá el tráfico HTTP y HTTPS a tu servidor.

## Paso 3: Verificar configuración

### 3.1 Ver reglas activas

En la misma página de Port Forwarding, deberías ver una lista con tus reglas:

    Service Name    External Port    Internal IP        Internal Port    Protocol
    Apache-HTTP     80              192.168.1.X        80              TCP
    Apache-HTTPS    443             192.168.1.X        443             TCP

### 3.2 Verificar desde red local

Primero, comprueba que tu servidor sigue siendo accesible localmente:

    # Desde tu PC Windows
    curl http://192.168.1.X

O abre en el navegador: `http://192.168.1.X`

### 3.3 Verificar desde Internet

Ahora el momento de la verdad. Desde tu navegador, accede usando tu dominio DuckDNS:

    http://tudominio.duckdns.org

Si ves tu web, felicidades. Tu servidor es ahora accesible desde Internet.

**Si no funciona desde tu red:**  
Algunos routers no soportan "NAT Loopback" (acceder a tu IP pública desde dentro de tu red). Prueba desde tu móvil usando datos 4G/5G (sin WiFi) o pide a un amigo que pruebe.

## Verificación externa

### 4.1 Usar herramientas online

Verifica que tus puertos estén abiertos usando herramientas externas:

**CanYouSeeMe.org:**

1. Ve a: https://canyouseeme.org/
2. En "Port to Check", escribe: **80**
3. Haz clic en "Check Port"

Si dice **"Success"**, tu puerto 80 está abierto y accesible.

**YouGetSignal.com:**

1. Ve a: https://www.yougetsignal.com/tools/open-ports/
2. Ingresa tu IP pública y puerto 80
3. Haz clic en "Check"

### 4.2 Verificar con nmap (desde otro lugar)

Si tienes acceso a otro ordenador fuera de tu red:

    nmap -p 80,443 tudominio.duckdns.org

Debería mostrar los puertos como "open".

## Configuraciones para otros routers

### TP-Link

1. Accede a http://192.168.0.1 o tplinkwifi.net
2. Usuario/Contraseña: admin/admin
3. Menú: **Forwarding → Virtual Servers**
4. Añade reglas con los mismos datos

### Netgear

1. Accede a http://192.168.1.1 o routerlogin.net
2. Usuario/Contraseña: admin/password
3. Menú: **Advanced → Port Forwarding/Port Triggering**
4. Añade reglas

### Movistar

1. Accede a http://192.168.1.1
2. Usuario/Contraseña: (depende del modelo, a veces admin/admin)
3. Menú: **Red Local → NAT/PAT**
4. Añade reglas de NAT

### Vodafone

1. Accede a http://vodafone.station
2. Menú: **Configuración → NAT → Port Forwarding**
3. Añade reglas

### Digi (router ZTE)

1. Accede a http://192.168.1.1
2. Usuario/Contraseña: admin/admin
3. Menú: **Application → Port Forwarding**
4. Añade reglas

## Configuración avanzada (opcional)

### DMZ (zona desmilitarizada)

No recomendado para principiantes:  
DMZ expone completamente un dispositivo a Internet (todos los puertos). Solo úsalo si sabes lo que haces y tienes tu servidor muy bien asegurado.

Si quieres usar DMZ (en algunos routers):

1. Ve a **WAN → DMZ**
2. Activa DMZ
3. Ingresa la IP de tu servidor: 192.168.1.X
4. Apply

### UPnP (Universal Plug and Play)

UPnP permite que aplicaciones abran puertos automáticamente. Puede ser conveniente pero es un riesgo de seguridad.

**Estado recomendado:** Desactivado (usa port forwarding manual)

## Seguridad y mejores prácticas

### 1. Cambia la contraseña del router

Si usas admin/admin, cámbiala:

1. En algunos routers: **Administration → System**
2. Cambia la contraseña del router
3. Usa una contraseña fuerte

### 2. Actualiza el firmware del router

1. En algunos routers: **Administration → Firmware Upgrade**
2. Verifica si hay actualizaciones
3. Actualiza si hay una versión nueva

### 3. Solo abre puertos necesarios

- Puerto 80 (HTTP) - necesario
- Puerto 443 (HTTPS) - necesario
- Puerto 22 (SSH) - evitar si es posible
- Otros puertos - solo si realmente los necesitas

### 4. Usa firewall en el servidor

El firewall UFW que configuraste protege tu servidor. Mantenlo activo:

    sudo ufw status

### 5. Monitorea los logs

Revisa regularmente los logs de Apache y firewall:

    sudo tail -f /var/log/apache2/access.log
    sudo tail -f /var/log/ufw.log

## Solución de problemas

### El puerto aparece cerrado

- Verifica que Apache esté corriendo: `sudo systemctl status apache2`
- Verifica firewall UFW: `sudo ufw status`
- Verifica que la IP local sea correcta: `ip addr show`
- Reinicia el router
- Verifica que no haya doble NAT (router + ONT en modo router)

### Funciona localmente pero no desde Internet

- Verifica que la regla de port forwarding esté activa
- Verifica que DuckDNS apunte a tu IP pública correcta
- Comprueba tu IP pública: `curl ifconfig.me`
- Algunos ISPs bloquean puerto 80, contacta a tu proveedor
- Prueba desde red móvil (4G) sin WiFi

### Doble NAT (problema común con fibra)

Si tienes ONT (convertidor fibra→ethernet) + router:

- Verifica que el ONT esté en modo bridge
- O configura port forwarding también en el ONT

### Timeout al acceder desde Internet

- Verifica DuckDNS: `nslookup tudominio.duckdns.org`
- Verifica que tu IP pública no haya cambiado
- Verifica que el script de actualización de DuckDNS funcione
- Comprueba logs del router si están disponibles

## Verificación de tu configuración de red

Ejecuta estos comandos para verificar tu setup completo:

    # IP local del servidor
    ip addr show | grep inet

    # Gateway
    ip route show | grep default

    # Verificar Apache
    sudo systemctl status apache2

    # Verificar firewall
    sudo ufw status

    # Verificar DuckDNS
    nslookup tudominio.duckdns.org

    # Verificar IP pública
    curl ifconfig.me

    # Probar acceso local
    curl http://localhost

    # Ver logs de Apache
    sudo tail -20 /var/log/apache2/access.log

## Diagrama de tu infraestructura

    ┌─────────────────────────────────────────────────────────┐
    │                       INTERNET                          │
    │                   (Red mundial)                         │
    └─────────────────────┬───────────────────────────────────┘
                          │
                          │ IP pública: X.X.X.X
                          │ DuckDNS: tudominio.duckdns.org
                          ↓
            ┌─────────────────────────────┐
            │            ONT              │
            │        (Bridge Mode)        │
            │   Convierte fibra→ethernet  │
            └──────────────┬──────────────┘
                           │
                           ↓
            ┌─────────────────────────────┐
            │           ROUTER            │
            │   IP: 192.168.1.1           │
            │   Port Forwarding:          │
            │   - 80  → 192.168.1.X:80    │
            │   - 443 → 192.168.1.X:443   │
            └──────────────┬──────────────┘
                           │
                           │ Red local: 192.168.1.0/24
                           │
            ┌──────────────┴──────────────┬───────────────┐
            │                             │               │
            ↓                             ↓               ↓
       ┌─────────┐                  ┌──────────┐    ┌─────────┐
       │  PC     │                  │  Ubuntu  │    │  Otros  │
       │ Windows │                  │  Server  │    │ Dispos. │
       │  .X     │                  │   .X     │    │         │
       └─────────┘                  └──────────┘    └─────────┘
                                     │ Apache   │
                                     │ UFW      │
                                     │ DuckDNS  │
                                     └──────────┘

## Resumen final

### Lo que hemos logrado

- Port forwarding configurado en el router
- Puerto 80 (HTTP) abierto y funcional
- Puerto 443 (HTTPS) abierto para futuro uso
- Servidor accesible desde Internet
- Dominio DuckDNS funcionando

### Tu web ahora es pública

Cualquier persona en el mundo puede acceder a tu web usando:

    http://tudominio.duckdns.org

### Lo que falta

- Configurar SSL/HTTPS para conexiones seguras
- Optimizar la seguridad
- Considerar Cloudflare Tunnel como alternativa

## Próximos pasos

Con el firewall configurado, tu servidor tiene las bases sólidas. Ahora configuraremos DuckDNS para obtener un dominio gratuito y hacer tu servidor accesible desde Internet.