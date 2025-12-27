---
title: Arquitectura de Sistemas Informáticos
description: "Fundamentos completos de arquitectura de sistemas: hardware, firmware, sistema operativo, ejecución, red, virtualización, contenedores, seguridad y observabilidad, desde nivel cero hasta profesional."
sidebar:
  order: 1
--- 

La palabra “arquitectura” se usa muchas veces como algo abstracto, pero en sistemas tiene una consecuencia muy concreta: determina qué puedes esperar del sistema cuando lo fuerzas, cuando falla, cuando lo atacan o cuando crece. La arquitectura describe **qué componentes existen**, **cómo se conectan**, qué **interfaces** y **contratos** se respetan, qué **suposiciones** se hacen (por ejemplo “siempre habrá red” o “siempre habrá disco”), y qué **propiedades** emergen de esa combinación (rendimiento, resiliencia, coste, seguridad).

En sistemas, la arquitectura no se reduce a diagramas bonitos. Es la disciplina que te permite contestar preguntas críticas sin improvisar:
- ¿Por qué el sistema está lento si la CPU está al 15%?
- ¿Qué pasa si se corta Internet 30 segundos?
- ¿Qué ocurre si el disco principal muere hoy?
- ¿Qué parte está expuesta a Internet y con qué privilegios?
- ¿Cómo recupero el servicio con garantías y en cuánto tiempo?

### 1.1 Qué es la arquitectura de un sistema informático

**Arquitectura de un sistema informático** es el marco que describe:
1) **Componentes**: hardware (CPU, RAM, discos, NIC), firmware (UEFI/BIOS), sistema operativo (kernel, drivers), servicios (systemd, demonios), aplicaciones (web, DB), red, almacenamiento externo, usuarios y operadores.  
2) **Relaciones**: qué depende de qué, qué comunica con qué, por dónde fluyen los datos, por dónde fluyen los permisos y privilegios, y cómo se propagan los fallos.  
3) **Restricciones**: presupuesto, SLA, compatibilidad, cumplimiento legal, tiempo de entrega, requisitos de seguridad, limitaciones físicas (espacio, energía, refrigeración).  
4) **Propiedades**: disponibilidad, rendimiento, escalabilidad, mantenibilidad, auditabilidad, trazabilidad, seguridad, coste total.

Una forma práctica de entenderlo:
- El **sistema** es “la cosa real” funcionando (un PC, un servidor, un cluster).
- La **arquitectura** es “el mapa y las reglas” que explican cómo se sostiene.
- La **implementación** es “la concreción exacta” (modelo de CPU, versión de kernel, FS, parámetros, configuración).

Ejemplo realista:
- “Servidor web” como sistema puede ser una sola máquina, o diez máquinas con balanceo, o un servicio serverless. El usuario ve “una web”. La arquitectura explica por qué en un caso un reinicio te tumba todo y en otro no; por qué en un caso escalar significa comprar un servidor nuevo y en otro significa añadir un nodo; por qué en un caso un bug afecta a todos y en otro queda aislado.

### 1.2 Por qué la arquitectura es crítica

La arquitectura influye en problemas que **no se corrigen al final** con un cambio menor:
- **Rendimiento**: no se “optimiza” si la arquitectura crea un cuello de botella inevitable (por ejemplo: una base de datos única como SPOF y saturada).  
- **Escalabilidad**: no se “arregla” si la arquitectura asume estado local y no replica.  
- **Seguridad**: no se “añade” después si la arquitectura mezcla privilegios, expone servicios innecesarios o no segmenta.  
- **Mantenibilidad**: no se “obtiene” si no hay observabilidad, si la configuración es manual e irrepetible o si todo está acoplado.  
- **Resiliencia**: no aparece por arte de magia si no hay redundancia, backups probados y recuperación planificada.

En arquitectura, lo importante no es evitar fallos, sino definir:
- qué fallos son aceptables,
- cómo se detectan,
- cómo se contienen,
- y cómo se recupera el sistema sin perder control.

### 1.3 Arquitectura como base de todo lo demás

Este módulo agrupa hardware/firmware/OS porque en sistemas las capas “altas” dependen de las “bajas” más de lo que parece. Virtualización y contenedores, por ejemplo, no son magia: se sostienen sobre extensiones de CPU, gestión de memoria, scheduling del kernel, drivers de red, sistemas de archivos y control de permisos. La ciberseguridad tampoco se entiende “solo con conceptos”: se apoya en separaciones reales (user/kernel, ring levels, permisos, aislamiento de procesos, segmentación de red).

**Idea central para todo el temario:** comprender la arquitectura es comprender el “por qué” de los comandos y configuraciones. Sin arquitectura, Linux y redes se aprenden como recetas; con arquitectura, se aprenden como sistema.

---

## 2. Modelo conceptual de un sistema informático

Para estudiar arquitectura necesitas un modelo mental consistente. El más útil al empezar es un modelo por capas y flujos.

### 2.1 El sistema como capas (de abajo arriba)

Un sistema moderno se puede describir como capas que aportan abstracción y control:

| Capa | Qué hace | Qué oculta | Qué riesgo introduce |
|------|----------|------------|----------------------|
| Hardware | Ejecuta instrucciones y mueve datos físicos | complejidad eléctrica | fallos físicos, límites térmicos |
| Firmware | Inicializa hardware y define arranque | detalles de dispositivos | configuraciones críticas, Secure Boot |
| Bootloader | Selecciona y carga kernel/OS | detalles del inicio del SO | errores de arranque, entradas rotas |
| Kernel | Planifica CPU, memoria, I/O, drivers, red | acceso directo al hardware | bugs críticos, privilegios máximos |
| User space | Servicios, librerías, herramientas | detalles de kernel | fallos de servicio, dependencias |
| Aplicaciones | Lógica de negocio, APIs | complejidad de infraestructura | bugs, vulnerabilidades, saturación |
| Operación/usuarios | Uso real y cambios | “cómo funciona por dentro” | error humano, mala gestión de cambios |

La clave de este modelo es reconocer que cada capa:
- simplifica lo que hay debajo,
- define límites y permisos,
- y tiene métricas y síntomas observables.

### 2.2 Flujo de datos y flujo de control

Cualquier acción tiene dos dimensiones:
- **Datos**: lo que viaja (texto, paquetes, bytes, bloques de disco).
- **Control**: quién decide cuándo se ejecuta qué y con qué prioridad (scheduler, interrupciones, locks, colas).

Ejemplo: “descargar un archivo”
- Datos: paquetes que llegan por la NIC, se copian a buffers, se escriben a disco.
- Control: interrupciones de red, planificador que da CPU al navegador, políticas del kernel para escribir al disco, colas de I/O.

Cuando un sistema “va lento”, a menudo el problema está en control (contención, colas, espera) más que en falta de potencia.

### 2.3 Diagrama lógico del sistema completo

Un diagrama conceptual que debes dominar:

~~~text
Aplicación (User Space)
  ↓  (syscalls)
Kernel: scheduler | memoria | FS | red | drivers
  ↓
Drivers / Controladores
  ↓
Hardware: CPU | RAM | almacenamiento | NIC | buses
~~~

La frontera crítica es **User Space ↔ Kernel Space**: ahí cambian privilegios, se controla seguridad, y se materializan las decisiones de arquitectura del SO.

### 2.4 Interfaces críticas y contratos

Un sistema funciona porque hay contratos:
- La aplicación asume que un `read()` devuelve bytes o error, no “comportamiento aleatorio”.
- El kernel asume que el driver respeta el protocolo del dispositivo.
- El firmware asume que el hardware responde a inicialización y control.

Cuando esos contratos se rompen aparecen síntomas característicos (panic, I/O error, kernel oops, timeouts, resets).

### 2.5 Propiedades emergentes

Hay propiedades que no pertenecen a una pieza: emergen de la combinación.
- **Latencia**: depende de cachés, RAM, disco, red, scheduling y colas.
- **Throughput**: depende de paralelismo, I/O, CPU, y límites de red.
- **Seguridad**: depende de límites de privilegios, segmentación y configuración.
- **Resiliencia**: depende de redundancia, detección y recuperación.
- **Observabilidad**: depende de logs, métricas y trazas integradas con tiempo fiable.

### 2.6 Caso completo “end-to-end” (navegador → servidor)

Cuando visitas una web HTTPS:
1) Resolución DNS (aplicación/OS/red).
2) Establecimiento de TCP (kernel/red).
3) Negociación TLS (app + librerías + sistema).
4) Petición HTTP, respuesta.
5) Renderizado (CPU, memoria, GPU).
6) Cacheo y escritura a disco (FS, I/O).

Cada etapa tiene fallos típicos:
- DNS: no resuelve.
- TCP: no conecta (firewall/puerto).
- TLS: certificados, hora del sistema, ciphers.
- HTTP: 4xx/5xx.
- Rendimiento: latencia de red, saturación, I/O.

---

## 3. Arquitectura de hardware (visión global)

El hardware es la base: todo lo demás es una manera de usarlo de forma controlada. En arquitectura de hardware importa menos “memorizar piezas” y más entender:
- qué recurso es limitado,
- cómo se produce el cuello de botella,
- qué métricas lo delatan,
- y qué decisiones arquitectónicas lo evitan o lo agravan.

### 3.1 Componentes físicos fundamentales

- **CPU**: ejecuta instrucciones; su rendimiento real depende del tipo de carga, del paralelismo, de cachés y de latencias de memoria.
- **RAM**: mantiene datos e instrucciones activas; escasez de RAM fuerza swap y destruye latencia.
- **Almacenamiento**: persistencia; su latencia es órdenes de magnitud peor que RAM, por eso influye brutalmente en rendimiento.
- **I/O**: puertos, controladoras, buses; el sistema es tan rápido como el eslabón más lento de su cadena de I/O.
- **NIC (red)**: comunica; su rendimiento depende de drivers, colas, buffers, offloading, y estado de red.

### 3.2 Von Neumann: la idea que todavía manda

En el modelo clásico von Neumann:
- una memoria guarda instrucciones y datos,
- la CPU ejecuta secuencialmente,
- y hay un canal de comunicación principal.

Su gran problema es el “cuello de botella” entre CPU y memoria: si la CPU espera a memoria, tienes potencia ociosa. Por eso existen cachés, prefetching y jerarquías.

### 3.3 Harvard y variantes modernas

Harvard separa memoria de instrucciones y datos (conceptualmente). En la práctica, sistemas modernos son híbridos: separaciones internas, cachés por niveles, caminos optimizados. Esto importa porque:
- explica por qué el acceso a memoria no es uniforme,
- explica por qué la localidad (datos “cerca” en caché) acelera todo.

### 3.4 Sistemas modernos: por qué “CPU potente” no garantiza rendimiento

Un sistema real es un equilibrio:
- Si el disco es lento, la CPU espera I/O.
- Si la RAM es baja, el sistema pagina y el disco se convierte en “memoria falsa”.
- Si la red está saturada o con latencia, la app “parece lenta” aunque localmente esté bien.
- Si hay contención (locks) o mala paralelización, más cores no ayudan.

---

## 4. Arquitectura de CPU

La CPU es el recurso central, pero su rendimiento percibido depende de cómo se alimenta de datos (memoria) y de cómo se planifica (OS).

### 4.1 Qué es una CPU internamente (visión útil)

Elementos clave:
- **Unidad de control**: organiza ejecución.
- **ALU/FPU**: operaciones enteras y coma flotante.
- **Registros**: almacenamiento ultrarrápido; cualquier acceso fuera de registros es mucho más lento.
- **Cachés**: memoria rápida intermedia; evitar ir a RAM.
- **Pipeline y predicción**: técnicas para ejecutar más por ciclo.

En práctica: una CPU no “solo calcula”; pasa gran parte del tiempo intentando no quedarse esperando datos.

### 4.2 CISC vs RISC (sin mitos)

Comparación clásica:

| Aspecto | CISC (p.ej. x86) | RISC (p.ej. ARM) |
|--------|-------------------|------------------|
| Instrucciones | más complejas | más simples |
| Filosofía | “menos instrucciones, más potentes” | “muchas instrucciones simples” |
| Eficiencia energética | depende | suele ser mejor (no siempre) |
| Ecosistema | PC/servidor tradicional | móvil, embebido, cada vez más servidor |

Lo importante no es “quién es mejor”, sino entender que arquitectura de CPU afecta:
- compiladores,
- rendimiento por watt,
- virtualización,
- compatibilidad binaria,
- y disponibilidad de software.

### 4.3 x86/x64 vs ARM: implicaciones reales

- **Compatibilidad**: binarios compilados para x86 no corren nativamente en ARM (y viceversa) sin recompilar o emular.
- **Virtualización**: depende de extensiones de hardware y de soporte del hypervisor.
- **Operación**: imágenes de contenedor multi-arch, repositorios, librerías.

En un entorno profesional, la arquitectura de CPU impacta desde el “docker pull” hasta el rendimiento de criptografía y compresión.

### 4.4 Multicore, SMT y paralelismo

- **Core físico**: unidad real de ejecución.
- **SMT/Hyper-Threading**: un core expone dos hilos lógicos; mejora throughput en cargas con esperas internas, no duplica potencia.
- **Escalado**: más cores ayudan si la carga es paralelizable y no está limitada por I/O o contención.

Síntoma típico de mala paralelización: CPU total baja, pero uno o pocos cores al 100% y el sistema “lento”.

---

## 5. Arquitectura de memoria

La memoria es el “espacio de trabajo” del sistema. El salto conceptual clave es entender la **jerarquía**: registros/cachés/RAM/swap, y que cada nivel tiene latencias radicalmente distintas.

### 5.1 Tipos de memoria en jerarquía

- **Registros**: los más rápidos, mínimos en cantidad.
- **Caché L1/L2/L3**: rápidas, más pequeñas; reducen accesos a RAM.
- **RAM**: grande, volátil, relativamente rápida.
- **Swap**: disco usado como extensión de RAM; extremadamente más lento que RAM.

### 5.2 Jerarquía y latencias (por qué importa)

No necesitas números exactos, pero sí el orden:
- caché ≪ RAM ≪ SSD ≪ HDD ≪ red remota.

Esto explica por qué:
- un cache miss puede multiplicar latencias,
- swap puede “matar” rendimiento,
- y sistemas I/O-bound se sienten lentos aunque CPU esté libre.

### 5.3 Memoria volátil vs no volátil

- Volátil: se pierde al apagar (RAM).
- No volátil: persiste (SSD/HDD/NVRAM).
Esto es fundamental para comprender persistencia, journaling, bases de datos y recuperación.

### 5.4 Gestión de memoria: paging y virtual memory

Los sistemas modernos usan memoria virtual:
- cada proceso cree tener su “espacio privado”,
- el kernel traduce direcciones virtuales a físicas,
- y usa paginación para mover páginas entre RAM y disco si falta memoria.

Consecuencia práctica: si una máquina se queda sin RAM, no “se detiene”, empieza a paginar y se vuelve impredecible en latencia. Por eso en producción se diseña con márgenes y límites.

---

## 6. Arquitectura de almacenamiento

El almacenamiento da persistencia, pero suele ser el mayor enemigo de la latencia. Entender almacenamiento es entender: latencia, colas, IOPS, throughput, cachés y fiabilidad.

### 6.1 Tipos de almacenamiento y diferencias reales

- **HDD**: mecánico; latencia alta, throughput decente secuencial, IOPS bajos.
- **SSD SATA**: latencia mucho menor, IOPS altos, throughput moderado.
- **SSD NVMe**: latencias menores aún, colas más eficientes, throughput alto.

Tabla conceptual:

| Tipo | Latencia | IOPS | Throughput | Uso típico |
|------|----------|------|------------|-----------|
| HDD | alta | bajo | ok secuencial | almacenamiento masivo barato, backups |
| SSD SATA | media-baja | alto | bueno | servidores generalistas, SO |
| NVMe | baja | muy alto | muy alto | DB, cargas intensivas, virtualización |

### 6.2 Bloques, sectores y sistemas de archivos (visión arquitectura)

Los discos trabajan con bloques/sectores. El sistema de archivos:
- organiza nombres, permisos, directorios,
- decide cómo escribe (journaling, metadata),
- y gestiona coherencia.

Arquitectónicamente importa porque:
- el patrón de escritura de una base de datos no se comporta igual en HDD que en NVMe,
- y porque la durabilidad depende del FS y de la estrategia de sincronización.

### 6.3 Métricas clave: IOPS, throughput y latencia

- **Latencia**: tiempo por operación; clave en cargas interactivas.
- **IOPS**: operaciones por segundo; clave en cargas con muchas lecturas/escrituras pequeñas.
- **Throughput**: MB/s; clave en streaming, copias grandes.

Error clásico: creer que “más MB/s” implica mejor rendimiento en DB; a menudo lo que manda es latencia e IOPS.

### 6.4 RAID (visión arquitectónica y límites)

RAID es una estrategia para:
- rendimiento,
- redundancia,
- o ambos.

| RAID | Idea | Ventaja | Riesgo/limitación |
|------|------|---------|-------------------|
| 0 | stripe | rendimiento | sin redundancia |
| 1 | mirror | redundancia | coste x2 |
| 5 | parity | equilibrio | penaliza escrituras; reconstrucción costosa |
| 10 | mirror+stripe | rendimiento+redundancia | coste alto |

Punto crítico: RAID no sustituye backups. RAID te protege de fallos de disco (ciertos), no de borrados, ransomware o corrupción lógica.

---

## 7. Arquitectura de red en un sistema

La red convierte un sistema en un nodo dentro de un ecosistema. Arquitectura de red en sistemas es entender: interfaces, pila TCP/IP, puertos, latencia, segmentación, y relación entre servicios.

### 7.1 El sistema como nodo: NIC, MAC e IP

- NIC: interfaz física o virtual.
- MAC: identidad de enlace.
- IP: identidad de red (ruteable).
- Puertos: multiplexación en transporte (TCP/UDP).

La arquitectura debe definir:
- qué interfaces existen (LAN, WAN, management),
- qué tráfico se permite (firewall),
- qué servicios escuchan y en qué puertos,
- qué dependencias externas hay (DNS, NTP, repositorios, APIs).

### 7.2 Capas implicadas (modelo práctico)

Arquitectura de red se entiende mejor como responsabilidades:
- Enlace: comunicación local (MAC).
- Red: ruteo (IP).
- Transporte: conexiones y puertos (TCP/UDP).
- Aplicación: protocolos (HTTP, SSH, DNS).

Cuando diagnosticas, ubicar el fallo en la capa correcta ahorra horas.

### 7.3 Cliente-servidor

Modelo dominante:
- cliente inicia,
- servidor escucha,
- existe un punto de servicio.

Arquitecturalmente:
- facilita control y seguridad,
- pero crea puntos de concentración (cuellos, SPOF si no hay redundancia).

### 7.4 Peer-to-peer

P2P distribuye responsabilidades. Ventajas:
- resiliencia frente a caídas de un nodo,
- escalado natural en ciertos casos.

Riesgos:
- control de seguridad más complejo,
- NAT traversal,
- trazabilidad y auditoría más difícil.

---

## 8. Firmware y arranque del sistema

El arranque es una cadena de confianza y control. Entenderlo es crítico para:
- diagnosticar “no arranca”,
- hardening (Secure Boot),
- recuperación (rescue, boot entries),
- y virtualización (firmware en VMs).

### 8.1 Qué es firmware: BIOS y UEFI

Firmware es software de bajo nivel que inicializa hardware y prepara el sistema para cargar un SO.

- BIOS: modelo clásico, limitado, legado.
- UEFI: moderno, modular, soporta Secure Boot, GPT, drivers en firmware.

Arquitectónicamente, UEFI importa por:
- entradas de arranque,
- variables NVRAM,
- Secure Boot (cadena de confianza),
- compatibilidad con particionado moderno.

### 8.2 Proceso de arranque completo (cadena)

Secuencia típica:
1) Energía y señal estable.
2) POST (comprobaciones básicas).
3) Inicialización de dispositivos y buses.
4) Selección de dispositivo de arranque.
5) Carga de bootloader.
6) Bootloader carga kernel e initramfs (Linux) o loader del SO.
7) Kernel inicializa drivers básicos, monta FS raíz.
8) Arranque de user space (init/systemd).
9) Servicios y login.

Cada etapa tiene fallos característicos:
- POST: pitidos, sin vídeo, RAM mala.
- Firmware: orden de boot incorrecto.
- Bootloader: entrada rota.
- Kernel: panic por driver o FS.
- User space: servicios fallan y el sistema arranca “a medias”.

### 8.3 Bootloaders: GRUB y Windows Boot Manager

Bootloader es el puente entre firmware y SO:
- permite seleccionar kernels/OS,
- pasa parámetros,
- gestiona menús y entradas.

En Linux, GRUB es común. En Windows, BCD/Boot Manager. Arquitectónicamente, el bootloader es un punto sensible: si se corrompe, el hardware está bien pero el sistema no arranca.

---

## 9. Arquitectura del sistema operativo

El SO es el gestor de recursos y el árbitro de privilegios. Sin SO moderno, el hardware no es utilizable de forma segura ni eficiente.

### 9.1 El papel del SO: abstraer y controlar

El SO:
- abstrae hardware (discos como archivos, NIC como sockets),
- gestiona CPU (quién corre, cuándo),
- gestiona memoria (aislamiento y paginación),
- gestiona I/O (drivers, colas),
- aplica permisos y seguridad,
- ofrece servicios a aplicaciones.

Arquitectónicamente, el SO define el “contrato” de ejecución de todo lo que corre encima.

### 9.2 Arquitecturas de kernel: monolítico, microkernel, híbrido

- Monolítico (Linux): muchas funciones dentro del kernel. Ventaja: rendimiento y simplicidad de llamadas. Riesgo: mayor superficie en kernel.
- Microkernel: kernel mínimo, servicios en user space. Ventaja: aislamiento. Coste: complejidad y overhead.
- Híbrido: mezcla pragmática.

Lo importante aquí no es “elegir ganador”, sino entender que el diseño del kernel afecta a:
- drivers,
- estabilidad,
- seguridad,
- rendimiento,
- y modelo de extensibilidad.

### 9.3 User space vs Kernel space

Separación de privilegios:
- User space: aplicaciones con privilegios limitados.
- Kernel space: control total del hardware.

Esta frontera es central en seguridad: exploits de kernel son críticos porque rompen aislamiento.

---

## 10. Arquitectura de procesos y ejecución

Procesos e hilos son cómo el SO representa trabajo en ejecución. Si no entiendes procesos/hilos, no puedes diagnosticar rendimiento, deadlocks ni consumo de recursos.

### 10.1 Proceso vs hilo: diferencia práctica

- Proceso: espacio de memoria aislado, recursos propios.
- Hilo: unidad de ejecución dentro de un proceso, comparte memoria con otros hilos del mismo proceso.

Implicación arquitectónica:
- procesos aíslan mejor (seguridad/estabilidad),
- hilos comunican rápido pero aumentan riesgo de condiciones de carrera.

### 10.2 Ciclo de vida de un proceso

Estados típicos:
- creado,
- listo,
- ejecutando,
- bloqueado (esperando I/O),
- terminado.

Diagnóstico real: si un proceso está “bloqueado” a menudo está esperando disco/red/lock, no “consumiendo CPU”.

### 10.3 Scheduling: cómo se reparte la CPU

El scheduler decide:
- qué se ejecuta y cuándo,
- prioridades,
- fairness,
- latencia.

Arquitecturalmente, esto impacta:
- tiempos de respuesta,
- throughput,
- “ruido” entre cargas (noisy neighbor en VMs/containers).

---

## 11. Arquitectura de entrada/salida (I/O)

La mayoría de sistemas “lentos” lo son por I/O, no por CPU. I/O incluye disco, red, y periféricos. El kernel introduce colas, buffers e interrupciones para hacerlo eficiente.

### 11.1 Dispositivos de entrada y salida

- Disco: I/O por bloques.
- Red: I/O por paquetes.
- Teclado/mouse: eventos.
- GPU: colas de comandos.

Cada uno tiene patrones distintos; mezclar expectativas lleva a errores (por ejemplo tratar disco como “instantáneo”).

### 11.2 Drivers: traducción entre mundo lógico y físico

El driver:
- entiende el dispositivo,
- implementa el contrato con el kernel,
- expone operaciones estándar.

Sin driver correcto:
- el dispositivo no existe (o funciona mal),
- aparecen timeouts, resets, “link down”, I/O errors.

### 11.3 Interrupciones y DMA (conceptos base)

- Interrupciones: eventos que avisan a CPU de algo urgente (paquete recibido, operación completada).
- DMA: movimiento de datos sin cargar a la CPU continuamente.

Arquitectónicamente esto explica por qué:
- un pico de red puede generar mucha carga por interrupciones,
- y por qué colas y afinidad de IRQ importan en servidores.

---

## 12. Arquitectura de virtualización

Virtualización es una capa que simula o abstrae hardware para ejecutar múltiples sistemas aislados en una máquina física.

### 12.1 Qué es virtualizar (de forma rigurosa)

Virtualizar es crear un entorno donde un sistema invitado cree tener:
- CPU,
- memoria,
- disco,
- red,
aunque realmente comparte recursos con otros invitados bajo control de un hipervisor.

La promesa arquitectónica es aislamiento y consolidación, pero introduce:
- overhead,
- complejidad de operación,
- riesgos de contención (“noisy neighbor”).

### 12.2 Tipos: hypervisor tipo 1 y tipo 2

- Tipo 1 (bare metal): corre directamente sobre hardware. Mejor para producción.
- Tipo 2 (hosted): corre sobre un SO host. Mejor para escritorio/lab.

### 12.3 Relación con hardware y SO

La virtualización moderna depende de:
- extensiones CPU (VT-x/AMD-V),
- virtualización de memoria (EPT/NPT),
- drivers paravirtualizados (virtio),
- scheduling del hypervisor y del guest.

Síntoma típico: “tengo 8 vCPU pero rinde peor” → contención y scheduling, o I/O virtualizado mal configurado.

---

## 13. Arquitectura de contenedores

Los contenedores no virtualizan hardware completo: aíslan procesos. Son más ligeros, pero comparten kernel. Esto cambia el modelo de seguridad y operación.

### 13.1 Contenedor vs VM (impacto real)

| Aspecto | VM | Contenedor |
|--------|----|------------|
| Kernel | propio | compartido (host) |
| Arranque | OS completo | proceso |
| Aislamiento | más fuerte | depende del kernel |
| Peso | mayor | menor |
| Densidad | menor | mayor |

Arquitectura: contenedores favorecen escalado rápido y despliegue consistente, pero requieren:
- buen control de permisos,
- límites de recursos,
- segmentación de red,
- y gestión de imágenes.

### 13.2 Namespaces y cgroups: el corazón técnico

- Namespaces: aíslan vistas (PID, red, mount, usuario).
- cgroups: limitan y contabilizan CPU/memoria/I/O.

Sin límites (cgroups), un contenedor puede tumbar al host por consumo excesivo. Por eso en producción el límite no es un detalle: es parte esencial de la arquitectura.

---

## 14. Arquitectura de seguridad del sistema

Seguridad en sistemas es una propiedad emergente: depende de diseño, configuración, operación y observabilidad. La arquitectura define “qué puede pasar” y “qué no debería ser posible”.

### 14.1 Superficie de ataque

Todo lo expuesto o accesible es superficie:
- servicios escuchando,
- puertos abiertos,
- APIs,
- usuarios con permisos,
- software desactualizado,
- credenciales almacenadas.

Arquitectónicamente, reducir superficie suele ser más efectivo que “añadir capas” defensivas.

### 14.2 Principio de mínimo privilegio

Un sistema bien diseñado asigna:
- el mínimo permiso necesario,
- el mínimo tiempo necesario,
- el mínimo alcance necesario.

Esto se concreta en:
- usuarios separados por función,
- servicios sin root cuando no es imprescindible,
- segmentación de red,
- separación de datos sensibles.

### 14.3 Separación de capas y dominios de confianza

Separar no es solo “ordenar”: es evitar que un fallo comprometa todo.
- DMZ para lo expuesto a Internet.
- Red de administración separada.
- Base de datos no accesible directamente desde Internet.
- Contenedores con capacidades reducidas.
- Políticas MAC (SELinux/AppArmor) cuando aplica.

### 14.4 Hardening desde arquitectura

Hardening no es “una lista de checks”, es un diseño:
- menos servicios,
- menos puertos,
- menos dependencias,
- configuraciones reproducibles,
- actualizaciones planificadas,
- logs y alertas para detectar desviaciones.

---

## 15. Arquitectura y alta disponibilidad

La alta disponibilidad no se logra declarando “quiero HA”; se logra eliminando o mitigando puntos únicos de fallo y diseñando recuperación.

### 15.1 SPOF (Single Point of Failure)

Un SPOF es cualquier componente cuya caída tumba el servicio:
- una única DB,
- un único balanceador,
- un único disco sin redundancia,
- una única conexión de red,
- un único nodo con estado crítico.

Arquitectura profesional identifica SPOFs y decide si:
- se elimina (redundancia),
- se tolera (coste),
- o se compensa (procedimientos de recuperación rápida).

### 15.2 Redundancia: activa-activa, activa-pasiva

- Activa-activa: varios nodos sirven a la vez; requiere coherencia y balanceo.
- Activa-pasiva: uno sirve, otro espera; conmutación (failover).

La elección depende de:
- coste,
- complejidad,
- consistencia de datos,
- tolerancia a fallos.

### 15.3 Escalado vertical vs horizontal

- Vertical: sencillo, pero con límite físico y posible SPOF.
- Horizontal: complejo, pero más resiliente y escalable.

Arquitectura moderna tiende a horizontal, pero exige:
- diseño sin estado o con estado gestionado,
- balanceo,
- observabilidad,
- automatización.

---

## 16. Arquitectura moderna y cloud

Cloud no es “otro tipo de servidor”; es un conjunto de modelos de entrega y operación que cambian cómo se diseña, despliega y escala.

### 16.1 Infraestructura tradicional vs cloud (impacto operativo)

Tradicional:
- compras hardware,
- ciclos lentos,
- capacidades fijas,
- control físico total.

Cloud:
- aprovisionamiento rápido,
- pago por uso,
- elasticidad,
- servicios gestionados,
- pero dependencia del proveedor y necesidad de gobierno (costes, seguridad, IAM).

### 16.2 IaaS, PaaS, SaaS (visión arquitectónica)

- IaaS: tú gestionas OS y arriba (VMs, redes, discos).
- PaaS: tú gestionas app y datos; plataforma gestiona runtime.
- SaaS: consumes servicio completo.

Arquitecturalmente, cuanto más alto (SaaS), menos control y menos carga operativa; cuanto más bajo (IaaS), más control y más responsabilidad.

### 16.3 Arquitecturas distribuidas

Sistemas modernos:
- microservicios,
- colas de mensajes,
- event-driven,
- caches distribuidas,
- replicación de datos,
- multi-región.

Esto mejora escalabilidad y resiliencia, pero sube la complejidad: observabilidad, consistencia, seguridad entre servicios (mTLS), y gestión de fallos parciales.

---

## 17. Observabilidad del sistema

Sin observabilidad, administrar sistemas es adivinar. Observabilidad es la capacidad de inferir qué pasa dentro del sistema a partir de señales externas.

### 17.1 Qué observar en cada capa (mapa práctico)

- Hardware: temperatura, errores de RAM, SMART de discos, uso de NIC.
- Kernel: carga, scheduling, OOM, I/O wait, errores de drivers.
- Servicios: estado, colas, tiempos de respuesta.
- Aplicación: latencias por endpoint, errores, saturación.
- Red: latencia, pérdida, retransmisiones, saturación.
- Seguridad: autenticaciones, escaladas, cambios de configuración, detecciones.

### 17.2 Métricas, logs y trazas (tres pilares)

- Métricas: números agregados (CPU, latencia p95, errores/min).
- Logs: eventos discretos con contexto (error stack, auth fail).
- Trazas: seguimiento de una petición a través de servicios (distributed tracing).

Arquitecturalmente, estos pilares deben:
- compartir un reloj coherente (NTP),
- tener correlación (IDs),
- ser centralizados,
- y tener retención y acceso controlado.

### 17.3 Instrumentación y coste

Más observabilidad no siempre es mejor si:
- genera ruido,
- sube costes,
- o no se usa.

Una arquitectura madura define:
- qué se mide,
- qué umbrales alertan,
- qué es “normal”,
- y qué runbooks se ejecutan.

---

## 18. Resumen final e integración con el resto del temario

Este documento te deja un mapa completo:
- El sistema es una cadena de capas con contratos.
- Rendimiento es latencia + colas + paralelismo + I/O, no solo CPU.
- Seguridad nace de separación, mínimo privilegio y superficie reducida.
- Disponibilidad nace de eliminar SPOFs y ensayar recuperación.
- Virtualización y contenedores son capas diferentes de aislamiento.
- Cloud cambia la responsabilidad, el aprovisionamiento y el diseño.
- Observabilidad convierte incidentes de “misterio” en diagnóstico reproducible.

### 18.1 Cómo encaja todo (modelo final que debes dominar)

~~~text
Hardware
  ↳ Firmware (UEFI/BIOS)
      ↳ Bootloader
          ↳ Kernel (CPU/mem/I/O/red/drivers)
              ↳ User space (servicios)
                  ↳ Aplicaciones
                      ↳ Red/usuarios/datos
+ Seguridad y observabilidad atraviesan todas las capas
+ Resiliencia y escalabilidad se diseñan desde la arquitectura
~~~

### 18.2 Relación directa con los siguientes módulos de SISTEMAS 1.0.1

- **sistemas-operativos.md**: profundiza en kernel, procesos, memoria, FS, permisos.
- **linux-fundamentos.md**: te da práctica para observar y operar estas capas.
- **redes-fundamentos.md / direccionamiento-ip.md**: te da el lenguaje para redes reales.
- **virtualizacion.md / contenedores.md**: llevan el aislamiento y despliegue al mundo actual.
- **monitorizacion-backups.md**: convierte observabilidad y recuperación en práctica real.
- **fundamentos-ciberseguridad.md**: aplica el modelo de arquitectura a amenazas y defensa.

---

## Apéndice: comandos de observación (vista previa, para usar más adelante en labs)

> Se incluyen como referencia porque son “las ventanas” a las capas. En los módulos de Linux y monitorización se trabajan en profundidad.

~~~bash
# CPU / arquitectura
lscpu

# Memoria
free -h

# Disco
lsblk
df -h

# Red
ip a
ip r

# Procesos (vista rápida)
ps aux | head

# Logs de arranque (si systemd)
journalctl -b | tail -n 50
~~~