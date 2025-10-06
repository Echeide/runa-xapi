/**
 * Módulo XAPI mejorado para entornos personalizados con iframe
 * Incluye comunicación bidireccional con el sistema padre
 */

class XAPIManagerIframe extends XAPIManager {
    constructor(config = {}) {
        super(config);
        this.parentOrigin = config.parentOrigin || '*';
        this.notifyParent = config.enableParentCommunication !== false;
        this.setupParentCommunication();
    }

    /**
     * Configurar comunicación con el sistema padre
     */
    setupParentCommunication() {
        if (window.parent === window || !this.notifyParent) {
            return;
        }

        // Escuchar mensajes del sistema padre
        window.addEventListener('message', (event) => {
            this.handleParentMessage(event);
        });

        // Notificar que el juego está listo
        this.notifyParentEvent('GAME_READY', {
            activityId: this.config.activityId,
            activityName: this.config.activityName,
            sessionId: this.sessionId
        });
    }

    /**
     * Manejar mensajes del sistema padre
     */
    handleParentMessage(event) {
        // Verificar origen por seguridad
        if (this.parentOrigin !== '*' && !event.origin.includes(this.parentOrigin)) {
            return;
        }

        switch (event.data.type) {
            case 'XAPI_CONFIG':
                this.updateConfig(event.data.config);
                break;
            case 'XAPI_PAUSE':
                this.pauseTracking();
                break;
            case 'XAPI_RESUME':
                this.resumeTracking();
                break;
            case 'XAPI_RESET':
                this.resetSession();
                break;
        }
    }

    /**
     * Notificar evento al sistema padre
     */
    notifyParentEvent(eventType, data) {
        if (!this.notifyParent || window.parent === window) {
            return;
        }

        try {
            window.parent.postMessage({
                type: 'XAPI_EVENT',
                eventType: eventType,
                data: data,
                timestamp: new Date().toISOString(),
                source: 'combinacion-runica-game',
                sessionId: this.sessionId
            }, this.parentOrigin);
        } catch (error) {
            console.warn('No se pudo notificar evento al sistema padre:', error);
        }
    }

    /**
     * Actualizar configuración dinámicamente
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('Configuración XAPI actualizada:', this.config);
    }

    /**
     * Pausar el tracking
     */
    pauseTracking() {
        this.trackingPaused = true;
        console.log('Tracking XAPI pausado');
    }

    /**
     * Reanudar el tracking
     */
    resumeTracking() {
        this.trackingPaused = false;
        console.log('Tracking XAPI reanudado');
    }

    /**
     * Reiniciar sesión
     */
    resetSession() {
        this.sessionId = this.generateUUID();
        this.gameStarted = false;
        this.attempts = 0;
        console.log('Sesión XAPI reiniciada:', this.sessionId);
    }

    /**
     * Enviar statement XAPI (versión mejorada)
     */
    async sendStatement(verb, result = null, extensions = {}) {
        // Verificar si el tracking está pausado
        if (this.trackingPaused) {
            console.log('Tracking pausado, statement no enviado');
            return false;
        }

        const statement = {
            actor: this.config.actor,
            verb: verb,
            object: {
                id: this.config.activityId,
                definition: {
                    name: {
                        "es": this.config.activityName
                    },
                    description: {
                        "es": this.config.activityDescription
                    },
                    type: "http://adlnet.gov/expapi/activities/game"
                }
            },
            context: {
                registration: this.sessionId,
                extensions: {
                    "http://adlnet.gov/expapi/extension/session": this.sessionId,
                    "http://adlnet.gov/expapi/extension/attempts": this.attempts,
                    "http://adlnet.gov/expapi/extension/environment": "iframe",
                    "http://adlnet.gov/expapi/extension/parent-origin": document.referrer,
                    ...extensions
                }
            },
            timestamp: new Date().toISOString()
        };

        // Añadir resultado si se proporciona
        if (result) {
            statement.result = result;
        }

        // Notificar al sistema padre antes de enviar
        this.notifyParentEvent('STATEMENT_SENDING', statement);

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

            console.log('Statement XAPI enviado correctamente:', statement);
            
            // Notificar éxito al sistema padre
            this.notifyParentEvent('STATEMENT_SENT', {
                statement: statement,
                response: {
                    status: response.status,
                    statusText: response.statusText
                }
            });

            return true;
        } catch (error) {
            console.error('Error enviando statement XAPI:', error);
            
            // Notificar error al sistema padre
            this.notifyParentEvent('STATEMENT_ERROR', {
                statement: statement,
                error: error.message
            });

            return false;
        }
    }

    /**
     * Registrar inicio del juego (versión mejorada)
     */
    async gameStarted() {
        this.gameStarted = true;
        this.attempts = 0;
        
        const verb = {
            id: "http://adlnet.gov/expapi/verbs/initialized",
            display: {
                "es": "iniciado"
            }
        };

        const result = await this.sendStatement(verb, {
            duration: "PT0S"
        });

        // Notificar inicio al sistema padre
        this.notifyParentEvent('GAME_STARTED', {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        });

        return result;
    }

    /**
     * Registrar intento (versión mejorada)
     */
    async attemptMade(guessNumber, correctPosition, correctRune) {
        this.attempts++;
        
        const verb = {
            id: "http://adlnet.gov/expapi/verbs/attempted",
            display: {
                "es": "intentado"
            }
        };

        const result = {
            score: {
                scaled: (correctPosition + correctRune) / 4,
                raw: correctPosition + correctRune,
                min: 0,
                max: 4
            },
            extensions: {
                "http://adlnet.gov/expapi/extension/guess-number": guessNumber,
                "http://adlnet.gov/expapi/extension/correct-position": correctPosition,
                "http://adlnet.gov/expapi/extension/correct-rune": correctRune
            }
        };

        const success = await this.sendStatement(verb, result, {
            "http://adlnet.gov/expapi/extension/attempt-number": this.attempts
        });

        // Notificar intento al sistema padre
        this.notifyParentEvent('ATTEMPT_MADE', {
            guessNumber: guessNumber,
            correctPosition: correctPosition,
            correctRune: correctRune,
            attempts: this.attempts,
            success: success
        });

        return success;
    }

    /**
     * Registrar victoria (versión mejorada)
     */
    async gamePassed(attemptsUsed, timeSpent) {
        const verb = {
            id: "http://adlnet.gov/expapi/verbs/passed",
            display: {
                "es": "aprobado"
            }
        };

        const result = {
            completion: true,
            success: true,
            score: {
                scaled: 1.0,
                raw: 100,
                min: 0,
                max: 100
            },
            duration: timeSpent,
            extensions: {
                "http://adlnet.gov/expapi/extension/attempts-used": attemptsUsed,
                "http://adlnet.gov/expapi/extension/efficiency": (8 - attemptsUsed) / 8
            }
        };

        const success = await this.sendStatement(verb, result);

        // Notificar victoria al sistema padre
        this.notifyParentEvent('GAME_PASSED', {
            attemptsUsed: attemptsUsed,
            timeSpent: timeSpent,
            efficiency: (8 - attemptsUsed) / 8,
            success: success
        });

        return success;
    }

    /**
     * Registrar derrota (versión mejorada)
     */
    async gameFailed(timeSpent) {
        const verb = {
            id: "http://adlnet.gov/expapi/verbs/failed",
            display: {
                "es": "fallido"
            }
        };

        const result = {
            completion: true,
            success: false,
            score: {
                scaled: 0.0,
                raw: 0,
                min: 0,
                max: 100
            },
            duration: timeSpent,
            extensions: {
                "http://adlnet.gov/expapi/extension/attempts-used": this.attempts,
                "http://adlnet.gov/expapi/extension/max-attempts-reached": true
            }
        };

        const success = await this.sendStatement(verb, result);

        // Notificar derrota al sistema padre
        this.notifyParentEvent('GAME_FAILED', {
            attempts: this.attempts,
            timeSpent: timeSpent,
            success: success
        });

        return success;
    }

    /**
     * Registrar finalización (versión mejorada)
     */
    async gameCompleted(success, timeSpent) {
        const verb = {
            id: "http://adlnet.gov/expapi/verbs/completed",
            display: {
                "es": "completado"
            }
        };

        const result = {
            completion: true,
            success: success,
            duration: timeSpent,
            extensions: {
                "http://adlnet.gov/expapi/extension/final-attempts": this.attempts
            }
        };

        const xapiSuccess = await this.sendStatement(verb, result);

        // Notificar finalización al sistema padre
        this.notifyParentEvent('GAME_COMPLETED', {
            success: success,
            timeSpent: timeSpent,
            attempts: this.attempts,
            xapiSuccess: xapiSuccess
        });

        return xapiSuccess;
    }
}

// Exportar para uso global
window.XAPIManagerIframe = XAPIManagerIframe;
