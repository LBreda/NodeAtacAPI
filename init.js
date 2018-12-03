const { createClient } = require("xmlrpc");
const { asyncRpcCall } = require("./utils");

const ATAC_HOST = "muovi.roma.it";

// Exported object
const atac = {};

const authClient = createClient({
  host: ATAC_HOST,
  path: "/ws/xml/autenticazione/1"
});

const palineClient = createClient({
  host: ATAC_HOST,
  path: "/ws/xml/paline/7"
});

const newsClient = createClient({ host: ATAC_HOST, path: "/ws/xml/news/2" });

/**
 * Connects to the API server
 * @param {string} apiKey - Atac API key
 * @return {string} Session token
 */
function connect(apiKey) {
  return asyncRpcCall(authClient, "autenticazione.Accedi", [apiKey, ""]);
}

/**
 * Gets data about a bus stop
 * @param {string} apiKey - API Key
 * @param {string} busStop - Bus stop number
 * @return {AtacBusStopResponse}
 */
atac.getBusStop = async function(apiKey, busStop) {
  const session = await connect(apiKey);
  return asyncRpcCall(palineClient, "paline.Previsioni", [
    session,
    busStop,
    "it"
  ]);
};

/**
 * Gets the routes of a bus line
 * @param {string} apiKey
 * @param {string} line
 * @return {AtacRouteResponse}
 */
atac.getRoutes = async function(apiKey, line) {
  const session = await connect(apiKey);
  return asyncRpcCall(palineClient, "paline.Percorsi", [session, line, "it"]);
};

/**
 * Gets informations about a single route
 * @param {string} apiKey
 * @param {string} routeId
 * @see atac.getRoutes
 * @return {AtacLineResponse}
 */
atac.getRoute = async function(apiKey, routeId) {
  const session = await connect(apiKey);
  return asyncRpcCall(palineClient, "paline.Percorso", [
    session,
    routeId,
    "",
    "",
    "it"
  ]);
};

/**
 * Gets the next departure from the first stop for a single route
 * @param apiKey
 * @param routeId
 * @return {AtacNextDepartureResponse}
 */
atac.getNextDeparture = async function(apiKey, routeId) {
  const session = await connect(apiKey);
  return asyncRpcCall(palineClient, "paline.ProssimaPartenza", [
    session,
    routeId,
    "it"
  ]);
};

/**
 * Gets a list of news categories
 * @param apiKey
 * @return {AtacNewsCategoriesListResponse}
 */
atac.getNewsCategories = async function(apiKey) {
  const session = await connect(apiKey);
  return asyncRpcCall(newsClient, "news.Categorie", [session, "it"]);
};

/**
 * Gets a list of most important news
 * @param apiKey
 * @return {AtacNewsItemListResponse}
 */
atac.getNewsFirstPage = async function(apiKey) {
  const session = await connect(apiKey);
  return asyncRpcCall(newsClient, "news.PrimaPagina", [session, "it"]);
};

/**
 * Gets a list of the categories for a single news
 * @param apiKey
 * @param {int} newsId id of a news item
 * @return {AtacNewsItemCategoryListResponse}
 */
atac.getNewsCategoriesForSingleNews = async function(apiKey, newsId) {
  const session = await connect(apiKey);
  return asyncRpcCall(newsClient, "news.CategorieNews", [
    session,
    "it",
    newsId
  ]);
};

/**
 * Gets a list of news for a category
 * @param apiKey
 * @param {int} categoryId id of a category
 * @return {AtacNewsItemListResponse}
 */
atac.getNewsByCategory = async function(apiKey, categoryId) {
  const session = await connect(apiKey);
  return asyncRpcCall(newsClient, "news.PerCategoria", [
    session,
    "it",
    categoryId
  ]);
};

/**
 * Gets a single news item
 * @param apiKey
 * @param {int} newsId id of a news item
 * @param {int} categoryId id of a category
 * @return {AtacNewsItemResponse}
 */
atac.getNewsSingle = async function(apiKey, newsId, categoryId) {
  const session = await connect(apiKey);
  return asyncRpcCall(newsClient, "news.Singola", [
    session,
    "it",
    newsId,
    categoryId
  ]);
};

/**
 * Gets all the news
 * @param apiKey
 * @return {AtacNewsItemListResponse}
 */
atac.getNewsAll = async function(apiKey) {
  const session = await connect(apiKey);
  return asyncRpcCall(newsClient, "news.Tutte", [session, "it"]);
};


module.exports = atac;

//region JSDoc type definitions

/**
 * Callback function for News Item Categories List
 * @callback NewsItemCategoriesListCallback
 * @property {boolean} error - Error
 * @property {AtacNewsItemCategoryListResponse} response - Server response
 */

/**
 * Callback function for News Item data
 * @callback NewsItemCallback
 * @property {boolean} error - Error
 * @property {AtacNewsItemResponse} response - Server response
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
 * Atac XMLRPC News Categories List response
 * @typedef {Object} AtacNewsCategoriesListResponse
 * @property {string} id_richiesta - Request ID
 * @property {NewsCategoriesList[]} risposta - Response Payload
 */

/**
 * Atac XMLRPC News Item List response
 * @typedef {Object} AtacNewsItemListResponse
 * @property {string} id_richiesta - Request ID
 * @property {NewsItem[]} risposta - Response Payload
 */

/**
 * Atac XMLRPC News Item Category List response
 * @typedef {Object} AtacNewsItemCategoryListResponse
 * @property {string} id_richiesta - Request ID
 * @property {NewsItemCategoryList} - Response Payload
 */

/**
 * Atac XMLRPC News Item response
 * @typedef {Object} AtacNewsItemResponse
 * @property {string} id_richiesta - Request ID
 * @property {NewsDetailedItem} risposta - Response Payload
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
 * @property {date} prossima_partenza - Next departure from the first stop
 * @property {int} tempo_attesa - Waiting time for the bus on the current stop (in minutes)
 * @property {int} tempo_attesa_secondi - Waiting time for the bus on the current stop (in seconds)
 * @property {int} distanza_fermate - Distance of the bus from the current stop (in stops)
 * @property {int} id_veicolo - Vehicle ID number
 * @property {string} banda - Undocumented by ATAC
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

/**
 * News Categories list element
 * @typedef {object} NewsCategoriesList
 * @property {int} id_categoria - Category ID
 * @property {string} nome - Category name
 * @property {int} conteggio - Number of news in the category
 */

/**
 * News Item
 * @typedef {object} NewsItem
 * @property {int} id_news - News item ID
 * @property {int} id_categoria - Category ID
 * @property {string} titolo - News title
 * @property {string} contenuto - News content
 * @property {date} data_pubblicazione - Publishing date
 */

/**
 * News Item
 * @typedef {object} NewsDetailedItem
 * @property {int} id_news - News item ID
 * @property {int} id_categoria - Category ID
 * @property {string} titolo - News title
 * @property {string} contenuto - News content
 * @property {date} data_pubblicazione - Publishing date
 * @property {int} prec - Previous News ID
 * @property {int} succ - Next News ID
 */

/**
 * News Item Category List
 * @typedef {object} NewsItemCategoryList
 * @property {int} id_categoria - Category ID
 * @property {string} nome_categoria - Category Name
 */

//endregion
