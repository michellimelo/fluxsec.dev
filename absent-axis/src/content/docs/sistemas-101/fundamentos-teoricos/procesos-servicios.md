---
title: Procesos y Servicios
description: "Capítulo académico y operativo sobre procesos y servicios en Linux. Estudia en profundidad cómo un sistema pasa de estar instalado a estar en ejecución, cómo el kernel gestiona procesos, concurrencia y planificación, y cómo los servicios representan procesos persistentes críticos para el funcionamiento y la seguridad del sistema."
sidebar:
  order: 4
---

Cuando un sistema operativo está instalado en disco, todavía **no está vivo**. Solo cuando el kernel arranca y comienza a crear y gestionar procesos, el sistema pasa a un estado dinámico. Los **procesos** son la manifestación concreta de que el sistema está funcionando; los **servicios** son aquellos procesos cuya misión es sostener funciones esenciales de forma continua.

Desde una perspectiva de sistemas, procesos y servicios representan la **actividad real** del sistema. Desde una perspectiva de ciberseguridad, representan la **superficie de ataque activa**: cada proceso ejecutándose es código con permisos, memoria, acceso a recursos y, potencialmente, vulnerabilidades.

Este módulo explica qué es un proceso, cómo se crea, cómo vive y cómo muere, y cómo los servicios se construyen sobre ese modelo para proporcionar funciones persistentes. Comprender este bloque es imprescindible para administrar sistemas, diagnosticar fallos y detectar comportamientos anómalos.

---

## 2. Qué es un proceso (desde cero)

Un **proceso** es una instancia de un programa en ejecución. Un programa, por sí solo, es un conjunto de instrucciones almacenadas en disco; no consume CPU ni memoria activa. Cuando se ejecuta, el sistema operativo crea un proceso, le asigna recursos y lo integra en el sistema de planificación.

El proceso es una **entidad gestionada por el kernel**. No es una abstracción teórica, sino un objeto real del sistema operativo, con identidad propia y un ciclo de vida bien definido. Cada proceso posee su propio espacio de direcciones virtual, su propio contexto de ejecución y unas credenciales de seguridad asociadas.

Un punto clave es que **un mismo programa puede dar lugar a múltiples procesos distintos**. Por ejemplo, abrir varias veces un navegador crea varios procesos independientes, aunque todos se basen en el mismo binario en disco. El aislamiento entre procesos es fundamental: un fallo en uno no debe afectar a los demás ni al sistema completo.

---

## 3. El proceso como entidad del sistema operativo

Cuando el kernel crea un proceso, le asigna un **identificador único**, el PID. Este identificador permite al sistema referirse al proceso de forma inequívoca. Además, cada proceso conoce quién lo creó: su **proceso padre**. Esta relación padre-hijo forma un árbol de procesos que describe la genealogía completa del sistema en ejecución.

Un proceso no es solo código. Incluye:
- un espacio de memoria virtual aislado,
- un conjunto de descriptores de archivo abiertos,
- credenciales (usuario, grupo, capacidades),
- un estado de ejecución,
- y un contexto que permite al kernel pausarlo y reanudarlo.

Desde el punto de vista de seguridad, este contexto es crítico. Las credenciales determinan qué puede hacer el proceso. Un proceso que se ejecute con privilegios elevados tiene un impacto potencial mucho mayor que uno restringido.

Ejemplo de observación de procesos en Linux:

    ps -ef
    ps -o pid,ppid,user,comm

Estos comandos no son simples listados: permiten reconstruir qué procesos existen, quién los ejecuta y cómo se relacionan entre sí.

---

## 4. Ciclo de vida de un proceso

Un proceso no aparece de forma espontánea ni desaparece sin consecuencias. Sigue un ciclo de vida bien definido controlado por el kernel.

La **creación** de procesos en Linux se basa en el modelo fork/exec. Primero, un proceso existente se duplica (fork), creando un proceso hijo casi idéntico. Después, ese proceso hijo reemplaza su imagen de memoria con un nuevo programa (exec). Este modelo explica por qué todos los procesos descienden, en última instancia, de un proceso inicial.

Durante su vida, un proceso puede encontrarse en distintos **estados**. Puede estar ejecutándose activamente en la CPU, esperando a que ocurra un evento (por ejemplo, entrada/salida), detenido temporalmente o finalizado. Un estado especial es el proceso zombi: un proceso que ya terminó su ejecución pero cuyo padre aún no ha recogido su estado final. Los zombis no consumen CPU, pero indican errores de gestión.

La **finalización** de un proceso puede ser limpia o forzada. Una terminación limpia permite liberar recursos de forma ordenada. Una terminación forzada puede dejar archivos temporales, locks o estados inconsistentes. Por ello, entender cómo finalizar procesos correctamente es una habilidad clave en administración de sistemas.

---

## 5. Hilos y concurrencia

Un proceso puede contener uno o varios **hilos de ejecución**. Los hilos comparten el mismo espacio de memoria del proceso, pero ejecutan flujos independientes. Esta arquitectura permite aprovechar mejor CPUs multinúcleo y mejorar el rendimiento en tareas concurrentes.

La concurrencia introduce complejidad. Al compartir memoria, los hilos pueden interferir entre sí si no se sincronizan correctamente. Las **condiciones de carrera**, los bloqueos y los interbloqueos no son errores anecdóticos: son problemas estructurales que pueden causar fallos graves y, en algunos casos, vulnerabilidades de seguridad.

Desde el punto de vista del sistema operativo, los hilos son unidades planificables. El kernel decide qué hilo se ejecuta en cada núcleo, no solo qué proceso.

---

## 6. Planificación de procesos (scheduler)

El **scheduler** es el componente del kernel que decide qué proceso o hilo utiliza la CPU en cada momento. Dado que la CPU es un recurso finito, el scheduler debe repartir tiempo de ejecución de forma justa y eficiente.

Linux utiliza políticas de planificación diseñadas para equilibrar rendimiento y equidad. El sistema distingue entre procesos interactivos y procesos intensivos en CPU o entrada/salida. Esta distinción es esencial para que el sistema siga siendo usable bajo carga.

Un scheduler mal configurado o abusado puede provocar:
- latencias elevadas,
- procesos críticos bloqueados,
- denegaciones de servicio locales.

Ejemplo de observación de carga y planificación:

    top
    htop

Estas herramientas permiten analizar cómo se reparte el tiempo de CPU y detectar procesos que acaparan recursos.

---

## 7. Señales y control de procesos

Las **señales** son un mecanismo de comunicación asíncrona entre el kernel y los procesos, o entre procesos. Permiten notificar eventos como solicitudes de terminación, interrupciones o errores.

No todas las señales son iguales. Algunas permiten una gestión ordenada, dando al proceso la oportunidad de limpiar recursos. Otras fuerzan la terminación inmediata. Desde administración y seguridad, saber qué señal usar y cuándo es crucial para evitar corrupción de datos o estados inconsistentes.

Ejemplo conceptual de control:

    kill -TERM <pid>
    kill -KILL <pid>

La diferencia entre ambas órdenes es profunda: una intenta finalizar limpiamente; la otra elimina el proceso sin posibilidad de reacción.

---

## 8. Qué es un servicio

Un **servicio** es un proceso diseñado para ejecutarse de forma persistente y proporcionar una función continua al sistema o a otros sistemas. A diferencia de los procesos interactivos, los servicios suelen ejecutarse en segundo plano, sin intervención directa del usuario.

Ejemplos de servicios incluyen servidores web, servicios de red, gestores de tiempo o demonios de logging. Su característica principal es la **persistencia**: deben iniciarse automáticamente, reiniciarse si fallan y mantenerse disponibles.

Desde el punto de vista de seguridad, los servicios son especialmente sensibles porque:
- suelen ejecutarse con privilegios elevados,
- suelen estar expuestos a la red,
- y suelen arrancar automáticamente.

---

## 9. systemd y la gestión moderna de servicios

En Linux moderno, **systemd** es el gestor central de procesos persistentes. systemd no solo inicia servicios; define dependencias, controla el orden de arranque y monitoriza el estado de cada servicio.

Cada servicio se describe mediante una **unidad**, que especifica:
- qué ejecutar,
- con qué usuario,
- en qué condiciones,
- y cómo reaccionar ante fallos.

Esto convierte a systemd en un elemento crítico de seguridad. Una unidad mal definida puede otorgar más privilegios de los necesarios o permitir persistencia no deseada.

Ejemplo de observación de servicios:

    systemctl status
    systemctl list-units --type=service

---

## 10. Arranque automático y persistencia

Los servicios pueden configurarse para arrancar automáticamente durante el inicio del sistema. Esta capacidad es esencial para la operatividad, pero también es una vía habitual de persistencia maliciosa.

Auditar qué servicios arrancan, con qué permisos y por qué es una tarea básica de hardening. Un sistema con servicios innecesarios activos es un sistema con superficie de ataque ampliada.

---

## 11. Observabilidad de procesos y servicios

Un sistema saludable debe ser observable. La observabilidad implica poder responder preguntas como:
- qué procesos se están ejecutando,
- cuánto consumen,
- cuándo fallan,
- y por qué.

Los logs y el estado de los servicios proporcionan esta información. Sin observabilidad, la administración se convierte en conjetura y la seguridad en ilusión.

Ejemplo de observación de eventos:

    journalctl -u nombre_servicio
    journalctl -xe

---

## 12. Procesos, servicios y seguridad

Desde la perspectiva de seguridad, cada proceso es una entidad con permisos, memoria y acceso a recursos. Cada servicio es una puerta potencial al sistema. La mayoría de compromisos reales no explotan fallos exóticos del kernel, sino servicios mal configurados o procesos con privilegios excesivos.

Principios fundamentales:
- minimizar procesos y servicios activos,
- ejecutar servicios con el menor privilegio posible,
- monitorizar comportamiento anómalo,
- auditar persistencia.

---

## 13. Relación con módulos posteriores

Este módulo es la base directa para:
- Usuarios y Permisos: quién ejecuta qué procesos.
- Redes y Servicios de Red: cómo los servicios exponen funcionalidades.
- Monitorización y Backups: observabilidad y continuidad.
- Contenedores: procesos aislados a gran escala.

Sin entender procesos y servicios, estos módulos carecen de fundamento real.

---

## 14. Conclusión

Procesos y servicios representan el **estado vivo del sistema operativo**. Entender cómo se crean, cómo se planifican, cómo se controlan y cómo persisten permite administrar sistemas con criterio y defenderlos con conocimiento. Este módulo transforma la visión de Linux de “un sistema con comandos” a **un organismo en ejecución**, observable y gobernable.