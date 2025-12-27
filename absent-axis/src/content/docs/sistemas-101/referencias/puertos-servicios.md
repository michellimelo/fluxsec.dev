---
title: "Puertos de red y servicios asociados"
description: "Referencia académica y operativa sobre puertos TCP/UDP utilizados en sistemas Linux, servicios de red y laboratorios de infraestructura."
sidebar:
  order: 99
---

## Introducción

En cualquier sistema informático conectado a una red, los **puertos** son el mecanismo que permite diferenciar servicios y aplicaciones que se comunican simultáneamente sobre una misma dirección IP. Un puerto es un identificador lógico asociado a un protocolo de transporte (principalmente TCP o UDP) que permite a un sistema operativo dirigir el tráfico entrante y saliente hacia el proceso correcto.

Comprender el uso de los puertos es fundamental para la administración de sistemas, la seguridad, el diagnóstico de problemas de red y la correcta publicación de servicios en Internet. Esta página actúa como **documento de referencia global**, aplicable a todos los laboratorios del módulo, evitando repetir explicaciones parciales en cada ejercicio.

---

## Concepto de puerto y relación con TCP/UDP

Los puertos forman parte de la capa de transporte del modelo TCP/IP. Su función es complementar la dirección IP, que identifica un host, con un identificador adicional que señala un servicio concreto dentro de ese host.

- **TCP (Transmission Control Protocol)** ofrece comunicación orientada a conexión, fiable y con control de errores. Es el protocolo habitual para servicios web, bases de datos y administración remota.
- **UDP (User Datagram Protocol)** ofrece comunicación no orientada a conexión, sin garantías de entrega, pero con menor latencia. Se utiliza cuando la rapidez es prioritaria, como en VPN, DNS o streaming.

Un servicio se define, por tanto, por la combinación:
  
`IP + Puerto + Protocolo`

---

## Clasificación de puertos

Los puertos se agrupan en tres rangos bien definidos:

- **Puertos bien conocidos (0–1023)**: reservados para servicios estándar.
- **Puertos registrados (1024–49151)**: usados por aplicaciones y servicios no críticos del sistema.
- **Puertos dinámicos o efímeros (49152–65535)**: asignados temporalmente a clientes.

En entornos de servidores, los puertos bien conocidos suelen estar protegidos y controlados estrictamente mediante firewall.

---

## Tabla de puertos y su utilidad

| Puerto | Protocolo | Servicio | Uso principal | Contexto en sistemas |
|------:|-----------|---------|---------------|----------------------|
| 20 | TCP | FTP (datos) | Transferencia de archivos | Canal de datos FTP |
| 21 | TCP | FTP (control) | Gestión de sesiones FTP | Servidores FTP |
| 22 | TCP | SSH | Acceso remoto seguro | Administración de servidores |
| 23 | TCP | Telnet | Acceso remoto sin cifrar | Obsoleto / inseguro |
| 25 | TCP | SMTP | Envío de correo | Servidores de email |
| 53 | UDP/TCP | DNS | Resolución de nombres | Infraestructura básica |
| 67 | UDP | DHCP (server) | Asignación IP | Redes locales |
| 68 | UDP | DHCP (client) | Solicitud IP | Clientes |
| 80 | TCP | HTTP | Web sin cifrar | Servidores Apache/Nginx |
| 110 | TCP | POP3 | Recepción de correo | Clientes email |
| 123 | UDP | NTP | Sincronización horaria | Crítico para SSL |
| 143 | TCP | IMAP | Correo electrónico | Acceso remoto |
| 443 | TCP | HTTPS | Web cifrada | SSL/TLS |
| 465 | TCP | SMTPS | Email cifrado | En desuso parcial |
| 587 | TCP | SMTP Submission | Envío seguro de correo | Recomendado |
| 631 | TCP | CUPS | Impresión | Servicios locales |
| 993 | TCP | IMAPS | Correo cifrado | Producción |
| 995 | TCP | POP3S | Correo cifrado | Producción |
| 1194 | UDP | OpenVPN | Túnel VPN | Acceso remoto seguro |
| 1433 | TCP | Microsoft SQL Server | Base de datos | Entornos mixtos |
| 2049 | TCP/UDP | NFS | Sistema de archivos en red | Infraestructura |
| 2082 | TCP | cPanel | Hosting | Administración |
| 2083 | TCP | cPanel SSL | Hosting | Administración segura |
| 3000 | TCP | Apps web | Redmine / desarrollo | Aplicaciones |
| 3306 | TCP | MySQL | Base de datos | Backend |
| 3389 | TCP | RDP | Escritorio remoto Windows | Administración |
| 5432 | TCP | PostgreSQL | Base de datos | Backend |
| 5900 | TCP | VNC | Escritorio remoto | Administración |
| 6379 | TCP | Redis | Base de datos en memoria | Caché |
| 8080 | TCP | HTTP alternativo | Zabbix / apps | Frontend |
| 8443 | TCP | HTTPS alternativo | Paneles web | Administración |
| 9000 | TCP | PHP-FPM / apps | Backend web | Producción |
| 10050 | TCP | Zabbix Agent | Métricas | Monitoreo |
| 10051 | TCP | Zabbix Server | Recolección | Monitoreo |
| 27017 | TCP | MongoDB | Base de datos | Backend |

---

## Relación entre puertos, firewall y exposición

Un puerto **abierto** implica que un proceso está escuchando y que el firewall permite el tráfico. No todos los puertos abiertos deben ser accesibles desde Internet. En una arquitectura correcta:

- Los puertos de **administración** (SSH, bases de datos, paneles) se restringen a red local o VPN.
- Los puertos **públicos** se limitan a los estrictamente necesarios, normalmente 80 y 443.
- El firewall actúa como capa de control, no como sustituto de una mala arquitectura.

---

## Mapa global de puertos y servicios en una infraestructura típica

El siguiente mapa representa **de forma integral** cómo se distribuyen y relacionan los puertos en una infraestructura realista basada en los ejercicios y laboratorios del módulo. No es un ejemplo abstracto: corresponde a un entorno Linux con servicios web, base de datos, monitoreo, VPN y administración remota.

El objetivo del mapa es **visualizar la exposición real de puertos**, diferenciando claramente qué servicios están publicados hacia Internet, cuáles permanecen en red local y cuáles solo deben ser accesibles a través de una VPN.

---

### Mapa lógico completo de red y puertos

    Internet
       |
       |  DNS (53)
       |  HTTP  (80)
       |  HTTPS (443)
       |  OpenVPN (1194/UDP)
       |
    ┌───────────────────────────────┐
    │            Router             │
    │  NAT / Firewall / Port Forward│
    │  IP pública                   │
    └───────────────┬───────────────┘
                    |
                    | Red local 192.168.1.0/24
                    |
        ┌───────────┴──────────────────────────────────────────┐
        │                                                      │
        │                Servidor Linux (Ubuntu)               │
        │                IP: 192.168.1.250                      │
        │                                                      │
        │  ┌───────────────────────────────────────────────┐  │
        │  │               Servicios Públicos               │  │
        │  │                                               │  │
        │  │  Apache / Nginx                                │  │
        │  │   ├─ Puerto 80  (HTTP)                         │  │
        │  │   └─ Puerto 443 (HTTPS / SSL)                  │  │
        │  │                                               │  │
        │  │  OpenVPN Access Server                         │  │
        │  │   └─ Puerto 1194/UDP                           │  │
        │  └───────────────────────────────────────────────┘  │
        │                                                      │
        │  ┌───────────────────────────────────────────────┐  │
        │  │           Servicios de Administración          │  │
        │  │        (NO expuestos a Internet)               │  │
        │  │                                               │  │
        │  │  SSH                                          │  │
        │  │   └─ Puerto 22/TCP                             │  │
        │  │                                               │  │
        │  │  FTP (vsftpd)                                 │  │
        │  │   └─ Puerto 21/TCP                             │  │
        │  │                                               │  │
        │  │  MySQL                                        │  │
        │  │   └─ Puerto 3306/TCP                           │  │
        │  │                                               │  │
        │  │  Redmine (aplicación web)                     │  │
        │  │   └─ Puerto 3000/TCP                           │  │
        │  └───────────────────────────────────────────────┘  │
        │                                                      │
        │  ┌───────────────────────────────────────────────┐  │
        │  │             Monitoreo (Zabbix)                │  │
        │  │                                               │  │
        │  │  Zabbix Web                                   │  │
        │  │   └─ Puerto 8080/TCP                           │  │
        │  │                                               │  │
        │  │  Zabbix Server                                │  │
        │  │   └─ Puerto 10051/TCP                          │  │
        │  │                                               │  │
        │  │  Zabbix Agent                                 │  │
        │  │   └─ Puerto 10050/TCP                          │  │
        │  └───────────────────────────────────────────────┘  │
        │                                                      │
        │  ┌───────────────────────────────────────────────┐  │
        │  │            Servicios internos Docker           │  │
        │  │        (red bridge 172.18.0.0/16)              │  │
        │  │                                               │  │
        │  │  Zabbix Server Container                       │  │
        │  │   └─ IP 172.18.0.x                             │  │
        │  │                                               │  │
        │  │  MySQL Container                               │  │
        │  │   └─ IP 172.18.0.x                             │  │
        │  │                                               │  │
        │  │  Comunicación interna SIN firewall externo     │  │
        │  └───────────────────────────────────────────────┘  │
        │                                                      │
        └──────────────────────────────────────────────────────┘


## Lectura académica del mapa

Este mapa permite entender varios principios fundamentales de arquitectura de sistemas:

1. **Separación de responsabilidades**  
   No todos los servicios cumplen la misma función ni deben exponerse igual. Web y VPN son públicos; bases de datos y administración no.

2. **Principio de mínima exposición**  
   Un puerto solo debe abrirse si existe una necesidad funcional clara. Abrir MySQL o SSH a Internet sin restricciones es una mala práctica grave.

3. **Uso de VPN como frontera de seguridad**  
   OpenVPN actúa como una segunda “puerta de entrada”. Muchos servicios que no deben exponerse públicamente pueden ser accesibles de forma segura a través del túnel VPN.

4. **Docker como red aislada**  
   Los contenedores no exponen puertos directamente a la red local salvo que se indiquen explícitamente. Esto reduce la superficie de ataque.

5. **Firewall como control, no como solución mágica**  
   El firewall (UFW) aplica reglas sobre este mapa, pero el diseño correcto es previo al firewall.

---

## Relación con los laboratorios del módulo

Este mapa engloba y conecta todos los ejercicios realizados:

- Apache, SSL y Port Forwarding explican los puertos 80 y 443.
- MySQL y Redmine justifican el uso de 3306 y 3000 solo en LAN/VPN.
- FTP introduce el puerto 21 con control de permisos.
- OpenVPN define un canal seguro alternativo (1194/UDP).
- Zabbix introduce un subsistema completo de monitoreo con múltiples puertos.
- Docker añade una capa de red virtual interna no visible desde el exterior.

Por ello, este documento debe entenderse como **referencia central**, no como un ejercicio aislado.

---

## Conclusión técnica

El mapa de puertos no es solo un esquema visual, sino una representación directa del estado de seguridad, funcionalidad y madurez de un sistema. Saber leerlo y justificar cada puerto abierto es una competencia clave en administración de sistemas y ciberseguridad.

Este documento sirve como base común para todos los ejercicios, evitando duplicaciones y aportando una visión global coherente y profesional.
