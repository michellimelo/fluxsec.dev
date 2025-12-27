---
title: Usuarios, Grupos y Permisos
description: "Capítulo académico y operativo sobre usuarios, grupos y permisos en Linux. Desarrolla el modelo de identidad, control de acceso, permisos clásicos y mecanismos avanzados, conectándolo con procesos, servicios y seguridad. Base fundamental para administración, hardening y análisis de incidentes."
sidebar:
  order: 5
---

Linux es, por diseño, un **sistema multiusuario**. Esto no significa únicamente que varias personas puedan usarlo al mismo tiempo, sino que el sistema operativo está construido sobre la idea de que **todo lo que se ejecuta lo hace bajo una identidad concreta**. Esa identidad determina qué puede hacerse y qué no, qué recursos pueden tocarse y cuáles están fuera de alcance.

Desde el punto de vista de sistemas, usuarios y grupos permiten **organizar responsabilidades**. Desde el punto de vista de la ciberseguridad, constituyen la **primera línea de defensa interna**. La mayoría de ataques reales no comienzan explotando el kernel, sino abusando de permisos mal definidos, usuarios innecesarios o privilegios excesivos.

Este módulo explica cómo Linux representa la identidad, cómo decide si una acción está permitida y por qué un mal diseño de usuarios y permisos convierte cualquier sistema en frágil, incluso aunque tenga firewalls y parches al día.

---

## 2. El concepto de usuario en Linux

### 2.1 Qué es un usuario realmente

En Linux, un usuario **no es una persona**. Es una **identidad lógica** que el sistema operativo utiliza para etiquetar procesos, archivos y acciones. Un mismo individuo puede usar varios usuarios, y muchos usuarios no representan personas, sino **servicios del sistema**.

Cada vez que un proceso se ejecuta, el kernel le asocia un usuario. A partir de ese momento, todas las decisiones de acceso se evalúan en función de esa identidad. El usuario, por tanto, no es una abstracción administrativa: es un **parámetro central del modelo de seguridad**.

Existen dos grandes categorías:
- **Usuarios humanos**, pensados para interacción directa.
- **Usuarios de sistema**, creados para ejecutar servicios de forma aislada.

Confundir ambos es un error frecuente que suele desembocar en servicios ejecutándose con más privilegios de los necesarios.

---

### 2.2 UID: la identidad real para el kernel

Aunque se hable de nombres de usuario, el kernel **no trabaja con nombres**, sino con números. Cada usuario tiene un **UID (User ID)**, que es su identidad real a nivel interno.

Tabla conceptual de rangos habituales:

| Rango de UID | Significado |
|-------------|-------------|
| 0 | Superusuario (root) |
| 1–999 | Usuarios de sistema |
| ≥1000 | Usuarios normales |

El caso especial es el **UID 0**. Cualquier proceso que se ejecute con UID 0 es tratado como superusuario, independientemente del nombre asociado. Esto explica por qué cambiar nombres sin entender los UID no aporta seguridad real.

---

## 3. El superusuario y el problema del privilegio total

### 3.1 Qué es root desde un punto de vista técnico

El usuario root (UID 0) no está sujeto a las restricciones normales del sistema. Puede:
- leer y modificar cualquier archivo,
- cambiar permisos arbitrariamente,
- cargar módulos del kernel,
- terminar cualquier proceso,
- modificar la configuración global del sistema.

Root **rompe el modelo de seguridad** porque está diseñado para administrar el sistema, no para usarlo de forma cotidiana. Esta omnipotencia es necesaria, pero extremadamente peligrosa si se usa sin disciplina.

---

### 3.2 Riesgos del uso directo de root

Trabajar habitualmente como root introduce varios problemas graves:
- **Errores humanos**: un comando mal escrito puede destruir el sistema.
- **Persistencia maliciosa**: cualquier malware ejecutado como root obtiene control total.
- **Falta de trazabilidad**: no queda claro quién hizo qué, cuándo y por qué.

Por estas razones, el uso directo de root debe ser **excepcional**, breve y controlado.

---

### 3.3 Delegación controlada de privilegios

Para resolver este problema surge el modelo de **delegación de privilegios**, cuyo ejemplo más conocido es `sudo`. La idea no es eliminar root, sino **limitar su uso**.

Con delegación controlada:
- los usuarios trabajan sin privilegios,
- elevan permisos solo para acciones concretas,
- queda registro de las operaciones administrativas.

Este enfoque implementa el **principio de mínimo privilegio**, uno de los pilares de la seguridad moderna.

---

## 4. Grupos: control colectivo de acceso

### 4.1 Qué es un grupo en Linux

Un grupo es una **agrupación lógica de usuarios**. Su función principal es permitir que varios usuarios compartan acceso a recursos sin necesidad de modificar permisos individuales constantemente.

Cada usuario pertenece:
- a un **grupo primario**, asociado por defecto a sus archivos,
- y puede pertenecer a múltiples **grupos secundarios**.

Los grupos permiten diseñar el acceso de forma estructurada, evitando soluciones improvisadas.

---

### 4.2 GID y relación con archivos

Al igual que los usuarios tienen UID, los grupos tienen **GID (Group ID)**. Los archivos y directorios almacenan el GID del grupo propietario, y el kernel utiliza esa información al evaluar permisos.

Esto permite escenarios como:
- varios administradores compartiendo acceso a logs,
- equipos de desarrollo accediendo a código común,
- servicios escribiendo en rutas compartidas sin ser root.

---

### 4.3 Grupos como herramienta de diseño de seguridad

Usar grupos correctamente evita malas prácticas como:
- permisos excesivamente abiertos,
- uso innecesario de root,
- duplicación de usuarios.

Un sistema bien diseñado usa grupos para **expresar políticas**, no solo para “arreglar” problemas puntuales.

---

## 5. El modelo clásico de permisos (DAC)

Linux implementa un modelo de **Control de Acceso Discrecional (DAC)**. Esto significa que el propietario de un recurso puede decidir quién accede a él.

### 5.1 Propietario, grupo y otros

Cada archivo o directorio define permisos para tres categorías:
- propietario,
- grupo,
- otros (todos los demás).

Para cada categoría existen tres permisos básicos:
- lectura (r),
- escritura (w),
- ejecución (x).

El kernel evalúa los permisos en orden: primero propietario, luego grupo, y finalmente otros. Este detalle es clave para entender por qué ciertos accesos funcionan o fallan.

---

### 5.2 Permisos en archivos y directorios

Los permisos no significan lo mismo en archivos y directorios. En archivos, ejecución significa “puede ejecutarse como programa”. En directorios, ejecución significa “puede accederse a su contenido”.

Este matiz es fundamental y suele causar confusión. Un directorio sin permiso de ejecución es inaccesible, aunque tenga permiso de lectura.

---

### 5.3 Representación simbólica y numérica

Los permisos pueden representarse de forma simbólica (`rwx`) o numérica (octal). La forma numérica no es un atajo: es una **representación exacta** que el sistema utiliza internamente.

Tabla conceptual:

| Permisos | Valor |
|--------|-------|
| r-- | 4 |
| rw- | 6 |
| rwx | 7 |

Un permiso `750` expresa una política concreta: control total para el propietario, acceso limitado para el grupo, ningún acceso para otros.

---

## 6. Permisos especiales y sus implicaciones

### 6.1 SUID: ejecución con identidad elevada

El bit SUID permite que un programa se ejecute con el UID de su propietario, no del usuario que lo lanza. Esto se diseñó para resolver necesidades legítimas, pero es uno de los **vectores clásicos de escalada de privilegios** si se usa mal.

Un binario SUID root vulnerable equivale a acceso root.

---

### 6.2 SGID y control de grupo

SGID funciona de forma similar, pero a nivel de grupo. En directorios, permite que los archivos creados hereden el grupo del directorio, facilitando trabajo colaborativo controlado.

Mal usado, puede exponer datos a grupos no deseados.

---

### 6.3 Sticky bit y protección en directorios compartidos

El sticky bit evita que usuarios borren archivos ajenos en directorios compartidos. Es esencial en rutas como `/tmp`. Su existencia refleja cómo el modelo de permisos se ha adaptado a escenarios multiusuario reales.

---

## 7. Umask y creación segura de archivos

Cuando un archivo se crea, no hereda permisos arbitrarios. El sistema aplica una **umask**, que define qué permisos se eliminan por defecto.

Una umask demasiado permisiva genera archivos inseguros desde el nacimiento. En sistemas multiusuario, una umask estricta es una medida básica de hardening.

---

## 8. Listas de Control de Acceso (ACL)

El modelo clásico de permisos es simple, pero limitado. Las **ACL** permiten definir permisos adicionales para usuarios o grupos concretos sin alterar la estructura básica.

Las ACL introducen mayor flexibilidad, pero también mayor complejidad. Su uso debe ser consciente y documentado, ya que complican la auditoría si se aplican sin criterio.

---

## 9. Autenticación y autorización

Es fundamental distinguir:
- **autenticación**: demostrar quién eres,
- **autorización**: decidir qué puedes hacer.

Linux separa ambos conceptos. Autenticarse correctamente no implica tener permisos. Esta separación permite integrar múltiples mecanismos de autenticación sin alterar el modelo de permisos del sistema.

---

## 10. Usuarios, permisos y procesos

Cada proceso se ejecuta con un usuario y unos grupos asociados. Esa identidad determina qué archivos puede abrir, qué puertos puede usar y qué señales puede enviar a otros procesos.

Los servicios bien diseñados se ejecutan con **usuarios dedicados**, sin login interactivo y con permisos mínimos. Ejecutar servicios como root cuando no es necesario es una de las malas prácticas más comunes y peligrosas.

---

## 11. Usuarios, permisos y seguridad

Desde el punto de vista de seguridad, muchos incidentes se explican por:
- usuarios olvidados,
- permisos excesivos,
- archivos críticos accesibles indebidamente,
- abuso de SUID/SGID.

El hardening básico comienza aquí, no en el firewall.

---

## 12. Errores comunes y malas prácticas

Entre los errores más frecuentes destacan:
- uso indiscriminado de root,
- permisos 777 como “solución rápida”,
- grupos mal diseñados,
- falta de revisión periódica de usuarios y permisos.

Estos errores no son teóricos: aparecen sistemáticamente en sistemas comprometidos.

---

## 13. Relación con módulos posteriores

Este módulo es la base directa para:
- Redes y servicios: quién puede abrir puertos y aceptar conexiones.
- Seguridad del sistema: control de privilegios y aislamiento.
- Contenedores: separación de identidades y espacios.

Sin una comprensión sólida de usuarios y permisos, los mecanismos avanzados pierden sentido.

---

## 14. Conclusión

Usuarios, grupos y permisos constituyen el **modelo interno de confianza** de Linux. No son un detalle administrativo, sino el núcleo de la seguridad del sistema. Dominar este módulo permite diseñar sistemas robustos, detectar configuraciones peligrosas y entender por qué muchos ataques tienen éxito sin explotar vulnerabilidades sofisticadas.