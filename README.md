Node Atac API
=============

This Node.js package is a simple wrapper for the Atac API, the public
API for the realtime tracking of the Rome Public Transport service.

The API is documented
[here](https://www.agenziamobilita.roma.it/it/api-real-time.html).

Installation
------------

You can install the package with npm:

    npm install LBreda/NodeAtacAPI
  
You can use it by requiring it:

    var atac = require('NodeAtacAPI');
    
In order to use the Atac API, you need an API Key. You can get a key
on the [Atac Website](http://muovi.roma.it/dev/key).
    
Functions
---------
Each available function is a wrapper for the official API.

### getBusStop
`atac.getBusStop` is a wrapper for [paline.Previsioni](https://bitbucket.org/agenziamobilita/muoversi-a-roma/wiki/paline.Previsioni).

It will return all the data about a bus stop, including the list of the
incoming buses.

It needs three parameters: the API key, the bus stop number and a
callback function with two parameters.

It returns a "error" boolean on the first parameter, and the response
object on the second parameter. The response object is a dictionary:

* `string nome`: the bus stop name
* `bool abilitata`: enabled / disabled
* `int id_news`: news ID for the disabled status, or -1
* `string collocazione`: Description of the location
* `VehiclesList arrivi`: Array of incoming vehicles, ordered by time of arrival
* `StopList primi_per_palina`: Array of Bus stop poles

Each `StopList` array element is a dictionary:

* `string id_palina`: Bus stop pole ID
* `string nome_palina`: Bus stop pole name
* `VehiclesList arrivi`: Array of incoming vehicles, ordered by time of arrival
  
Each `VehiclesList` array element is a dictionary:

* `string linea`: Line number
* `string id_palina`: Bus stop pole ID
* `string nome_palina`: Bus stop pole name
* `bool non_monitorata`: if true, realtime data is not available (and the following keys are not set)
* `bool nessun_autobus`: if true, there are no buses for the line (and the following keys are not set)
* `bool disabilitata`: if true, the realtime data is not available at the moment (and the keys following the next are not set)
* `int news_id`: ID of the notice which explains why the data is not available, or -1
* `string id_percorso`: Route ID
* `string destinazione`: Final destination name (may be undefined)
* `string carteggi`: Route papers
* `string carteggi dec`: Decoded route papers
* `string capolinea`: Final destination (the difference with `destinazione` is a mystery only Atac can solve)
* `string partenza`: Departure time from the first stop (defined if the bus is reaching the first stop)
* `string annuncio`: Announcement string for the InfoTP informative system
* `bool meb`: True if the bus has a on-board ticket vending machine
* `bool pedana`: True if the bus has a on-board wheelchair ramp
* `bool moby`: True if the bus has a on-board monitor
* `bool aria`: True if the bus has a (probably out of order) air conditioner
* `bool a_capolinea`: True if the bus is reaching the first stop
* `bool in_arrivo`: True if the bus is coming at the current stop
* `date prossima_partenza`: Next departure from the first stop
* `int tempo_attesa`: Waiting time for the bus on the current stop (in minutes)
* `int tempo_attesa_secondi`: Waiting time for the bus on the current stop (in seconds)
* `int distanza_fermate`: Distance of the bus from the current stop (in stops)
* `int id_veicolo`: Vehicle ID number
* `int banda`: Undocumented
  
### getRoutes
`atac.getRoutes` is a wrapper for [paline.Percorsi](https://bitbucket.org/agenziamobilita/muoversi-a-roma/wiki/paline.Percorsi).

It will return a list of routes for a given line. A line may have one
or more routes (usually two, one for each way).

It needs three parameters: the API key, the line number and a
callback function with two parameters.

It returns a "error" boolean on the first parameter, and the response
object on the second parameter. The response object is a dictionary:

* `bool monitorata`: True if the line has real-time data
* `bool abilitata`: True if the line is currently enabled
* `int id_news`: ID of the notice explaining why the line is disabled, or -1
* `RoutesList percorsi`: List of the line routes

Each `RouteList` element is a dictionary:

* `string id_percorso`: Route ID
* `string descrizione`: Route description
* `string capolinea`: Route last stop
  
### getRoute
`atac.getRoute` is a wrapper for [paline.Percorso](https://bitbucket.org/agenziamobilita/muoversi-a-roma/wiki/paline.Percorso).

It will return all the data for a given route.

It needs three parameters: the API key, the route ID and a
callback function with two parameters.

It returns a "error" boolean on the first parameter, and the response
object on the second parameter. The response object is a dictionary.

I'm working on a English translation of the output. You can find the
Italian version on the linked API function page.

### getNextDeparture
`atac.getNextDeparture` is a wrapper for [paline.ProssimaPartenza](https://bitbucket.org/agenziamobilita/muoversi-a-roma/wiki/paline.ProssimaPartenza).

It will return the next departure from the first stop for a given route.

It needs three parameters: the API key, the route ID and a
callback function with two parameters.

It returns a "error" boolean on the first parameter, and the response
object on the second parameter. The response object is a `string` in
the format `Y-m-d H:i:s`.

### getNewsCategories
`atac.getNewsCategories` is a wrapper for the undocumented news.Categorie endpoint.

It will return an list of the available news categories, and the number of
the news contained in each category.

It needs only one parameter: the API key.

It returns a "error" boolean on the first parameter, and the response object on the
second parameter. The response object is an array of dictionaries in this format:

* `int id_categoria`: Category ID
* `string nome`: Category name
* `int conteggio`: Number of news in the category

### getNewsFirstPage
`atac.getNewsFirstPage` is a wrapper for the undocumented news.PrimaPagina endpoint.

It will return a list of the main news.

It needs only one parameter: the API key.

It returns a "error" boolean on the first parameter, and the response object on the
second parameter. The response object is an array of dictionaries in this format:

* `int id_news`: News item id
* `int id_categoria`: Category ID
* `string titolo`: News title
* `string contenuto`: News content
* `date data_pubblicazione`: Publishing date


### getNewsCategoriesForSingleNews
`atac.getNewsCategoriesForSingleNews` is a wrapper for the undocumented news.CategorieNews endpoint.

It will return an list of the categories in which a single news is published.

It needs two parameters: the API key and the News Item id.

It returns a "error" boolean on the first parameter, and the response object on the
second parameter. The response object is an array of dictionaries in this format:

* `int id_categoria`: Category ID
* `string nome_categoria`: Category name

### getNewsByCategory
`atac.getNewsByCategory` is a wrapper for the undocumented news.PerCategoria endpoint.

It will return a list of news for a single category.

It needs two parameters: the API key and a Category id.

It returns a "error" boolean on the first parameter, and the response object on the
second parameter. The response object is an array of dictionaries in this format:

* `int id_news`: News item id
* `int id_categoria`: Category ID
* `string titolo`: News title
* `string contenuto`: News content
* `date data_pubblicazione`: Publishing date

### getNewsSingle
`atac.getNewsSingle` is a wrapper for the undocumented news.Singola endpoint.

It will return a single detailed news.

It needs two parameters: the API key and a Category id.

It returns a "error" boolean on the first parameter, and the response object on the
second parameter. The response object is a dictionary in this format:

* `int id_news`: News item id
* `int id_categoria`: Category ID
* `string titolo`: News title
* `string contenuto`: News content
* `date data_pubblicazione`: Publishing date
* `int prec`: Previous News ID
* `int succ`: Next News ID

### getNewsAll
`atac.getNewsByCategory` is a wrapper for the undocumented news.Tutte endpoint.

It will return a list of all the news.

It needs only one parameter: the API key.

It returns a "error" boolean on the first parameter, and the response object on the
second parameter. The response object is an array of dictionaries in this format:

* `int id_news`: News item id
* `int id_categoria`: Category ID
* `string titolo`: News title
* `string contenuto`: News content
* `date data_pubblicazione`: Publishing date

To Do
-----
* Support for the `paline.PalinaLinee`, `paline.Veicolo` and
`paline.SmartSearch` API functions
* Better support for the `paline.Percorso` API function
* Testing framework
* Better documentation for the return values
* (much) better error handling
