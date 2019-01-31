const express = require('express');
const line = require('@line/bot-sdk');

require('dotenv').config();
const app = express()

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

const client = new line.Client(config);

app.get('/', function (req, res) {
	res.send('Hello I GEAR GEEK!!');
})

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
});

function handleEvent(event) {
  console.log(event);
  if(event.type === 'message' && event.message.type === 'text') {
    handleMessageEvent(event);
  }else {
    return Promise.resolve(null)
  }
}

function handleMessageEvent(event) {
  var msg = {
    type: event.message.type,
    text: event.message.text
  }
  return client.replyMessage(event.replyToken, msg);
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})