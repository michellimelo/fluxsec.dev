---
title: "Instalación de Pandoc y conversión de documentos"
description: "Ejercicio práctico para instalar Pandoc en Linux, convertir documentos y transferirlos al host mediante FTP"
sidebar:
  order: 10
---

Instalar **Pandoc** en un sistema Linux (Ubuntu/Debian), crear un documento en formato DOCX, convertirlo a PDF desde la línea de comandos y transferir el documento resultante al host físico mediante **FTP**.

Al finalizar el ejercicio serás capaz de:
- Instalar Pandoc correctamente
- Crear un documento DOCX básico
- Convertir documentos entre formatos usando Pandoc
- Transferir archivos desde la máquina virtual al host mediante FTP

**Tiempo estimado:** 25–35 minutos

---

## Parte 1: Instalación de Pandoc

### 1. Actualizar los repositorios de paquetes

    sudo apt update

---

### 2. Instalar Pandoc

Instala Pandoc desde los repositorios oficiales.

    sudo apt install pandoc -y

---

### 3. Verificar la instalación

Comprueba que Pandoc está instalado correctamente.

    pandoc --version

Deberías ver información de la versión instalada y los formatos soportados.

---

## Parte 2: Crear un documento DOCX

### 4. Crear un archivo de texto base

Crea un archivo Markdown que servirá como contenido del documento.

    nano documento.md

Contenido de ejemplo:

    # Documento de prueba

    Este es un documento creado para el ejercicio de Pandoc.

    ## Objetivo

    Probar la conversión de documentos desde DOCX a PDF utilizando Pandoc en Linux.

    - Pandoc
    - Conversión de formatos
    - Transferencia por FTP

Guarda el archivo con **Ctrl+O**, Enter y sal con **Ctrl+X**.

---

### 5. Convertir el archivo Markdown a DOCX

Usa Pandoc para generar el documento en formato Word.

    pandoc documento.md -o documento.docx

Verifica que el archivo se ha creado:

    ls -l documento.docx

---

## Parte 3: Convertir el documento DOCX a PDF

### 6. Instalar dependencias para PDF (LaTeX)

Pandoc necesita un motor LaTeX para generar PDFs.

    sudo apt install texlive-latex-base texlive-fonts-recommended texlive-latex-extra -y

Este paso puede tardar varios minutos.

---

### 7. Convertir DOCX a PDF

Ejecuta la conversión:

    pandoc documento.docx -o documento.pdf

Verifica el resultado:

    ls -l documento.pdf

Si no hay errores, el PDF se habrá generado correctamente.

---

## Parte 4: Transferir el documento por FTP

### 8. Conectar por FTP desde el host o cliente FTP

Asegúrate de que el servicio FTP esté disponible en la máquina virtual (por ejemplo, vsftpd).

Desde el host físico o un cliente FTP:

- Conéctate a la IP de la máquina virtual
- Usuario y contraseña configurados en el servidor FTP

Ejemplo de conexión desde terminal:

    ftp 192.168.1.X

---

### 9. Descargar el documento PDF al host físico

Una vez conectado por FTP:

    get documento.pdf

El archivo se copiará al sistema host.

Sal de la sesión FTP:

    bye

---

## Parte 5: Ejecutar / abrir el documento en el host físico

En el host físico, localiza el archivo descargado y ábrelo con un lector de PDF.

Ejemplo en Linux:

    xdg-open documento.pdf

En Windows o macOS, ábrelo con el visor de PDF habitual.

---

## Verificación final

Comprueba que:
- Pandoc está instalado y operativo
- El documento DOCX se creó correctamente
- El PDF se generó sin errores
- El archivo fue transferido correctamente al host físico
- El PDF se abre correctamente fuera de la máquina virtual

---

## Resultado del ejercicio

El sistema queda con:
- Pandoc instalado y funcional
- Conversión de documentos entre formatos operativa
- Flujo completo VM → FTP → Host validado

Este ejercicio demuestra un caso real de automatización y portabilidad de documentación técnica en entornos Linux.