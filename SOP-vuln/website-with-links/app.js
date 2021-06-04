
const express = require('express')
const bodyParser = require('body-parser')
var app = express()

// App setup
app
  //.use(express.urlencoded()) // Parse URL-encoded bodies (as sent by HTML forms)
  .use(express.json())
  .set('view engine', 'hjs') 
  .get('/', (req, res) => {
    res.render('home', {})
  })
  .post('/userdata', (req, res) => {
    //console.log(req)
    console.log(req.body)
  })

  .listen('3000', () => {
    console.log('Server now listening on port 3000...')
  })
  .on('error', (error) => {
    console.error(error)
  })
