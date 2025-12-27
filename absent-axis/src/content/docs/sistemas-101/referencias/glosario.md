---
title: Glosario de Sistemas
description: "Glosario técnico y académico de conceptos fundamentales de Sistemas 101: informática general, sistemas operativos, procesos, memoria, usuarios y sistemas de archivos, con enfoque en sistemas y ciberseguridad."
sidebar:
  order: 1
---

### Conceptos fundamentales de informática y sistemas

**Sistema informático**  
Conjunto organizado de componentes hardware, software y datos que interactúan para procesar información. Desde una perspectiva de sistemas, no se trata solo de la suma de elementos, sino de las relaciones y dependencias entre ellos. Un fallo en un componente puede propagarse al resto del sistema, lo que justifica la necesidad de aislamiento, redundancia y control.

**Hardware**  
Conjunto de componentes físicos de un sistema informático: CPU, memoria, dispositivos de almacenamiento y periféricos. El hardware impone límites físicos y arquitectónicos que condicionan el diseño del software de sistemas, especialmente en rendimiento, concurrencia y seguridad.

**Software**  
Conjunto de programas y configuraciones que gobiernan el uso del hardware. En sistemas, el software no solo ejecuta tareas, sino que define políticas de uso de recursos, control de acceso y mecanismos de protección.

**Firmware**  
Software de bajo nivel integrado en dispositivos hardware que se ejecuta antes o de forma independiente al sistema operativo. El firmware actúa como intermediario entre hardware y software, y su compromiso supone un riesgo elevado debido a su alto nivel de privilegio y persistencia.

**Arquitectura de computadores**  
Disciplina que estudia la organización interna de un sistema de computación, incluyendo CPU, memoria, buses e instrucciones. Comprender la arquitectura es esencial para entender cómo el software de sistemas interactúa con el hardware y por qué ciertas optimizaciones o vulnerabilidades existen.

**Arquitectura Von Neumann**  
Modelo en el que datos e instrucciones comparten el mismo espacio de memoria. Su simplicidad facilita el diseño, pero introduce riesgos como la ejecución de datos como código, relevantes en ataques de inyección.

**Arquitectura Harvard / Harvard modificada**  
Modelo que separa memoria de datos y de instrucciones. Reduce ciertos riesgos y mejora rendimiento, siendo habitual en sistemas embebidos y en arquitecturas modernas con cachés separadas.

**Recurso**  
Entidad limitada gestionada por el sistema: CPU, memoria, almacenamiento, red. La gestión eficiente y segura de recursos es una función central del sistema operativo.

**Abstracción**  
Mecanismo mediante el cual el sistema presenta una interfaz simplificada de recursos complejos. La abstracción permite portabilidad y facilidad de uso, pero introduce overhead y capas que deben comprenderse para depuración y seguridad.

**Aislamiento**  
Separación lógica entre componentes o procesos para evitar interferencias. Es un principio fundamental para estabilidad y ciberseguridad, aplicado en procesos, usuarios, máquinas virtuales y contenedores.

**Compartición**  
Uso concurrente de recursos por múltiples entidades. La compartición mejora eficiencia, pero requiere mecanismos de sincronización y control para evitar conflictos y fugas de información.

**Overhead**  
Coste adicional introducido por mecanismos de abstracción, seguridad o virtualización. El análisis del overhead permite evaluar trade-offs entre rendimiento y protección.

---

### Sistemas operativos

**Sistema operativo**  
Software base que actúa como intermediario entre hardware y aplicaciones. Gestiona recursos, aplica políticas de seguridad y proporciona servicios comunes mediante llamadas al sistema.

**Kernel**  
Núcleo del sistema operativo que se ejecuta en modo privilegiado. Controla memoria, CPU, dispositivos y aislamiento entre procesos. Es uno de los componentes más críticos desde el punto de vista de seguridad.

**Kernel monolítico**  
Arquitectura donde la mayoría de servicios del sistema se ejecutan en el espacio del kernel. Ofrece alto rendimiento, pero aumenta el impacto de errores.

**Microkernel**  
Arquitectura que minimiza el código en kernel, delegando servicios en procesos de usuario. Mejora aislamiento, a costa de mayor complejidad y overhead.

**Kernel híbrido**  
Modelo intermedio que combina características de ambos enfoques, utilizado en sistemas modernos para equilibrar rendimiento y modularidad.

**Espacio de usuario**  
Zona de ejecución donde operan las aplicaciones sin privilegios directos sobre el hardware. Su aislamiento protege al sistema frente a fallos o ataques en aplicaciones.

**Espacio de kernel**  
Zona de ejecución privilegiada reservada al sistema operativo. El acceso indebido a este espacio implica compromisos graves de seguridad.

**Modo usuario / modo kernel**  
Niveles de privilegio que separan código confiable del no confiable. Esta distinción es la base del modelo de seguridad de los sistemas modernos.

**Llamada al sistema**  
Mecanismo controlado mediante el cual un proceso solicita servicios al kernel. Define una frontera de seguridad clave entre usuario y sistema.

**Interrupción**  
Señal generada por hardware o software que interrumpe la ejecución normal para atender un evento. Es fundamental para E/S, temporización y multitarea.

**Excepción**  
Evento generado por la CPU ante una condición anómala durante la ejecución. Puede indicar errores de programación o intentos de acceso indebido.

**Bootloader**  
Programa inicial que carga el kernel en memoria. Su seguridad es crítica, ya que controla el arranque del sistema.

**Init system**  
Componente responsable de iniciar y gestionar servicios tras el arranque. Define el ciclo de vida de los procesos del sistema.

**systemd**  
Sistema init moderno que unifica gestión de servicios, dependencias y logging. Introduce potencia y complejidad adicional en la administración del sistema.

---

### Procesos, hilos y ejecución

**Proceso**  
Instancia de un programa en ejecución con su propio espacio de memoria y recursos. Es la unidad básica de aislamiento en un sistema operativo.

**Hilo**  
Unidad de ejecución dentro de un proceso que comparte memoria con otros hilos. Facilita concurrencia, pero introduce riesgos de sincronización.

**PID**  
Identificador único de proceso. Permite al sistema y a los administradores gestionar y controlar procesos.

**Estado de proceso**  
Situación actual de un proceso, como ejecución, espera o detenido. Refleja las decisiones del planificador.

**Scheduler**  
Componente del kernel que decide qué proceso o hilo utiliza la CPU. Influye directamente en rendimiento y latencia.

**Planificación preventiva**  
Modelo en el que el sistema interrumpe procesos para garantizar reparto justo de CPU.

**Context switch**  
Cambio de ejecución entre procesos o hilos. Introduce overhead y es clave para la multitarea.

**Prioridad**  
Valor que influye en las decisiones del scheduler. Un mal uso puede provocar inanición o degradación del sistema.

**Afinidad de CPU**  
Asociación de procesos a núcleos específicos. Puede mejorar rendimiento, pero reduce flexibilidad.

**Daemon / servicio**  
Proceso que se ejecuta en segundo plano ofreciendo funcionalidades al sistema o a la red.

---

### Gestión de memoria

**Memoria física**  
RAM instalada en el sistema. Es un recurso limitado gestionado por el kernel.

**Memoria virtual**  
Abstracción que permite a los procesos creer que disponen de memoria contigua y exclusiva.

**Dirección virtual**  
Dirección usada por un proceso, traducida por el sistema a memoria física real.

**Dirección física**  
Ubicación real en la RAM. El acceso directo está restringido al kernel.

**Página**  
Unidad básica de gestión de memoria virtual.

**Frame**  
Bloque de memoria física donde se almacena una página.

**Page table**  
Estructura que mantiene la correspondencia entre direcciones virtuales y físicas.

**Page fault**  
Evento que ocurre cuando una página requerida no está en memoria. Puede ser legítimo o indicar un error.

**Swap**  
Uso de almacenamiento secundario para ampliar memoria virtual. Aumenta capacidad, pero reduce rendimiento.

**OOM killer**  
Mecanismo que finaliza procesos cuando el sistema se queda sin memoria, priorizando estabilidad global.

**Stack**  
Región de memoria usada para llamadas a funciones y variables locales.

**Heap**  
Región de memoria usada para asignación dinámica. Es fuente frecuente de errores de seguridad.

**Memoria compartida**  
Segmento accesible por múltiples procesos. Mejora rendimiento, pero requiere control estricto.

---

### Usuarios, grupos y control de acceso

**Usuario**  
Entidad que representa una identidad en el sistema. Define permisos y contexto de ejecución.

**Grupo**  
Conjunto de usuarios para facilitar la gestión de permisos.

**UID**  
Identificador numérico de usuario.

**GID**  
Identificador numérico de grupo.

**Autenticación**  
Proceso de verificación de identidad.

**Autorización**  
Proceso de concesión de permisos tras la autenticación.

**Permisos UNIX**  
Modelo básico de control de acceso basado en lectura, escritura y ejecución.

**ACL**  
Listas de control de acceso que permiten granularidad adicional.

**SUID**  
Permiso que permite ejecutar un programa con privilegios de su propietario.

**SGID**  
Permiso similar aplicado a grupos.

**Sticky bit**  
Permiso que restringe la eliminación de archivos en directorios compartidos.

**Principio de mínimo privilegio**  
Regla que establece que cada entidad debe tener solo los permisos estrictamente necesarios.

---

### Sistemas de archivos y almacenamiento

**Sistema de archivos**  
Estructura lógica que organiza y gestiona datos en almacenamiento.

**Inodo**  
Estructura que contiene metadatos de un archivo. Es clave para entender permisos y enlaces.

**Path absoluto**  
Ruta completa desde la raíz del sistema.

**Path relativo**  
Ruta definida respecto a un directorio actual.

**Mount / umount**  
Operaciones para integrar sistemas de archivos en la jerarquía del sistema.

**Block device**  
Dispositivo que gestiona datos en bloques, como discos.

**Character device**  
Dispositivo que gestiona datos como flujo continuo.

**Journaling**  
Técnica para mantener consistencia del sistema de archivos tras fallos.

**Snapshot**  
Captura del estado de un sistema de archivos en un momento dado.

**RAID**  
Conjunto de técnicas para combinar discos, mejorando rendimiento o tolerancia a fallos.

**Thin provisioning**  
Asignación de espacio bajo demanda.

**Thick provisioning**  
Reserva completa de espacio desde el inicio.

**Latencia de E/S**  
Tiempo que tarda una operación de entrada/salida, factor crítico del rendimiento.

### Redes y comunicaciones

**Red**  
Conjunto de sistemas interconectados que intercambian información mediante protocolos definidos. En sistemas, una red no es solo conectividad, sino un entorno donde intervienen latencia, fiabilidad, seguridad y control de acceso.

**Topología de red**  
Forma en que se organizan los nodos y enlaces de una red. La topología influye directamente en rendimiento, tolerancia a fallos y superficie de ataque.

**LAN**  
Red de área local, limitada geográficamente. Suele estar bajo control administrativo único, lo que permite aplicar políticas de seguridad más estrictas.

**WAN**  
Red de área amplia que interconecta múltiples LANs. Introduce mayores latencias y riesgos de seguridad, al depender de infraestructuras externas.

**Modelo OSI**  
Modelo conceptual de siete capas que describe funciones de comunicación en red. Facilita el análisis de problemas y la separación de responsabilidades.

**Modelo TCP/IP**  
Modelo práctico de cuatro capas usado en Internet. Define cómo se encapsulan y transmiten los datos entre sistemas.

**Dirección IP**  
Identificador lógico de un nodo en una red IP. Es esencial para el enrutamiento y la comunicación entre sistemas.

**IPv4**  
Versión de IP basada en direcciones de 32 bits. Su limitación de espacio ha impulsado técnicas como NAT.

**IPv6**  
Versión de IP con direcciones de 128 bits. Mejora escalabilidad y elimina algunas limitaciones estructurales de IPv4.

**Subred**  
Segmentación lógica de una red IP. Permite control de tráfico, organización y aislamiento.

**Gateway**  
Nodo que actúa como punto de salida de una red hacia otras redes. Es un elemento crítico desde el punto de vista de seguridad.

**Routing**  
Proceso de selección de rutas para enviar paquetes entre redes. Determina eficiencia y resiliencia de la comunicación.

**Switching**  
Proceso de reenvío de tramas dentro de una red local. Afecta directamente a rendimiento y segmentación.

**NAT**  
Mecanismo que traduce direcciones IP privadas a públicas. Mejora aprovechamiento de direcciones, pero complica trazabilidad.

**DNS**  
Sistema que traduce nombres de dominio a direcciones IP. Es un servicio crítico y objetivo frecuente de ataques.

**DHCP**  
Protocolo que asigna automáticamente direcciones IP y parámetros de red. Facilita administración, pero introduce dependencia de un servicio central.

---

### Virtualización

**Virtualización**  
Técnica que permite ejecutar múltiples sistemas lógicos sobre un mismo hardware físico mediante abstracción y aislamiento de recursos.

**Máquina virtual**  
Sistema operativo completo que se ejecuta sobre un hipervisor con recursos virtualizados. Proporciona fuerte aislamiento.

**Host**  
Sistema físico o lógico que ejecuta el hipervisor y proporciona recursos a las máquinas virtuales.

**Guest**  
Sistema operativo que se ejecuta dentro de una máquina virtual.

**Hipervisor**  
Capa de software que gestiona máquinas virtuales y controla el acceso al hardware.

**Hipervisor tipo 1 (bare metal)**  
Hipervisor que se ejecuta directamente sobre el hardware. Ofrece mayor rendimiento y seguridad.

**Hipervisor tipo 2 (hosted)**  
Hipervisor que se ejecuta sobre un sistema operativo anfitrión. Prioriza facilidad de uso.

**vCPU**  
Unidad de procesamiento virtual asignada a una máquina virtual. Se planifica sobre CPU físicas.

**Virtualización asistida por hardware**  
Extensiones de CPU que facilitan y aseguran la ejecución de sistemas virtualizados.

**Overcommit**  
Asignación de más recursos virtuales que físicos, asumiendo que no todos se usarán simultáneamente.

**Snapshot**  
Captura del estado completo de una máquina virtual en un momento dado. Útil para pruebas y recuperación.

**Migración en frío**  
Movimiento de una máquina virtual apagada entre hosts.

**Migración en caliente**  
Movimiento de una máquina virtual en ejecución sin interrupción del servicio.

---

### Contenedores y aislamiento a nivel de sistema

**Contenedor**  
Entorno aislado que ejecuta aplicaciones compartiendo el kernel del host. Ofrece menor aislamiento que una máquina virtual, pero mayor eficiencia.

**Namespace**  
Mecanismo del kernel Linux que aísla recursos como procesos, red o sistema de archivos.

**cgroups**  
Mecanismo del kernel que limita y contabiliza el uso de recursos por grupos de procesos.

**Runtime de contenedores**  
Software responsable de crear y gestionar contenedores, interactuando directamente con el kernel.

**Imagen**  
Plantilla inmutable que define el contenido de un contenedor.

**Registro de imágenes**  
Repositorio centralizado para almacenar y distribuir imágenes de contenedores.

**Orquestación**  
Gestión automatizada de múltiples contenedores: despliegue, escalado y recuperación.

**Contenedor vs máquina virtual**  
Diferencia fundamental basada en el nivel de aislamiento: kernel compartido frente a kernel propio.

**Aislamiento a nivel de kernel**  
Modelo de aislamiento basado en mecanismos internos del sistema operativo, más ligero pero más dependiente del kernel.

---

### Lenguajes de sistemas

**Lenguaje de sistemas**  
Lenguaje diseñado para interactuar directamente con hardware y kernel, permitiendo control explícito de recursos.

**Bajo nivel**  
Característica que describe lenguajes cercanos a la representación real de la máquina.

**Lenguaje máquina**  
Código binario ejecutado directamente por la CPU.

**Ensamblador**  
Representación simbólica del lenguaje máquina.

**Compilación**  
Proceso de traducción de código fuente a binario ejecutable.

**Enlazado**  
Fase que combina código compilado y bibliotecas en un ejecutable final.

**Toolchain**  
Conjunto de herramientas necesarias para compilar y construir software.

**ABI**  
Interfaz binaria que define cómo interactúan binarios, sistema operativo y hardware.

**Gestión manual de memoria**  
Responsabilidad del programador de reservar y liberar memoria explícitamente.

**Puntero**  
Variable que almacena direcciones de memoria. Es una herramienta potente y peligrosa.

**Referencia**  
Abstracción que permite acceder a datos sin manipular direcciones explícitas.

**Condición de carrera**  
Situación en la que el resultado depende del orden de ejecución concurrente.

---

### Bases de datos: conceptos estructurales

**Base de datos (DB)**  
Conjunto organizado de datos persistentes gestionados de forma estructurada.

**Sistema gestor de bases de datos (DBMS)**  
Software que gestiona almacenamiento, acceso, concurrencia y seguridad de los datos.

**Motor de base de datos**  
Componente interno del DBMS que implementa almacenamiento y ejecución de consultas.

**Instancia**  
Proceso en ejecución de un motor de base de datos con su memoria y recursos.

**Cluster**  
Conjunto de instancias coordinadas para alta disponibilidad o escalado.

**Schema**  
Espacio lógico que organiza objetos de una base de datos.

**Table**  
Estructura que almacena datos en filas y columnas.

**Row / tuple**  
Registro individual dentro de una tabla.

**Index**  
Estructura auxiliar que acelera búsquedas a costa de espacio y escrituras adicionales.

**Constraint**  
Regla que garantiza integridad de los datos.

**Primary key**  
Identificador único de una fila.

**Foreign key**  
Referencia que enlaza datos entre tablas, manteniendo integridad referencial.

---

### Bases de datos: consistencia y concurrencia

**ACID**  
Conjunto de propiedades que garantizan fiabilidad de transacciones.

**Atomicidad**  
Garantiza que una transacción se ejecute completamente o no se ejecute.

**Consistencia**  
Garantiza que las reglas de integridad se mantengan tras una transacción.

**Aislamiento**  
Garantiza que transacciones concurrentes no interfieran de forma indebida.

**Durabilidad**  
Garantiza que los cambios confirmados persistan ante fallos.

**CAP**  
Teorema que describe el equilibrio entre consistencia, disponibilidad y tolerancia a particiones en sistemas distribuidos.

**Disponibilidad**  
Capacidad del sistema para responder a peticiones.

**Tolerancia a particiones**  
Capacidad de operar ante fallos de comunicación.

**MVCC**  
Mecanismo de control de concurrencia basado en versiones múltiples de datos.

**WAL**  
Registro previo de cambios para garantizar durabilidad.

**Checkpoint**  
Punto de sincronización entre memoria y almacenamiento persistente.

**Vacuum**  
Proceso de limpieza y reutilización de espacio en bases de datos.

### Alta disponibilidad y resiliencia

**Replication**  
Mecanismo mediante el cual los datos o servicios se duplican en múltiples nodos. La replicación mejora tolerancia a fallos y disponibilidad, pero introduce complejidad en consistencia y sincronización.

**Replica primaria**  
Nodo principal que acepta escrituras y coordina la replicación. Su fallo suele desencadenar procesos de failover.

**Replica secundaria**  
Nodo que mantiene una copia sincronizada del primario. Puede usarse para lecturas o como respaldo ante fallos.

**Failover**  
Proceso automático o manual por el cual un sistema secundario asume el rol del principal tras una caída. Es crítico para continuidad del servicio.

**Failback**  
Retorno controlado del rol principal al nodo original una vez recuperado. Requiere sincronización cuidadosa para evitar pérdida de datos.

**Load balancing**  
Distribución de carga entre múltiples nodos para mejorar rendimiento y disponibilidad. Introduce una capa adicional que debe protegerse y monitorizarse.

**High availability (HA)**  
Conjunto de técnicas destinadas a minimizar el tiempo de inactividad del sistema. Combina replicación, monitorización y failover.

**Disaster recovery**  
Estrategia para recuperar sistemas tras eventos catastróficos. Incluye copias remotas, procedimientos y pruebas periódicas.

**Backup**  
Copia de datos destinada a restauración ante pérdida o corrupción. No debe confundirse con replicación.

**Restore**  
Proceso de recuperación de datos a partir de un backup. Su efectividad depende de pruebas previas y documentación.

**RPO**  
Punto objetivo de recuperación que define la cantidad máxima de datos que se pueden perder.

**RTO**  
Tiempo objetivo de recuperación que define cuánto puede tardar el sistema en volver a estar operativo.

---

### Escalabilidad y arquitectura distribuida

**Escalabilidad vertical**  
Incremento de capacidad mediante mejora de recursos de un único nodo. Tiene límites físicos y económicos.

**Escalabilidad horizontal**  
Incremento de capacidad mediante adición de nodos. Mejora tolerancia a fallos, pero introduce complejidad distribuida.

**Sharding**  
Distribución de datos entre nodos basada en una clave. Permite escalar, pero complica consultas y consistencia.

**Partitioning**  
División lógica o física de datos dentro de un mismo sistema para mejorar rendimiento y gestión.

**Consistencia fuerte**  
Modelo donde todas las lecturas reflejan inmediatamente la última escritura confirmada.

**Consistencia eventual**  
Modelo donde las réplicas convergen con el tiempo. Mejora disponibilidad a costa de inmediatez.

**CQRS**  
Separación de modelos de lectura y escritura para optimizar rendimiento y escalabilidad.

**Event sourcing**  
Modelo que almacena cambios como eventos en lugar de estados finales. Facilita auditoría y reconstrucción.

**Idempotencia**  
Propiedad por la cual una operación repetida produce el mismo resultado. Es clave en sistemas distribuidos y tolerantes a fallos.

---

### Seguridad y ciberseguridad

**Seguridad informática**  
Disciplina orientada a proteger sistemas frente a accesos no autorizados, fallos y uso indebido.

**Ciberseguridad**  
Aplicación de la seguridad informática en entornos conectados y distribuidos, considerando amenazas activas.

**Superficie de ataque**  
Conjunto de puntos por los que un sistema puede ser atacado. Aumenta con complejidad y exposición.

**Vulnerabilidad**  
Debilidad explotable en un sistema. Puede ser técnica, lógica u operativa.

**Exploit**  
Código o técnica que aprovecha una vulnerabilidad para obtener un comportamiento no autorizado.

**Threat model**  
Análisis estructurado de amenazas, actores y vectores de ataque. Base del diseño seguro.

**Hardening**  
Proceso de reducción de la superficie de ataque mediante configuración y eliminación de componentes innecesarios.

**Defense in depth**  
Estrategia de múltiples capas defensivas para mitigar fallos individuales.

**Zero trust**  
Modelo de seguridad que no asume confianza implícita en ningún componente.

**Sandbox**  
Entorno aislado para ejecutar código con privilegios restringidos.

**Escape**  
Ruptura del aislamiento de un sandbox, contenedor o máquina virtual.

---

### Seguridad en redes

**Firewall**  
Sistema que filtra tráfico de red según reglas definidas.

**IDS**  
Sistema de detección de intrusiones que analiza tráfico o eventos.

**IPS**  
Sistema de prevención que bloquea tráfico malicioso activamente.

**VLAN**  
Segmentación lógica de red para aislar tráfico.

**Segmentación de red**  
Separación de redes para limitar movimiento lateral.

**DMZ**  
Zona intermedia que expone servicios controlados al exterior.

**VPN**  
Túnel cifrado que permite acceso remoto seguro.

**TLS**  
Protocolo de cifrado para comunicaciones seguras.

**MITM**  
Ataque donde un tercero intercepta comunicaciones.

**DDoS**  
Ataque de denegación de servicio distribuido basado en saturación de recursos.

---

### Observabilidad y operación

**Logging**  
Registro de eventos del sistema. Esencial para auditoría y forense.

**Monitoring**  
Supervisión continua del estado del sistema.

**Metrics**  
Medidas cuantitativas del comportamiento del sistema.

**Tracing**  
Seguimiento de peticiones a través de componentes distribuidos.

**Alerting**  
Generación de avisos ante condiciones anómalas.

**SLA**  
Acuerdo contractual sobre nivel de servicio.

**SLO**  
Objetivo interno de nivel de servicio.

**SLI**  
Indicador medible del nivel de servicio.

---

### Automatización y operación de sistemas

**Automatización**  
Ejecución de tareas sin intervención manual para reducir errores y tiempos.

**Infraestructura como código**  
Definición de infraestructuras mediante archivos versionables.

**Provisionamiento**  
Creación inicial de recursos y sistemas.

**Configuración declarativa**  
Definición del estado deseado del sistema en lugar de pasos imperativos.

**Orquestación**  
Coordinación de múltiples componentes y servicios.

**CI/CD**  
Integración y despliegue continuos para entrega frecuente y controlada.

**Idempotencia operativa**  
Capacidad de aplicar configuraciones repetidas sin efectos colaterales.

---

### Rendimiento y análisis de sistemas

**Rendimiento**  
Capacidad del sistema para procesar trabajo eficientemente.

**Latencia**  
Tiempo de respuesta de una operación.

**Throughput**  
Cantidad de trabajo procesado por unidad de tiempo.

**Bottleneck**  
Componente que limita el rendimiento global.

**Profiling**  
Análisis detallado del consumo de recursos.

**Benchmarking**  
Medición comparativa del rendimiento.

**Trade-off**  
Compromiso entre objetivos contrapuestos.

**Deuda técnica**  
Coste acumulado por decisiones técnicas subóptimas.

---

### Uso académico, profesional y documentación

**Laboratorio**  
Entorno controlado para experimentación práctica.

**Entorno reproducible**  
Sistema que puede recrearse de forma consistente.

**Documentación técnica**  
Descripción formal de diseño, uso y operación.

**Auditoría**  
Revisión sistemática de sistemas y procesos.

**Cumplimiento**  
Adecuación a normas y regulaciones.

**Buenas prácticas**  
Conjunto de técnicas recomendadas por experiencia y consenso.

**Estándar**  
Especificación aceptada formalmente.

**RFC**  
Documento que define estándares y prácticas en Internet.