import Reflux from 'reflux';
import { addLayer, generateGeoQuery } from '../modules/geo';
import mergeGeoFilter from '../modules/merge-geo-filter';
import StateMixin from 'reflux-state-mixin';
import Actions from '../actions/index'

/**
 * Listens to all query updates and triggers queryChanged.
 * Components/charts that modify the query should emit actions
 * that will update the current query here, and listen to the data store to render changes
 * @param options
 * @returns {{geoLayers: {}, query: {}}|*}
 */
const QueryStore = Reflux.createStore({
  mixins: [StateMixin.store],

  getInitialState() {
    return {
      query: {},
      geoLayers: {}
    }
  },
  init: function () {
    this.listenTo(Actions.updateQuery, this.onQueryAdded.bind(this))
    this.listenTo(Actions.clearQuery, this.onQueryCleared.bind(this))
    this.listenTo(Actions.addGeoLayer, this.geoLayerAdded.bind(this))
    this.listenTo(Actions.editGeoLayers, this.geoLayersEdited.bind(this))
    this.listenTo(Actions.deleteGeoLayer, this.geoLayersDeleted.bind(this))
  },

  onQueryCleared() {
    Actions.queryChanged({})
    this.setState(this.getInitialState())
  },

  /**
   * Contribute fields to the current query
   * @param query
   */
  onQueryAdded(query) {
    // merge don't overwrite
    const newQuery = { ...this.state.query, ...query }
    this.setState({ query: newQuery })
    Actions.queryChanged(newQuery) // to communicate between stores, could get rid of with redux
  },

  geoLayerAdded(field, layer) {
    const geoLayer = addLayer(field, layer, this.state.geoLayers);
    const newQuery = generateGeoQuery(geoLayer)
    const query = mergeGeoFilter(this.state.query, newQuery)
    this.setState({query: query, geoLayers: geoLayer})
    Actions.queryChanged(query) // to communicate between stores, could get rid of with redux
  },

  geoLayersEdited(field, layers) {
    layers.eachLayer((layer) => {
      this.geoLayerAdded(field, layer);
    });
  },

  geoLayersDeleted(layers) {
    const geoLayer = { ...this.state.geoLayers }
    layers.eachLayer((layer) => {
      delete geoLayer[layer._leaflet_id];
    });
    const newQuery = generateGeoQuery(geoLayer)
    const query = mergeGeoFilter(this.state.query, newQuery)
    this.setState({query: query, geoLayers: geoLayer})
    Actions.queryChanged(query) // to communicate between stores, could get rid of with redux
  },
});

export default QueryStore