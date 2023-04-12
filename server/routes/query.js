const express = require("express");
const COLL_NAME = process.env.MDB_COLL
const { EJSON } = require('bson');

// express router.
const queryRoutes = express.Router();
const dbo = require("../db/connection");

// query, for now assume it's always the same DB and collection but can easily be updated
queryRoutes.route("/query").get((req, res) => {
  console.log("FindALL on server ")
  try {
    dbo.getDb()
      .collection(COLL_NAME)
      .find({})
      // .limit(10) // TODO: temporary
      .toArray((err, result) => {
        if (err) throw err;
        const bsonres = EJSON.serialize(result);
        res.json({result: bsonres})
      });
  } catch (e) {
    console.log(`FindAll failed with ${e.errmsg}`)
    res.status(500).send({ error: `FindAll failed with ${e.errmsg}`})
  }
});

queryRoutes.route("/query/:filter").get((req, res) => {
  try {
    const q = EJSON.parse(req.params.filter)
    console.log("Query on server ", q)
    dbo.getDb()
      .collection(COLL_NAME)
      .find(q)
      .limit(1000) // TODO: temporary
      .toArray((err, result) => {
        if (err) {
          console.log(`Query ${req.params.filter} failed with ${err.errmsg}`)
          res.status(500).send({ error: `Query ${req.params.filter} failed with ${err.errmsg}`})
        } else {
          const bsonres = EJSON.serialize(result);
          res.json({result: bsonres})
        }
      });
  } catch (e) {
    console.log(`Query ${req.params.filter} failed with ${e.errmsg}`)
    res.status(500).send({ error: `Query ${req.params.filter} failed with ${e.errmsg}`})
  }
});

queryRoutes.route("/aggregate/:pipeline").get((req, res) => {
  try {
    const q = EJSON.parse(req.params.pipeline)
    console.log("Aggregation on server ", q)
    dbo.getDb()
      .collection(COLL_NAME)
      .aggregate(q)
      .toArray((err, result) => {
        if (err) {
          console.log(`Aggregation ${req.params.pipeline} failed with ${err.errmsg}`)
          res.status(500).send({ error: `Aggregation ${req.params.pipeline} failed with ${err.errmsg}`})
        } else {
          const bsonres = EJSON.serialize(result);
          res.json({result: bsonres})
        }
      });
  } catch (e) {
    console.log(`Aggregation ${req.params.pipeline} failed with ${e.errmsg}`)
    res.status(500).send({ error: `Aggregation ${req.params.pipeline} failed with ${e.errmsg}`})
  }
});

// queryRoutes.route("/query/:id").get((req, res) => {
//   const q = { _id: ObjectId(req.params.id) };
//   dbo.getDb()
//     .collection(COLL_NAME)
//     .findOne(q, (err, result) => {
//       if (err) throw err;
//       res.json(result);
//     });
// });

// in a real website would not expose runCommand even w pwd
queryRoutes.route("/runCommand").post((req, res) => {
  console.log("command on db ", req.body)
  try {
    dbo.getDb(req.body.db)
      .command(req.body.command, (err, result) => {
        if (err) throw err;
        console.log("command res ", result)
        const bsonres = EJSON.serialize(result);
        res.json({result: bsonres})
      });
  } catch (e) {
    console.log(`RunCommand ${req.body.command} failed with ${e.errmsg}`)
    res.status(500).send({ error: `Command ${req.body.command} failed with ${e.errmsg}`})
  }
});

module.exports = queryRoutes;
