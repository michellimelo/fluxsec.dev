---
title: "Servidor OpenVPN en Ubuntu"
description: "Red privada virtual para acceso seguro remoto"
sidebar:
  order: 12
---

Configurar un servidor OpenVPN Access Server en Ubuntu para crear una red privada virtual (VPN) que permita conectarse de forma segura desde cualquier dispositivo (Windows, iPhone, Android) a nuestra red local.

**Tiempo estimado:** 40-50 minutos

## ¿Qué es una VPN?

Una VPN (Virtual Private Network) crea un "túnel" cifrado entre tu dispositivo y un servidor, permitiéndote acceder a recursos internos como si estuvieras físicamente en esa red.

## ¿Para qué sirve una VPN?

### Usos prácticos

- **Acceso remoto seguro:** Acceder a tu red local desde cualquier lugar
- **Seguridad en WiFi públicas:** Cifra tu tráfico en cafeterías, aeropuertos, etc.
- **Acceder a servicios internos:** Zabbix, servidores, bases de datos
- **Bypass de restricciones:** Acceder a recursos como si estuvieras en casa

### Ejemplo real

Estás de viaje y quieres:

- Ver tus cámaras de seguridad caseras
- Acceder a archivos de tu NAS
- Usar impresoras de tu oficina
- Monitorear Zabbix de forma segura

Con VPN, tu dispositivo se convierte en parte de tu red local, sin importar dónde estés.

## Conceptos básicos

### Red VPN típica

    Internet → Cliente VPN → Túnel cifrado → Servidor VPN → Red local

    Ejemplo de IPs:
    - Tu PC en casa: 192.168.1.X
    - Servidor VPN: 192.168.1.X
    - Red VPN interna: 10.8.0.0/24
      - Servidor: 10.8.0.X
      - Tu móvil conectado: 10.8.0.X
      - Tu laptop conectada: 10.8.0.X

### OpenVPN Access Server vs OpenVPN Classic

- **OpenVPN Classic:** Versión tradicional, configuración manual compleja
- **OpenVPN Access Server:** Interfaz web, fácil de gestionar, 2 usuarios gratis

Usaremos **Access Server** por su facilidad de uso y gestión web.

## Requisitos previos

- Ubuntu Server 24.04 funcionando
- Acceso SSH al servidor
- Conexión a Internet
- Usuario con permisos sudo

## Paso 1: Preparar el sistema

### 1.1 Actualizar el sistema

    sudo apt update
    sudo apt upgrade -y

### 1.2 Verificar IP del servidor

    ip addr show

Anota tu IP local (ejemplo: 192.168.1.X)

## Paso 2: Instalar OpenVPN Access Server

### 2.1 Descargar el script de instalación

    cd /tmp
    wget https://as-repository.openvpn.net/as-repo-public.asc -qO /etc/apt/trusted.gpg.d/as-repo-public.asc

### 2.2 Añadir repositorio

    echo "deb [arch=amd64 signed-by=/etc/apt/trusted.gpg.d/as-repo-public.asc] http://as-repository.openvpn.net/as/debian noble main" | sudo tee /etc/apt/sources.list.d/openvpn-as-repo.list

### 2.3 Actualizar e instalar

    sudo apt update
    sudo apt install openvpn-as -y

La instalación tardará 2-3 minutos.

Al finalizar verás información importante:

    Access Server Web UIs are available at these URLs:
    Admin  UI: https://192.168.1.X:943/admin
    Client UI: https://192.168.1.X:943/

    Login with username: openvpn
    Password: (se genera automáticamente)

Guarda esta información.

### 2.4 Cambiar contraseña del admin

Por seguridad, cambia la contraseña:

    sudo passwd openvpn

Ingresa tu nueva contraseña dos veces.

## Paso 3: Configurar el firewall

Abre los puertos necesarios:

    # Puerto web de administración (HTTPS)
    sudo ufw allow 943/tcp

    # Puerto OpenVPN
    sudo ufw allow 1194/udp

    # Puerto TCP alternativo
    sudo ufw allow 443/tcp

    # Recargar firewall
    sudo ufw reload

    # Verificar
    sudo ufw status

## Paso 4: Acceder a la interfaz web

### 4.1 Acceder al panel de administración

Desde tu navegador:

    https://192.168.1.X:943/admin

Advertencia de seguridad:
El navegador mostrará "Conexión no segura" porque el certificado es autofirmado. Esto es normal.

- **Chrome:** Haz clic en "Avanzado" → "Continuar a 192.168.1.X"
- **Firefox:** "Avanzado" → "Aceptar el riesgo y continuar"

### 4.2 Iniciar sesión

    Usuario: openvpn
    Contraseña: (la que estableciste)

### 4.3 Aceptar el EULA

1. Lee los términos de servicio
2. Marca "Agree" (Acepto)
3. Haz clic en "Accept" (Aceptar)

## Paso 5: Configuración básica del servidor

### 5.1 Network Settings (Configuración de red)

1. En el menú lateral, ve a **Configuration → Network Settings**
2. Verifica:
   - **Hostname or IP Address:** Tu IP local (192.168.1.X)
   - **Protocol:** UDP
   - **Port:** 1194
3. Haz clic en **Save Settings**
4. Haz clic en **Update Running Server**

### 5.2 VPN Settings (Configuración VPN)

1. Ve a **Configuration → VPN Settings**
2. Verifica:
   - **Dynamic IP Address Network:** 10.8.0.0/24 (por defecto)
   - **Routing:** Marca "Should VPN clients have access to private subnets"
   - Añade tu red local: **192.168.1.0/24**
3. Haz clic en **Save Settings**
4. Haz clic en **Update Running Server**

¿Qué hace esto?
Permite que los clientes VPN accedan a tu red local 192.168.1.X a través del túnel.

## Paso 6: Crear usuario VPN

### 6.1 Añadir nuevo usuario

1. Ve a **User Management → User Permissions**
2. En "New Username", escribe: **usuario**
3. Haz clic en el símbolo **+** para añadir
4. Verás el usuario en la lista

### 6.2 Configurar contraseña

1. Haz clic en el icono del lápiz (editar) junto al usuario
2. Marca **Local Password**
3. Ingresa una contraseña segura
4. Haz clic en **Save Settings**
5. Haz clic en **Update Running Server**

## Paso 7: Descargar el cliente OpenVPN

### 7.1 OpenVPN Connect (recomendado)

Descarga desde:

- **Windows:** https://openvpn.net/client/
- **macOS:** App Store o sitio oficial
- **iPhone/iPad:** App Store
- **Android:** Google Play Store

O descarga directamente desde tu servidor:

    https://192.168.1.X:943/

1. Inicia sesión con usuario: **usuario**
2. Verás opciones de descarga para cada sistema operativo
3. Haz clic en tu sistema (Windows, macOS, etc.)

## Paso 8: Conectarse desde Windows

### 8.1 Instalar OpenVPN Connect

1. Ejecuta el instalador descargado
2. Acepta los permisos
3. Espera a que termine la instalación

### 8.2 Obtener el perfil de conexión

Ve al portal del cliente:

    https://192.168.1.X:943/

1. Inicia sesión con: **usuario**
2. Haz clic en **"Yourself (user-locked profile)"**
3. Se descargará un archivo: **client.ovpn**

### 8.3 Importar perfil en OpenVPN Connect

1. Abre **OpenVPN Connect**
2. Haz clic en **File**
3. Selecciona el archivo **client.ovpn** descargado
4. Haz clic en **Connect**

Si todo está bien, verás "Connected" en verde.

## Paso 9: Verificar la conexión VPN

### 9.1 Verificar IP asignada

Desde PowerShell en Windows:

    ipconfig

Busca un adaptador llamado "OpenVPN" o similar con IP 10.8.0.X:

    Adaptador desconocido Conexión de área local:
       Dirección IPv4: 10.8.0.X

### 9.2 Hacer ping al servidor VPN

    ping 10.8.0.X

Deberías recibir respuestas:

    Respuesta desde 10.8.0.X: bytes=32 tiempo=1ms TTL=64

Si recibes respuestas del ping, la VPN está completamente funcional.

### 9.3 Acceder a recursos internos

Ahora puedes acceder a tu red local:

    # SSH al servidor
    ssh usuario@10.8.0.X

    # Acceder a web interna
    http://10.8.0.X

    # Acceder a Zabbix
    http://10.8.0.X:8080

## Paso 10: Conectar iPhone/iPad

### 10.1 Instalar OpenVPN Connect

1. Abre **App Store**
2. Busca: **OpenVPN Connect**
3. Instala la app oficial de OpenVPN Inc.

### 10.2 Importar perfil

**Opción A: Desde el iPhone**

1. Abre Safari en el iPhone
2. Ve a: `https://192.168.1.X:943/`
3. Inicia sesión (usuario)
4. Descarga el perfil
5. Se abrirá automáticamente en OpenVPN Connect

**Opción B: Compartir archivo**

1. Envíate el archivo `client.ovpn` por email/AirDrop
2. Ábrelo desde el iPhone
3. Selecciona "OpenVPN Connect"

### 10.3 Conectar

1. En OpenVPN Connect, verás el perfil importado
2. Activa el switch para conectar
3. iOS pedirá permiso para crear VPN → Permitir
4. Verás el icono "VPN" en la barra superior

## Problemas comunes y soluciones

### 1. No puedo acceder a la interfaz web (943)

Verificar que el servicio está corriendo:

    sudo systemctl status openvpnas

Verificar firewall:

    sudo ufw status | grep 943

Reiniciar servicio:

    sudo systemctl restart openvpnas

### 2. Cliente no puede conectar

Verificar puerto 1194:

    sudo ss -tulnp | grep 1194

Ver logs del servidor:

    sudo tail -30 /var/log/openvpnas.log

### 3. Conecta pero no hace ping

Verificar rutas en VPN Settings:

- Ve a Admin UI → VPN Settings
- Verifica que 192.168.1.0/24 esté en las rutas
- Update Running Server

### 4. Error "Connection timed out"

Causa: Firewall bloqueando

    # Abrir puerto UDP
    sudo ufw allow 1194/udp

    # Verificar
    sudo ufw status

## Comandos útiles de OpenVPN AS

    # Ver estado del servicio
    sudo systemctl status openvpnas

    # Reiniciar servicio
    sudo systemctl restart openvpnas

    # Ver usuarios conectados
    sudo /usr/local/openvpn_as/scripts/sacli VPNStatus

    # Ver configuración
    sudo /usr/local/openvpn_as/scripts/sacli ConfigQuery

    # Resetear contraseña de admin
    sudo passwd openvpn

    # Ver logs en tiempo real
    sudo tail -f /var/log/openvpnas.log

## Seguridad y mejores prácticas

### 1. Usa contraseñas fuertes

- Mínimo 12 caracteres
- Combinación de mayúsculas, minúsculas, números y símbolos
- Diferente para cada usuario

### 2. Limita usuarios

- Solo crea usuarios para personas que realmente necesitan acceso
- Revisa periódicamente la lista de usuarios
- Elimina usuarios que ya no lo necesiten

### 3. Monitorea conexiones

- Revisa regularmente quién está conectado
- Admin UI → Status → Current Users

### 4. Mantén actualizado

    sudo apt update
    sudo apt upgrade openvpn-as

### 5. Configura MFA (Opcional)

Para mayor seguridad, habilita autenticación de dos factores en:

- Configuration → Authentication
- Enable Google Authenticator

## Acceso desde Internet (Opcional)

Si quieres conectarte desde fuera de tu red local:

### 1. Port forwarding en el router

1. Accede a tu router (192.168.1.X)
2. Ve a Port Forwarding
3. Añade regla:
   - Puerto externo: 1194
   - Puerto interno: 1194
   - Protocolo: UDP
   - IP interna: 192.168.1.X

### 2. Usar DuckDNS o IP pública

En Network Settings del Admin UI:

- Cambia Hostname a: **ejemplo.dominio**
- O usa tu IP pública
- Save Settings → Update Running Server

### 3. Descargar nuevo perfil

Los clientes necesitarán descargar un nuevo perfil con el hostname actualizado.

## Resumen

### Lo que hemos logrado

- OpenVPN Access Server instalado
- Interfaz web configurada
- Usuarios creados
- Clientes Windows e iOS conectados
- Red VPN 10.8.0.0/24 funcionando
- Acceso a recursos internos desde VPN

### Arquitectura final

    ┌─────────────────────────────────────────────┐
    │         Internet / Red Externa              │
    └──────────────────┬──────────────────────────┘
                       │
                       │ Cliente VPN (Windows/iOS)
                       │ IP: 10.8.0.X
                       ↓
            ┌──────────────────────────┐
            │  Túnel VPN cifrado       │
            │  Puerto: 1194/UDP        │
            └──────────┬───────────────┘
                       │
                       ↓
            ┌─────────────────────────────┐
            │  Servidor OpenVPN AS        │
            │  IP LAN: 192.168.1.X        │
            │  IP VPN: 10.8.0.X           │
            └──────────┬──────────────────┘
                       │
                       ↓
            ┌─────────────────────────────┐
            │  Red Local 192.168.1.0/24   │
            │  - Servidor Apache          │
            │  - Zabbix                   │
            │  - Otros recursos           │
            └─────────────────────────────┘

## Referencias

- Documentación oficial: https://openvpn.net/access-server-manual/
- OpenVPN Connect: https://openvpn.net/client/
- Comunidad OpenVPN: https://forums.openvpn.net/
