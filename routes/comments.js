/* eslint-disable fecs-indent */
var express = require('express');
var router = express.Router();

var DpShopCommentModel = require('../lib/model/DpShopCommentModel');
var DpShopModel = require('../lib/model/DpShopModel');
// var nuomi = require('../lib/nuomi');
var eventEmitter = null;

router.get('/topsList', function (req, res, next) {
  var filters = [];
  var commentList = [];
  DpShopCommentModel.fetchTops(filters).then(function (docs) {
    var commentIds = [];
    commentList = docs;
    if (docs) {
       commentIds = docs.map(function (m) {
        return m.shopId;
      });
       commentIds = commentIds.unique();
    }

    return DpShopModel.findShopsByIds(commentIds);
  }).then(function (shops) {
    res.send(JSON.stringify({
      shops: shops,
      commentList: commentList
    }));
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

function initEventEmitter(ee) {
  eventEmitter = ee;
}

module.exports = {
  router: router,
  initEventEmitter: initEventEmitter
};
