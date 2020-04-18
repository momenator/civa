const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');
const cors = require('cors');
const path = require('path');
const { botReply } = require('./bot');

const PROJECT_ID = 'civa-boivdp'

process.env.GOOGLE_APPLICATION_CREDENTIALS = './cred.json';

// Create a new session
const sessionClient = new dialogflow.SessionsClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


app.post('/query', async (req, res) => {
  let sessionId = req.query.sessionId;
  try {
    const reply = await botReply(sessionClient, req.body.query, sessionId);
    res.json(reply)
  } catch(e) {
    res.json({
      response: 'ERROR',
    })
  }
})

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
