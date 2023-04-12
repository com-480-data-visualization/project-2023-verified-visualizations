# DataVis Citibike Data

## Installation instructions
I recommend installing nvm, then you need node v16 and npm v8
### Backend
```
$ cd server
$ npm i
$ npm start
> server@1.0.0 start
> node server.js

Server is running on port: 3000
Successfully connected to MongoDB citibike
```
The connection details are stored in server/config.env if you need to change it. You need to be on the EPFL network to connect or VPN, assuming you haven't changed the connection info. If it doesn't say "successfully connected" then you should check server/config.env to make sure the URI is correct.

### Frontend
```
$ cd client
$ npm i
$ npm start
> Something is already running on port 3k, so type 'Y'
```
Navigate to localhost on the next available port, probably http://localhost:3001/

## Usage
The basic idea is that interacting with the charts / maps will auto-generate a DB query so all the charts will 
simultaneously update to reflect the selected data. So when you drag+drop on the map, all charts will
automatically update to reflect only data within the radius on the map, same for when we add interaction to the d3.
This also means that all the aggregations/stats/grouping etc all happens on the server side and any d3 interaction should 
just be generating aggregation pipelines instead of doing any real calculations.

### Current components
`Current Query` shows the current filter that is auto-generated based on interacting with the website.
Printed there for debugging purposes, we can probably get rid of it in the final version.

`Example add to query via textbox` shows how to add fields to the current query. 
For example, if you type {"gender": "female"} into the box it will update all the charts to show only trips taken by female bikers.
Can be any proper mongodb query. POC for updating the query.

`Clear Query` will reset the current query to no filtering, but you have to manually delete any polygons on the map if you want them to not be rendered.
The polygons won't affect the query, but they will be visible (feel free to fix that if it annoys you, the map itself is using leaflet).

`Map` shows the geojson for the `startGeo` field. You can do radial search by clicking the round botton on the side of the map 
then dragging out. You can also draw custom polygons with the hex button. You can draw multiple polygons, which will show the union 
of the geo query. You can delete/edit polygons as well. A lot of the maps code is adapted from mongodb-compass, we are actually using their tiling server too.

`D3 Example Chart` is a simple d3 bar chart for an aggregated field, in this case it shows a count/distinct for birth year.

`First 10 Documents` shows the first 10 out of the 1000 sampled the documents used for the map (for debugging, can delete later).

## Implementation 
On the client side, this is a React/Reflux application that uses d3 for charts and leaflet for maps. The server side 
uses Express to route queries to MongoDB. Queries are stringified while data is serialized into binary BSON to save space.

### Actions
Redux Actions, i.e. how user interactions are communicated from components to stores, or stores to stores. Most of the actions should be done, but the general flow is that components change the query via calling various actions. The stores listen to the actions, get new data from the database, then update their own state. The components listen to the stores so when the stores states are updated then react will re-render the components.

### Stores
Reflux Stores, which is essentially where state gets stored. We shouldn't need more stores I think. State is split into 3:
- `QueryStore` tracks the current generated query. Receives data flow from the components/user interactions.
- `SampledDataStore` For some components, like the GeoJSON maps, we want to randomly sample the data and not display every single datapoint because then the map would be unreadable and very slow. Any component that needs a sampled set of datapoints should listen to this store. Any fields that should be output in this data should be specified in the $project field of the `pipeline` array in the `runQuery` method. Just add `'<field>': 1`. 
- `AggregatedDataStore` Stores data that is aggregated, for example if you want to do count/distinct for a particular field in order to generate a histogram that would go in this store. These aggregations are run on the raw data, not a sample, but only the result is passed to the client side. To add a field to the data that is passed to the components that listen to this store, add a field to the `$facet` object in the `pipeline` object in the `runAggregation` method. I recommend using MongoDB Compass's agg pipeline builder then running 'export to language' > node.js and it will generate something you can paste into the pipeline. All possible aggregations are documented here: https://www.mongodb.com/docs/v3.6/reference/operator/aggregation.

### Components
React components. The only flow of data from components -> stores right now is the query itself, so if any new components change the query then they should trigger the `QueryChanged` action and pass the new query fields. 

`DocumentsComponent` is an example of a component that uses the sampled data, and listens to the SampledDataStore. To add a chart that renders the data points, add the field you want to the SampledDataStore query, copy the DocumentsComponent and change the render method to do something with the field you want.  

`ExampleAggChartComponent` is an example of a component that uses the aggregated data, and listens to the AggregatedDataStore. To add a chart that renders the aggregation, add the aggregation you want to the AggregatedDataStore pipeline, copy the ExampleAggChartComponent and change the render method to do whatever you want. D3 components live in components/d3, right now I've just added a simple bar chart.

`components/coordinates-minichart` is based on mongodb-compass and contains components for react-leaflet (the map).

### Modules
Helper methods, most of which are also adapted from mongobd-compass in order to generate queries from map iteractions.

### Other
If you change the DB or collection, or the port that the server is running on, you need to update `client/src/cxninfo.js`.

### Server
This should be pretty much complete, but if you want to add more interactions with the DB then you can add new routes to server/db/routes/query.js. The connection info is stored in config.env and the server itself is in server.js. `runCommand` is exposed for debugging but obviously if this was a real website you wouldn't expose your DB like so.