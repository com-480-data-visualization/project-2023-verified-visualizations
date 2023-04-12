const Reflux = require('reflux');

const Actions = Reflux.createActions([
    { addGeoLayer: { sync: true } },
    { editGeoLayers: { sync: true } },
    { deleteGeoLayer: { sync: true } },
    { updateQuery: { sync: true }},
    { clearQuery: { sync: true }},
    { queryChanged: { asyncResult: true } },
    { dbError: { asyncResult: true } }
  ])

module.exports = Actions;
