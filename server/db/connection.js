const { MongoClient } = require('mongodb');
const DB = process.env.MDB_URI;
const DB_NAME = process.env.MDB_DB
const client = new MongoClient(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db(DB_NAME);
        console.log(`Successfully connected to MongoDB ${DB_NAME}`);
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
