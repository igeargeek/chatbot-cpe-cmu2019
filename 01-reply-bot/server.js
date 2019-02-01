const express = require('express')
const line = require('@line/bot-sdk')

require('dotenv').config()
const app = express()

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
}

const client = new line.Client(config)

app.get('/', function (req, res) {
	res.send('01-reply-bot!!')
})

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
})

function handleEvent(event) {
  console.log(event)
  if(event.type === 'message' && event.message.type === 'text') {
    handleMessageEvent(event)
  }else {
    return Promise.resolve(null)
  }
}

function handleMessageEvent(event) {
  let msg = {
    type: event.message.type,
    text: event.message.text
  }

  const eventMessageText = event.message.text.toLowerCase()
  if(eventMessageText === "menu") {
    msg = {
      "type": "text", // ①git 
      "text": "Select your menu",
      "quickReply": { // ②
        "items": [
          {
            "type": "action", // ③
            "imageUrl": "https://www.igeargeek.com/wp-content/uploads/2018/09/cropped-38773896_936358296563359_1678814042111606784_n-1.png",
            "action": {
              "type": "message",
              "label": "apply jobs!",
              "text": "apply jobs"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "location",
              "text": "location"
            }
          }
        ]
      }
    }
  }else if(eventMessageText === "location") {
    msg = {
      "type": "location",
      "title": "I GEAR GEEK",
      "address": "Malada space",
      "latitude": 18.7777264,
      "longitude": 98.9513933
    }
  }else if(eventMessageText === "apply jobs") {
    msg = {
      "type": "text",
      "text": "jobs.igeargeek.com"
    }
  }
  return client.replyMessage(event.replyToken, msg)
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})