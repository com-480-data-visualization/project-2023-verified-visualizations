const Reflux = require('reflux');
const cxninfo = require('../cxninfo');
const Actions = require('../actions/index');
const { EJSON } = require('bson');

const SAMPLE_SIZE = 1000

/**
 * Triggers with a random sample of SAMPLE_SIZE documents
 * that match the current query. Useful for data fields where
 * we want to show a sample instead of an aggregation.
 */
const SampledDataStore = Reflux.createStore({
  init: function() {
    this.listenTo(Actions.queryChanged, this.runQuery.bind(this))
    this.runQuery({})
  },


  /**
   * Get all the data, no filter
   */
  runFindAll() {
    fetch(`http://localhost:${cxninfo.port}/query`).then(response => {
      const documents = response.json();
      documents.then(doc => {
        if (doc.error)
          throw Error(doc.error)
        this.trigger(null, EJSON.deserialize(doc.result))
      }).catch(error => {
        console.log("DB ERROR: (probably malformed query):", error)
        this.trigger(error, null)
      })
    }).catch(error => {
      console.log("SERVER ERROR: something actually bad happened ", error)
      this.trigger(error, null)
    })
  },

  /**
   * Get specific query
   * @param query (in BSON)
   */
  runQuery(query) {
    const pipeline = [
      { // Only match documents that match current selection
        '$match': query
      }, { // take a random sample, leave sampling to DB bc complicated
        '$sample': {
          'size': SAMPLE_SIZE
        }
      }, { // project only the fields that are needed by the components currently, to reduce the data size, any other fields feel free to add here
        '$project': {
          'startGeo': 1,
          'endGeo': 1
        }
      }
    ]
    const querystr = EJSON.stringify(pipeline)
    console.log(`data store running new query: ${querystr}`)
    fetch(`http://localhost:${cxninfo.port}/aggregate/${querystr}`).then(response => {
      const documents = response.json();
      documents.then(doc => {
        if (doc.error)
          throw Error(doc.error)
        this.trigger(null, EJSON.deserialize(doc.result))
      }).catch(error => {
        console.log("DB ERROR: (probably malformed query):", error)
        this.trigger(error, null)
      })
    }).catch(error => {
      console.log("SERVER ERROR: something actually bad happened ", error)
      this.trigger(error, null)
    })
  }
});

export default SampledDataStore;
