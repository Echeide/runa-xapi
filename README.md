# 🎯 Combinación Rúnica - Sistema H5P con xAPI

Juego de combinación de runas vikingas con integración completa H5P y xAPI para sistemas de aprendizaje.

## 📁 Archivos del Proyecto

### Archivos Principales
- `test-xapi.html` - **Archivo de pruebas principal** para testear actividades H5P
- `index.html` - **Juego principal** con integración H5P completa
- `game-xapi.html` - **Juego de Combinación Rúnica** con protocolo XAPI integrado
- `h5p-xapi-manager.js` - Manager XAPI específico para H5P
- `package.json` - Metadatos del proyecto

### Archivos H5P Core
- `XAPI_samples/h5p-events.js` - Sistema de eventos H5P
- `XAPI_samples/h5p-xapi-events.js` - Eventos XAPI para H5P

## 🚀 Uso Rápido

### 1. Archivo de Pruebas (`test-xapi.html`)

Este es el archivo principal para testear actividades H5P:

```bash
# Abrir en navegador
open test-xapi.html
```

**Características:**
- ✅ Interfaz de configuración completa
- ✅ Soporte para actividades H5P externas
- ✅ Sistema de comunicación xAPI bidireccional
- ✅ Pantallas de victoria/derrota personalizables
- ✅ Modo debug integrado
- ✅ Funciones de prueba manual

### 2. Juego Principal (`index.html`)

Juego completo con integración H5P:

```bash
# Abrir en navegador
open index.html
```

**Características:**
- ✅ Juego de combinación de runas completo
- ✅ Integración H5P nativa
- ✅ Tracking xAPI automático
- ✅ Comunicación con sistemas padre
- ✅ Indicador de estado XAPI en tiempo real

### 3. Juego de Combinación Rúnica (`game-xapi.html`)

Juego específico de combinación de runas con protocolo XAPI:

```bash
# Abrir en navegador
open game-xapi.html
```

**Características:**
- ✅ Juego de combinación de runas vikingas
- ✅ Protocolo XAPI completo integrado
- ✅ Eventos PASSED y FAILED automáticos
- ✅ Tracking de intentos y tiempo
- ✅ Indicador de estado XAPI en tiempo real
- ✅ Animaciones de victoria y derrota

## 🔧 Configuración

### Configuración en `test-xapi.html`

Usa el botón "⚙️ Configurar" para ajustar:

- **Título**: Nombre de la actividad
- **Descripción**: Descripción para el usuario
- **URL de H5P**: URL de la actividad H5P externa
- **Soporte xAPI**: Habilitar/deshabilitar tracking
- **Puntos**: Puntos por completar/fallar
- **Debug**: Mostrar información de debug

### Configuración XAPI

El sistema se conecta automáticamente a:
- **Endpoint**: `https://192.168.1.35:3600/xapi`
- **Usuario**: `routingtales-user`
- **Password**: `routingtales-pass`

## 📊 Eventos XAPI Disponibles

| Evento | Descripción |
|--------|-------------|
| `initialized` | Actividad iniciada |
| `attempted` | Intento realizado |
| `passed` | Actividad completada exitosamente |
| `failed` | Actividad fallida |
| `completed` | Actividad terminada |

## 🎮 Funciones de Prueba

En `test-xapi.html`, puedes usar estas funciones en la consola:

```javascript
// Completar actividad exitosamente
testCompleteActivity(true);

// Completar actividad con fallo
testCompleteActivity(false);

// Mostrar pantalla de fallo
testShowFailScreen();

// Mostrar pantalla de victoria
testShowWinScreen();

// Reintentar carga
testRetryLoad();
```

## 🔍 Debugging

### Modo Debug en `test-xapi.html`

1. Activa "Mostrar información de debug" en configuración
2. Verás información en tiempo real:
   - Estado de carga del iframe
   - Eventos xAPI recibidos
   - Interacciones del usuario
   - Estado de completado

### Logs en Consola

Ambos archivos muestran logs detallados:
- ✅ Conexión XAPI establecida
- ✅ Eventos enviados al LRS
- ✅ Comunicación con sistema padre
- ❌ Errores de conexión

## 🎯 Casos de Uso

### 1. Testing de Actividades H5P
```html
<!-- Cargar actividad H5P externa -->
<iframe src="test-xapi.html?h5p_url=https://h5p.org/h5p/embed/132"></iframe>
```

### 2. Integración en LMS
```html
<!-- Juego completo con tracking -->
<iframe src="index.html" width="100%" height="600"></iframe>
```

### 3. Desarrollo y Testing
- Usa `test-xapi.html` para probar diferentes actividades H5P
- Configura diferentes endpoints XAPI
- Prueba diferentes escenarios de completado/fallo

## 🛡️ Seguridad

- ✅ Validación de orígenes en comunicación iframe
- ✅ Sanitización de URLs de actividades H5P
- ✅ Timeouts de seguridad para carga
- ✅ Manejo de errores robusto

## 📈 Datos Enviados al LRS

- **Estado**: Passed/Failed/Completed
- **Puntuación**: Escalada de 0 a 1
- **Tiempo**: Duración de la sesión
- **Intentos**: Número de intentos realizados
- **Eficiencia**: Rendimiento del usuario
- **Contexto**: Información de la actividad H5P

## 🎯 Próximos Pasos

1. **Abrir `test-xapi.html`** para comenzar a probar
2. **Configurar una actividad H5P** usando el panel de configuración
3. **Probar diferentes escenarios** usando las funciones de test
4. **Verificar logs XAPI** en la consola del navegador
5. **Integrar en tu sistema** usando `index.html`

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Activa el modo debug
3. Verifica la configuración XAPI
4. Usa las funciones de test manual

---

**🎮 ¡Disfruta probando actividades H5P con tracking xAPI completo!**