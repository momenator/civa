const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const PROJECT_ID = 'civa-boivdp'

process.env.GOOGLE_APPLICATION_CREDENTIALS = './cred.json';

// Create a new session
const sessionClient = new dialogflow.SessionsClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('CIVA API');
});


app.post('/query', (req, res) => {
  let sessionId = req.query.sessionId;

  if (!sessionId) sessionId = uuid.v4();

  const sessionPath = sessionClient.sessionPath(PROJECT_ID, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.query,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  sessionClient.detectIntent(request).then(responses => {
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    res.json({
      response: result.fulfillmentText,
      sessionId: sessionId,
    });
  }).catch(e => {
    console.log(e);
    res.json({
      message: 'ERROR'
    });
  })
})

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
