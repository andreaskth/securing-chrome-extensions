// Start file
// npm install ...
// also: npm install hjs
const express = require('express')
//const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

var path = require('path');
var fs = require('fs');

var app = express()
var dir = path.join(__dirname, 'public/images');

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

// App setup
app
  .set('view engine', 'hjs') 
  .get('/', (req, res) => {

    res.render('forumHome', {})
    //stats.getStats(st => {
    //  res.render('forumHome', {user: req.user, error: req.flash('error'), success: req.flash('success'), stats: st})
    //})
  })
  .get('*', function (req, res) {
    console.log("New req")
    //console.log(req)
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
  //.use(express.static(dir))
  //.use(bodyParser.json())
  //.use(bodyParser.urlencoded({extended: false}))

  //.use((req, res, next) => {
  //  console.log(req);
  //  next()
  //})

  .listen('3000', () => {
    console.log('Server now listening on port 3000...')
  })
  .on('error', (error) => {
    console.error(error)
  })
