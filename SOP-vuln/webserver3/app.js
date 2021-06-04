
const express = require('express')

var app = express()

// App setup
app
  .set('view engine', 'hjs') 
  .get('/', (req, res) => {
    res.render('home', {})
  })

  .listen('3000', () => {
    console.log('Server now listening on port 3000...')
  })
  .on('error', (error) => {
    console.error(error)
  })
