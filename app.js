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
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

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

    // Get twitter trending results
    var TRENDS = [];
    var USERS = [];
    var TWEETS = [];
    var finalDataStr = '';
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

        // Get six twitter results per tag
        twit.get('search/tweets', {q : (encodeURIComponent('#') + TRENDS[0] + ' OR ' + encodeURIComponent('#') + TRENDS[1] + ' OR ' + encodeURIComponent('#') + TRENDS[2]),
        result_type : 'popular', count : '48' }, function(error, tweets, response){
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

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
