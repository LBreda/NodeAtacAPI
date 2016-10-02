'use strict';

const atacHost = 'muovi.roma.it';
var xmlrpc = require('xmlrpc');
var authClient = xmlrpc.createClient({host: atacHost, path: '/ws/xml/autenticazione/1'});
var palineClient = xmlrpc.createClient({host: atacHost, path: '/ws/xml/paline/7'});

var atac = exports;

/**
 * Connects to the API server
 * @param {string} apiKey - Atac API key
 * @param {AuthCallback} callback - ServerReply
 */
function connect(apiKey, callback) {

    // ConnectionTimeout
    var timeoutProtect = setTimeout(function() {

        // Clear the local timer variable, indicating the timeout has been triggered.
        timeoutProtect = null;

        // Error
        console.log('Connection timeout');
        callback(true);

    }, 5000);

    // Connection function
    authClient.methodCall('autenticazione.Accedi', [apiKey, ''], (error, value) => {

        // Proceed only if the timeout handler has not yet fired.
        if (timeoutProtect) {

            // Clear the scheduled timeout handler
            clearTimeout(timeoutProtect);

            // Result
            callback(error, value);
        }
    });
}

/**
 * Gets data about a bus stop
 * @param {string} apiKey - API Key
 * @param {string} busStop - Bus stop number
 * @param {BusStopCallback} callback
 * @exports atac.getBusStop
 */
atac.getBusStop = function (apiKey, busStop, callback) {
    connect(apiKey, (error, token) => {
        if (error) {
            console.log('Auth error');
            callback(error);
        }
        else {
            palineClient.methodCall('paline.Previsioni', [token, busStop, 'it'], callback);
        }
    });
};

/**
 * Gets the routes of a bus line
 * @param {string} apiKey
 * @param {string} line
 * @param {RouteCallback} callback
 * @exports atac.getRoutes
 */
atac.getRoutes = function (apiKey, line, callback) {
    connect(apiKey, (error, token) => {
        if (error) {
            console.log('getRoutes error');
        }
        else {
            palineClient.methodCall('paline.Percorsi', [token, line, 'it'], callback);
        }
    });
};

/**
 * Gets informations about a single route
 * @param {string} apiKey
 * @param {string} routeId
 * @see atac.getRoutes
 * @param {LineCallback} callback
 * @exports atac.getRoute
 */
atac.getRoute = function (apiKey, routeId, callback) {
    connect(apiKey, (error, token) => {
        if (error) {
            console.log('getRoute error')
        }
        else {
            palineClient.methodCall('paline.Percorso', [token, routeId, '', '', 'it'], callback);
        }
    });
};

/**
 * Gets the next departure from the first stop for a single route
 * @param apiKey
 * @param routeId
 * @param {NextDepartureCallback} callback
 * @exports atac.getNextDeparture
 */
atac.getNextDeparture = function (apiKey, routeId, callback) {
    connect(apiKey, (error, token) => {
        if (error) {
            console.log('getNextDeparture error');
        }
        else {
            palineClient.methodCall('paline.prossimaPartenza', [token, routeId, 'it'], callback);
        }
    });
};

/**
 * Callback function for authentication
 * @callback AuthCallback
 * @property {boolean} error - Error
 * @property {string} token - Auth token
 */

/**
 * Callback function for Bus stop data
 * @callback BusStopCallback
 * @property {boolean} error - Error
 * @property {AtacBusStopResponse} response - Server response
 */

/**
 * Callback function for Line data
 * @callback LineCallback
 * @property {boolean} error - Error
 * @property {AtacLineResponse} response - Server response
 */

/**
 * Callback function for Route data
 * @callback RouteCallback
 * @property {boolean} error - Error
 * @property {AtacRouteResponse} response - Server response
 */

/**
 * Callback function for Next departure data
 * @callback NextDepartureCallback
 * @property {boolean} error - Error
 * @property {AtacNextDepartureResponse} response - Server response
 */

/**
 * Atac XMLRPC Bus Stop response
 * @typedef {Object} AtacBusStopResponse
 * @property {string} id_richesta - Request ID
 * @property {BusStop} risposta - Response Payload
 */

/**
 * Atac XMLRPC Line response
 * @typedef {Object} AtacLineResponse
 * @property {string} id_richesta - Request ID
 * @property {Line} risposta - Response Payload
 */

/**
 * Atac XMLRPC Route response
 * @typedef {Object} AtacRouteResponse
 * @property {string} id_richesta - Request ID
 * @property {Route} risposta - Response Payload
 */

/**
 * Atac XMLRPC Next Departure response
 * @typedef {Object} AtacNextDepartureResponse
 * @property {string} id_richesta - Request ID
 * @property {string} risposta - Response Payload
 */

/**
 * Atac Bus Stop data
 * @typedef {object} BusStop
 * @property {string} nome - Bus stop name
 * @property {boolean} abilitata - Enabled / disabled status
 * @property {int} id_news - News id for the disabled status, or -1
 * @property {string} collocazione - Description of the bus stop location
 * @property {vehicle[]} arrivi - Array of incoming vehicles, ordered by time of arrival
 * @property {pole[]} primi_per_palina - Array of bus stop poles
 */

/**
 * Atac line data
 * @typedef {object} Line
 * @property {boolean} monitorata - True if the line has real-time data
 * @property {boolean} abilitata - True if the line has real-time data at the moment
 * @property {int} id_news - ID of the notice explaining why the real-time data is not available, or -1
 * @property {routeData[]} percorsi - Array containing the line routes data
 */

/**
 * Atac route
 * @typedef {object} Route
 * @property {routeStop[]} fermate - Array of route stops
 * @property {path} percorso - General informations about the path of the route
 * @property {path[]} percorsi - Array of general informations about the paths of the other routes in the same line
 * @property {timetableElement[]} orari_partenze_vicini - Array of departure times close to the given departure time
 * @property {timetableElement[]} orari_partenze - Array of all the departure times
 * @property {boolean} nessuna_partenza - True if the departure list is empty
 */

/**
 * Veichle
 * @typedef {object} vehicle
 * @property {string} linea - Line number
 * @property {string} id_palina - Bus stop pole ID
 * @property {string} nome_palina - Bus stop pole name
 * @property {boolean} non_monitorata - If true, realtime data is not available (and the following params are not set)
 * @property {boolean} nessun_autobus - If true, there are no buses on the line (and the following params are not set)
 * @property {boolean} disabilitata - If true, the realtime data is not available at the moment (and the params following the next are not set)
 * @property {int} news_id - ID of the notice which explains why the data is not available, or -1
 * @property {string} id_percorso - Route ID
 * @property {string} destinazione - Final destination name (may be undefined)
 * @property {string} carteggi - Route papers
 * @property {string} carteggi_dec - Decoded route papers
 * @property {string} capolinea - Final destination
 * @property {string} partenza - Departure time from the first stop (defined if the bus is reaching the first stop)
 * @property {string} annuncio - Announcement string for the InfoTP informative system
 * @property {boolean} meb - True if the bus has a on-board ticket vending machine
 * @property {boolean} pedana - True if the bus has a on-board wheelchair ramp
 * @property {boolean} moby - True if the bus has a on-board monitor
 * @property {boolean} aria - True if the bus has an air conditioner
 * @property {boolean} a_capolinea - True if the bus is reaching the first stop
 * @property {boolean} in_arrivo - True if the bus is coming at the current stop
 * @property {int} tempo_attesa - Waiting time for the bus on the current stop (in minutes)
 * @property {int} distanza_fermate - Distance of the bus from the current stop (in stops)
 * @property {int} id_veicolo - Vehicle ID number
 */

/**
 * Bus stop pole
 * @typedef {object} pole
 * @property {string} id_palina - Bus stop pole ID
 * @property {string} nome_palina - Bus stop name
 * @property {vehicle[]} - Array of incoming vehicles, ordered by time of arrival
 */

/**
 * Route data
 * @typedef {object} routeData
 * @property {string} id_percorso - Route ID
 * @property {string} descrizione - Route description
 * @property {string} capolinea - Route's last stop
 */

/**
 * Route stop
 * @typedef {object} routeStop
 * @property {string} id_palina - Bus stop pole id
 * @property {string} nome - Bus stop pole name (in capital letters)
 * @property {string} nome_ricapitalizzato - Bus stop pole name
 * @property {int} stato_traffico - Traffic speed nearby the bus stop, 1-4 (1 is slow), -1 if not available
 * @property {string} orario_arrivo - Time of arrival of the (eventual) selected vehicle. --:-- if the vehicle passed the stop
 * @property {vehiclePosition} - Position data of a incoming vehicle, if present
 */

/**
 * Vehicle position
 * @typedef {object} vehiclePosition
 * @property {string} id_veicolo - Vehicle ID
 * @property {float} lat - Vehicle latitude (WGS84)
 * @property {float} lon - Vehicle longitude (WGS84)
 */

/** Path
 * @typedef {object} path
 * @property {string} id_linea - Line id
 * @property {string} id_percorso - Path id
 * @property {string} carteggio - Encoded path attributes
 * @property {string} carteggio_dec - Decoded path attributes
 * @property {string} arrivo - Last stop name
 * @property {boolean} abilitata - True if real-time data is available
 * @property {int} id_news - Id of the notice which explains why real-time data is not available, or -1
 * @property {boolean} no_orario - True if the departing times from the first stop are not available
 */

/**
 * Timetable element
 * @typedef {object} timetableElement
 * @property {string} ora - Hour
 * @property {string[]} minuti - List of minutes
 */
