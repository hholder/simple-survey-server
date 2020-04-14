var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
var surveyId = null;
const mongoUrl = 'mongodb://localhost:27017/simple-survey';

router.get('/', handleSurveyRequest);
router.post('/', saveSurvey);

async function handleSurveyRequest(req, rsp) {
  surveyId = parseInt(req.query.surveyId);

  if (surveyId) {
    const client = new MongoClient(mongoUrl);

    try {
      var survey = await client.connect().then(loadData, dataError);
      rsp.send(survey);
    } catch (ex) {
      console.log(ex);
    }
  }
}

async function loadData(client) {
  var survey = {};
  var db = client.db('simple-survey');
  var surveys = db.collection('surveys');
  var results = await surveys.find({surveyId: surveyId}).toArray();

  if (results.length > 0) {
    survey = results[0];
  }

  client.close();

  var json = JSON.stringify(survey);
  return json
}

async function dataError(error) {
  return {};
}

async function saveSurvey(req, rsp) {   
  const client = new MongoClient(mongoUrl);

  try {
    var survey = req.body;

    await client.connect();
    var db = client.db('simple-survey');
    var surveys = db.collection('surveys');
    var surveyId = await surveys.count() + 1;
    var status = await surveys.insertOne({
      surveyId: surveyId,
      survey: survey
    });

    if (status.insertedCount === 1) {
      rsp.send(200);
    } else {
      rsp.send(500);
    }
  } catch (ex) {
    console.log(ex);
    rsp.send(500);
  }

  rsp.close();
}

module.exports = router;