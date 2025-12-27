---
title: Fundamentos de redes
description: "Capítulo base y profundo de redes: modelos OSI y TCP/IP, encapsulación, medios de transmisión, Ethernet y Wi-Fi, direccionamiento L2, dominios de colisión/broadcast, MTU y fragmentación, rendimiento (latencia/jitter/pérdida), y herramientas esenciales de diagnóstico en Linux. Prepara el terreno para direccionamiento IP y dispositivos de red."
sidebar:
  order: 6
---

Una red de datos no es “Internet” ni “Wi-Fi”: es un **sistema físico y lógico** que permite que dos extremos intercambien información con garantías mínimas de **entrega, integridad, orden, rendimiento y control**. Para entender redes de verdad (y poder defenderlas), hay que dominar cuatro ideas:

1) **Encapsulación**: los datos viajan “envueltos” en capas (cabeceras/tráilers) que permiten transporte y control.  
2) **Modelos**: OSI y TCP/IP no son dogmas; son mapas mentales para razonar, diagnosticar y diseñar.  
3) **Medio y acceso**: el cableado y el aire (Wi-Fi) condicionan rendimiento, fiabilidad y superficie de ataque.  
4) **Dominios y alcance**: quién “ve” a quién (colisión/broadcast) define tanto el funcionamiento como la seguridad.

Este módulo construye la base conceptual y operativa. El **direccionamiento IP** (subnetting, CIDR, routing, NAT) se trata en su capítulo específico, y los **dispositivos** (switch/router/firewall/IDS) en el siguiente.

---

## 2. Qué es una red: componentes y objetivos

### 2.1 Elementos mínimos

- **Nodos (hosts)**: equipos finales (PC, móvil, servidor, IoT).
- **Interfaces**: tarjetas de red (Ethernet/Wi-Fi) y sus parámetros (MAC, MTU, duplex).
- **Medio**: cable (cobre/fibra) o radio (Wi-Fi).
- **Reglas (protocolos)**: acuerdos para hablar (Ethernet, ARP, IP, TCP/UDP, DNS, HTTP, etc.).
- **Servicios de soporte**: resolución de nombres, asignación de configuración, sincronización de tiempo.

### 2.2 Objetivos reales de una red

- **Conectividad**: que un extremo pueda alcanzar al otro.
- **Fiabilidad**: manejar errores del medio (ruido, interferencias, pérdidas).
- **Escalabilidad**: crecer sin colapsar el dominio de difusión ni la administración.
- **Rendimiento**: throughput útil, latencia, jitter y pérdida bajo control.
- **Seguridad**: autenticación, autorización, segmentación, trazabilidad y respuesta.

---

## 3. Modelos OSI y TCP/IP: cómo pensar, no cómo memorizar

Los modelos organizan la complejidad. No describen “cajas” perfectas: describen **funciones**.

### 3.1 OSI (7 capas): funciones y ejemplos

Tabla orientativa (la red real mezcla capas, pero el modelo ayuda):

| Capa | Nombre | Unidad de datos | Qué resuelve | Ejemplos |
|------|--------|------------------|--------------|----------|
| 7 | Aplicación | Datos | Semántica del servicio | HTTP, DNS, SMTP |
| 6 | Presentación | Datos | Formato, codificación, cifrado | TLS (conceptualmente), UTF-8 |
| 5 | Sesión | Datos | Sesiones, control de diálogo | RPC, sesiones lógicas |
| 4 | Transporte | Segmento/Datagrama | Puertos, fiabilidad, control de flujo | TCP, UDP |
| 3 | Red | Paquete | Direccionamiento lógico y encaminamiento | IP, ICMP |
| 2 | Enlace | Trama | Acceso al medio, MAC, detección de errores | Ethernet, Wi-Fi (MAC) |
| 1 | Física | Bits | Señal, voltaje/luz/radio | UTP, fibra, radio |

Ideas clave:
- Cada capa añade **metadatos** (cabeceras) para cumplir una función.
- La seguridad se ubica en varias capas: no hay una única “capa de seguridad”.

### 3.2 TCP/IP (modelo práctico): lo que más verás en sistemas

TCP/IP simplifica en 4–5 capas (según autor). En operaciones, suele bastar:

- **Acceso a red**: físico + enlace (Ethernet/Wi-Fi).
- **Internet**: IP (direccionamiento y routing).
- **Transporte**: TCP/UDP.
- **Aplicación**: protocolos de usuario (DNS/HTTP/SSH…).

La ventaja de TCP/IP: se ajusta mejor al stack real de Internet y a lo que diagnosticas con herramientas.

---

## 4. Encapsulación: el “viaje” de un mensaje

Cuando una aplicación envía datos, no “sale” texto sin más. Se encapsula:

- La aplicación genera **datos**.
- Transporte (TCP/UDP) añade cabecera: **puertos**, control, (y fiabilidad si TCP).
- Red (IP) añade cabecera: **IP origen/destino**, TTL, etc.
- Enlace (Ethernet/Wi-Fi) añade cabecera y trailer: **MAC origen/destino**, tipo, FCS.

Diagrama mental:

    [Datos de Aplicación]
          ↓
    [TCP/UDP | Datos]               (puertos)
          ↓
    [IP | TCP/UDP | Datos]          (IP, TTL, etc.)
          ↓
    [ETH/Wi-Fi | IP | TCP/UDP | Datos | FCS]   (MAC + control de errores)

Consecuencia operativa:
- Un problema en una capa puede “parecer” de otra. Por ejemplo:
  - DNS roto (capa aplicación) parece “no hay Internet”.
  - MTU mal (capa enlace) parece “TCP falla” o “VPN va a ratos”.
  - Wi-Fi con interferencia (física) parece “servidor lento”.

---

## 5. Medios de transmisión: lo físico condiciona lo lógico

### 5.1 Cobre (UTP/STP): alcance, interferencias y duplex

- UTP (par trenzado) domina en LAN por coste y flexibilidad.
- STP añade blindaje, útil en entornos con ruido electromagnético.
- En Ethernet moderno, lo normal es **full-duplex** (envío y recepción simultáneos).
- La calidad del crimpado, la categoría del cable y la longitud afectan la tasa de error.

Conceptos prácticos:
- **Autonegociación**: velocidad/duplex se negocian; una mala negociación genera degradación.
- **Errores físicos**: CRC, pérdidas, retransmisiones (en TCP) y throughput real menor.

### 5.2 Fibra óptica: distancia y aislamiento

- Mayor alcance y capacidad, inmunidad a interferencias.
- Muy usada en backbone, CPDs, y enlaces de larga distancia.
- Conectores y limpieza importan: el fallo puede ser intermitente y difícil de ver “a simple vista”.

### 5.3 Radio (Wi-Fi): el medio compartido por excelencia

Wi-Fi es un caso especial:
- Es un **medio compartido**: muchos compiten por el mismo espectro.
- Está sujeto a interferencias, obstáculos, saturación de canales y condiciones dinámicas.
- La seguridad es crítica: el medio es “público” por naturaleza (lo que cambia es el cifrado y el control de acceso).

---

## 6. Ethernet: la base de la mayoría de LANs

### 6.1 Qué aporta Ethernet (Capa 2)

Ethernet define:
- Formato de **trama**.
- Direcciones **MAC**.
- Reglas de acceso al medio (históricamente CSMA/CD; hoy, conmutación full-duplex reduce colisiones).
- Detección de errores a nivel de trama (FCS/CRC).

### 6.2 Dirección MAC: identidad de enlace, no “identidad del host”

- Una MAC identifica una interfaz de red en un dominio L2.
- No es “segura” ni “secreta”: puede observarse y, en muchos casos, suplantarse.
- Se usa para entregar tramas dentro de una LAN (o VLAN).

Errores conceptuales comunes:
- “MAC = identidad fiable”: falso en redes no controladas.
- “Filtrado por MAC = seguridad”: es un control débil por sí solo (puede sumar como fricción, no como garantía).

### 6.3 Broadcast, unicast y multicast (Capa 2)

- **Unicast**: a una MAC concreta.
- **Broadcast**: a todos (FF:FF:FF:FF:FF:FF).
- **Multicast**: a un grupo (según rangos y mecanismos de suscripción).

El broadcast es útil (p. ej., descubrimientos), pero peligroso si crece sin control:
- aumenta ruido,
- facilita enumeración,
- amplifica fallos y ataques.

---

## 7. Wi-Fi: fundamentos técnicos y de seguridad (sin entrar en configuración avanzada)

### 7.1 Wi-Fi no es “Ethernet sin cable”

A nivel enlace, Wi-Fi comparte muchas ideas, pero su realidad es distinta:

- El aire no es full-duplex real en el sentido cableado tradicional.
- La contención del medio y la interferencia hacen que el rendimiento fluctúe.
- La señal se degrada con distancia, paredes, saturación y dispositivos vecinos.

### 7.2 Rendimiento Wi-Fi: por qué “300 Mbps” no significa nada en práctica

Factores principales:
- Canal y ancho de canal (más ancho no siempre mejor si hay interferencia).
- Número de clientes y su distancia al AP.
- Obstáculos, reflexiones, ruido.
- Reintentos (retransmisiones) por errores de radio.

Indicadores típicos:
- Buena señal pero mala experiencia: congestión o interferencia.
- Señal variable: roaming, obstáculos, o canal saturado.

### 7.3 Seguridad Wi-Fi: superficie y control

Sin entrar en el detalle de estándares, hay tres principios:

1) **El medio es observable**: cualquiera puede captar radio; la protección real es el cifrado y autenticación.
2) **La segmentación importa**: redes de invitados deben estar aisladas de redes internas.
3) **La administración del AP es crítica**: credenciales, firmware, exposición de paneles, etc.

---

## 8. Dominios de colisión y broadcast: el alcance define el impacto

### 8.1 Dominio de colisión (histórico y conceptual)

- En medios compartidos antiguos (hubs), las colisiones eran parte del día a día.
- En redes modernas con switches full-duplex, la colisión prácticamente desaparece a nivel operativo, pero el concepto sirve para entender por qué el switch mejoró tanto.

### 8.2 Dominio de broadcast: el problema que sigue vigente

El broadcast define “quién recibe ciertos mensajes por defecto”. Si el dominio es enorme:
- crece el tráfico de control,
- aumenta la visibilidad interna (y la enumeración),
- sube el impacto de fallos y tormentas (broadcast storms).

La segmentación (p. ej., VLANs) y el control inter-segmento se tratan más a fondo en el módulo de dispositivos, pero aquí debes quedarte con la idea:
- **la red plana es cómoda al inicio y cara después**.

---

## 9. MTU, fragmentación y por qué rompe cosas “raras”

### 9.1 Qué es MTU

MTU (Maximum Transmission Unit) es el máximo tamaño de carga que puede transportar una trama/paquete en un enlace sin fragmentar.

- Ethernet clásico: MTU IP típica 1500 bytes.
- Si hay encapsulaciones (VPN, túneles), el espacio útil baja.

### 9.2 Qué pasa cuando la MTU no encaja

Cuando un paquete es mayor que la MTU del siguiente salto:
- puede fragmentarse (dependiendo del diseño y protocolos),
- puede descartarse si no se permite fragmentación,
- puede provocar fallos selectivos: “algunas webs van, otras no”, “SSH ok, pero descargas no”.

Diagnóstico conceptual:
- Fallos con payload grande suelen apuntar a MTU/túneles.
- Esto explica muchos problemas “intermitentes” en VPNs o rutas con encapsulación.

---

## 10. Rendimiento: medir correctamente (y no confundir síntomas)

### 10.1 Métricas que importan

- **Ancho de banda**: capacidad teórica del enlace.
- **Throughput**: datos útiles realmente entregados por unidad de tiempo (siempre menor que el teórico).
- **Latencia**: tiempo ida (o ida y vuelta).
- **Jitter**: variación de latencia (crítico en voz/vídeo).
- **Pérdida**: paquetes que no llegan (o llegan tarde y se consideran perdidos).
- **Retransmisiones**: síntoma de pérdida/errores (especialmente visible en TCP).

### 10.2 TCP vs UDP: comportamiento ante pérdida

- TCP intenta fiabilidad: retransmite, controla congestión, ajusta ventana.
- UDP no garantiza entrega: si hay pérdida, la aplicación decide qué hacer.

Consecuencia práctica:
- En enlaces con pérdida, TCP puede degradar throughput para mantener fiabilidad.
- En tiempo real (voz/vídeo), se tolera cierta pérdida para mantener fluidez; ahí jitter es el enemigo.

---

## 11. Herramientas esenciales de diagnóstico en Linux (fundamentos)

Este apartado no busca “recetas”, sino que sepas qué mira cada herramienta y qué capa toca.

### 11.1 Identidad de interfaz y estado (Capa 1/2)

Comandos básicos:
    ip link
    ip -br link

Qué observar:
- interfaz UP/DOWN,
- tipo (ether, wlan),
- MAC,
- contadores de errores (si los expone el driver/hardware).

### 11.2 Configuración IP y rutas (puente al módulo de direccionamiento)

Aunque IP se desarrolla en su capítulo, en fundamentos conviene saber “mirar”:
    ip -br addr
    ip route

Qué observar:
- si hay IP asignada,
- si existe ruta por defecto (gateway),
- coherencia entre interfaz y red asignada.

### 11.3 Conectividad y latencia (ICMP)

    ping -c 4 8.8.8.8
    ping -c 4 <gateway>

Interpretación base:
- ping al gateway falla: problema local (L1/L2, Wi-Fi, VLAN, cable, interfaz).
- ping al exterior falla pero gateway responde: problema de routing/política/DNS (según caso).

### 11.4 Ruta y saltos (visión de Capa 3)

    traceroute <destino>
    tracepath <destino>

Qué aporta:
- dónde se corta,
- si hay saltos inesperados,
- pistas de MTU (tracepath suele mostrarlo).

### 11.5 Puertos y estado de sockets (Transporte)

    ss -tulpen
    ss -tan

Qué aporta:
- qué servicios escuchan,
- en qué puertos,
- conexiones establecidas,
- si algo está “abierto” sin necesitarlo (riesgo).

### 11.6 Captura de tráfico (observabilidad real)

    sudo tcpdump -i <interfaz> -nn
    sudo tcpdump -i <interfaz> -nn port 53

Para qué sirve:
- ver si “sale” una petición DNS,
- ver si vuelven respuestas,
- comprobar si hay retransmisiones o patrones anómalos.

Regla práctica:
- si no lo ves en captura, no está ocurriendo (o está ocurriendo en otra interfaz/ruta).

---

## 12. Errores conceptuales frecuentes y cómo evitarlos

1) “Tengo Wi-Fi con barras, luego va bien”  
La señal es solo un factor. Interferencia y congestión pueden destruir el rendimiento con buena señal.

2) “Si hay Internet, DNS está bien”  
Puedes tener conectividad IP y DNS roto, o viceversa (resuelve, pero no enruta).

3) “La red funciona si puedo hacer ping”  
Ping prueba ICMP; muchos servicios pueden fallar aun con ping correcto (MTU, puertos, TLS, políticas).

4) “MAC filtering es suficiente”  
No lo es. Puede ayudar como control débil, pero no sustituye autenticación fuerte ni segmentación.

---

## 13. Conclusión

Fundamentos de redes significa dominar tres niveles de realidad:

- **Físico**: el medio impone límites y errores (cable, fibra, radio).
- **Lógico por capas**: encapsulación y funciones por nivel (L2/L3/L4/L7).
- **Operativo**: saber observar con herramientas (estado, rutas, latencia, puertos, captura).

Con esta base, el capítulo de **Direccionamiento IP** encaja de forma natural (subredes, CIDR, routing, NAT) y el capítulo de **Dispositivos de red y seguridad** se entiende como lo que realmente es: la infraestructura que **materializa decisiones** sobre el tráfico y sobre el riesgo.