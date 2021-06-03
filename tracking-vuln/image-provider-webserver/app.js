
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')

var path = require('path');
var fs = require('fs');

var app = express()
var dir = path.join(__dirname, 'public');

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

var images = fs.readdirSync('./public/images/');

// App setup
app
  .set('view engine', 'hjs')
  .get('/', (req, res) => {
    var imagePayload = { 
      images : JSON.stringify(images)
    };
    res.render('home', imagePayload)
  }) 
  .get('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("New req")
    //console.log(req)
    console.log("User IP: " + req["headers"]["x-forwarded-for"])
    console.log("Referrer: " + req["headers"]["referer"])
    console.log("Origin: " + req["headers"]["origin"])
    console.log("------------------------------------------------")
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
})

  .listen('3000', () => {
    console.log('Server now listening on port 3000...')
    console.log("------------------------------------------------")
  })
  .on('error', (error) => {
    console.error(error)
  })
