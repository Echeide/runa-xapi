/**
 * Configuración XAPI para Combinación Rúnica
 * 
 * Optimizada para entornos personalizados con iframe.
 * Incluye detección automática del sistema padre y comunicación bidireccional.
 */

const XAPI_CONFIG = {
    // === CONFIGURACIÓN PARA ENTORNOS PERSONALIZADOS ===
    
    // Detección automática del entorno padre
    autoDetectParent: true,
    
    // Endpoint por defecto para entornos personalizados
    endpoint: window.parent !== window ? 
        'https://parent-system.com/xapi-endpoint' : // Si está en iframe
        'https://your-lrs-endpoint.com/data/xAPI',   // Si está standalone
    
    // Credenciales - pueden ser configuradas por el sistema padre
    username: 'iframe-user',
    password: 'iframe-pass',
    
    // === INFORMACIÓN DEL USUARIO ===
    actor: {
        name: "Usuario del Juego",
        mbox: "mailto:user@example.com"
    },
    
    // === INFORMACIÓN DE LA ACTIVIDAD ===
    activityId: 'urn:uuid:combinacion-runica-game',
    activityName: 'Combinación Rúnica',
    activityDescription: 'Juego de combinación de runas vikingas',
    
    // === CONFIGURACIÓN ESPECÍFICA PARA IFRAME ===
    
    // Habilitar comunicación con el sistema padre
    enableParentCommunication: true,
    
    // Mostrar logs detallados en consola
    debug: true,
    
    // Reintentos en caso de fallo de conexión
    maxRetries: 3,
    
    // Timeout para las peticiones (en milisegundos)
    timeout: 10000,
    
    // === CONFIGURACIÓN DE DETECCIÓN ===
    
    // Intentar detectar configuración del sistema padre
    detectParentConfig: true,
    
    // Escuchar mensajes del sistema padre
    listenToParentMessages: true
};

/**
 * Función para detectar configuración del sistema padre
 */
function detectParentConfiguration() {
    if (!XAPI_CONFIG.detectParentConfig || window.parent === window) {
        return;
    }
    
    try {
        // Intentar obtener configuración del sistema padre
        const parentConfig = window.parent.XAPI_CONFIG || window.parent.xapiConfig;
        if (parentConfig) {
            console.log('Configuración XAPI detectada del sistema padre:', parentConfig);
            Object.assign(XAPI_CONFIG, parentConfig);
            return true;
        }
    } catch (error) {
        console.log('No se pudo acceder a la configuración del sistema padre:', error.message);
    }
    
    return false;
}

/**
 * Función para configurar XAPI desde mensajes del sistema padre
 */
function setupParentMessageListener() {
    if (!XAPI_CONFIG.listenToParentMessages || window.parent === window) {
        return;
    }
    
    window.addEventListener('message', function(event) {
        // Verificar origen del mensaje por seguridad
        if (event.origin !== window.location.origin && 
            !event.origin.includes('parent-system.com')) {
            return;
        }
        
        if (event.data.type === 'XAPI_CONFIG') {
            console.log('Configuración XAPI recibida del sistema padre:', event.data.config);
            Object.assign(XAPI_CONFIG, event.data.config);
            
            // Notificar que la configuración fue recibida
            if (window.xapiManager) {
                window.xapiManager.updateConfig(XAPI_CONFIG);
            }
        }
    });
}

/**
 * Función para solicitar configuración al sistema padre
 */
function requestParentConfiguration() {
    if (window.parent === window) {
        return;
    }
    
    try {
        window.parent.postMessage({
            type: 'REQUEST_XAPI_CONFIG',
            source: 'combinacion-runica-game'
        }, '*');
    } catch (error) {
        console.log('No se pudo solicitar configuración al sistema padre:', error.message);
    }
}

/**
 * Función para notificar eventos al sistema padre
 */
function notifyParentEvent(eventType, data) {
    if (window.parent === window) {
        return;
    }
    
    try {
        window.parent.postMessage({
            type: 'XAPI_EVENT',
            eventType: eventType,
            data: data,
            timestamp: new Date().toISOString(),
            source: 'combinacion-runica-game'
        }, '*');
    } catch (error) {
        console.log('No se pudo notificar evento al sistema padre:', error.message);
    }
}

/**
 * Función para obtener configuración desde parámetros URL
 * Optimizada para entornos con iframe
 */
function loadXAPIConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Parámetros básicos
    if (urlParams.has('xapi_endpoint')) {
        XAPI_CONFIG.endpoint = urlParams.get('xapi_endpoint');
    }
    
    if (urlParams.has('xapi_user')) {
        XAPI_CONFIG.username = urlParams.get('xapi_user');
    }
    
    if (urlParams.has('xapi_pass')) {
        XAPI_CONFIG.password = urlParams.get('xapi_pass');
    }
    
    if (urlParams.has('xapi_name')) {
        XAPI_CONFIG.actor.name = urlParams.get('xapi_name');
    }
    
    if (urlParams.has('xapi_email')) {
        XAPI_CONFIG.actor.mbox = `mailto:${urlParams.get('xapi_email')}`;
    }
    
    if (urlParams.has('xapi_enabled')) {
        XAPI_CONFIG.enabled = urlParams.get('xapi_enabled') === 'true';
    }
    
    // Parámetros específicos para iframe
    if (urlParams.has('parent_origin')) {
        XAPI_CONFIG.parentOrigin = urlParams.get('parent_origin');
    }
    
    if (urlParams.has('auto_detect')) {
        XAPI_CONFIG.autoDetectParent = urlParams.get('auto_detect') === 'true';
    }
    
    if (urlParams.has('debug')) {
        XAPI_CONFIG.debug = urlParams.get('debug') === 'true';
    }
}

/**
 * Función para configurar XAPI dinámicamente
 */
function configureXAPI(config) {
    Object.assign(XAPI_CONFIG, config);
    
    // Notificar al sistema padre si está disponible
    notifyParentEvent('CONFIG_UPDATED', XAPI_CONFIG);
}

/**
 * Función para verificar si estamos en un iframe
 */
function isInIframe() {
    return window.parent !== window;
}

/**
 * Función para obtener información del entorno
 */
function getEnvironmentInfo() {
    return {
        isIframe: isInIframe(),
        parentOrigin: window.parent !== window ? document.referrer : null,
        currentOrigin: window.location.origin,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando configuración XAPI para entorno personalizado...');
    
    // Cargar configuración desde URL
    loadXAPIConfigFromURL();
    
    // Detectar configuración del sistema padre
    if (XAPI_CONFIG.autoDetectParent) {
        detectParentConfiguration();
    }
    
    // Configurar escucha de mensajes del padre
    setupParentMessageListener();
    
    // Solicitar configuración al sistema padre
    if (isInIframe()) {
        requestParentConfiguration();
    }
    
    // Mostrar información del entorno
    if (XAPI_CONFIG.debug) {
        console.log('Información del entorno:', getEnvironmentInfo());
        console.log('Configuración XAPI final:', XAPI_CONFIG);
    }
});

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.XAPI_CONFIG = XAPI_CONFIG;
    window.configureXAPI = configureXAPI;
    window.loadXAPIConfigFromURL = loadXAPIConfigFromURL;
    window.detectParentConfiguration = detectParentConfiguration;
    window.notifyParentEvent = notifyParentEvent;
    window.isInIframe = isInIframe;
    window.getEnvironmentInfo = getEnvironmentInfo;
}
