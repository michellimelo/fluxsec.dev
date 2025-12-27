---
title: "Configuración de red"
description: "Configurar modo Bridge Adapter para acceso desde tu red local."
sidebar:
  order: 2
---

En este capítulo configuraremos la red de tu máquina virtual en modo "Bridge Adapter" (Adaptador Puente). Esto permitirá que tu VM obtenga una IP de tu red local, haciéndola accesible desde otros dispositivos de tu casa.

**Tiempo estimado:** 15-20 minutos

> **¿Qué es el modo Bridge?**  
> En modo Bridge, tu máquina virtual se comporta como un ordenador físico más en tu red. Obtiene su propia IP del router (mediante DHCP) y puede ser accedida directamente desde otros dispositivos de tu red local.

## Modos de red en VirtualBox

### Comparación de modos

**NAT (Por defecto):**

- La VM puede acceder a Internet
- La VM NO es accesible desde tu red local
- Útil para: Navegación web, descargas, uso personal

**Bridge Adapter (Lo que usaremos):**

- La VM obtiene IP de tu router
- La VM ES accesible desde tu red local
- Útil para: Servidores, servicios de red, acceso remoto

## Paso 1: Apagar la máquina virtual

> **Importante:** La configuración de red debe hacerse con la VM apagada.

Si tu VM está encendida, apágala correctamente:

    sudo shutdown now

O desde VirtualBox: Máquina → Cerrar → Apagar

## Paso 2: Configurar Bridge Adapter en VirtualBox

### 2.1 Acceder a configuración

1. En VirtualBox, selecciona tu VM "ubuntu-server"
2. Haz clic en **"Configuración"** (icono de engranaje)
3. Ve a la sección **"Red"** en el panel lateral

### 2.2 Configurar adaptador 1

En la pestaña "Adaptador 1":

    [✓] Habilitar adaptador de red
    Conectado a: Adaptador puente (Bridge Adapter)
    Nombre: [Selecciona tu adaptador de red físico]

> **¿Qué adaptador seleccionar?**  
> - Si usas cable ethernet: Selecciona tu adaptador Ethernet/LAN  
> - Si usas WiFi: Selecciona tu adaptador WiFi/Wireless  
> - Ejemplo nombres: "Realtek PCIe GBE", "Intel WiFi", "en0", "wlan0"

### 2.3 Configuración avanzada (opcional pero recomendada)

Haz clic en "Avanzado" para expandir las opciones:

    Tipo de adaptador: Intel PRO/1000 MT Desktop (82540EM)
    Modo promiscuo: Denegar
    Cable conectado: [✓]

Haz clic en **"Aceptar"** para guardar los cambios.

## Paso 3: Iniciar la VM y verificar IP

### 3.1 Arrancar la VM

1. Selecciona tu VM en VirtualBox
2. Haz clic en "Iniciar"
3. Inicia sesión con tu usuario y contraseña

### 3.2 Verificar la nueva IP

Ejecuta el siguiente comando para ver tu configuración de red:

    ip addr show

**Busca tu adaptador de red principal** (generalmente `enp0s3` o `eth0`). Deberías ver algo como:

    2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
        link/ether 08:00:27:xx:xx:xx
        inet 192.168.1.X/24 brd 192.168.1.255 scope global dynamic enp0s3
           valid_lft 86400sec preferred_lft 86400sec

La línea que empieza con `inet` muestra tu IP local. En este ejemplo es `192.168.1.X`. Tu IP puede variar dependiendo de tu router.

> Nota técnica: si el adaptador aparece como `DOWN` o no ves una línea `inet`, revisa que el adaptador esté habilitado, conectado y que tu red entregue DHCP. En VirtualBox, el check "Cable conectado" debe estar marcado.

### 3.3 Anotar tu IP

**Anota tu IP local** - la necesitarás en pasos posteriores. Ejemplo:

    IP VM Ubuntu: 192.168.1.X
    Gateway (Router): 192.168.1.1
    Red: 192.168.1.0/24

## Paso 4: Verificar conectividad

### 4.1 Verificar puerta de enlace (gateway)

Tu router actúa como gateway. Verifica que puedas alcanzarlo:

    ip route show

Deberías ver una línea similar a:

    default via 192.168.1.1 dev enp0s3 proto dhcp

Esto significa que tu gateway (router) está en `192.168.1.1`.

### 4.2 Probar conectividad al router

    ping -c 4 192.168.1.1

Deberías recibir 4 respuestas exitosas.

### 4.3 Probar conectividad a Internet

    ping -c 4 8.8.8.8

Si recibes respuestas, tu conexión a Internet funciona correctamente.

### 4.4 Probar resolución DNS

    ping -c 4 google.com

Si funciona, tu DNS está configurado correctamente.

Si los pings a IP funcionan pero `google.com` no, el problema suele estar en DNS (resolución) y no en conectividad básica.

## Paso 5: Acceder desde tu PC Windows/Host

Ahora vamos a verificar que puedes acceder a tu VM desde tu ordenador principal.

### Desde Windows (PowerShell o CMD)

    ping 192.168.1.X

(Reemplaza `192.168.1.X` con la IP de tu VM)

Si recibes respuestas, tu VM es accesible desde tu red local.

## Configuración estática vs DHCP

### DHCP (actual - recomendado para empezar)

- **Ventajas:** Configuración automática, fácil de usar
- **Desventajas:** La IP puede cambiar al reiniciar
- **Solución:** Reservar IP en el router (opcional)

### IP estática (avanzado - opcional)

Si prefieres que tu VM siempre tenga la misma IP, puedes configurarla manualmente.

## Configurar IP estática (opcional)

> **Solo si es necesario:** Por ahora, DHCP es suficiente. Esta sección es opcional y para usuarios avanzados.

Si decides configurar IP estática, edita el archivo de configuración de red:

    sudo nano /etc/netplan/00-installer-config.yaml

Contenido ejemplo para IP estática:

    network:
      version: 2
      renderer: networkd
      ethernets:
        enp0s3:
          addresses:
            - 192.168.1.X/24
          routes:
            - to: default
              via: 192.168.1.1
          nameservers:
            addresses:
              - 8.8.8.8
              - 8.8.4.4

Guarda (Ctrl+O, Enter) y sal (Ctrl+X).

Aplica los cambios:

    sudo netplan apply

> Nota técnica: si tras aplicar cambios pierdes conectividad, vuelve a abrir el archivo y revisa que `enp0s3` coincide con tu interfaz real (compruébalo con `ip link`). Un nombre de interfaz incorrecto hace que netplan no aplique sobre la NIC esperada.

## Resumen de configuración de red

### Información de tu red (ejemplo)

    IP VM Ubuntu: 192.168.1.X
    Máscara: 255.255.255.0 (/24)
    Gateway: 192.168.1.1
    DNS: 8.8.8.8, 8.8.4.4
    Modo: Bridge Adapter
    Adaptador: enp0s3

Anota esta información.

## Verificación final

Ejecuta este comando para ver toda la información de tu configuración de red:

    ip addr show && echo "---" && ip route show && echo "---" && cat /etc/resolv.conf

Esto te mostrará:

- Todas tus interfaces de red y sus IPs
- Tu tabla de rutas (gateway)
- Tus servidores DNS

## Solución de problemas comunes

### No obtengo IP en modo Bridge

- Verifica que seleccionaste el adaptador de red correcto en VirtualBox
- Asegúrate de que "Cable conectado" está marcado
- Reinicia la VM después de cambiar la configuración
- Verifica que tu firewall no esté bloqueando DHCP

### No puedo hacer ping desde mi PC a la VM

- Verifica que ambos estén en la misma red (192.168.1.x)
- Desactiva temporalmente el firewall de tu PC para probar
- Verifica que no haya aislamiento de clientes en tu router WiFi

### La VM tiene Internet pero no es accesible

- Verifica que estés usando Bridge Adapter, no NAT
- Reinicia tanto la VM como VirtualBox
- Verifica la configuración del firewall UFW (lo veremos más adelante)

## Conclusión

La máquina virtual está configurada en modo Bridge Adapter y es accesible desde tu red local. La conectividad queda verificada mediante pruebas contra el gateway, una IP pública y un nombre de dominio, lo que confirma que el enrutamiento y la resolución DNS funcionan correctamente.
