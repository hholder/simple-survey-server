var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
var surveyId = null;
const mongoUrl = 'mongodb://localhost:27017/simple-survey';

router.get('/', handleSurveysRequest);

async function handleSurveysRequest(req, rsp) {
  const client = new MongoClient(mongoUrl);

  try {
    var surveys = await client.connect().then(loadData, dataError);
    rsp.send(surveys);
  } catch (ex) {
    console.log(ex);
  }
}

async function loadData(client) {
  var db = client.db('simple-survey');
  var surveys = db.collection('surveys');
  var results = await surveys.find({isActive: true}).toArray();

  client.close();

  var json = JSON.stringify(results);
  return json
}

async function dataError(error) {
  return [];
}

module.exports = router;