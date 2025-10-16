# El Espadachín - Juego de Duelo con Gestos

## 🎮 Descripción

Juego de duelo de espadas controlado por gestos táctiles, compatible con XAPI para integración en plataformas LMS.

## 🌐 Parámetros URL

El juego soporta personalización mediante parámetros GET en la URL:

### 1. **Idioma** (`lang`)

Cambia el idioma de todos los textos del juego.

**Valores**: `es` (Español), `en` (Inglés)  
**Por defecto**: `es`

```
http://localhost:8080/estoque.html?lang=en
http://localhost:8080/estoque.html?lang=es
```

**Elementos traducidos**:
- Título del juego
- Instrucciones completas
- Mensajes de juego (¡DEFENSA!, ¡ATACA!, etc.)
- Metadatos XAPI

### 2. **Nivel de Dificultad** (`nivel`)

Ajusta la dificultad del juego modificando tiempos y mecánicas.

**Valores**: `1` (Fácil), `2` (Normal), `3` (Difícil)  
**Por defecto**: `2`

```
http://localhost:8080/estoque.html?nivel=1
http://localhost:8080/estoque.html?nivel=2
http://localhost:8080/estoque.html?nivel=3
```

#### Nivel 1 - Fácil
- ⏱️ **Tiempos más largos**: 1800-2800ms defensa, 1500-2200ms ataque
- 🎯 **Solo ataques laterales**: LEFT y RIGHT (sin TOP/BOTTOM)
- 🛡️ **Menos paradas del oponente**: 25% probabilidad
- 📚 **Instrucciones simplificadas**: Solo muestra defensas laterales

#### Nivel 2 - Normal (Actual)
- ⏱️ **Tiempos moderados**: 1200-1800ms defensa, 1200-1000ms ataque
- 🎯 **Todos los ataques**: LEFT, RIGHT, TOP, BOTTOM
- 🛡️ **Paradas medias**: 40% probabilidad
- 📚 **Todas las instrucciones**

#### Nivel 3 - Difícil
- ⏱️ **Tiempos cortos**: 800-1400ms defensa, 800-1200ms ataque
- 🎯 **Todos los ataques**: LEFT, RIGHT, TOP, BOTTOM
- 🛡️ **Más paradas del oponente**: 55% probabilidad
- 📚 **Todas las instrucciones**

### 3. **Personaje NPC** (`npj`)

Cambia la imagen de fondo del oponente.

**Valores**: `1`, `2`, `3`, ...  
**Por defecto**: `1`

```
http://localhost:8080/estoque.html?npj=1
http://localhost:8080/estoque.html?npj=2
http://localhost:8080/estoque.html?npj=3
```

**Imágenes**:
- `npj=1` → `estoque/bad.jpg` (por defecto)
- `npj=2` → `estoque/npj/npj2.jpg`
- `npj=3` → `estoque/npj/npj3.jpg`

### Combinar Parámetros

Puedes combinar múltiples parámetros:

```bash
# Inglés, nivel difícil, personaje 2
http://localhost:8080/estoque.html?lang=en&nivel=3&npj=2

# Español, nivel fácil, personaje 3
http://localhost:8080/estoque.html?lang=es&nivel=1&npj=3

# Inglés, nivel normal, personaje 1
http://localhost:8080/estoque.html?lang=en&nivel=2&npj=1
```

## 🎯 Controles del Juego

### Ataque
- **Gesto**: Desliza hacia arriba
- **Cuándo**: Durante la fase "¡ATACA!"

### Defensas

#### Defensa Izquierda
- **Gesto**: Desliza hacia la izquierda
- **Cuándo**: Cuando aparece el indicador ◄ 

#### Defensa Derecha
- **Gesto**: Desliza hacia la derecha
- **Cuándo**: Cuando aparece el indicador ►

#### Defensa Superior (Niveles 2 y 3)
- **Gesto**: Dibuja un arco hacia arriba (izquierda a derecha)
- **Cuándo**: Cuando aparece el indicador ▲

#### Defensa Inferior (Niveles 2 y 3)
- **Gesto**: Dibuja un arco hacia abajo (derecha a izquierda)
- **Cuándo**: Cuando aparece el indicador ▼

## 📊 Sistema XAPI

El juego está completamente integrado con XAPI para tracking educativo.

### Eventos Enviados

1. **initialized** - Al iniciar el juego
2. **passed** - Al ganar el duelo (100 puntos)
3. **failed** - Al perder el duelo (0 puntos)
4. **completed** - Al finalizar (éxito o fallo)

### Extensiones XAPI

Cada evento incluye:
- `rounds-played` - Rondas jugadas
- `successful-blocks` - Bloques exitosos
- `successful-attacks` - Ataques exitosos
- `difficulty-level` - Nivel de dificultad (1, 2, 3)
- `difficulty-name` - Nombre del nivel (Fácil, Normal, Difícil)
- `language` - Idioma del juego
- `character` - Personaje NPC usado

### Uso con LMS

El juego detecta automáticamente si está en un iframe y comunica con el LMS mediante `postMessage`:

```html
<iframe src="estoque.html?lang=en&nivel=2&npj=1"></iframe>
```

## 🎨 Elementos Visuales

- **Área de combate**: Recuadro blanco de 80% x 60%
- **Barras de vida**: 
  - Superior (roja) - Oponente
  - Inferior (cyan) - Jugador
- **Indicadores de ataque**: Triángulos parpadeantes en bordes del área
- **Barra de tiempo**: Amarilla, indica tiempo restante para actuar
- **Efectos visuales**:
  - Flash blanco al golpear
  - Flash rojo al recibir daño
  - Partículas amarillas al bloquear
  - Trazo blanco del gesto

## 🔊 Audio

- **sblock.mp3** - Bloqueo exitoso
- **shit.mp3** - Golpe al oponente
- **ay.mp3** - Daño recibido
- **win.mp3** - Victoria
- **lose.mp3** - Derrota

## 🏗️ Estructura de Archivos

```
/estoque.html           - Juego principal con XAPI
/estoque/
  ├── estoque.html      - Versión original
  ├── bad.jpg           - Imagen NPC 1
  ├── icons/            - Iconos SVG de instrucciones
  │   ├── t_up.svg
  │   ├── t-left.svg
  │   ├── t-rigth.svg
  │   ├── t-up-left.svg
  │   └── t-down-rigth.svg
  ├── npj/              - Imágenes de NPCs adicionales
  │   ├── npj2.jpg
  │   └── npj3.jpg
  └── *.mp3             - Efectos de sonido
```

## 🚀 Ejemplos de Uso

### Educativo - Progresión de Dificultad

```html
<!-- Lección 1: Introducción (fácil) -->
<iframe src="estoque.html?lang=es&nivel=1"></iframe>

<!-- Lección 2: Práctica (normal) -->
<iframe src="estoque.html?lang=es&nivel=2"></iframe>

<!-- Lección 3: Maestría (difícil) -->
<iframe src="estoque.html?lang=es&nivel=3"></iframe>
```

### Internacional

```html
<!-- Estudiantes españoles -->
<iframe src="estoque.html?lang=es&nivel=2"></iframe>

<!-- English students -->
<iframe src="estoque.html?lang=en&nivel=2"></iframe>
```

### Personalización Visual

```html
<!-- Diferentes oponentes para variedad -->
<iframe src="estoque.html?npj=1"></iframe>
<iframe src="estoque.html?npj=2"></iframe>
<iframe src="estoque.html?npj=3"></iframe>
```

## 📱 Compatibilidad

- ✅ Dispositivos móviles (táctil)
- ✅ Tablets
- ✅ Navegadores modernos
- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS y Android

## 🎓 Uso Educativo

Este juego está diseñado para:
- Desarrollo de reflejos y coordinación
- Reconocimiento de patrones
- Toma de decisiones rápidas
- Aprendizaje progresivo por niveles
- Tracking de progreso mediante XAPI

---

**Nota**: El juego requiere interacción táctil. En desktop, solo funcionará el modal de instrucciones. Para mejor experiencia, usar en dispositivos táctiles.

