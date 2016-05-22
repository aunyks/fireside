const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      Twitter      = require('twitter'),
      Vineapple    = require('vineapple'),
      env          = process.env;

// These prototype aggregations will be used later in the program
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.contains = function(str){
  return this.indexOf(str) != -1;
}

// Set API credentials
var twit = new Twitter({
    consumer_key: env.TWITTER_CONSUMER_KEY,
    consumer_secret: env.TWITTER_CONSUMER_SECRET,
    access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET,
});

var vine = new Vineapple();

// Create application routes
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
  } else if(url == '/twitter' || url == '/twitter/'){

    vine.login('Fireside Project', 'project_fireside', function(error, vineClient){

      if(error)
        console.log('SOMETHING BROKE!');

      vineClient.popular(function(err, response){
        if(err)
          console.log('ANOTHER THING BROKE!');
        console.log(response);
      });

    });

    // Declare/initialize persistent variables
    var TRENDS = [];
    var USERS = [];
    var TWEETS = [];
    var finalDataStr = '';
    var IG = [];

    // This is our main call stack.
    // 1. Get trends from the USA
    // 2. Use Twitter API search to find the 48 most popular tweets related to the trends
    // 3. Get the 48 tweets, parse them, and send them back to the browser
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

        twit.get('search/tweets', {q : (encodeURIComponent('#') + TRENDS[0] + ' OR ' + encodeURIComponent('#') + TRENDS[1] + ' OR ' + encodeURIComponent('#') + TRENDS[2]),
        result_type : 'popular', count : '96' }, function(error, tweets, response){
          if(!error){
            for(var j = 0; j < tweets.statuses.length; j++){
              TWEETS.push(tweets.statuses[j].text);
              USERS.push(tweets.statuses[j].user.screen_name);

              if(j == tweets.statuses.length - 1){
                var finalData = {
                  user: USERS,
                  tweet: TWEETS,
                  trend: TRENDS
                };

                finalDataStr = JSON.stringify(finalData, null, '\t');
                res.writeHead(200, {'Content-Type': 'text/json'});
                res.end(finalDataStr);
              }
            }
          }

        });

      }
    });

  }else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(301, {Location: 'http://fireside-gnash48.rhcloud.com/'});
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

// Begin server!
// If the environment doesnt specify a port then bind to 3000
// If the environment doesnt specify an IP then load to localhost
server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
