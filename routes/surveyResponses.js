var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
const mongoUrl = 'mongodb://localhost:27017/simple-survey';

router.get('/', handleGetResponses);
router.post('/', handleSubmitResponse);

async function handleGetResponses(req, rsp) {

}

async function handleSubmitResponse(req, rsp) {
  const client = new MongoClient(mongoUrl);

  try {
    var survey = req.body;

    await client.connect();
    var db = client.db('simple-survey');
    var reponses = db.collection('survey-responses');

    var status = await reponses.insertOne({
      surveyId: survey.surveyId,
      surveyName: survey.surveyName,
      surveyDescription: survey.surveyDescription,
      answers: survey.answers
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
}

module.exports = router;