# Sistema Multiidioma - Ahorcado

## 🌐 Idiomas Soportados

El juego del ahorcado ahora soporta **3 idiomas**:

- **Español** (`es`) - Por defecto
- **Inglés** (`en`)
- **Alemán** (`de`)

## 🔧 Uso

### Mediante parámetros GET

Añade el parámetro `?lang=XX` a la URL:

#### Español (por defecto)
```
http://localhost:8080/ahorcado.html
http://localhost:8080/ahorcado.html?lang=es
```

#### Inglés
```
http://localhost:8080/ahorcado.html?lang=en
```

#### Alemán
```
http://localhost:8080/ahorcado.html?lang=de
```

### Con test-xapi.html

El sistema de pruebas XAPI también soporta idiomas:

```
http://localhost:8080/test-xapi.html?lang=en
http://localhost:8080/test-xapi.html?lang=de
```

El parámetro `lang` se pasa automáticamente al iframe del juego.

## 📚 Contenido Traducido

### 1. **Títulos de Obras de Agatha Christie**

#### Español
- MUERTE EN EL NILO
- DIEZ NEGRITOS
- ASESINATO EN EL ORIENT EXPRESS
- EL MISTERIOSO CASO DE STYLES
- EL ASESINATO DE ROGER ACKROYD
- CITA CON LA MUERTE
- UN CADAVER EN LA BIBLIOTECA
- MALDAD BAJO EL SOL
- CINCO CERDITOS
- EL TREN DE LAS 4 50
- ASESINATO EN MESOPOTAMIA
- LA CASA TORCIDA
- EL ESPEJO SE ROMPIO
- NEMESIS
- TERCERA MUCHACHA
- HACIA CERO
- EL MISTERIO DE LAS SIETE ESFERAS

#### Inglés
- DEATH ON THE NILE
- AND THEN THERE WERE NONE
- MURDER ON THE ORIENT EXPRESS
- THE MYSTERIOUS AFFAIR AT STYLES
- THE MURDER OF ROGER ACKROYD
- APPOINTMENT WITH DEATH
- THE BODY IN THE LIBRARY
- EVIL UNDER THE SUN
- FIVE LITTLE PIGS
- FOUR FIFTY FROM PADDINGTON
- MURDER IN MESOPOTAMIA
- CROOKED HOUSE
- THE MIRROR CRACKD
- NEMESIS
- THIRD GIRL
- TOWARDS ZERO
- THE SEVEN DIALS MYSTERY

#### Alemán
- DER TOD AUF DEM NIL
- ZEHN KLEINE NEGERLEIN
- MORD IM ORIENT EXPRESS
- DAS FEHLENDE GLIED IN DER KETTE
- ALIBI
- RENDEZVOUS MIT EINER LEICHE
- DIE TOTE IN DER BIBLIOTHEK
- DAS BOESE UNTER DER SONNE
- FUENF KLEINE SCHWEINE
- SECHZEHN UHR FUENFZIG AB PADDINGTON
- MORD IN MESOPOTAMIEN
- DAS KRUMME HAUS
- NEMESIS
- DAS DRITTE MAEDCHEN
- DAS ENDE KOMMT NIE
- DIE SIEBEN ZIFFERBLAETTER

### 2. **Mensajes del Juego**

| Elemento | Español | Inglés | Alemán |
|----------|---------|--------|--------|
| Título | Misterio en la Máquina de Escribir | Mystery at the Typewriter | Mysterium an der Schreibmaschine |
| Victoria | Misterio Resuelto | Mystery Solved | Mysterium Gelöst |
| Derrota | Manuscrito Inacabado | Manuscript Unfinished | Manuskript Unvollendet |
| Botón Reinicio | Nuevo Manuscrito | New Manuscript | Neues Manuskript |

### 3. **Teclado/Alfabeto**

Cada idioma usa su distribución de teclado apropiada:

- **Español**: QWERTY con Ñ
  - `QWERTYUIOPASDFGHJKLÑZXCVBNM`
  
- **Inglés**: QWERTY estándar
  - `QWERTYUIOPASDFGHJKLZXCVBNM`
  
- **Alemán**: QWERTZ
  - `QWERTZUIOPASDFGHJKLYXCVBNM`

### 4. **Metadatos XAPI**

Los eventos XAPI también se envían con los nombres y descripciones en el idioma seleccionado:

```javascript
// Español
activityName: "Misterio en la Máquina de Escribir"
activityDescription: "Juego de ahorcado temático de misterio con títulos de obras de Agatha Christie"

// Inglés
activityName: "Mystery at the Typewriter"
activityDescription: "Hangman game themed around Agatha Christie's mystery novels"

// Alemán
activityName: "Mysterium an der Schreibmaschine"
activityDescription: "Galgenmännchen-Spiel mit Titeln von Agatha Christies Kriminalromanen"
```

## 🔄 Comportamiento por Defecto

- Si no se especifica idioma: **Español (es)**
- Si se especifica un idioma no válido: **Español (es)**
- Idiomas válidos: `es`, `en`, `de`

## 💻 Implementación Técnica

El sistema detecta el idioma mediante:

```javascript
const urlParams = new URLSearchParams(window.location.search);
const lang = ['es', 'en', 'de'].includes(urlParams.get('lang')) 
    ? urlParams.get('lang') 
    : 'es';
```

Todas las traducciones están contenidas en un objeto JavaScript:

```javascript
const translations = {
    es: { /* traducciones en español */ },
    en: { /* traducciones en inglés */ },
    de: { /* traducciones en alemán */ }
};

const t = translations[lang];
```

## 🎮 Ejemplos de Uso

### Desarrollo Local

```bash
# Español
http://localhost:8080/ahorcado.html

# Inglés
http://localhost:8080/ahorcado.html?lang=en

# Alemán
http://localhost:8080/ahorcado.html?lang=de

# Con test-xapi
http://localhost:8080/test-xapi.html?lang=en
```

### Producción

```bash
# Español
https://tu-dominio.com/ahorcado.html

# Inglés
https://tu-dominio.com/ahorcado.html?lang=en

# Alemán
https://tu-dominio.com/ahorcado.html?lang=de
```

## ✨ Características

- ✅ Detección automática de idioma vía URL
- ✅ Fallback a español si el idioma no es válido
- ✅ Traducciones completas de palabras y UI
- ✅ Alfabetos adaptados a cada idioma
- ✅ Metadatos XAPI multiidioma
- ✅ Compatible con sistema de pruebas test-xapi.html
- ✅ Sin recarga de página requerida

## 🚀 Agregar Nuevos Idiomas

Para agregar un nuevo idioma:

1. Añade el código de idioma a la validación:
```javascript
const lang = ['es', 'en', 'de', 'fr'].includes(...)
```

2. Añade las traducciones al objeto `translations`:
```javascript
fr: {
    title: "...",
    activityName: "...",
    activityDescription: "...",
    winMessage: "...",
    loseMessage: "...",
    restartButton: "...",
    alphabet: "...",
    wordList: [...]
}
```

3. ¡Listo! El sistema detectará automáticamente el nuevo idioma.

---

**Nota**: Los títulos de las obras de Agatha Christie están basados en sus traducciones oficiales publicadas en cada idioma.

