
const express = require('express')

var app = express()

// App setup
app
  .get('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    console.log("New req")
    //console.log(req)
    console.log("User IP: " + req["headers"]["x-forwarded-for"])
    console.log("Referrer: " + req["headers"]["referer"])
    console.log("Origin: " + req["headers"]["origin"])
    console.log("------------------------------------------------")
    
    res.redirect(req.query.url)
  })

  .listen('3001', () => {
    console.log('Server now listening on port 3001...')
    console.log("------------------------------------------------")
  })
  .on('error', (error) => {
    console.error(error)
  })
