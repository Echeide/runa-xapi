# 🎯 Combinación Rúnica - Integración XAPI para Iframe

Juego de combinación de runas vikingas con integración XAPI optimizada para entornos personalizados que cargan la actividad a través de iframe.

## 📁 Archivos del Proyecto

- `index.html` - Juego principal optimizado para iframe
- `xapi-config.js` - Configuración XAPI con detección automática del sistema padre
- `xapi.js` - Módulo XAPI con comunicación bidireccional
- `parent-system-demo.html` - Ejemplo completo del sistema padre
- `README.md` - Esta documentación

## 🚀 Uso Rápido

### 1. En tu Sistema Personalizado

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Sistema</title>
</head>
<body>
    <iframe id="game-iframe" 
            src="index.html" 
            width="100%" 
            height="600" 
            frameborder="0">
    </iframe>

    <script>
        // Configuración XAPI
        const XAPI_CONFIG = {
            endpoint: 'https://tu-lrs.com/xapi',
            username: 'usuario',
            password: 'password',
            actor: {
                name: "Usuario",
                mbox: "mailto:usuario@ejemplo.com"
            }
        };

        // Escuchar mensajes del iframe
        window.addEventListener('message', function(event) {
            if (event.data.type === 'REQUEST_XAPI_CONFIG') {
                // Enviar configuración al juego
                event.source.postMessage({
                    type: 'XAPI_CONFIG',
                    config: XAPI_CONFIG
                }, '*');
            }
            
            if (event.data.type === 'XAPI_EVENT') {
                // Procesar eventos del juego
                console.log('Evento:', event.data.eventType, event.data.data);
            }
        });
    </script>
</body>
</html>
```

### 2. Configuración por URL (Alternativa)

```html
<iframe src="index.html?xapi_endpoint=https://tu-lrs.com/xapi&xapi_user=usuario&xapi_pass=password"></iframe>
```

## 📊 Eventos XAPI Disponibles

| Evento | Descripción |
|--------|-------------|
| `GAME_STARTED` | Usuario comenzó a jugar |
| `ATTEMPT_MADE` | Usuario hizo un intento |
| `GAME_PASSED` | Usuario ganó el juego |
| `GAME_FAILED` | Usuario perdió el juego |
| `GAME_COMPLETED` | Juego terminó |

## 🔧 Configuración

Edita `xapi-config.js` para personalizar:

```javascript
const XAPI_CONFIG = {
    // Endpoint de tu LRS
    endpoint: 'https://tu-lrs.com/xapi',
    
    // Credenciales
    username: 'usuario',
    password: 'password',
    
    // Información del usuario
    actor: {
        name: "Nombre del Usuario",
        mbox: "mailto:usuario@ejemplo.com"
    },
    
    // Habilitar/deshabilitar XAPI
    enabled: true,
    
    // Mostrar logs detallados
    debug: false
};
```

## 🎮 Comandos del Sistema Padre

| Comando | Descripción |
|---------|-------------|
| `XAPI_CONFIG` | Enviar configuración XAPI |
| `XAPI_PAUSE` | Pausar tracking |
| `XAPI_RESUME` | Reanudar tracking |
| `XAPI_RESET` | Reiniciar sesión |

## 🛡️ Seguridad

El sistema incluye validación de orígenes y verificación de mensajes para garantizar comunicación segura entre el iframe y el sistema padre.

## 🐛 Debugging

Habilita `debug: true` en `xapi-config.js` para ver logs detallados en la consola del navegador.

## 📈 Datos Enviados al LMS

- **Estado**: Passed/Failed
- **Puntuación**: Escalada de 0 a 1
- **Tiempo**: Duración de la sesión
- **Intentos**: Número de adivinanzas utilizadas
- **Eficiencia**: Rendimiento del jugador

## 🎯 Ejemplo Completo

Abre `parent-system-demo.html` en tu navegador para ver un ejemplo completo funcionando con logs en tiempo real.

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica que los orígenes estén permitidos
3. Confirma la configuración XAPI
4. Usa el modo debug para logs detallados