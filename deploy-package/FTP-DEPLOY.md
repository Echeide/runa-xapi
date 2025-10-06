# Configuración FTP para Combinación Rúnica XAPI

## Archivos para Subir a FTP

### Archivos Principales (5 archivos)
- `index.html` - Juego principal optimizado para iframe
- `xapi-config.js` - Configuración XAPI con detección automática
- `xapi.js` - Módulo XAPI completo con comunicación bidireccional
- `parent-system-demo.html` - Ejemplo del sistema padre
- `README.md` - Documentación

### Archivos Opcionales
- `package.json` - Metadatos del proyecto
- `.gitignore` - Archivos excluidos

## Estructura Recomendada en FTP

```
/public_html/
├── runa-xapi/
│   ├── index.html
│   ├── xapi-config.js
│   ├── xapi.js
│   ├── parent-system-demo.html
│   ├── README.md
│   └── package.json
```

## Configuración para Producción

### 1. Configurar XAPI en xapi-config.js
```javascript
const XAPI_CONFIG = {
    endpoint: 'https://tu-servidor.com/xapi',
    username: 'tu-usuario',
    password: 'tu-password',
    actor: {
        name: "Usuario Real",
        mbox: "mailto:usuario@tudominio.com"
    },
    enabled: true
};
```

### 2. Configurar por URL (Recomendado)
```
https://tu-servidor.com/runa-xapi/index.html?xapi_endpoint=https://tu-lrs.com/xapi&xapi_user=usuario&xapi_pass=password&xapi_name=Usuario&xapi_email=usuario@ejemplo.com
```

## Verificación Post-Deploy

1. ✅ Cargar `index.html` en el navegador
2. ✅ Verificar en consola: "XAPI habilitado: [endpoint]"
3. ✅ Jugar una partida completa
4. ✅ Verificar statements XAPI en el LRS
5. ✅ Probar `parent-system-demo.html` para ejemplo completo

## Notas de Seguridad

- ⚠️ Cambiar credenciales por defecto en producción
- ⚠️ Configurar HTTPS para el endpoint XAPI
- ⚠️ Verificar permisos CORS en el LRS
- ⚠️ Usar parámetros URL para configuración dinámica

## Soporte

- 📧 Documentación: README.md
- 🎮 Demo: parent-system-demo.html
- 🔧 Configuración: xapi-config.js
- 📊 Logs: Consola del navegador
