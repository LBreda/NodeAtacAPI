'use strict';

/**
 * Atac XMLRPC reply
 * @typedef {Object} atacReply
 * @param {Object} risposta - Response Object
 */

/**
 * Callback function for reply data
 * @callback replyCallback
 * @param {boolean} error - Error
 * @param {atacReply} reply - Server reply
 */

var xmlrpc = require('xmlrpc');

const atacHost = 'muovi.roma.it';
var authClient = xmlrpc.createClient({host: atacHost, path: '/ws/xml/autenticazione/1'});
var palineClient = xmlrpc.createClient({host: atacHost, path: '/ws/xml/paline/7'});

var atac = exports;

/**
 * Class constructor
 * @param {string} apiKey - Atac API key
 * @param {replyCallback} callback - ServerReply
 */
function connect(apiKey, callback) {
    authClient.methodCall('autenticazione.Accedi', [apiKey, ''], callback);
}

/**
 * Gets data about a bus stop
 * @param {string} apiKey - API Key
 * @param {int} busStop - Bus stop number
 * @param {replyCallback} callback
 */
atac.getBusStop = function (apiKey, busStop, callback) {
    connect(apiKey, (error, token) => {
        if (error) {
            console.log('Auth error');
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
 * @param {replyCallback} callback
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
 * @param {replyCallback} callback
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
 * @param {replyCallback} callback
 */
atac.getNextDeparture = function (apiKey, routeId, callback) {
    connect(apiKey, (error, token) => {
        if(error) {
            console.log('getNextDeparture error');
        }
        else {
            palineClient.methodCall('paline.prossimaPartenza', [token, routeId, 'it'], callback);
        }
    });
};