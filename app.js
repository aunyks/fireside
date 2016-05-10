const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      dotenv       = require('dotenv').config(),
      Twitter      = require('twitter'),
      Instagram    = require('instagram-wrapi'),
      env          = process.env;
      
var twit = new Twitter({
    consumer_key: env.TWITTER_CONSUMER_KEY,
    consumer_secret: env.TWITTER_CONSUMER_SECRET,
    access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET,
});

var ig = new Instagram(env.INSTAGRAM_ACCESS_TOKEN);

let server = http.createServer(function (req, res) {
  let url = req.url;
  if (url == '/') {
    url += 'index.html';
  }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url.indexOf('/info/') == 0) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else if(url == '/api' || url == '/api/'){
    
    // Get twitter trending results
    var tags = [];
    twit.get('trends/place', {id : '2357011'}, function(error, trends, response){
      // Find out how to store tags, may require json parsing
    });
    
    // Store trending tags
    
    // Search tags in ig and twitter
    
    // Get three twitter results
    
    // Get three ig results
    
    // Get 
    
    // Store in (ig, twit, ig, twit, ig, twit) order
    
  }else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        let ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', 'text/' + ext);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
