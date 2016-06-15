/* eslint-disable fecs-indent */
var express = require('express');
var router = express.Router();

var DpShopCommentModel = require('../lib/model/DpShopCommentModel');
// var nuomi = require('../lib/nuomi');

/* GET users listing. */
router.get('/', function (req, res, next) {
  var promise = DpShopCommentModel.findLatestByLimit();
  promise.addBack(function (err, docs) {
    res.send(JSON.stringify(docs));
  });
});

/* GET users listing. */
// router.get('/nuomi', function (req, res, next) {
//   nuomi();
//   res.send('respond with a resource');
// });

// router.post('/', function (req, res) {
//   res.send('Got a POST request');
// });

// router.put('/spider', function (req, res) {
//   res.send('Got a PUT request at /spider');
// });

// router.delete('/spider', function (req, res) {
//   res.send('Got a DELETE request at /spider');
// });

module.exports = router;
