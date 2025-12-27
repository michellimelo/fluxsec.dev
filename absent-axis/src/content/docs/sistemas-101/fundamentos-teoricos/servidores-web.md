---
title: Servidores Web
description: "Desarrollo académico completo del módulo Servidores Web. Análisis profundo del servidor web como servicio crítico dentro de los sistemas informáticos y la ciberseguridad. Se estudian fundamentos del modelo web, HTTP/HTTPS, arquitectura interna, servidores más comunes, virtual hosting, configuración, seguridad, hardening, observabilidad y despliegues modernos, alineado con documentación técnica y laboratorios del proyecto."
sidebar:
  order: 10
---

## 1. Introducción: qué es realmente un servidor web

Un servidor web es un **servicio de sistema** cuya función es recibir peticiones mediante el protocolo HTTP o HTTPS y generar respuestas adecuadas. Aunque a menudo se asocia únicamente con “mostrar páginas”, en realidad el servidor web es un **intermediario crítico** entre redes externas y recursos internos del sistema. Actúa como frontera entre entornos con distintos niveles de confianza, lo que lo convierte en una de las piezas más sensibles de cualquier infraestructura.

Desde la perspectiva de sistemas operativos, un servidor web es un proceso persistente que gestiona sockets de red, accede al sistema de archivos, crea procesos o hilos de trabajo y escribe registros de actividad. Desde la perspectiva de la ciberseguridad, es uno de los activos más atacados porque está diseñado para aceptar entradas de origen desconocido y procesarlas de forma automática.

Este módulo estudia el servidor web no como un simple software, sino como **componente estructural** del sistema, conectado directamente con procesos, usuarios, red, almacenamiento y seguridad.

---

## 2. Fundamentos del modelo web

### 2.1 Cliente y servidor

La web se basa en un modelo cliente–servidor asimétrico. El cliente inicia siempre la comunicación y el servidor responde. El cliente puede ser un navegador, una aplicación móvil, un script automatizado o una herramienta de análisis. El servidor no conoce la intención del cliente; solo interpreta la petición y aplica reglas.

Esta asimetría obliga al servidor web a estar permanentemente disponible, a gestionar múltiples conexiones simultáneas y a tratar cada petición como potencialmente hostil. Por ello, la validación, el control de recursos y el aislamiento son esenciales.

Un ejemplo mínimo de interacción cliente–servidor permite observar la web sin abstracciones gráficas:

    curl -i http://localhost

Este comando muestra cabeceras y cuerpo, reforzando la idea de que la web es un intercambio estructurado de mensajes.

---

### 2.2 El protocolo HTTP/HTTPS

HTTP es un protocolo de nivel de aplicación que define cómo se formulan peticiones y respuestas. Una petición incluye método, ruta, cabeceras y, opcionalmente, un cuerpo. Una respuesta incluye código de estado, cabeceras y cuerpo.

HTTPS no es un protocolo distinto, sino HTTP encapsulado en TLS. TLS aporta confidencialidad, integridad y autenticidad del servidor, pero no protege frente a errores de lógica, permisos incorrectos o mala configuración.

La semántica de HTTP es fundamental. Usar métodos o códigos de estado incorrectos no es solo un error de diseño, sino una fuente de problemas de seguridad.

Tabla de métodos HTTP y su interpretación operativa:

| Método | Intención | Riesgo si se usa incorrectamente |
|------|-----------|----------------------------------|
| GET | Obtener información | Exposición de datos en URL o caché |
| POST | Enviar datos y provocar cambios | CSRF, abuso de formularios |
| PUT | Reemplazar un recurso | Sobrescritura no controlada |
| DELETE | Eliminar un recurso | Borrado accidental o malicioso |

---

### 2.3 Evolución del protocolo

HTTP/1.1 introdujo conexiones persistentes y cabeceras más ricas. HTTP/2 mejoró el rendimiento mediante multiplexación y compresión de cabeceras. HTTP/3, basado en QUIC sobre UDP, reduce latencia en redes modernas. Sin embargo, ninguna versión elimina la necesidad de una configuración segura y consciente.

---

## 3. Arquitectura de un servidor web

### 3.1 Componentes internos

Internamente, un servidor web debe gestionar concurrencia. Para ello utiliza distintos modelos: procesos independientes, hilos o bucles de eventos. Cada modelo implica un compromiso distinto entre consumo de recursos, complejidad y aislamiento.

Tabla conceptual de modelos de concurrencia:

| Modelo | Característica principal | Implicación |
|------|--------------------------|------------|
| Prefork | Un proceso por conexión | Mayor aislamiento, más memoria |
| Worker | Procesos con múltiples hilos | Mejor eficiencia, mayor complejidad |
| Event-driven | Gestión por eventos | Alta concurrencia con pocos recursos |

---

### 3.2 Flujo de una petición web

Una petición web real atraviesa varias capas: resolución DNS, conexión TCP, negociación TLS, interpretación HTTP, selección de sitio virtual, acceso a recursos o proxy a backend, generación de respuesta y registro en logs. Comprender este flujo es esencial para diagnosticar errores y analizar incidentes.

---

## 4. Servidores web más comunes

### 4.1 Apache HTTP Server

Apache es un servidor web modular y extensible, ampliamente utilizado en entornos de hosting y servidores tradicionales. Su flexibilidad permite una configuración muy granular, pero exige disciplina para evitar configuraciones complejas o inseguras.

---

### 4.2 Nginx

Nginx se diseñó con un enfoque orientado a eventos y alta concurrencia. Es especialmente eficiente como servidor de contenido estático y como reverse proxy. En arquitecturas modernas, suele actuar como capa frontal, incluso cuando el backend utiliza otros servidores.

---

### 4.3 Comparación conceptual

| Aspecto | Apache | Nginx |
|-------|--------|-------|
| Arquitectura | Procesos/hilos | Eventos |
| Contenido estático | Correcto | Muy eficiente |
| Reverse proxy | Posible | Uso principal |
| Configuración | Jerárquica | Centralizada |

---

## 5. Contenido estático y dinámico

### 5.1 Contenido estático

El contenido estático consiste en archivos servidos directamente desde el sistema de archivos. La principal preocupación no es el rendimiento, sino la **exposición indebida**. DocumentRoot debe contener únicamente recursos públicos.

---

### 5.2 Contenido dinámico

El contenido dinámico se genera mediante aplicaciones que procesan lógica de negocio. El servidor web no debe ejecutar esa lógica directamente, sino comunicarse con el backend mediante mecanismos como FastCGI o proxy HTTP. Esta separación es clave para la seguridad.

---

### 5.3 Modelos de integración

CGI fue el modelo original, pero su coste lo hizo obsoleto. FastCGI y el proxy HTTP permiten procesos persistentes y mayor eficiencia. La elección del modelo afecta directamente a rendimiento y superficie de ataque.

---

## 6. Virtual Hosting y multi-sitio

### 6.1 Concepto de virtual hosting

El virtual hosting permite alojar múltiples sitios en un mismo servidor. El servidor decide qué sitio servir en función del nombre de dominio o la IP destino.

---

### 6.2 Estructura típica

Una estructura correcta separa DocumentRoot, logs y permisos por sitio. Esta separación facilita auditoría y reduce el impacto de incidentes.

---

### 6.3 Riesgos comunes

El principal riesgo es el aislamiento insuficiente. Un sitio comprometido no debe poder acceder a los recursos de otro. Esto conecta directamente con usuarios, grupos y permisos.

---

## 7. Configuración básica de un servidor web

### 7.1 Archivos de configuración

Los servidores web distinguen entre configuración global y configuración por sitio. Comprender el orden de carga y herencia evita comportamientos inesperados.

---

### 7.2 Puertos y binding

Decidir en qué interfaces escucha el servidor define su exposición. Escuchar en todas las interfaces aumenta la superficie de ataque.

Comprobación básica:

    ss -tulpen

---

### 7.3 Usuarios y permisos del servicio

El servidor web debe ejecutarse con un usuario dedicado y con permisos mínimos. Ejecutarlo como root de forma permanente es una mala práctica grave.

---

## 8. HTTPS y seguridad del canal

### 8.1 TLS en servidores web

TLS protege el canal de comunicación, pero no soluciona problemas de autorización ni de lógica de aplicación. HTTPS es una condición necesaria, no suficiente.

---

### 8.2 Gestión de certificados

Los certificados vinculan dominios con claves públicas. Errores en su gestión provocan indisponibilidad inmediata y pérdida de confianza.

---

### 8.3 Errores comunes

Configuraciones débiles, certificados caducados o cadenas incompletas son problemas frecuentes que afectan tanto a seguridad como a disponibilidad.

---

## 9. Seguridad del servidor web

### 9.1 Superficie de ataque típica

La superficie de ataque del servidor web crece con módulos innecesarios, rutas públicas mal definidas y configuraciones por defecto no revisadas.

---

### 9.2 Errores de configuración frecuentes

Listados de directorios, exposición de archivos sensibles o mensajes de error detallados son causas habituales de incidentes.

---

### 9.3 Separación de responsabilidades

El servidor web debe limitarse a su función de intermediario. La lógica de negocio y el acceso a datos deben residir en capas separadas.

---

## 10. Hardening de servidores web

### 10.1 Principios de hardening

El hardening busca reducir superficie de ataque y eliminar ambigüedad. Cada funcionalidad activa debe estar justificada.

---

### 10.2 Medidas técnicas habituales

Deshabilitar módulos innecesarios, limitar métodos HTTP, establecer límites de tamaño y tiempo y configurar cabeceras de seguridad son prácticas comunes.

---

### 10.3 Hardening a nivel sistema

El sistema operativo debe acompañar: usuarios dedicados, permisos estrictos, firewall coherente y servicios mínimos.

---

## 11. Logs y observabilidad

### 11.1 Tipos de logs

Los access logs registran peticiones; los error logs registran fallos. Ambos son esenciales para diagnóstico y seguridad.

---

### 11.2 Análisis de logs

El análisis de logs permite detectar patrones anómalos, escaneos y errores recurrentes.

Ejemplo básico:

    tail -n 50 /var/log/nginx/access.log

---

### 11.3 Logs como evidencia

Los logs son fundamentales para auditoría y análisis forense básico. Sin ellos, la respuesta a incidentes es especulativa.

---

## 12. Servidores web y redes

### 12.1 Relación con DNS

DNS y virtual hosting están estrechamente relacionados. Errores en DNS suelen manifestarse como fallos aparentes del servidor web.

---

### 12.2 Reverse proxy y balanceo

El reverse proxy permite ocultar backends, centralizar TLS y repartir carga. También introduce nuevos riesgos si se configura mal.

---

### 12.3 Exposición pública y segmentación

Separar el servidor web de los sistemas internos mediante segmentación reduce el impacto de un compromiso.

---

## 13. Servidores web en entornos modernos

### 13.1 Contenedores

Los contenedores facilitan despliegues reproducibles, pero no eliminan la necesidad de configurar correctamente permisos y secretos.

---

### 13.2 Integración con cloud

En entornos cloud aparecen balanceadores y certificados gestionados, pero el rol lógico del servidor web se mantiene.

---

## 14. Servidores web y ciberseguridad

El servidor web es simultáneamente un objetivo y una capa defensiva. La mayoría de ataques explotan configuraciones débiles, no vulnerabilidades sofisticadas.

---

## 15. Ejercicios prácticos y documentación técnica

Este módulo debe acompañarse de laboratorios: despliegue básico, virtual hosting, activación de HTTPS, hardening progresivo y análisis de logs, alineados con los ejercicios del proyecto.

---

## 16. Relación con módulos posteriores

Los servidores web conectan directamente con bases de datos, lenguajes de backend, contenedores, monitorización y seguridad en aplicaciones.

---

## 17. Conclusión del módulo

El servidor web es un punto de convergencia entre sistemas, redes y ciberseguridad. Comprenderlo en profundidad permite diseñar infraestructuras más robustas, seguras y observables, y sirve de base para cualquier trabajo posterior en aplicaciones y seguridad web.