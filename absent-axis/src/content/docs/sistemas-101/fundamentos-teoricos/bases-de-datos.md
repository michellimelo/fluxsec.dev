---
title: Bases de Datos
description: "Desarrollo académico y profesional completo sobre bases de datos, desde los fundamentos teóricos hasta la arquitectura y operación avanzada en sistemas informáticos. Se abordan modelos de datos, diseño, SQL, transacciones, concurrencia, índices, rendimiento, seguridad, alta disponibilidad, backups, escalabilidad, observabilidad y operación en Linux, con un enfoque riguroso, progresivo y orientado a sistemas."
sidebar:
  order: 15
---

Una base de datos no es únicamente un lugar donde “guardar información”: es un subsistema de la arquitectura que impone reglas formales y proporciona garantías (o compromisos) sobre cómo se almacenan, consultan, protegen y recuperan los datos. En sistemas reales, el comportamiento de una base de datos bajo carga, fallos y concurrencia determina la estabilidad de la plataforma completa. Por ello, dominar bases de datos implica comprender simultáneamente: el modelo de datos, el lenguaje de consulta, la ejecución interna, el control de concurrencia, y la operación (seguridad, backups, alta disponibilidad, observabilidad y rendimiento).

Este documento sigue una progresión rigurosa: primero define conceptos y modelos, luego entra en SQL y transacciones, después aborda rendimiento (índices y motor), y finalmente operación avanzada (seguridad, backups, HA, escalabilidad y observabilidad).

---

## 1. Fundamentos: qué es una base de datos y qué problema resuelve

Una base de datos es un repositorio persistente de datos gestionado por un DBMS (Database Management System) que proporciona:
- un modelo de organización (relacional, documental, etc.),
- un lenguaje de acceso (SQL u otros),
- mecanismos de concurrencia (para múltiples usuarios),
- mecanismos de recuperación (ante fallos),
- mecanismos de seguridad (autenticación/autorización/auditoría),
- y herramientas de administración (monitorización, backups, replicación).

La motivación histórica y técnica es superar las debilidades del “almacenamiento por ficheros” cuando el sistema crece:
- Inconsistencia: múltiples copias del mismo dato y actualizaciones parciales.
- Concurrencia insegura: dos procesos escribiendo a la vez sin coordinación.
- Consultas rígidas: buscar y combinar información se vuelve costoso y frágil.
- Seguridad dispersa: permisos repartidos por archivos sin control fino por entidades.
- Recuperación complicada: fallos a mitad de escritura dejan datos corruptos.

### 1.1 Datos vs información vs conocimiento (con implicación práctica)

- Dato: unidad mínima (p.ej., 100, “A123”, “2025-12-23”).
- Información: dato contextualizado (p.ej., “pedido A123 cuesta 100€”).
- Conocimiento: interpretación para decisión (p.ej., “este cliente compra cada 7 días; conviene fidelización”).

Implicación práctica: un diseño de base de datos debe permitir que la información sea consistente y verificable. Si el modelo permite duplicidades o ambigüedad, el conocimiento derivado será inestable.

### 1.2 Terminología esencial (precisa, como se usa en operaciones)

- DB (Database): conjunto de datos persistentes y su estructura.
- DBMS: software que gestiona la DB.
- Motor (engine): núcleo que parsea, planifica y ejecuta consultas, gestiona almacenamiento y transacciones.
- Instancia: proceso(s) en ejecución del DBMS (lo que “está corriendo”).
- Cluster (según motor): conjunto coordinado (puede ser 1 o varios nodos; en PostgreSQL “cluster” suele referirse a un conjunto de bases bajo un data directory).
- Esquema (schema): espacio lógico de nombres y objetos (tablas, vistas, funciones).
- Tabla: estructura de filas/columnas.
- Índice: estructura auxiliar para acelerar accesos.
- Transacción: unidad de trabajo atómica.
- Conexión/Sesión: canal lógico entre cliente y DBMS.

### 1.3 OLTP vs OLAP (no es una etiqueta, cambia el diseño)

- OLTP (Online Transaction Processing): sistemas operacionales: pedidos, pagos, usuarios, inventario. Características: transacciones cortas, muchas escrituras, latencia baja, concurrencia alta.
- OLAP (Online Analytical Processing): analítica: informes, agregaciones históricas, exploración. Características: consultas largas, grandes scans, agregaciones, cargas batch.

Tabla de implicaciones arquitectónicas:

| Dimensión | OLTP (operacional) | OLAP (analítica) |
|----------|---------------------|------------------|
| Modelo | normalización frecuente | desnormalización frecuente |
| Índices | selectivos, orientados a filtros/join | orientados a agregación/columnar |
| Almacenamiento | latencia baja, IOPS altos | throughput alto, compresión |
| Concurrencia | muy alta | media |
| Métricas críticas | p95/p99 latencia, locks | tiempo de consulta, IO secuencial |

### 1.4 Garantías y límites: persistencia, durabilidad, consistencia

En términos operativos:
- Persistencia: los datos sobreviven a reinicios.
- Durabilidad: tras COMMIT, los datos no deberían perderse ante fallos previstos (según configuración).
- Consistencia: se respetan reglas (constraints) y el sistema no permite estados inválidos.

Punto clave: estas garantías dependen de configuración y arquitectura (WAL/redo log, fsync, replicación, almacenamiento). En producción, “lo que promete ACID” se convierte en “lo que realmente garantiza tu configuración + tu hardware + tu operación”.

---

## 2. Clasificación de bases de datos (mapa mental útil para elegir y operar)

Clasificar no es memorizar categorías: es entender qué compromisos toma cada familia.

### 2.1 Relacionales (SQL): cuándo son la elección natural

Ventajas:
- Modelo formal (relacional) con integridad (PK/FK/constraints).
- Consultas expresivas (joins, agregaciones, ventanas).
- Transacciones ACID maduras.
- Ecosistema sólido (drivers, herramientas, replicación).

Limitaciones típicas:
- Escalado horizontal (sharding) suele ser complejo.
- Joins y transacciones distribuidas aumentan complejidad si se reparte el dato.

### 2.2 NoSQL: familias y problema que resuelven

- Key-Value: latencia mínima por clave; útil para sesiones, caché, colas simples. Limitación: consultas complejas.
- Documentales: esquema flexible; útil cuando la entidad es “documento” y cambia; riesgo: duplicación y consistencia.
- Column-family: escalado horizontal masivo; útil en eventos y grandes volúmenes; consultas limitadas por diseño.
- Grafos: relaciones profundas; útil en recomendación, fraude, dependencias; coste: complejidad y rendimiento variable.
- Time-series: ingesta masiva temporal; compresión y retención; útil en métricas, IoT.

### 2.3 NewSQL / Distributed SQL (visión realista)

Promesa: consistencia fuerte + SQL + escalado horizontal.
Coste: complejidad de consenso (quórum), latencias entre nodos, operación más exigente.
Arquitectónicamente, son útiles cuando necesitas “SQL y ACID” en distribuido sin construir sharding manual, pero debes aceptar el coste de coordinación.

### 2.4 Embedded DB (SQLite) y su rol en sistemas

SQLite no es “pequeña y por eso mala”: es excelente cuando:
- la DB está embebida en la app,
- el acceso es local,
- el despliegue requiere cero administración.
Limitación: concurrencia de escritura y multiusuario/alta disponibilidad.

### 2.5 In-memory (Redis) como DB/caché/cola

Redis puede actuar como caché y estructura de datos.
Riesgo arquitectónico común: tratar Redis como “verdad” sin durabilidad adecuada, o sin política de expiración coherente, o sin protección de datos sensibles.

### 2.6 Cómo elegir (matriz de decisión mínima)

| Requisito dominante | Elección típica | Motivo |
|--------------------|-----------------|--------|
| Integridad y joins complejos | Relacional | constraints + SQL expresivo |
| Esquema cambiante por entidad | Documental | flexibilidad de campos |
| Latencia por clave extrema | Key-Value/In-memory | acceso directo |
| Relación profunda entre entidades | Grafo | traversal eficiente |
| Métricas/eventos temporales masivos | Time-series/Column-family | retención + ingesta |

---

## 3. Modelo relacional desde cero (lo que debes poder explicar con rigor)

El modelo relacional representa datos como relaciones (tablas) y se apoya en lógica para asegurar integridad.

### 3.1 Conceptos formales y traducción a práctica

- Relación (tabla): conjunto de tuplas.
- Tupla (fila): instancia de la relación.
- Atributo (columna): propiedad.
- Dominio: valores permitidos (tipo + restricciones).

En práctica, el dominio no es solo el tipo: también incluye restricciones como “no negativo”, “formato email”, “fecha válida”.

### 3.2 Claves (por qué existen y qué problema evitan)

- PK: evita duplicidad e identifica de forma estable.
- FK: evita referencias rotas y mantiene coherencia entre entidades.
- Claves candidatas: posibles PK (p.ej., email si es único).
- Claves compuestas: cuando la identidad natural requiere varias columnas.

Ejemplo conceptual: una tabla de líneas de pedido puede identificarse por (order_id, line_number) como clave compuesta.

### 3.3 Integridad y constraints (la integridad no es “opcional”)

- Integridad de entidad: PK no nula y única.
- Integridad referencial: FK apunta a PK existente o a NULL si lo permite.
- Integridad de dominio: CHECK, tipos, enums controlados.

Plantilla SQL (conceptual, portable):
    CREATE TABLE orders (
      id          BIGINT PRIMARY KEY,
      user_id     BIGINT NOT NULL,
      status      TEXT NOT NULL,
      total_cents BIGINT NOT NULL,
      created_at  TIMESTAMP NOT NULL,
      CONSTRAINT chk_total_nonneg CHECK (total_cents >= 0)
    );

---

## 4. Diseño y modelado: de requisitos a esquema operable

Diseñar una DB es traducir el dominio a una estructura que mantenga integridad y rendimiento bajo carga.

### 4.1 Requisitos: cómo capturarlos “como arquitecto”

Requisitos mínimos que deben existir antes de diseñar:
- Entidades y reglas (qué es un usuario, pedido, pago; qué estados son válidos).
- Volumen (cuántos registros por día/mes).
- Concurrencia (cuántos usuarios simultáneos).
- Latencia objetivo (p95/p99).
- Retención (cuánto tiempo se guarda histórico).
- Cumplimiento (datos personales, auditoría).

Sin esto, el modelo será improvisado y el rendimiento será azaroso.

### 4.2 ER y cardinalidades (1:1, 1:N, N:M)

- 1:1: rara; suele indicar que quizá es una tabla con campos opcionales o separación por privacidad.
- 1:N: común (usuario → pedidos).
- N:M: requiere tabla puente (usuarios ↔ roles).

Ejemplo N:M (conceptual):
    CREATE TABLE user_roles (
      user_id BIGINT NOT NULL,
      role_id BIGINT NOT NULL,
      PRIMARY KEY (user_id, role_id)
    );

### 4.3 Normalización (por qué protege calidad y reduce anomalías)

- 1FN: valores atómicos (no listas dentro de una celda).
- 2FN: atributos dependen de la clave completa (evita datos duplicados por parte de una clave compuesta).
- 3FN: evita dependencias transitivas (evita duplicidad y actualizaciones inconsistentes).

Ejemplo típico de violación 3FN: guardar “ciudad” y “código postal” en una tabla donde el CP determina ciudad, generando inconsistencias.

### 4.4 Desnormalización (cuándo es razonable)

Se desnormaliza para:
- reducir joins costosos en rutas críticas,
- precalcular agregaciones,
- optimizar lecturas masivas.

Pero exige controles:
- fuente de verdad (qué tabla manda),
- procesos de sincronización,
- auditoría de inconsistencias.

### 4.5 Anti-patrones de diseño (síntomas en producción)

| Anti-patrón | Síntoma | Consecuencia |
|------------|---------|-------------|
| “tabla gigante” con todo | consultas lentas, índices enormes | mantenimiento caro, bloat |
| duplicar datos sin control | valores inconsistentes | bugs funcionales |
| estado sin máquina de estados | estados imposibles | soporte caótico |
| usar NULL como “varias cosas” | lógica ambigua | errores en queries |

---

## 5. SQL esencial (de 0 a seguro y profesional)

SQL se divide en definición, manipulación, control de acceso y control transaccional. La potencia de SQL está en su carácter declarativo: describes el resultado y el motor decide el plan.

### 5.1 DDL, DML, DCL, TCL (lo que cambia en operación)

| Categoría | Ejemplos | Riesgo operativo típico |
|----------|----------|-------------------------|
| DDL | CREATE/ALTER/DROP | bloqueos, migraciones peligrosas |
| DML | SELECT/INSERT/UPDATE/DELETE | saturación, locks por mal filtro |
| DCL | GRANT/REVOKE | exposición accidental |
| TCL | BEGIN/COMMIT/ROLLBACK | transacciones largas, contención |

### 5.2 Tipos de datos (criterio, no “preferencias”)

- Identificadores: BIGINT/UUID según requisitos (UUID útil en distribuido; BIGINT más compacto).
- Dinero: evitar floats; usar enteros (cents) o tipos monetarios del motor.
- Fechas: usar TIMESTAMP con criterio de zona horaria.
- Texto: TEXT/VARCHAR; definir constraints si el dominio lo exige.

Tabla de recomendaciones:

| Dato | Recomendación | Motivo |
|------|--------------|--------|
| dinero | BIGINT en cents | precisión |
| IDs | BIGINT o UUID | rendimiento vs distribuido |
| boolean | BOOLEAN | claridad |
| fechas | TIMESTAMP | orden y filtros |

### 5.3 Consultas: selectividad, filtros y paginación

Conceptos de rendimiento:
- Selectividad: cuántas filas filtra una condición.
- Un WHERE poco selectivo puede forzar scans.
- Paginación con OFFSET degrada a grandes páginas.

Ejemplo de paginación eficiente (keyset, conceptual):
    SELECT *
    FROM orders
    WHERE user_id = 42
      AND created_at < '2025-12-01 00:00:00'
    ORDER BY created_at DESC
    LIMIT 50;

### 5.4 Joins (por qué son poderosos y peligrosos)

- INNER JOIN: solo coincidencias.
- LEFT JOIN: mantiene lado izquierdo.
- FULL JOIN: ambos lados.

Errores típicos:
- joins sin condición (producto cartesiano).
- join sobre columnas no indexadas en grandes tablas.
- confundir WHERE con condición de join y convertir un LEFT en INNER accidentalmente.

### 5.5 CTE, subconsultas y ventanas

- CTE (WITH): mejora legibilidad, y en algunos motores puede materializar.
- Ventanas: calculan métricas por partición sin colapsar filas.

Ejemplo ventana (conceptual):
    SELECT
      user_id,
      created_at,
      SUM(total_cents) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total
    FROM orders;

---

## 6. Transacciones y concurrencia (núcleo profesional)

En sistemas multiusuario, la concurrencia es el estado natural. Las transacciones son el mecanismo para garantizar coherencia ante accesos simultáneos y fallos parciales.

### 6.1 ACID (con lectura operativa)

- Atomicidad: si falla algo, no quedan “medias actualizaciones”.
- Consistencia: constraints y reglas se respetan.
- Aislamiento: el resultado no depende de la intercalación concurrente.
- Durabilidad: tras COMMIT, se preserva ante fallos razonables.

### 6.2 Anomalías y por qué se producen

- Dirty read: se lee un cambio no confirmado.
- Non-repeatable read: la misma consulta da distinto resultado dentro de una transacción.
- Phantom read: aparecen/desaparecen filas que cumplen un predicado.

Ejemplo conceptual de phantom:
- Transacción A: consulta “pedidos status='pending'”.
- Transacción B: inserta un pedido pending y confirma.
- Transacción A repite y ve un “fantasma”.

### 6.3 Niveles de aislamiento y coste

| Aislamiento | Previene | Coste típico |
|------------|----------|-------------|
| Read Uncommitted | ninguno | inconsistencias |
| Read Committed | dirty reads | puede tener phantoms |
| Repeatable Read | non-repeatable | puede tener phantoms (según motor) |
| Serializable | phantoms | más locks/abortos |

En operación: subir aislamiento puede aumentar abortos o contención. La elección debe basarse en requisitos de coherencia del dominio.

### 6.4 Locks, MVCC y transacciones largas

- Locking: bloqueos para coordinar acceso.
- MVCC: lectura consistente sin bloquear escrituras (según motor), pero requiere limpieza (vacuum/compaction).
- Transacciones largas: retienen versiones/locks, degradan todo.

Tabla de síntomas:

| Síntoma | Causa probable | Mitigación |
|--------|----------------|-----------|
| latencia sube con carga | contención de locks | reducir transacciones, orden consistente |
| deadlocks | locks cruzados | ordenar operaciones, índices, reintentos |
| bloat/crecimiento | MVCC sin limpieza | mantenimiento, vacuums, tuning |

### 6.5 Idempotencia y reintentos seguros

En sistemas distribuidos, reintentar es normal (timeouts). Para reintentar con seguridad:
- operaciones idempotentes,
- claves de idempotencia,
- upserts con constraints,
- diseño que tolere duplicados controlados.

Ejemplo conceptual de “idempotency key” (tabla):
    CREATE TABLE payments (
      id BIGINT PRIMARY KEY,
      idempotency_key TEXT NOT NULL UNIQUE,
      amount_cents BIGINT NOT NULL,
      created_at TIMESTAMP NOT NULL
    );

---

## 7. Índices y rendimiento (lo que más impacta en producción)

Los índices son estructuras auxiliares que reducen el coste de búsqueda a costa de:
- espacio,
- coste de mantenimiento en escrituras,
- complejidad de planificación.

### 7.1 Qué optimiza un índice (y qué no)

Un índice ayuda cuando:
- hay filtros selectivos,
- hay joins sobre claves,
- hay ORDER BY compatible,
- hay límites (LIMIT) que se benefician de orden.

No ayuda cuando:
- la consulta lee gran parte de la tabla,
- la condición es poco selectiva,
- hay funciones sobre la columna (según motor),
- el índice no coincide con el patrón (orden de columnas mal elegido).

### 7.2 Índices compuestos: orden y selectividad

Regla práctica: primero columnas de alta selectividad y filtros frecuentes, después ordenación.
Ejemplo:
    CREATE INDEX idx_orders_user_created
    ON orders (user_id, created_at DESC);

### 7.3 Índices y escrituras: el coste oculto

Cada INSERT/UPDATE debe actualizar índices. Muchos índices:
- empeoran latencia de escritura,
- aumentan bloat,
- incrementan IO.

Tabla de equilibrio:

| Situación | Estrategia |
|----------|------------|
| OLTP con escrituras altas | índices mínimos y medidos |
| Lecturas críticas por endpoint | índices específicos + pruebas |
| Analítica | índices/columnar/partición |

### 7.4 Planes de ejecución: leer sin memorizar

Leer un plan es identificar:
- si hay scan o index scan,
- si hay join costoso,
- si hay sort,
- si el motor estima mal cardinalidades.

Plantilla conceptual:
    EXPLAIN
    SELECT *
    FROM orders
    WHERE user_id = 42
    ORDER BY created_at DESC
    LIMIT 50;

---

## 8. Arquitectura interna de un motor (para explicar “por qué sucede”)

A nivel interno, un DBMS convierte SQL en ejecución física:

1) Parser: valida sintaxis y construye árbol.
2) Planner/optimizer: elige plan basado en estadísticas.
3) Executor: ejecuta operadores (scan, join, sort, aggregate).

Componentes críticos:
- Buffer cache: páginas de datos en memoria.
- WAL/redo log: registro previo a escritura para durabilidad.
- Checkpoints: consolidan y limitan tiempo de recuperación.
- Estadísticas: base para el optimizador.

Idea clave: la base de datos es un sistema con su propia gestión de memoria y escritura. No compite solo por CPU: compite por RAM, IO y latencia de fsync.

---

## 9. Conexiones, pooling y límites (operación real)

En producción, el número de conexiones es un factor arquitectónico.

### 9.1 Por qué “más conexiones” suele empeorar

Cada conexión consume:
- memoria,
- context switching,
- recursos del kernel (file descriptors),
- y aumenta la competencia por locks/CPU.

Síntoma típico: la DB “se ahoga” con miles de conexiones y empeora latencia incluso con baja CPU.

### 9.2 Pooling: criterio y arquitectura

- Pool en la app: común; controla concurrencia por instancia.
- Pool externo (p.ej. proxy): centraliza control.

Buenas prácticas:
- limitar conexiones máximas,
- usar timeouts razonables,
- evitar conexiones por request sin reutilización.

Tabla de parámetros conceptuales:

| Parámetro | Riesgo si mal ajustado | Objetivo |
|----------|-------------------------|----------|
| max_connections | overhead y thrashing | límite sano |
| pool_size | saturación o infrautilización | estabilidad |
| statement_timeout | queries colgadas | control de latencia |

---

## 10. Seguridad en bases de datos (imprescindible y estructural)

La seguridad en DB no es “poner contraseña”: es diseñar control de acceso, cifrado, segregación de redes y auditoría.

### 10.1 Principios aplicados

- Mínimo privilegio: cada rol solo lo necesario.
- Separación de funciones: app vs admin vs auditor.
- Red: la DB no debería estar expuesta a Internet.
- Auditoría: trazabilidad de accesos y cambios.

Ejemplo conceptual de roles:
    CREATE ROLE app_readonly;
    CREATE ROLE app_rw;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_rw;

### 10.2 SQL Injection (arquitectura segura)

Prevención:
- consultas parametrizadas,
- validación de entradas,
- mínimos privilegios (aunque inyecten, no puedan “todo”).

Regla operativa: si la cuenta de la app no tiene DROP/ALTER, un ataque se limita.

### 10.3 Cifrado en tránsito y en reposo

- En tránsito: TLS para evitar sniffing y MITM.
- En reposo: cifrado de disco o funciones del motor.

La elección depende de:
- requisitos legales,
- amenaza,
- necesidad de rotación de claves,
- rendimiento.

---

## 11. Backups y recuperación (RPO/RTO reales)

Backups no se definen por “hacer dumps”, sino por objetivos de negocio.

### 11.1 RPO y RTO (definición operativa)

- RPO (Recovery Point Objective): cuántos datos puedes perder (tiempo).
- RTO (Recovery Time Objective): cuánto tardas en restaurar servicio.

Ejemplo:
- RPO 5 min: no puedes perder más de 5 minutos.
- RTO 30 min: debes volver a operar en 30 minutos.

### 11.2 Tipos de backup y cuándo usar cada uno

| Tipo | Ventaja | Desventaja | Uso típico |
|------|---------|------------|-----------|
| Lógico (dump) | portable, simple | lento en grandes volúmenes | migraciones, pequeños sistemas |
| Físico | rápido, consistente | dependiente del motor/version | producción |
| Incremental | menor ventana | complejidad | producción con gran tamaño |
| PITR | recuperación fina | requiere WAL/archivado | sistemas críticos |

### 11.3 Verificación: restaurar es obligatorio

Regla profesional: “backup sin restore probado no cuenta”.
Debe existir un runbook de restauración, con pruebas periódicas, y medición del tiempo real (RTO real, no teórico).

---

## 12. Replicación y alta disponibilidad (HA)

Replicar no es solo “tener una copia”: es definir cómo se sincroniza, cómo se lee, cómo se hace failover y qué consistencia se acepta.

### 12.1 Replicación síncrona vs asíncrona

| Tipo | Ventaja | Riesgo |
|------|---------|--------|
| Síncrona | RPO ~ 0 | mayor latencia y dependencia |
| Asíncrona | mejor rendimiento | pérdida de datos si cae primario |

### 12.2 Failover y split-brain

Failover: cambio de primario.
Riesgo: split-brain (dos primarios) → corrupción lógica.

Mitigación conceptual:
- quórum,
- fencing,
- herramientas de orquestación,
- procedimientos claros y automatización controlada.

### 12.3 Lecturas en réplicas y consistencia

Leer de réplicas reduce carga, pero introduce:
- retraso (replication lag),
- lecturas obsoletas.

Arquitectura correcta: decidir qué lecturas toleran eventualidad y cuáles deben ir a primario.

---

## 13. Escalabilidad: particionamiento, sharding y cachés

La escalabilidad es el resultado de diseño + operación.

### 13.1 Vertical vs horizontal

- Vertical: simple, límite físico, posible SPOF.
- Horizontal: complejo, mejor resiliencia, requiere diseño distribuido.

### 13.2 Particionamiento (dentro de una DB)

Dividir una tabla grande en particiones (por rango/fecha/hash) puede:
- mejorar mantenimiento,
- mejorar consultas por rango,
- controlar retención.

Ejemplo conceptual: particionar “events” por mes.

### 13.3 Sharding (entre múltiples nodos)

Sharding reparte datos entre nodos.
Decisión crítica: clave de partición (por ejemplo user_id).
Riesgos:
- joins cross-shard,
- transacciones distribuidas,
- reequilibrio.

### 13.4 Caché (Redis/Memcached) y coherencia

La caché mejora latencia y reduce carga, pero crea el problema clásico de invalidación:
- invalidar al escribir,
- TTL razonable,
- evitar “cache stampede”.

---

## 14. Migraciones, cambios de esquema y evolución segura

Los sistemas cambian. El esquema debe evolucionar con método para evitar downtime y corrupción.

### 14.1 Versionado de esquema

Buenas prácticas:
- migraciones versionadas,
- una única fuente de verdad,
- entornos de staging,
- rollback planificado.

### 14.2 Cambios compatibles (expand/contract)

Estrategia general:
- expandir: añadir columna nullable, escribir en ambos.
- migrar datos.
- contract: eliminar cuando todo está migrado.

Evita cambios destructivos directos en producción.

### 14.3 Índices y cambios pesados

Crear índices en tablas grandes puede bloquear o tardar. Arquitecturalmente:
- planificar ventanas,
- usar estrategias online si el motor lo soporta,
- medir impacto.

---

## 15. Observabilidad y troubleshooting (diagnóstico reproducible)

Sin observabilidad, el rendimiento es “opinión”. Con observabilidad, es ingeniería.

### 15.1 Métricas clave (mínimo profesional)

- Latencia p50/p95/p99 por tipo de query.
- QPS (queries por segundo).
- Locks y tiempos de espera.
- Cache hit ratio.
- I/O: lecturas/escrituras, fsync, colas.
- Replication lag (si hay réplicas).

### 15.2 Slow queries y priorización

Proceso profesional:
1) identificar top queries por tiempo total (no solo por tiempo individual),
2) revisar patrón (filtro, join, sort),
3) proponer índice/cambio,
4) medir antes/después,
5) validar que no penaliza escrituras.

### 15.3 Diagnóstico por capas (DB vs OS)

- CPU alta: queries pesadas, falta de índices, agregaciones.
- RAM baja: cache insuficiente, demasiadas conexiones.
- Disco saturado: checkpoints, falta de cache, queries con scans.
- Red: latencia entre app y DB, o replicación.

---

## 16. Operación en Linux (bases de datos como servicio del sistema)

Una DB en producción es un proceso con dependencias del sistema operativo: filesystem, memoria, límites de kernel, red y servicios.

### 16.1 Service management (systemd) y logs

Ejemplos de operación:
    systemctl status postgresql
    journalctl -u postgresql --since "1 hour ago"

### 16.2 Permisos, directorios y ownership

Puntos críticos:
- directorio de datos con permisos estrictos,
- separación de logs,
- rotación de logs,
- backups con permisos mínimos.

### 16.3 Límites del sistema (impacto real)

- file descriptors (ulimit): demasiadas conexiones y ficheros.
- swappiness/memoria: swapping destruye latencia.
- I/O scheduler: impacto en latencia de disco (según sistema).

Comandos útiles:
    ulimit -n
    free -h
    df -h
    lsblk
    iostat -x 1

### 16.4 Red y exposición

- bind a interfaz interna,
- firewall por IP/puerto,
- TLS si cruza redes no confiables,
- separar redes de administración.

---

## 17. Patrones y anti-patrones (arquitectura aplicada)

### 17.1 Patrones recomendados

- Pooling de conexiones con límites y timeouts coherentes.
- Índices basados en medición y planes.
- Backups con restore probado y métricas de RTO real.
- Roles y permisos mínimos por servicio.
- Separación de lectura/escritura cuando aplica.
- Observabilidad desde el diseño (métricas y logs útiles).

### 17.2 Anti-patrones frecuentes (y por qué son graves)

| Anti-patrón | Por qué ocurre | Qué provoca |
|------------|-----------------|------------|
| DB expuesta a Internet | “comodidad” | intrusión, fuerza bruta, fuga |
| no probar restores | falsa sensación de seguridad | desastre en incidente |
| índices por intuición | falta de medición | writes lentas, bloat |
| transacciones largas | lógica mal estructurada | contención, lag, bloat |
| OFFSET profundo | paginación naïve | latencia creciente |

---

## 18. Síntesis final

Una base de datos es un componente arquitectónico crítico que concentra: persistencia, consistencia, concurrencia y seguridad de información. Su diseño afecta directamente al rendimiento global, a la estabilidad bajo carga y a la capacidad de recuperación ante fallos. El dominio profesional de bases de datos exige:
- modelar con rigor (integridad y normalización),
- consultar con precisión (SQL y expresividad),
- entender la concurrencia (transacciones, aislamiento, locks/MVCC),
- optimizar con método (índices y lectura de planes),
- operar con garantías (seguridad, backups, HA, observabilidad),
- y alinear todo con requisitos de negocio (RPO/RTO, latencia, coste).

Este módulo se integra de forma natural con sistemas operativos, Linux, redes, monitorización y ciberseguridad, porque una base de datos en producción es, esencialmente, un sistema dentro del sistema.