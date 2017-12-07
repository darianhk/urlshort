
var express = require('express');
var shortid = require('shortid');
var mongoclient = require('mongodb').MongoClient();
var app = express();
var appurl = "https://url-shrt.glitch.me/id/";
var database;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// take in full url and generate shortened url
mongoclient.connect("mongodb://darianhk:ettinfreak9@ds113046.mlab.com:13046/urlshrtdhk", function(err, db){
  database = db;
})
  
  app.get('/', function (req, res){
  res.sendFile(__dirname + '/views/index.html')
})
  
  

                      
app.get("/new/:longURL(*)", function (req, res) {
  var long = req.params.longURL;
  var id = shortid.generate().slice(0,6);
  var short = appurl + id;
  res.json({original: long, shortened: short});
  database.collection('urlshort').insert({
    original: long,
    shortened: short,
    id: id
  })
  console.log("url generated")
})

  
// redirect to original url based on id
app.get('/id/:id', function(req, res){
  var url = "";
  var obj = database.collection('urlshort').find({
    id: req.params.id
  }).toArray(function(err, data){
    res.redirect(data[0].original)
  });
  console.log("redirecting")
})

// listen for requests :)
app.listen(process.env.PORT, function () {
  console.log('Your app is listening');
})
