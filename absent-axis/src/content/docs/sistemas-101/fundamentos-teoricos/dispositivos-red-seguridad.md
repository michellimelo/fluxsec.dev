---
title: Dispositivos de Red y Seguridad
description: "Capítulo académico y operativo sobre dispositivos de red y seguridad: switches, routers, APs, firewalls, NAT, IDS/IPS y proxies. Explica el procesamiento real del tráfico, segmentación por capas, amenazas típicas, controles de mitigación y criterios de diseño con enfoque práctico."
sidebar:
  order: 8
---

Cuando una red “funciona”, suele parecer magia: los equipos se ven, Internet va rápido, el Wi-Fi responde. Cuando algo falla (o alguien ataca), se descubre la realidad: **la red es un sistema de decisiones** tomadas por dispositivos intermedios. Un paquete no “viaja” solo: es **aceptado, reenviado, modificado, priorizado, bloqueado o registrado** por elementos como switches, routers, puntos de acceso, firewalls y proxies.

Este módulo no se limita a nombrar dispositivos. La meta es que entiendas:

- **Qué inspecciona cada dispositivo** (MAC, IP, puertos, estado de conexión, aplicación).
- **Qué decisión puede tomar** (forward/flood/drop/translate/shape/log).
- **Qué superficies de ataque abre** y **qué controles reales** existen para reducir riesgo.

Punto clave: la seguridad de red no es “poner un firewall”. Es **diseñar zonas**, controlar flujos, reducir exposición, registrar lo importante y poder diagnosticar con precisión.

---

## 2. Dispositivos de interconexión básicos: por qué importan aunque sean “obsoletos”

### 2.1 Repetidor y Hub: el origen del problema “todos ven todo”

**Repetidor (Capa 1)**  
Un repetidor se limita a regenerar señal. No entiende tramas ni direcciones. Su importancia hoy es conceptual: muestra que, si no hay inteligencia, no hay control.

**Hub (Capa 1)**  
Un hub replica bits a todos los puertos. Esto implica:
- **Un único dominio de colisión**: el medio es compartido (históricamente con Ethernet half-duplex).
- **Un único “dominio de escucha”**: todo el tráfico es visible por cualquier puerto.

Implicación de seguridad (conceptual): en un medio compartido, el sniffing es trivial. El salto de hub a switch no solo mejoró rendimiento, también cambió el modelo de exposición del tráfico.

### 2.2 Bridge: el primer “filtro” basado en MAC

Un bridge (puente) conecta dos segmentos Ethernet y **filtra en Capa 2** usando MAC.  
Idea esencial: aprende qué direcciones están “detrás” de cada lado y evita reenviar tramas innecesarias.

El bridge introduce una noción central que dominará el resto del módulo: **tablas de decisión** (quién está dónde) y **comportamientos por defecto** (qué pasa cuando no se sabe).

---

## 3. Switch: el sistema nervioso de la LAN

Un switch moderno es más que “un repartidor de puertos”: es el dispositivo que define:
- qué equipos se comunican dentro de un segmento,
- cuánto se expande un broadcast,
- cómo se implementa segmentación lógica (VLAN),
- y qué controles de acceso “en el borde” son posibles.

### 3.1 Conmutación Ethernet: el algoritmo real (y sus consecuencias)

El switch decide basándose en **tramas**, no en paquetes IP. En términos prácticos:

1) **Aprendizaje (learning)**  
Cuando llega una trama, el switch toma la **MAC origen** y la asocia al puerto de entrada en su tabla (CAM).
- Esto no es “seguridad”; es un mecanismo operativo.
- El switch confía en lo que ve: “si veo esta MAC entrar por este puerto, asumo que vive aquí”.

2) **Reenvío (forwarding) o inundación (flooding)**  
- Si conoce la **MAC destino** en su CAM, envía por ese puerto.
- Si no la conoce, hace **flooding**: envía por todos menos por el puerto de entrada.
- Si es broadcast, también se difunde dentro del dominio correspondiente.

3) **Aging**  
Las entradas CAM caducan si no se observan durante un tiempo. Esto es crucial:
- Permite adaptarse a cambios.
- También abre la puerta a manipulación si se fuerza “movilidad” de MAC.

**Por qué esto importa en seguridad**  
Casi todos los ataques a Capa 2 explotan una de estas realidades:
- el switch aprende sin verificar identidad,
- inunda cuando no sabe,
- y mantiene estado temporal en tablas internas.

### 3.2 Dominios: colisión, broadcast y el impacto del diseño

En redes modernas conmutadas, las colisiones casi desaparecen; lo que sigue siendo importante es el **dominio de broadcast**:
- Un broadcast (ARP, DHCP, etc.) se expande dentro del dominio.
- Más dominio de broadcast = más ruido, más posibilidades de abuso, más impacto de fallos.

La segmentación por VLAN existe, entre otras cosas, para **controlar el alcance del broadcast** y **limitar movimiento lateral**.

### 3.3 Switch gestionado: por qué es el estándar real en entornos serios

Un switch no gestionado “solo conmuta”. Un gestionado añade capacidades que, desde la perspectiva de seguridad y operación, son determinantes:

- Segmentación (VLAN, trunks).
- Control de borde (port security, 802.1X en entornos avanzados).
- Visibilidad (logs, SNMP/telemetría, mirroring/SPAN).
- Resiliencia de Capa 2 (STP/RSTP para evitar bucles).
- Calidad de servicio (QoS) en escenarios donde importa.

Sin gestión, la red se vuelve un “medio compartido lógico” difícil de gobernar.

### 3.4 VLAN: segmentación lógica correctamente entendida

Una VLAN no es “una subred”, pero suele mapearse a una subred por buenas razones operativas.

**Qué es realmente**
- Una VLAN define un **ámbito de Capa 2**: qué puertos comparten un dominio de broadcast.
- Dentro de una VLAN, ARP/broadcast se propagan (salvo controles adicionales).
- Entre VLANs, por diseño, no debería haber comunicación **sin Capa 3**.

**Modelo mental práctico**
- VLAN 10 (Usuarios)
- VLAN 20 (Servidores)
- VLAN 30 (Invitados)
- VLAN 40 (IoT)

Si conectas todo “plano” sin VLAN, un equipo comprometido en “Usuarios” tiene un camino mucho más directo hacia “Servidores”.

#### Acceso vs Trunk y el papel del etiquetado (802.1Q)

- **Puerto de acceso**: transporta una sola VLAN. El endpoint no ve etiquetas VLAN.
- **Trunk**: transporta varias VLAN. Las tramas viajan etiquetadas con 802.1Q para conservar identidad de VLAN entre dispositivos.

Errores típicos con impacto de seguridad:
- puertos trunk expuestos donde deberían ser access,
- VLAN nativa sin control,
- “permit all VLANs” en trunks sin necesidad.

### 3.5 Ataques típicos en switching: no por “maldad”, por funcionamiento

#### 3.5.1 MAC flooding (explotación del flooding por desconocimiento)
Si se fuerza al switch a aprender demasiadas MAC, la CAM puede saturarse (según equipo y configuración). Cuando el switch no puede aprender, tiende a comportarse con más flooding. Resultado: aumenta la exposición del tráfico.

Defensa conceptual:
- limitar MAC por puerto (port security),
- detectar tasas anómalas de aprendizaje,
- segmentar y no permitir endpoints no confiables en el mismo dominio que activos críticos.

#### 3.5.2 VLAN hopping (cuando la segmentación está mal hecha)
La idea no es “magia”: suele depender de **configuraciones débiles**. En general, la mitigación es “higiene”:
- trunks solo donde sean necesarios,
- lista explícita de VLANs permitidas en el trunk,
- no usar VLAN por defecto para cosas importantes,
- revisar consistencia y documentar.

#### 3.5.3 ARP y la confianza de Capa 2 (puerta a ataques de intermediación)
ARP es necesario para mapear IP → MAC en una LAN. El problema: **ARP no autentica**. Esto permite:
- engañar a un host para que asocie el gateway a una MAC del atacante (MITM).
- redirigir tráfico o provocar DoS local.

Defensas (conceptuales, según entorno):
- segmentación por VLAN (reduce alcance),
- inspección dinámica ARP y controles en switches (si existen),
- cifrado extremo a extremo en aplicaciones (mitiga impacto de MITM),
- monitorización de cambios anómalos de ARP.

---

## 4. Router: el dispositivo que decide entre redes (y define el “perímetro lógico”)

El router opera en **Capa 3**: mira IP y decide por dónde enviar paquetes. Su contribución principal:
- separar dominios de broadcast,
- habilitar comunicación entre subredes,
- aplicar políticas de encaminamiento y, frecuentemente, NAT.

### 4.1 Tabla de rutas: el cerebro del forwarding IP

Una tabla de rutas es una lista de “prefijos conocidos” y “cómo llegar”.

Conceptos que debes dominar:
- **Ruta más específica gana**: /24 se prefiere sobre /16 si ambas aplican.
- **Ruta por defecto**: lo que no conozco, lo envío al gateway por defecto.
- **Next hop**: siguiente dispositivo hacia el destino.
- **Interfaz de salida**: por dónde se envía realmente.

Implicación operativa:
- un fallo de rutas puede parecer “Internet caído”, pero en realidad es un problema de decisión.
- un diseño de rutas confuso provoca agujeros de seguridad o rutas inesperadas (tráfico sensible saliendo por donde no debe).

### 4.2 Router doméstico vs empresarial: el “todo en uno” y su límite

Un router doméstico suele integrar:
- router + switch + AP + NAT + firewall básico + DHCP.
Es cómodo, pero:
- segmentación real limitada,
- visibilidad/logs escasos,
- controles avanzados ausentes o difíciles de gobernar.

En empresarial, se separa por roles:
- switching robusto,
- routing controlado,
- firewall con políticas de zona,
- Wi-Fi gestionado,
- telemetría y logs centralizados.

---

## 5. Access Point: el borde inalámbrico como superficie de ataque

El AP no es “solo Wi-Fi”: es el punto por el que entran dispositivos al dominio de red. Un error común es tratar la red Wi-Fi como “menos seria”; en realidad, es un borde crítico.

### 5.1 AP vs Router Wi-Fi: diferenciación funcional

- **AP**: puente Wi-Fi ↔ Ethernet; suele “colgar” de una LAN y delega routing/firewall en otros.
- **Router Wi-Fi**: integra routing/NAT/firewall + AP + switch. Es típico en hogares.

En empresas, la separación permite:
- aplicar políticas consistentes (usuarios, invitados, IoT),
- aislar SSIDs con VLANs reales,
- auditar y controlar acceso.

### 5.2 Segmentación inalámbrica correcta: SSID no es seguridad por sí solo

Un SSID “Invitados” solo es útil si:
- se mapea a una VLAN/segmento separado,
- y se controla el acceso a recursos internos.

De lo contrario, es “un nombre” distinto para la misma red, y el riesgo persiste.

---

## 6. Firewall: política de comunicación convertida en decisiones

Un firewall es un motor de decisiones basado en reglas. La comprensión profunda empieza por dejar de pensar “bloquea cosas” y pasar a pensar:

- ¿qué zonas existen?
- ¿qué comunicaciones son necesarias?
- ¿cómo se expresan como reglas mínimas?
- ¿qué se registra para investigar incidentes?

### 6.1 Tipos por comportamiento (lo que inspeccionan)

**Filtrado stateless**  
Decide por 5-tuplas (origen/destino IP, origen/destino puerto, protocolo). Es simple y rápido, pero requiere reglas bien diseñadas para permitir retornos legítimos.

**Stateful**  
Mantiene estado de conexiones (sesiones). Permite “retorno” de tráfico asociado sin abrir reglas amplias. En la práctica, es el estándar para perímetros.

**Capa 7 / aplicación (conceptual)**  
Puede aplicar reglas por aplicación/HTTP/DNS, etc. Útil para control fino, pero requiere capacidad, tuning y claridad en objetivos.

### 6.2 Perímetro y segmentación interna: el error de “solo uno en la salida”

Un firewall perimetral controla Internet ↔ red interna.  
Pero muchos incidentes graves son **internos** (o se vuelven internos tras el primer acceso). Por eso existe la segmentación:

- Usuarios no deben hablar libremente con servidores.
- IoT no debe hablar con todo.
- Invitados deben estar aislados.

La segmentación se implementa con:
- VLANs + routing controlado,
- y, preferentemente, políticas de firewall entre zonas.

### 6.3 El concepto de “política mínima”: del diagrama a reglas

Una forma académica y práctica de diseñar reglas:
1) Define zonas: `USERS`, `SERVERS`, `IOT`, `GUEST`, `MGMT`, `WAN`.
2) Define flujos necesarios (y solo los necesarios).
3) Escribe reglas explícitas por servicio (DNS, NTP, HTTP/HTTPS, SSH, etc.).
4) Registra y monitoriza denegaciones relevantes (no todo indiscriminadamente).
5) Revisa: cada regla debe tener justificación, dueño y fecha.

Tabla guía (conceptual) de flujos típicos:

| Origen  | Destino  | Servicios permitidos (ejemplo)                     | Motivo |
|--------|----------|-----------------------------------------------------|--------|
| USERS  | WAN      | 80/443, DNS hacia resolvers autorizados, NTP       | Navegación y sincronización |
| USERS  | SERVERS  | Solo apps específicas (p.ej. 443 a un servicio)     | Acceso controlado a aplicaciones |
| IOT    | WAN      | 443 a endpoints específicos (idealmente), NTP       | Telemetría, actualizaciones |
| GUEST  | WAN      | 80/443, DNS, NTP                                    | Internet sin acceso interno |
| MGMT   | Infra    | SSH/HTTPS/SNMP hacia equipos, desde red dedicada    | Administración |

El objetivo es que un compromiso en USERS o GUEST no “abra el mapa” de la red interna.

---

## 7. NAT: traducción de direcciones (y por qué no es “seguridad”)

NAT existe principalmente por escasez de IPv4 y por necesidades de publicación/control de flujos.

### 7.1 SNAT, DNAT y PAT con impacto operativo

**SNAT (salida)**  
Los equipos internos salen a Internet con una IP pública “común”. Esto permite que muchas máquinas compartan una IP.

**PAT**  
Es la forma habitual: además de traducir IP, se traducen puertos para multiplexar miles de conexiones.

**DNAT (entrada / publicación)**  
Permite publicar un servicio interno:
- el firewall/router recibe tráfico en IP pública:puerto
- lo redirige a IP privada:puerto.

Riesgo: DNAT es “abrir una puerta”. Se debe:
- justificar cada publicación,
- limitar por origen si procede,
- endurecer el servicio publicado,
- registrar accesos,
- y preferir patrones como reverse proxy/WAF cuando aplique.

### 7.2 Mito del NAT como seguridad

NAT “reduce exposición directa” de hosts internos si no hay DNAT, pero no:
- filtra por intención,
- ni evita que malware salga,
- ni segmenta internamente.

La seguridad requiere **política** (firewall) y **segmentación** (zonas/VLAN), no solo traducción.

---

## 8. IDS/IPS, Proxy y Reverse Proxy: control y visibilidad avanzados

### 8.1 IDS vs IPS: detectar no es bloquear

**IDS** observa y alerta. Ventaja: no corta negocio por falsos positivos.  
**IPS** está en línea y puede bloquear. Ventaja: puede detener ataques automáticamente; riesgo: falsos positivos afectan disponibilidad.

En entornos reales:
- IDS es una base excelente para madurar visibilidad.
- IPS exige tuning y diseño cuidadoso (capacidad, latencia, bypass, excepciones).

### 8.2 Proxy: control de salida y publicación segura

**Forward proxy (salida)**  
- Centraliza navegación.
- Permite políticas: categorías, autenticación, inspección (si aplica y está permitido), logging.
- Ayuda a investigar incidentes (quién accedió a qué, cuándo).

**Reverse proxy (entrada a servicios)**  
- Protege servicios internos (especialmente web).
- Centraliza TLS, balancea, aplica límites (rate limiting), y facilita WAF.
- Reduce exposición: el backend no está “directamente” en Internet.

Patrón típico robusto:
- Internet → reverse proxy/WAF → servicio interno
- firewall controla que solo el proxy hable con el backend.

---

## 9. Modelo OSI aplicado sin simplificaciones engañosas

Asociación útil, no dogmática:

- Capa 1: repetidor/hub (bits).
- Capa 2: switching/bridging (MAC, tramas, VLAN).
- Capa 3: routing (IP, rutas).
- Capa 4: decisiones por puertos/estado (firewall stateful).
- Capa 7: aplicación (proxies, WAF, inspección avanzada).

Regla de oro:
- No preguntes “en qué capa está”.
- Pregunta: “¿qué campos inspecciona?”, “¿qué modifica?”, “¿qué decisión toma?”.

---

## 10. Diseño defensivo: cómo convertir una red en un sistema controlable

### 10.1 Principios estructurales
1) **Segmenta** por función y riesgo (usuarios, servidores, invitados, IoT, gestión).
2) **Controla** flujos entre zonas con política mínima.
3) **Reduce exposición**: nada de administración en redes “de usuario”.
4) **Observa**: logs útiles y centralizados (cuando sea posible).
5) **Documenta**: sin documentación, no hay operación segura.

### 10.2 Errores típicos (y por qué son peligrosos)
- Red plana: movimiento lateral fácil.
- “Invitados” sin aislamiento real: acceso accidental o malicioso a recursos internos.
- Trunks mal ubicados: VLAN hopping y confusión.
- DNAT sin control: servicios expuestos sin hardening.
- Sin logs: no hay investigación fiable, solo suposiciones.

---

## 11. Diagnóstico práctico: cómo pensar un incidente o una caída

Sin entrar en comandos de un fabricante específico, el diagnóstico se apoya en hipótesis por capa y dispositivo:

- Si un host no llega al gateway: sospecha Capa 2 (VLAN, ARP, puerto, cable, Wi-Fi).
- Si llega al gateway pero no a otra red: sospecha routing/política (rutas, firewall inter-VLAN).
- Si llega a Internet por IP pero no resuelve dominios: sospecha DNS (servicio/ACL).
- Si “a ratos va”: sospecha bucles Capa 2 (STP), saturación, interferencias Wi-Fi, tablas/recursos.

Ejemplo de razonamiento (conceptual):
- “Usuarios navegan, pero no acceden a la app interna”:
  - ¿La app está en VLAN SERVERS?
  - ¿Hay regla de firewall USERS → SERVERS:443?
  - ¿El DNS interno resuelve el nombre a la IP correcta?
  - ¿El reverse proxy está en la zona adecuada?
  - ¿Hay rutas asimétricas (ida por un camino y vuelta por otro)?

---

## 12. Conclusión

Los dispositivos de red son mecanismos de decisión. La seguridad emerge de:
- segmentación (VLAN/zonas),
- control de flujos (firewall/políticas),
- publicación segura (DNAT con criterio, reverse proxy),
- y visibilidad (logs, IDS donde aplique).

Con este módulo quedan cerrados los tres pilares de redes del temario:
- fundamentos (cómo funciona),
- direccionamiento (cómo se identifica y enruta),
- dispositivos y seguridad (dónde se decide y se controla).

El siguiente paso natural, ya fuera de este bloque, es entrar en servicios (DNS/DHCP/HTTP), y más adelante, aplicar estas ideas a laboratorios de segmentación, hardening y análisis de tráfico.