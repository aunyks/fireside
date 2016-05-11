const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      dotenv       = require('dotenv').config(),
      Twitter      = require('twitter'),
      Instagram    = require('instagram-wrapi'),
      env          = process.env;
      
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.contains = function(str){
  return this.indexOf(str) != -1;
}
      
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
    var TRENDS = [];
    var USERS = [];
    var TWEETS = [];
    var IG = [];
    
    twit.get('trends/place', {id : '23424977'}, function(error, trends, response){
      if(!error){
        var data = trends[0];
        
        for(var i = 0; i < 3; i++){
          var strTrend = data.trends[i].name;
          
          if(strTrend.substring(0, 1) != '#')
            strTrend = '#' + strTrend;
            
          if(strTrend.contains(' '))
            strTrend = strTrend.replaceAll(' ','');
            
            TRENDS.push(strTrend);
            console.log(strTrend);
        }
        
        // Get five twitter results per tag
        for(var i = 0; i < TRENDS.length; i++){
          
          twit.get('search/tweets', {q : (encodeURIComponent('#') + TRENDS[i]), 
          result_type : 'popular', count : '5' }, function(error, tweets, response){
            if(!error){
              for(var j = 0; j < tweets.statuses.length; j++){
                TWEETS.push(tweets.statuses[j].text);
                USERS.push(tweets.statuses[j].user.screen_name);
              }
            }
            
            ig.tags.media.recent('spring', function(error, data) {
              if (!error) {
                console.log(data);
              } 
            });
          });
          
        }
        
      }
    });
    
    // Search tags in ig and twitter
    
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
