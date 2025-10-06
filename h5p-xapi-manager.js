/**
 * Sistema XAPI compatible con H5P para Combinación Rúnica
 * Basado en los archivos h5p-event-dispatcher.js y h5p-x-api-event.js que funcionan
 */

// Asegurar que H5P esté disponible
var H5P = window.H5P = window.H5P || {};

/**
 * Clase XAPI Manager compatible con H5P
 */
class H5PXAPIManager {
    constructor(config = {}) {
        this.config = {
            endpoint: config.endpoint || 'https://192.168.1.35:3600/xapi',
            username: config.username || 'routingtales-user',
            password: config.password || 'routingtales-pass',
            actor: config.actor || {
                name: "Usuario RoutingTales",
                mbox: "mailto:usuario@routingtales.com"
            },
            activityId: config.activityId || 'urn:uuid:combinacion-runica-game',
            activityName: config.activityName || 'Combinación Rúnica',
            activityDescription: config.activityDescription || 'Juego de combinación de runas vikingas'
        };
        
        this.sessionId = this.generateUUID();
        this.gameStarted = false;
        this.attempts = 0;
        this.maxAttempts = 8;
        this.activityStartTime = Date.now();
        
        // Configurar H5P si no está disponible
        this.setupH5PIntegration();
    }

    /**
     * Configurar integración con H5P
     */
    setupH5PIntegration() {
        // Crear H5PIntegration si no existe
        if (!window.H5PIntegration) {
            window.H5PIntegration = {
                user: this.config.actor,
                siteUrl: window.location.origin,
                contents: {
                    'cid-1': {
                        url: window.location.href
                    }
                }
            };
        }

        // Crear externalDispatcher si no existe
        if (!H5P.externalDispatcher) {
            H5P.externalDispatcher = new H5P.EventDispatcher();
        }

        // Escuchar eventos XAPI
        H5P.externalDispatcher.on('xAPI', (event) => {
            this.handleXAPIEvent(event);
        });
    }

    /**
     * Genera un UUID único para la sesión
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Manejar eventos XAPI de H5P
     */
    async handleXAPIEvent(event) {
        try {
            const statement = event.data.statement;
            
            // Añadir información específica del juego
            statement.context = statement.context || {};
            statement.context.extensions = statement.context.extensions || {};
            statement.context.extensions['http://adlnet.gov/expapi/extension/session'] = this.sessionId;
            statement.context.extensions['http://adlnet.gov/expapi/extension/attempts'] = this.attempts;
            statement.context.extensions['http://adlnet.gov/expapi/extension/environment'] = 'iframe';
            
            // Enviar al LRS
            await this.sendToLRS(statement);
            
            console.log('Statement XAPI enviado:', statement);
        } catch (error) {
            console.error('Error procesando evento XAPI:', error);
        }
    }

    /**
     * Enviar statement al LRS
     */
    async sendToLRS(statement) {
        try {
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(this.config.username + ':' + this.config.password),
                    'X-Experience-API-Version': '1.0.3'
                },
                body: JSON.stringify(statement)
            });

            if (!response.ok) {
                throw new Error(`Error XAPI: ${response.status} ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Error enviando al LRS:', error);
            return false;
        }
    }

    /**
     * Crear y disparar evento XAPI usando H5P
     */
    triggerXAPIEvent(verb, result = null, extensions = {}) {
        const event = new H5P.XAPIEvent();
        
        // Configurar verbo
        event.setVerb(verb);
        
        // Configurar objeto
        event.setObject({
            contentId: 1,
            getTitle: () => this.config.activityName,
            libraryInfo: {
                versionedNameNoSpaces: 'CombinacionRunica-1.0'
            }
        });
        
        // Configurar actor
        event.setActor();
        
        // Configurar contexto
        event.setContext({
            contentId: 1,
            libraryInfo: {
                versionedNameNoSpaces: 'CombinacionRunica-1.0'
            }
        });
        
        // Añadir resultado si se proporciona
        if (result) {
            event.setScoredResult(
                result.score?.raw || 0,
                result.score?.max || 100,
                { activityStartTime: this.activityStartTime },
                result.completion || false,
                result.success
            );
        }
        
        // Añadir extensiones personalizadas
        if (Object.keys(extensions).length > 0) {
            event.data.statement.context = event.data.statement.context || {};
            event.data.statement.context.extensions = {
                ...event.data.statement.context.extensions,
                ...extensions
            };
        }
        
        // Disparar evento
        H5P.externalDispatcher.trigger(event);
    }

    /**
     * Registrar inicio del juego
     */
    gameStarted() {
        this.gameStarted = true;
        this.attempts = 0;
        this.activityStartTime = Date.now();
        
        this.triggerXAPIEvent('initialized', {
            completion: false,
            success: false
        });
    }

    /**
     * Registrar intento de adivinanza
     */
    attemptMade(guessNumber, correctPosition, correctRune) {
        this.attempts++;
        
        const score = correctPosition + correctRune;
        const maxScore = 4;
        
        this.triggerXAPIEvent('attempted', {
            score: { raw: score, max: maxScore },
            completion: false,
            success: false
        }, {
            'http://adlnet.gov/expapi/extension/guess-number': guessNumber,
            'http://adlnet.gov/expapi/extension/correct-position': correctPosition,
            'http://adlnet.gov/expapi/extension/correct-rune': correctRune,
            'http://adlnet.gov/expapi/extension/attempt-number': this.attempts
        });
    }

    /**
     * Registrar victoria del juego
     */
    gamePassed(attemptsUsed, timeSpent) {
        this.triggerXAPIEvent('passed', {
            score: { raw: 100, max: 100 },
            completion: true,
            success: true
        }, {
            'http://adlnet.gov/expapi/extension/attempts-used': attemptsUsed,
            'http://adlnet.gov/expapi/extension/efficiency': (8 - attemptsUsed) / 8
        });
    }

    /**
     * Registrar derrota del juego
     */
    gameFailed(timeSpent) {
        this.triggerXAPIEvent('failed', {
            score: { raw: 0, max: 100 },
            completion: true,
            success: false
        }, {
            'http://adlnet.gov/expapi/extension/attempts-used': this.attempts,
            'http://adlnet.gov/expapi/extension/max-attempts-reached': true
        });
    }

    /**
     * Registrar finalización del juego
     */
    gameCompleted(success, timeSpent) {
        this.triggerXAPIEvent('completed', {
            score: { raw: success ? 100 : 0, max: 100 },
            completion: true,
            success: success
        }, {
            'http://adlnet.gov/expapi/extension/final-attempts': this.attempts
        });
    }
}

// Exportar para uso global
window.H5PXAPIManager = H5PXAPIManager;
