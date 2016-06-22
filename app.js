/* eslint-disable fecs-indent */
var express = require('express');
var path = require('path');
var events = require('events');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var comments = require('./routes/comments');
var DpShopCommentModel = require('./lib/model/DpShopCommentModel');
var DpShopModel = require('./lib/model/DpShopModel');
var wsServer = null;
var clients = [];

Array.prototype.unique = function () {
  var newArray = [];

  for (var i = this.length - 1; i >= 0; i--) {
    if (newArray.indexOf(this[i]) === -1) {
      newArray.push(this[i]);
    }
  }

  return newArray;
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var eventEmitter = new events.EventEmitter();

var commentInserted = function commentInserted(commentList) {
  var commentIds = [];
  if (commentList) {
     commentIds = commentList.map(function (m) {
      return m.shopId;
    });
     commentIds = commentIds.unique();
  }

  DpShopModel.findShopsByIds(commentIds).then(function (shops) {
    clients.forEach(function (client) {
      client.sendUTF(JSON.stringify({
        shops: shops,
        commentList: commentList
      }));
    });
  });
};

eventEmitter.on('commentInserted', commentInserted);
eventEmitter.emit('commentInserted');
comments.initEventEmitter(eventEmitter);

app.use('/', routes);
app.use('/comments', comments.router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      // message: err.message,
      message: 'eerrrrr',
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.initSocket = function (wss) {
  wsServer = wss;

  wss.on('request', function (req) {
    console.log(new Date() + ' connection from origin ' + req.origin + '.');

    // check 'request.origin' to make sure that client is connecting from your website
    var connection = req.accept(null, req.origin);

    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;

    connection.on('message', function (msg) {
      if (msg.type === 'utf8') {
        // connection.sendUTF(JSON.stringify({ type:'color', data: 'aaa' }));
      }
    });

    connection.on('close', function (conn) {
      console.log(new Date() + 'Peer ' + conn.remoteAddress + ' disconnected.');
    });
  });

  // start the dianping spider
  var dpSpider = require('./lib/dpSpider');
  dpSpider(eventEmitter);
};

// setInterval(function () {
//   DpShopCommentModel.fetchTops({limited: 3}).then(function (docs) {
//     eventEmitter.emit('commentInserted', docs);
//   });
// }, 1000 * 5);

module.exports = app;
