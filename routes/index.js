/* eslint-disable */
var express = require('express');
var router = express.Router();

function indexHandler(wsServer) {
    wsServer.on('request', function (req) {
      console.log(new Date() + ' connection from origin ' + req.origin + '.');

      // check 'request.origin' to make sure that client is connecting from your website
      var connection = req.accept(null, req.origin);

      // we need to know client index to remove them on 'close' event
      var index = clients.push(connection) - 1;

      var count = 0;
      setInterval(function () {
        connection.sendUTF(JSON.stringify({count: count}));
        count++;
      }, Math.random() * 1000 * 5);

      connection.on('message', function (msg) {
        if (msg.type === 'utf8') {
          connection.sendUTF(JSON.stringify({ type:'color', data: 'aaa' }));
        }
      });

      connection.on('close', function (conn) {
        console.log(new Date() + 'Peer ' + conn.remoteAddress + ' disconnected.');
      });
    });

}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function (req, res, next) {
  res.render('list');
});

module.exports = router;
