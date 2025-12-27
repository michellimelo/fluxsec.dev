---
title: Direccionamiento IP
description: "Capítulo académico y operativo sobre direccionamiento IP en entornos Linux: fundamentos de IP, IPv4 e IPv6, tipos de direcciones, máscaras, subnetting y CIDR, routing básico, NAT, relación con firewall, IP en LAN y Wi-Fi, y conexión directa con ciberseguridad mediante ejemplos, tablas y comandos."
sidebar:
  order: 7
---

Este documento desarrolla el direccionamiento IP como **eje central** de la conectividad en redes. Aquí se explica IP en profundidad (IPv4/IPv6, tipos de direcciones, subredes y CIDR), y se conectan sus implicaciones con routing, NAT y firewall desde una perspectiva **de sistemas Linux** y **operación real**. La meta es que puedas leerlo como un capítulo académico: entender conceptos, aplicarlos, y diagnosticar problemas con comandos.

---

## 1. Qué es IP y por qué existe

Una red moderna no transmite “mensajes” de manera mágica: transmite **paquetes**. Para que un paquete llegue a su destino se necesitan dos cosas:
- una forma de **identificar el origen y el destino** (direcciones),
- una forma de **encaminar** el paquete por diferentes redes (routing).

El protocolo IP (Internet Protocol) cumple esa función: define un formato de paquete y un esquema de direccionamiento que permite que múltiples redes independientes se interconecten.

### 1.1 Dirección IP: identificador lógico, no físico

Una dirección IP es un identificador **lógico** asignado a una **interfaz de red** en un contexto de red. No identifica un “ordenador” en abstracto:
- un mismo equipo puede tener varias interfaces (Ethernet, Wi-Fi, VPN, Docker bridge),
- cada interfaz puede tener una o varias IP (IPv4/IPv6, alias, secundarios),
- la IP puede cambiar (DHCP, movilidad, VPN, rotación ISP).

En Linux, la pregunta correcta no es “qué IP tiene mi PC”, sino:
- “qué IP tiene cada interfaz y en qué subred está”.

### 1.2 IP y el concepto de “red” (subred) como frontera lógica

Una IP siempre se interpreta junto con una máscara/prefijo. Sin eso no existe el concepto de “mi red”:
- la red define qué destinos son “locales” (entrega directa),
- y qué destinos son “remotos” (requieren gateway).

Ejemplo intuitivo:
- si tu IP es 192.168.1.34/24, estás en la red 192.168.1.0/24.
- cualquier 192.168.1.X se considera “local”.
- cualquier otra red requiere enviar el tráfico al gateway.

### 1.3 IP como base de decisiones de sistema

El direccionamiento IP no es solo teoría de redes. En sistemas, IP determina:
- qué ruta toma un paquete (tabla de rutas),
- qué tráfico se permite o bloquea (firewall),
- cómo se registran eventos (logs con IP origen/destino),
- cómo se segmenta (subredes separadas por función),
- cómo se investigan incidentes (correlación por IP/tiempo/puerto).

---

## 2. IP vs MAC: lógico (L3) vs físico (L2)

En redes Ethernet/Wi-Fi, el envío real en la LAN se hace con direcciones MAC, pero el routing entre redes se hace con IP. La relación típica es:

1) La aplicación genera tráfico hacia una IP destino.  
2) El sistema decide si el destino es local o remoto (con prefijo).  
3) Si es local: necesita la MAC del destino (ARP/NDP).  
4) Si es remoto: necesita la MAC del gateway (ARP/NDP), y el router se encarga del resto.

Tabla comparativa:

| Característica | IP | MAC |
|---|---|---|
| Tipo | Lógica | Física (identificador de enlace) |
| Capa | Red (L3) | Enlace (L2) |
| Alcance | Inter-red (routing) | Red local (LAN) |
| Cambia | Sí (por red/entorno) | Normalmente no |
| Uso | Encaminamiento | Entrega local del frame |

Comandos Linux para ver ambas capas:
    ip addr
    ip link

---

## 3. Versiones del protocolo IP: IPv4 e IPv6

### 3.1 IPv4 (32 bits) y su realidad operativa

IPv4 usa direcciones de 32 bits, representadas como 4 octetos en decimal:
    192.168.1.34

Limitación estructural: el espacio es finito. Esto empujó a:
- uso masivo de direcciones privadas (RFC 1918),
- NAT (traducción de direcciones),
- CGNAT en ISP (NAT a gran escala).

IPv4 sigue dominando en muchas redes, por lo que un profesional debe dominar:
- subnetting,
- CIDR,
- routing,
- NAT,
- troubleshooting con herramientas clásicas.

### 3.2 IPv6 (128 bits) y su modelo

IPv6 usa 128 bits y notación hexadecimal:
    2001:db8:1a2b:0000:0000:0000:0000:0010

Se permite abreviar:
- eliminar ceros a la izquierda,
- sustituir una secuencia de 0s por :: (una vez).

Ejemplo:
    2001:db8:1a2b::10

IPv6 no existe “para ser bonito”, existe por:
- escalabilidad (espacio enorme),
- mejor modelado (tipos de direcciones),
- autoconfiguración,
- eliminación de broadcast (se usa multicast),
- restauración del modelo extremo a extremo (sin NAT obligatorio).

Comparativa esencial:

| Aspecto | IPv4 | IPv6 |
|---|---|---|
| Tamaño | 32 bits | 128 bits |
| Notación | Decimal | Hexadecimal |
| Broadcast | Sí | No |
| Autoconfiguración | Limitada | Nativa (SLAAC) |
| NAT | Frecuente | No necesario (aunque puede existir) |
| Coexistencia | Base actual | Presente y creciendo |

---

## 4. Estructura de IPv4: red + host (y por qué importa)

Una dirección IPv4 “sola” no dice a qué red pertenece. La pertenencia la define la máscara/prefijo.

Ejemplo:
- IP: 192.168.1.34
- Máscara: 255.255.255.0 (equivalente a /24)

Interpretación:
- Red: 192.168.1.0
- Broadcast: 192.168.1.255
- Hosts válidos: 192.168.1.1–192.168.1.254

Conceptos clave:
- Dirección de red: identifica la subred (no se asigna a hosts).
- Broadcast: difusión a toda la subred (en IPv4).
- Rango de hosts: direcciones asignables.

Comandos Linux para ver IP y prefijo:
    ip -br addr

---

## 5. Tipos de direcciones IPv4 (con usos reales)

Este apartado es crítico: “tipos de IP” no es memorizar rangos; es saber **para qué sirven** y **qué implican**.

### 5.1 Públicas

Son enrutable en Internet. Se usan para:
- servidores expuestos (web, correo, APIs),
- salida a Internet (IP del router o del firewall),
- infraestructura ISP.

En casa o empresa, normalmente solo tienes 1 (o pocas) IP públicas.

### 5.2 Privadas (RFC 1918)

No son enrutable en Internet. Se usan dentro de LAN/VPN.

Rangos:
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

Tabla de uso típico:

| Rango privado | Uso común | Ventaja | Riesgo típico |
|---|---|---|---|
| 10.0.0.0/8 | corporativo grande | mucho espacio | solapamiento con VPN si no se planifica |
| 172.16.0.0/12 | empresas | equilibrio | igual: solapes y mala documentación |
| 192.168.0.0/16 | hogar/pyme | familiar | excesiva reutilización, conflictos frecuentes |

### 5.3 Loopback (127.0.0.0/8)

Sirve para “volver al propio host”. Es esencial para:
- pruebas locales,
- servicios que escuchan solo en localhost,
- diagnósticos.

Ejemplo:
    ping -c 2 127.0.0.1

### 5.4 Link-local (169.254.0.0/16)

Se asigna automáticamente cuando no hay DHCP (APIPA). Indica:
- fallo de DHCP,
- conexión “física” pero sin configuración.

Diagnóstico típico: si ves 169.254.X.Y, tienes conectividad L2 pero no obtuviste IP.

### 5.5 Broadcast (por subred)

En una subred IPv4, el broadcast es la última dirección. Se usa para:
- descubrimientos y ciertos protocolos legacy,
- ARP funciona por broadcast (en el sentido de difusión L2).

En redes modernas se intenta limitar broadcast mediante segmentación.

### 5.6 Multicast (224.0.0.0/4)

Rango: 224.0.0.0 – 239.255.255.255  
Uso: uno-a-muchos (streaming, routing, discovery). No es “broadcast”: se entrega solo a suscriptores.

---

## 6. Máscaras, prefijos y subnetting (explicado con método)

### 6.1 Máscara / prefijo: significado exacto

Un prefijo /n significa: “los primeros n bits identifican la red”.
- /24 → 24 bits de red, 8 bits de host.
- /16 → 16 bits de red, 16 bits de host.

Tabla rápida (muy usada):

| Prefijo | Máscara | Hosts teóricos |
|---|---|---|
| /30 | 255.255.255.252 | 2 (enlace punto a punto típico) |
| /29 | 255.255.255.248 | 6 |
| /28 | 255.255.255.240 | 14 |
| /27 | 255.255.255.224 | 30 |
| /26 | 255.255.255.192 | 62 |
| /25 | 255.255.255.128 | 126 |
| /24 | 255.255.255.0 | 254 |
| /23 | 255.255.254.0 | 510 |
| /22 | 255.255.252.0 | 1022 |

Nota: en IPv4, tradicionalmente se resta 2 (red y broadcast). En algunos contextos (p. ej. enlaces /31) hay excepciones, pero la base académica es esta.

### 6.2 Subnetting: por qué existe en diseño

Subnetting divide una red mayor en redes menores para:
- segmentar por función (usuarios, servidores, invitados),
- reducir broadcast,
- aplicar políticas de firewall por subred,
- limitar impacto de incidentes (contenimiento lateral).

Ejemplo conceptual:
- 192.168.1.0/24 para todo “mezclado” es fácil pero inseguro.
- separar en /26 permite crear 4 segmentos: usuarios, servidores, IoT, invitados.

### 6.3 Ejemplo guiado: partir una /24 en 4 subredes

Partimos:
- 192.168.1.0/24

Queremos 4 subredes → necesitamos 2 bits extra de red (2^2 = 4).  
Nuevo prefijo: /26.

Subredes resultantes:
- 192.168.1.0/26     (hosts .1 a .62, broadcast .63)
- 192.168.1.64/26    (hosts .65 a .126, broadcast .127)
- 192.168.1.128/26   (hosts .129 a .190, broadcast .191)
- 192.168.1.192/26   (hosts .193 a .254, broadcast .255)

Errores típicos en subnetting:
- asignar gateway fuera del rango,
- olvidar reservar rangos para infraestructura (DHCP, routers, APs),
- solapar subredes entre sedes o VPNs.

---

## 7. CIDR: diseño moderno y resumen de rutas

CIDR (Classless Inter-Domain Routing) es el modelo actual. Dos usos clave:

1) Definir tamaños de red sin depender de clases (A/B/C).  
2) Hacer agregación (route summarization) para simplificar tablas.

Ejemplo de agregación:
- si tienes 192.168.0.0/24 y 192.168.1.0/24
- puedes resumir como 192.168.0.0/23 (si están contiguas y alineadas)

Esto es crítico en:
- routing corporativo,
- firewalls (reglas por prefijos),
- documentación y operación.

---

## 8. Routing básico: gateway, tabla de rutas y decisión

El direccionamiento IP no funciona sin routing. El routing decide el “próximo salto”.

### 8.1 Gateway por defecto

Si un destino no está en tu red local, tu host lo envía al gateway por defecto. Ese gateway suele ser:
- el router doméstico,
- un firewall corporativo,
- un router interno,
- una interfaz de VPN.

### 8.2 Tabla de rutas en Linux

Ver rutas:
    ip route show

Salida típica:
    default via 192.168.1.1 dev wlan0
    192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.34

Interpretación:
- “default via 192.168.1.1” → todo lo que no sea local va al gateway.
- “192.168.1.0/24 dev wlan0” → esa red es local en esa interfaz.

### 8.3 Ruta más específica gana

Si tienes:
- 10.0.0.0/8 por defecto hacia VPN
- pero 10.10.10.0/24 hacia otra interfaz
la /24 (más específica) se usa para esa subred.

Este principio es clave para:
- coexistencia de redes,
- split tunneling,
- rutas a servicios internos.

---

## 9. NAT: por qué existe y qué implica

NAT traduce direcciones (y frecuentemente puertos) entre redes. Aparece como respuesta operativa al agotamiento de IPv4 y a la necesidad de conectar redes privadas a Internet.

### 9.1 Tipos principales

- NAT estático: 1:1 (una IP privada siempre se traduce a una pública concreta).
- NAT dinámico: pool de IP públicas para varios internos.
- PAT (NAT por puertos): muchos internos comparten una IP pública diferenciándose por puertos.

Tabla conceptual:

| Tipo | Traducción | Uso típico | Observación |
|---|---|---|---|
| Estático | 1:1 | publicar un servidor interno | más predecible |
| Dinámico | N:pool | entornos con varias públicas | menos común en hogar |
| PAT | N:1 | hogares y pymes | el más común |

### 9.2 NAT y seguridad (realidad, no mito)

NAT no es un firewall. Puede “ocultar” direcciones internas, pero:
- no aplica políticas por sí mismo (eso lo hace el firewall/iptables),
- puede dificultar trazabilidad si no hay logs de traducción,
- rompe el modelo extremo a extremo (impacta en VoIP, P2P, etc.).

### 9.3 CGNAT (Carrier-Grade NAT)

Muchos ISP usan CGNAT: compartes IP pública con otros clientes. Consecuencias:
- no puedes abrir puertos hacia tu red fácilmente,
- servicios autoalojados se complican,
- depende de túneles/VPN inversa o IPv6.

---

## 10. IP y firewall: relación directa con control de tráfico

Un firewall filtra tráfico basándose en criterios como:
- IP origen/destino,
- prefijos (subredes),
- puertos y protocolos,
- estado de conexión (stateful).

### 10.1 Stateless vs stateful (visión práctica)

| Tipo | Qué mira | Ventaja | Limitación |
|---|---|---|---|
| Stateless | paquete individual | simple, rápido | no entiende “conexión” |
| Stateful | estado de conexión | más seguro y práctico | más complejidad/estado |

### 10.2 Regla por subred: segmentación real

El direccionamiento IP permite segmentar:
- usuarios: 10.10.10.0/24
- servidores: 10.10.20.0/24
- invitados: 10.10.30.0/24

Y en firewall:
- permitir usuarios → servidores solo en puertos específicos,
- bloquear invitados → servidores,
- permitir invitados → Internet únicamente.

Esto muestra por qué IP, subnetting y firewall no se entienden separados: el diseño IP habilita la política.

Ejemplo conceptual de política:
- permitir 10.10.10.0/24 → 10.10.20.10:443
- denegar 10.10.30.0/24 → 10.10.20.0/24 (todo)

---

## 11. IP en LAN: segmentación, VLAN y operación

En una LAN simple doméstica, suele haber una sola subred (por ejemplo 192.168.1.0/24). En empresa es habitual separar:
- usuarios,
- servidores,
- administración,
- VoIP,
- IoT,
- invitados.

La separación lógica se implementa con:
- VLAN (capa 2),
- subredes IP por VLAN (capa 3),
- routing inter-VLAN controlado por firewall.

En este documento no profundizamos VLAN (eso va mejor en “redes-fundamentos”), pero sí debes entender la relación: una buena segmentación IP reduce el movimiento lateral y facilita control.

---

## 12. IP en Wi-Fi: lo que cambia y lo que no

Wi-Fi es un medio (capa 2). IP funciona igual, pero el entorno cambia:
- movilidad,
- riesgo de acceso no autorizado,
- necesidad de segmentación por SSID/VLAN,
- mayor exposición a ataques de capa 2/3.

Buenas prácticas de direccionamiento en Wi-Fi:
- SSID invitados en subred distinta (p. ej. 10.10.30.0/24),
- aislamiento de clientes (client isolation) cuando aplique,
- firewall estricto invitados → LAN,
- logs y control de DHCP.

Comandos útiles en Linux para interfaz Wi-Fi:
    ip link
    iw dev
    nmcli dev status

---

## 13. IP y servicios: DNS, web, logs y auditoría

IP es la base de:
- DNS: nombre → IP (y viceversa en algunos casos),
- servicios web: servidor escucha en IP:puerto,
- registros: casi todos los logs de red registran IP origen/destino.

Ejemplos de operación en Linux:
- ver sockets escuchando:
    ss -lntp

- comprobar resolución DNS:
    getent hosts ejemplo.com

- comprobar rutas y latencia:
    ping -c 4 1.1.1.1
    traceroute 1.1.1.1

Nota: en troubleshooting profesional, distinguir fallo por capa:
- si ping a IP pública funciona pero DNS no resuelve → problema DNS
- si DNS resuelve pero no hay ruta → problema routing/firewall

---

## 14. Troubleshooting esencial en Linux (IP desde el punto de vista operativo)

Este bloque es intencionadamente práctico: no basta entender “qué es IP”; hay que poder diagnosticar.

### 14.1 Ver IPs y prefijos por interfaz

    ip -br addr

Interpretación:
- identifica interfaz (eth0, wlan0, wg0, docker0),
- mira si hay IPv4/IPv6,
- confirma prefijo (p. ej. /24).

### 14.2 Ver tabla de rutas

    ip route show

Puntos a revisar:
- existe default route,
- default route apunta al gateway correcto,
- rutas específicas (VPN) no “secuestran” tráfico inesperadamente.

### 14.3 Ver ARP (IPv4) y vecinos (IPv6)

ARP (IPv4):
    ip neigh show

Si no hay entrada para el gateway, puede ser:
- problema de capa 2,
- Wi-Fi aislado,
- gateway caído,
- firewall L2/seguridad en red.

### 14.4 Diagnóstico rápido por preguntas

1) ¿Tengo IP?
- ip -br addr

2) ¿Tengo gateway y ruta por defecto?
- ip route show

3) ¿Puedo llegar a una IP pública?
- ping -c 2 1.1.1.1

4) ¿Puedo resolver nombres?
- getent hosts ejemplo.com

5) ¿Dónde se corta?
- traceroute 1.1.1.1

---

## 15. IP y ciberseguridad: por qué es imprescindible dominarlo

En ciberseguridad, IP es lenguaje base:
- en logs (SIEM, firewall, proxy),
- en tráfico (PCAP, NetFlow),
- en inteligencia (IOCs basados en IP/rangos),
- en segmentación (controles por subred),
- en respuesta a incidentes (aislar rangos, bloquear, trazar).

### 15.1 Riesgos y ataques relacionados con IP

- Escaneo de rangos: enumeración de hosts y servicios.
- IP spoofing: suplantación de origen (mitigable con filtros/antispoof).
- Movimiento lateral: desplazamiento entre subredes si no hay segmentación.
- Evasión: uso de redes internas “planas” y reglas permisivas.

### 15.2 Controles defensivos conectados a direccionamiento

- diseño de subredes por función,
- firewall inter-subred con mínimo privilegio,
- registros de NAT (si aplica),
- monitorización de flujos entre segmentos,
- listas de control (ACL) y antispoof en borde.

En resumen: un diseño IP correcto reduce superficie de ataque, mejora visibilidad y permite contención rápida.

---

## 16. Buenas prácticas de diseño de direccionamiento IP (profesional)

### 16.1 Principios

- Coherencia: rangos con sentido (no “lo que salga”).
- No solapamiento: especialmente en VPN y multi-sede.
- Segmentación: por función y nivel de confianza.
- Documentación: imprescindible (sin documentación no hay operación).
- Reserva de infraestructura: gateways, DHCP, switches, APs, firewalls.

### 16.2 Ejemplo de plan simple (empresa pequeña)

Tabla de ejemplo:

| Segmento | Subred | Uso | Nota |
|---|---|---|---|
| Usuarios | 10.10.10.0/24 | PCs | acceso limitado a servidores |
| Servidores | 10.10.20.0/24 | servicios internos | mayor protección |
| Invitados Wi-Fi | 10.10.30.0/24 | invitados | solo Internet |
| Administración | 10.10.40.0/24 | equipos de gestión | acceso restringido |

Este tipo de diseño habilita reglas claras en firewall y facilita auditoría.

---

## 17. Resumen conceptual del tema (mapa mental textual)

    DIRECCIONAMIENTO IP
      ├─ Fundamentos
      │   ├─ IP como identificador lógico
      │   └─ Red/prefijo como frontera
      ├─ IPv4
      │   ├─ Tipos de IP (pública/privada/loopback/link-local/multicast)
      │   └─ Máscaras, subnetting y CIDR
      ├─ IPv6
      │   ├─ Tipos (global/link-local/ULA/multicast/anycast)
      │   └─ SLAAC/DHCPv6
      ├─ Routing
      │   ├─ Gateway
      │   └─ Tabla de rutas
      ├─ NAT
      │   ├─ PAT
      │   └─ CGNAT
      ├─ Firewall (relación directa)
      │   ├─ Stateless/Stateful
      │   └─ Segmentación por subred
      ├─ LAN y Wi-Fi (operación)
      └─ Ciberseguridad
          ├─ Segmentación y contención
          └─ Investigación y logs

---

## 18. Conclusión y conexión con ciberseguridad

El direccionamiento IP es el pilar lógico que permite la comunicación en redes y habilita routing, NAT y políticas de firewall. Dominar IP implica entender tipos de direcciones, subredes y CIDR, y ser capaz de diagnosticar problemas reales en Linux mediante comandos y análisis por capas.

En ciberseguridad, IP es fundamental para segmentar redes, reducir movimiento lateral, interpretar logs y tráfico, y ejecutar medidas de contención ante incidentes. Un diseño de direccionamiento coherente y documentado simplifica la defensa: hace que las políticas sean aplicables, medibles y auditables, y convierte la red en un sistema controlable en lugar de un conjunto de conexiones improvisadas.