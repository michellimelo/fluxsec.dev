---
title: "Certificados SSL/TLS"
description: "Habilitar HTTPS para conexiones seguras"
sidebar:
  order: 8
---

SSL/TLS permite que tu web use HTTPS en lugar de HTTP, cifrando todas las comunicaciones entre el navegador y tu servidor. En este capítulo instalaremos un certificado SSL gratuito de Let's Encrypt usando Certbot.

**Tiempo estimado:** 25-35 minutos

**¿Por qué necesitas HTTPS?**

- Cifra las comunicaciones (seguridad)
- Los navegadores modernos marcan HTTP como "No seguro"
- Mejora el SEO (Google prioriza HTTPS)
- Genera confianza en los visitantes
- Es gratis con Let's Encrypt

## Conceptos fundamentales

### HTTP vs HTTPS

**HTTP (Puerto 80):**

- Sin cifrado
- Datos viajan en texto plano
- Cualquiera puede interceptar y leer
- Marcado como "No seguro" por navegadores

**HTTPS (Puerto 443):**

- Con cifrado SSL/TLS
- Datos viajan cifrados
- Protección contra interceptación
- Candado verde en el navegador

### ¿Qué es Let's Encrypt?

Let's Encrypt es una autoridad de certificación gratuita, automatizada y abierta. Proporciona certificados SSL/TLS sin costo para cualquier dominio.

### ¿Qué es Certbot?

Certbot es una herramienta que automatiza la obtención e instalación de certificados de Let's Encrypt. Configura Apache automáticamente.

## Requisitos previos

IMPORTANTE - Verifica estos requisitos:

- Tu dominio DuckDNS debe estar funcionando
- Port forwarding configurado (puerto 80 y 443)
- Tu web debe ser accesible desde Internet vía HTTP
- Apache debe estar corriendo

### Verificar requisitos

    # Verificar que Apache está corriendo
    sudo systemctl status apache2

    # Verificar que tu web es accesible localmente
    curl http://localhost

    # Verificar DNS
    nslookup tudominio.duckdns.org

    # Verificar que puerto 80 está abierto en firewall
    sudo ufw status | grep 80

    # Verificar que puerto 443 está abierto en firewall
    sudo ufw status | grep 443

## Paso 1: Instalar Certbot

### 1.1 Actualizar sistema

    sudo apt update

### 1.2 Instalar Certbot y plugin de Apache

    sudo apt install certbot python3-certbot-apache -y

Esto instala:

- **certbot:** La herramienta principal
- **python3-certbot-apache:** Plugin para Apache

### 1.3 Verificar instalación

    certbot --version

Deberías ver algo como:

    certbot 2.7.4

## Paso 2: Obtener certificado SSL

IMPORTANTE: Asegúrate de que tu dominio sea accesible desde Internet ANTES de continuar. Certbot verificará que controlas el dominio accediendo a él desde Internet.

### 2.1 Ejecutar Certbot

Ejecuta Certbot con el plugin de Apache:

    sudo certbot --apache -d tudominio.duckdns.org

(Reemplaza `tudominio.duckdns.org` con tu dominio real)

### 2.2 Proceso interactivo

Certbot te hará varias preguntas:

**Pregunta 1: Email**

    Enter email address (used for urgent renewal and security notices)

Ingresa tu email y presiona Enter.

**Pregunta 2: Términos de servicio**

    Please read the Terms of Service...
    (A)gree/(C)ancel:

Escribe **A** y presiona Enter.

**Pregunta 3: Newsletter (Opcional)**

    Would you be willing to share your email address with EFF?
    (Y)es/(N)o:

Escribe **N** (o Y si quieres) y presiona Enter.

**Pregunta 4: Redirigir HTTP a HTTPS**

    Please choose whether or not to redirect HTTP traffic to HTTPS...
    1: No redirect
    2: Redirect - Make all requests redirect to secure HTTPS access
    Select the appropriate number [1-2]:

Escribe **2** y presiona Enter (recomendado).

### 2.3 Proceso de validación

Certbot realizará estos pasos automáticamente:

1. Crea archivos de validación en tu servidor
2. Let's Encrypt intenta acceder a esos archivos desde Internet
3. Si tiene éxito, genera el certificado
4. Instala el certificado en Apache
5. Configura el VirtualHost para HTTPS

Si todo va bien, verás un mensaje como:

    Successfully received certificate.
    Certificate is saved at: /etc/letsencrypt/live/tudominio.duckdns.org/fullchain.pem
    Key is saved at: /etc/letsencrypt/live/tudominio.duckdns.org/privkey.pem
    Deploying certificate...
    Successfully deployed certificate for tudominio.duckdns.org to /etc/apache2/sites-available/biotonic-le-ssl.conf
    Congratulations! You have successfully enabled HTTPS on https://tudominio.duckdns.org

## Paso 3: Verificar configuración SSL

### 3.1 Verificar en el navegador

Abre tu navegador y accede a:

    https://tudominio.duckdns.org

Nota: Ahora es **https://** (con 's')

Comprueba:

- Candado verde en la barra de direcciones
- No hay advertencias de seguridad
- La web carga correctamente

### 3.2 Verificar redirección HTTP → HTTPS

Intenta acceder con HTTP:

    http://tudominio.duckdns.org

Deberías ser redirigido automáticamente a HTTPS.

### 3.3 Verificar con SSL Labs

Comprueba la calidad de tu configuración SSL:

1. Ve a: https://www.ssllabs.com/ssltest/
2. Ingresa tu dominio: tudominio.duckdns.org
3. Haz clic en "Submit"
4. Espera 2-3 minutos para el análisis

Deberías obtener una calificación A o A+.

### 3.4 Verificar desde terminal

    # Verificar certificado
    curl -I https://tudominio.duckdns.org

    # Información detallada del certificado
    openssl s_client -connect tudominio.duckdns.org:443 -servername tudominio.duckdns.org < /dev/null

## Paso 4: Entender la estructura de certificados

### Ubicación de certificados

    /etc/letsencrypt/
    ├── live/
    │   └── tudominio.duckdns.org/
    │       ├── fullchain.pem   → Certificado completo
    │       ├── privkey.pem     → Clave privada
    │       ├── cert.pem        → Certificado del dominio
    │       └── chain.pem       → Cadena de certificados
    ├── archive/
    │   └── tudominio.duckdns.org/  → Versiones anteriores
    └── renewal/
        └── tudominio.duckdns.org.conf  → Configuración renovación

### Archivos de certificado

- **fullchain.pem:** Certificado + cadena intermedia
- **privkey.pem:** Clave privada (¡MUY IMPORTANTE!)
- **cert.pem:** Solo tu certificado
- **chain.pem:** Certificados intermedios

### Ver información del certificado

    sudo certbot certificates

Resultado:

    Found the following certs:
      Certificate Name: tudominio.duckdns.org
        Domains: tudominio.duckdns.org
        Expiry Date: 2026-02-10 12:34:56+00:00 (VALID: 89 days)
        Certificate Path: /etc/letsencrypt/live/tudominio.duckdns.org/fullchain.pem
        Private Key Path: /etc/letsencrypt/live/tudominio.duckdns.org/privkey.pem

## Paso 5: Renovación automática

Certificados de Let's Encrypt:  
Los certificados de Let's Encrypt son válidos por 90 días. Certbot configura renovación automática para que no tengas que preocuparte.

### 5.1 Verificar timer de renovación

Certbot instala un timer de systemd para renovación automática:

    sudo systemctl status certbot.timer

Deberías ver:

    ● certbot.timer - Run certbot twice daily
         Loaded: loaded
         Active: active (waiting)

### 5.2 Probar renovación (dry run)

Prueba la renovación sin ejecutarla realmente:

    sudo certbot renew --dry-run

Si ves **"Congratulations, all simulated renewals succeeded"**, la renovación automática funcionará correctamente.

### 5.3 Renovar manualmente (si es necesario)

Para renovar todos los certificados antes de expirar:

    sudo certbot renew

Certbot solo renovará certificados que expiren en menos de 30 días.

### 5.4 Forzar renovación

Para forzar renovación incluso si no es necesario:

    sudo certbot renew --force-renewal

## Configuración de Apache con SSL

### Verificar VirtualHost SSL

Certbot creó automáticamente un VirtualHost para SSL:

    sudo cat /etc/apache2/sites-available/biotonic-le-ssl.conf

Contenido ejemplo:

    <IfModule mod_ssl.c>
    <VirtualHost *:443>
        ServerName tudominio.duckdns.org
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/biotonic

        ErrorLog ${APACHE_LOG_DIR}/biotonic-error.log
        CustomLog ${APACHE_LOG_DIR}/biotonic-access.log combined

        SSLEngine on
        SSLCertificateFile /etc/letsencrypt/live/tudominio.duckdns.org/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/tudominio.duckdns.org/privkey.pem
        Include /etc/letsencrypt/options-ssl-apache.conf
    </VirtualHost>
    </IfModule>

### VirtualHost HTTP (redirección)

Tu VirtualHost original ahora redirige a HTTPS:

    sudo cat /etc/apache2/sites-available/biotonic.conf

Ahora incluye líneas de redirección:

    <VirtualHost *:80>
        ServerName tudominio.duckdns.org

        RewriteEngine on
        RewriteCond %{SERVER_NAME} =tudominio.duckdns.org
        RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
    </VirtualHost>

## Mejorar seguridad SSL (opcional)

### Headers de seguridad

Edita tu VirtualHost SSL:

    sudo nano /etc/apache2/sites-available/biotonic-le-ssl.conf

Añade estos headers de seguridad dentro de `<VirtualHost>`:

        # Headers de seguridad
        Header always set Strict-Transport-Security "max-age=31536000"
        Header always set X-Content-Type-Options "nosniff"
        Header always set X-Frame-Options "SAMEORIGIN"
        Header always set X-XSS-Protection "1; mode=block"

Guarda y recarga Apache:

    sudo systemctl reload apache2

¿Qué hacen estos headers?

- **HSTS:** Fuerza HTTPS por 1 año
- **X-Content-Type-Options:** Previene MIME sniffing
- **X-Frame-Options:** Protege contra clickjacking
- **X-XSS-Protection:** Protección contra XSS

## Comandos útiles de Certbot

### Gestión de certificados

    # Ver todos los certificados
    sudo certbot certificates

    # Renovar todos los certificados
    sudo certbot renew

    # Renovar certificado específico
    sudo certbot renew --cert-name tudominio.duckdns.org

    # Probar renovación (sin ejecutar)
    sudo certbot renew --dry-run

    # Revocar certificado
    sudo certbot revoke --cert-path /etc/letsencrypt/live/tudominio.duckdns.org/cert.pem

    # Eliminar certificado
    sudo certbot delete --cert-name tudominio.duckdns.org

### Reconfiguración

    # Reconfigurar certificado existente
    sudo certbot --apache -d tudominio.duckdns.org

    # Añadir otro dominio al certificado
    sudo certbot --apache -d tudominio.duckdns.org -d www.tudominio.duckdns.org

    # Expandir certificado con nuevo dominio
    sudo certbot --expand -d tudominio.duckdns.org -d otro.duckdns.org

## Solución de problemas SSL

### Error: Domain validation failed

- Verifica que tu dominio sea accesible desde Internet
- Comprueba port forwarding (puerto 80 debe estar abierto)
- Verifica firewall: `sudo ufw status`
- Prueba acceder a http://tudominio.duckdns.org desde otro lugar

### Error: Apache configuration error

- Verifica sintaxis: `sudo apache2ctl configtest`
- Verifica que el módulo SSL esté activo: `sudo a2enmod ssl`
- Reinicia Apache: `sudo systemctl restart apache2`

### Certificado no se renueva automáticamente

- Verifica timer: `sudo systemctl status certbot.timer`
- Habilitar timer: `sudo systemctl enable certbot.timer`
- Iniciar timer: `sudo systemctl start certbot.timer`
- Prueba renovación: `sudo certbot renew --dry-run`

### Warning "certificado expirará pronto"

- Ejecuta: `sudo certbot renew`
- Si falla, revisa logs: `sudo tail -50 /var/log/letsencrypt/letsencrypt.log`
- Verifica que tu dominio siga siendo accesible

### Navegador muestra "conexión no segura"

- Limpia caché del navegador (Ctrl+Shift+Del)
- Verifica que uses HTTPS (no HTTP)
- Verifica certificado: `sudo certbot certificates`
- Comprueba que no haya expirado

## Monitoreo y mantenimiento

### Verificar expiración

    # Ver información de certificados
    sudo certbot certificates

    # Ver días restantes
    openssl x509 -noout -dates -in /etc/letsencrypt/live/tudominio.duckdns.org/cert.pem

### Ver logs de renovación

    # Logs de Certbot
    sudo tail -f /var/log/letsencrypt/letsencrypt.log

    # Últimas renovaciones
    sudo grep renew /var/log/letsencrypt/letsencrypt.log

### Notificaciones por email

Let's Encrypt enviará emails a tu dirección cuando:

- El certificado está por expirar (30, 14 y 7 días antes)
- Hay problemas con la renovación automática

## Alternativa: certificado con Cloudflare

Nota: Si usas Cloudflare Tunnel (próximo capítulo), Cloudflare maneja SSL automáticamente. No necesitarías Let's Encrypt.

## Resumen de archivos SSL

    # Ver estructura de certificados
    sudo tree /etc/letsencrypt/live/tudominio.duckdns.org/

    # Ver configuración de renovación
    sudo cat /etc/letsencrypt/renewal/tudominio.duckdns.org.conf

    # Ver configuración SSL de Apache
    sudo cat /etc/letsencrypt/options-ssl-apache.conf

    # Ver sitios SSL habilitados
    ls -la /etc/apache2/sites-enabled/ | grep ssl

## Verificación final

Comprueba que todo funciona correctamente:

    # Verificar certificado instalado
    sudo certbot certificates

    # Verificar Apache con SSL
    sudo apache2ctl -M | grep ssl

    # Verificar sitios activos
    ls /etc/apache2/sites-enabled/

    # Probar HTTPS
    curl -I https://tudominio.duckdns.org

    # Verificar redirección HTTP → HTTPS
    curl -I http://tudominio.duckdns.org

    # Verificar renovación automática
    sudo certbot renew --dry-run

Tu web ahora usa HTTPS con un certificado válido de Let's Encrypt. Las conexiones están cifradas y seguras. La renovación es automática.

## Comparativa: Let's Encrypt vs Cloudflare

### Let's Encrypt (método actual)

- Control total del certificado
- No depende de servicios externos
- Funciona con port forwarding directo
- Requiere puerto 80 abierto
- Tu IP pública está expuesta
- Renovación cada 90 días

### Cloudflare Tunnel (alternativa)

- No necesita port forwarding
- IP pública oculta (proxy de Cloudflare)
- SSL gestionado por Cloudflare
- Protección DDoS incluida
- Dependencia de Cloudflare
- Latencia adicional mínima