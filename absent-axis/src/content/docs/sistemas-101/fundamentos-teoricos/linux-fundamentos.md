---
title: Fundamentos Linux
description: "Módulo académico y operativo de fundamentos de Linux. Desarrollo profundo del sistema GNU/Linux como entorno real de trabajo: arquitectura, arranque, filesystem, shell, comandos, paquetes, procesos, logs y seguridad básica. Base técnica para administración, ciberseguridad y sistemas."
sidebar:
  order: 3
---

Linux no es un sistema operativo “alternativo” ni una herramienta especializada: es **la implementación práctica más extendida de los conceptos de sistemas operativos modernos**. La mayoría de servidores, infraestructuras cloud, dispositivos de red, plataformas de contenedores y entornos de ciberseguridad se apoyan directa o indirectamente en Linux.

Tras estudiar el módulo de *Sistemas Operativos*, este capítulo aterriza esa teoría en un sistema real. Aquí Linux se estudia **no como una colección de comandos**, sino como un **entorno coherente**, donde cada decisión de diseño tiene consecuencias operativas y de seguridad.

Este módulo prepara el terreno para los siguientes capítulos (usuarios, procesos, redes, servicios) y establece el lenguaje común que se usará en todo el proyecto.

---

## 2. Qué es Linux exactamente

### 2.1 Kernel Linux vs sistema GNU/Linux

Técnicamente, **Linux es solo el kernel**. El kernel se encarga de:
- planificar procesos,
- gestionar memoria,
- controlar dispositivos,
- implementar el stack de red,
- imponer aislamiento y permisos.

Por sí solo, el kernel no es usable. Para convertirlo en un sistema operativo completo se necesita un **userland**, históricamente proporcionado por el proyecto GNU. Este userland incluye:
- la librería estándar (glibc),
- utilidades básicas (coreutils),
- shells,
- compiladores,
- herramientas de administración.

Por eso, desde un punto de vista riguroso, el sistema completo se denomina **GNU/Linux**. En la práctica cotidiana se usa “Linux” como término abreviado, pero es importante entender esta distinción porque explica:
- por qué el mismo kernel puede dar lugar a sistemas muy distintos,
- por qué cambiar de distribución no implica cambiar de kernel necesariamente.

---

### 2.2 La distribución Linux como unidad funcional

Una **distribución Linux** es un producto integrado que combina:
- kernel Linux (con parches y configuración),
- userland GNU,
- sistema de paquetes,
- repositorios,
- políticas de seguridad,
- documentación y soporte.

La distribución define decisiones críticas:
- qué versiones de software se consideran estables,
- con qué rapidez llegan los parches,
- qué nivel de riesgo se acepta,
- cómo se gestiona la seguridad por defecto.

Tabla conceptual:

| Elemento | Kernel | Distribución |
|--------|--------|--------------|
| Planificación CPU | Sí | No |
| Sistema de paquetes | No | Sí |
| Políticas de actualización | No | Sí |
| Herramientas de admin | No | Sí |
| Soporte y ciclo de vida | No | Sí |

---

## 3. Arranque y estado inicial del sistema en Linux

### 3.1 Del firmware al kernel Linux

El arranque de Linux comienza fuera del propio sistema operativo, en el firmware (BIOS o UEFI). Tras la fase de firmware:
- se localiza un dispositivo de arranque,
- se ejecuta un bootloader,
- se carga el kernel en memoria.

El kernel recibe **parámetros de arranque** que pueden modificar su comportamiento: depuración, mitigaciones de seguridad, selección de dispositivos, etc. Estos parámetros son extremadamente sensibles desde el punto de vista de seguridad.

Durante esta fase también entra en juego el **initramfs**, un sistema de archivos temporal que permite al kernel:
- cargar drivers críticos,
- montar el sistema raíz real,
- continuar el arranque.

Un fallo aquí implica que el sistema **ni siquiera llega a estado operativo**.

---

### 3.2 systemd como gestor del sistema

Una vez el kernel está activo, lanza el primer proceso del sistema: **PID 1**. En la mayoría de distribuciones modernas este rol lo cumple **systemd**.

systemd no es solo un “init”. Es un **gestor integral del sistema** que controla:
- servicios,
- dependencias,
- montaje de sistemas de archivos,
- dispositivos,
- logs,
- estados del sistema.

systemd organiza el sistema en **targets**, que representan estados operativos (por ejemplo, sistema multiusuario, entorno gráfico, rescate). Esto permite un arranque ordenado y reproducible, pero también introduce una pieza crítica: **controlar systemd es controlar el sistema**.

---

## 4. Estructura del sistema de archivos (FHS)

### 4.1 Filosofía del filesystem en Linux

Linux adopta una filosofía clara: **todo se organiza en una única jerarquía de directorios**, independientemente del número de discos o particiones físicas. No existen “unidades” separadas como en Windows.

Además, Linux aplica el principio de **“todo es un archivo”**:
- discos,
- dispositivos,
- procesos,
- información del kernel.

Todo se expone mediante rutas del filesystem, lo que unifica administración y observabilidad.

---

### 4.2 Directorios fundamentales y su propósito real

El estándar FHS define el significado de cada directorio. Entenderlos evita errores graves:

| Directorio | Función real |
|----------|--------------|
| / | Raíz del sistema |
| /bin | Binarios esenciales |
| /sbin | Binarios de administración |
| /lib, /lib64 | Librerías críticas |
| /etc | Configuración del sistema |
| /var | Datos variables (logs, colas, caché) |
| /home | Directorios de usuario |
| /proc | Información dinámica del kernel |
| /sys | Interfaz de dispositivos y kernel |

Modificar `/etc` cambia el comportamiento del sistema. Modificar `/var` afecta al estado. Confundir ambos es un error frecuente en sistemas mal administrados.

---

### 4.3 Implicaciones en seguridad y mantenimiento

Esta estructura tiene consecuencias directas:
- backups deben priorizar `/etc` y datos de `/var`,
- `/proc` y `/sys` no son datos persistentes,
- permisos incorrectos en rutas críticas pueden permitir escaladas de privilegios.

---

## 5. Shell y entorno de usuario

### 5.1 Qué es la shell realmente

La shell es un **intérprete de comandos**, no un simple “programa para escribir comandos”. Es un lenguaje que:
- interpreta texto,
- gestiona procesos,
- controla flujos,
- conecta programas entre sí.

La shell se ejecuta sobre un terminal, que puede ser:
- una consola física,
- un emulador gráfico,
- una sesión remota (SSH).

Confundir shell con terminal es un error conceptual común.

---

### 5.2 Variables de entorno y contexto de ejecución

Las variables de entorno definen el **contexto de ejecución** de los programas:
- dónde buscar binarios,
- qué usuario ejecuta,
- qué shell está activa.

Ejemplo de observación:
    
    env
    echo $PATH

Desde seguridad, manipular variables como `PATH` o `LD_LIBRARY_PATH` puede permitir **ejecución de binarios maliciosos** si no se controla el contexto.

---

## 6. Comandos fundamentales como modelo mental

### 6.1 Navegación y contexto

En Linux, el **directorio actual** es parte del estado del proceso. Muchas operaciones dependen del contexto correcto.

Ejemplo:
    
    pwd
    cd /etc

Entender rutas absolutas y relativas es clave para evitar operaciones destructivas accidentales.

---

### 6.2 Archivos, enlaces y persistencia

Linux permite:
- enlaces duros (mismo inode),
- enlaces simbólicos (punteros).

Esto tiene implicaciones en:
- backup,
- permisos,
- análisis forense.

Un archivo puede existir sin nombre visible si solo tiene enlaces duros.

---

### 6.3 Pipes y redirecciones: filosofía UNIX

Linux favorece herramientas simples que se combinan:

    comando1 | comando2
    comando > salida.txt
    comando 2> error.txt

Este modelo permite construir flujos complejos de análisis sin herramientas monolíticas.

---

## 7. Permisos y modelo de acceso (introducción)

### 7.1 Modelo DAC en Linux

Linux usa control de acceso discrecional (DAC):
- propietario,
- grupo,
- otros.

Cada archivo define:
- lectura,
- escritura,
- ejecución.

Este modelo es simple, pero poderoso. Un error en permisos puede exponer información sensible o permitir ejecución no autorizada.

---

### 7.2 Permisos especiales: por qué existen

Bits como SUID o SGID permiten que un programa se ejecute con privilegios elevados. Existen para resolver problemas reales, pero **son puntos críticos de riesgo** si se usan sin control.

---

## 8. Procesos y ejecución de programas

### 8.1 Cómo se ejecuta un programa

En Linux, la ejecución sigue el modelo:
- fork: duplicar proceso,
- exec: cargar nuevo binario.

Scripts se ejecutan mediante **shebang**, que indica qué intérprete usar.

Ejemplo:
    
    #!/bin/bash

---

### 8.2 Control de procesos

Los procesos pueden ejecutarse en primer plano o en segundo plano. Las señales permiten controlarlos.

Ejemplo de observación:
    
    ps aux
    kill -TERM <pid>

Entender señales es esencial para administrar servicios y diagnosticar problemas.

---

## 9. Gestión de paquetes y software

### 9.1 Qué es un paquete

Un paquete no es solo un binario. Incluye:
- archivos,
- dependencias,
- scripts de instalación,
- firmas criptográficas.

Esto convierte al sistema de paquetes en **infraestructura crítica de seguridad**.

---

### 9.2 Sistemas de paquetes y confianza

Cada familia Linux implementa su propio sistema:
- apt (Debian),
- dnf (Red Hat),
- pacman (Arch).

Todos se basan en repositorios firmados. Añadir repositorios externos sin criterio rompe la cadena de confianza.

---

## 10. Logs y observabilidad básica

### 10.1 Logging como pilar del sistema

Los logs permiten entender:
- qué ocurrió,
- cuándo,
- bajo qué contexto.

Sin logs no hay diagnóstico ni seguridad.

---

### 10.2 journald

systemd centraliza logs mediante journald, que permite:
- búsquedas estructuradas,
- correlación temporal,
- persistencia controlada.

Ejemplo:
    
    journalctl -xe

---

## 11. Red básica en Linux

### 11.1 Interfaces como objetos del sistema

Las interfaces de red son objetos gestionados por el kernel:
    
    ip link
    ip addr

Comprender su estado es esencial antes de analizar problemas de red.

---

### 11.2 Sockets y procesos

Los sockets conectan procesos con la red. Cada conexión es un recurso del sistema operativo.

Ejemplo:
    
    ss -tulpen

---

## 12. Linux y seguridad: visión inicial

### 12.1 Superficie de ataque típica

En Linux, la mayoría de incidentes no ocurren por fallos del kernel, sino por:
- servicios innecesarios,
- configuraciones por defecto,
- software desactualizado.

---

### 12.2 Principios básicos de hardening

Hardening inicial significa:
- minimizar servicios,
- actualizar regularmente,
- separar privilegios,
- observar el sistema.

---

## 13. Linux en ciberseguridad y laboratorio

### 13.1 Linux como entorno de aprendizaje

Linux permite:
- reproducibilidad,
- control,
- visibilidad.

Por eso es el sistema base en ciberseguridad.

---

### 13.2 Separación de entornos

Nunca se debe mezclar:
- sistema diario,
- laboratorio ofensivo.

Las máquinas virtuales y snapshots no son opcionales, son disciplina profesional.

---

## 14. Conclusión

Linux Fundamentos proporciona el **lenguaje operativo común** del resto del proyecto. Dominar este módulo significa entender cómo se estructura, arranca, ejecuta, registra y se protege un sistema Linux. A partir de aquí, los módulos de usuarios, procesos, redes y servicios se apoyan sobre una base sólida y coherente.