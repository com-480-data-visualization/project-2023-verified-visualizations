const Reflux = require('reflux');
const cxninfo = require('../cxninfo');
const Actions = require('../actions/index');
const { EJSON } = require('bson');

/**
 * Data that is aggregated, not raw+sampled. Example, count+distinct for a grouped histogram.
 * NOTE this is not sampled so we can get accurate stats, without worrying about passing around
 * a ton of data.
 */
const AggregatedDataStore = Reflux.createStore({
  init: function() {
    this.listenTo(Actions.queryChanged, this.runAggregation.bind(this))
    this.runAggregation({})
  },

  /**
   * Run any additional aggregations that are required by different components.
   * This way we can do 100% of the math on the serverside.
   * @param query
   */
  runAggregation(query) {
    const pipeline = [
      { // Only match documents that match current selection
        '$match': query
      },
      {
        '$facet': { // equivalent to project but for aggregations
          'birth_year': [ // put result in birth id field
            {
              '$group': { // same as group distinct
                '_id': '$birth_year',
                'value': {
                  '$sum': 1
                }
              }
            }, {
              '$project': { // rename output to label + value, skip _id
                '_id': 0,
                'label': '$_id',
                'value': 1
              }
            }
          ]
          // TODO: add more aggregations here. Will return a doc with $field: <aggregation>
          // output_field: [ { $<agg stage 1>: {...} }, {...} ]
        }
      }
    ]
    const querystr = EJSON.stringify(pipeline)
    console.log(`data store running new aggregation: ${querystr}`)
    fetch(`http://localhost:${cxninfo.port}/aggregate/${querystr}`).then(response => {
      const documents = response.json();
      documents.then(doc => {
        if (doc.error)
          throw Error(doc.error)
        this.trigger(null, EJSON.deserialize(doc.result[0])) // always array of length 1 because $facet
      }).catch(error => {
        console.log("DB ERROR: (probably malformed agg pipeline):", error)
        this.trigger(error, null)
      })
    }).catch(error => {
      console.log("SERVER ERROR: something actually bad happened ", error)
      this.trigger(error, null)
    })
  }
});

export default AggregatedDataStore;
