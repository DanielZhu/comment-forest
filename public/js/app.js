/* eslint-disable */
var app = angular.module('commentForest', ['ngSanitize', 'ngAnimate']);

app.directive('commentScrollWatching', function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind('scroll', function() {
      var scrolledHeight = $('body').scrollTop();
      var viewportHeight = $(window).height();
      var commentListHeight = $('body').height();
      angular.forEach(scope.comments, function(value, key, obj) {
        var commentEl = $('.comment-item[data-id=' + value._id + ']');
        var commentElOffsetTop = commentEl.offset().top;
        var commentElHeight = commentEl.height();
        if (value.hasOwnProperty('new')
          && value.new
          && commentElOffsetTop > scrolledHeight
          && commentElOffsetTop + commentElHeight < scrolledHeight + viewportHeight) {
          // (function(){
            scope.count > 0 && scope.count--;
            scope.updateToastMsg();
            value.new = false;
            scope.$apply();
          // })();
        }
      });
    });
  };
});

app.controller('MainCtrl', ['$scope', '$sce', '$interval', '$http', function($scope, $sce, $interval, $http) {
  var self = this;
  $scope.count = 0;
  $scope.toast = '';
  $scope.shops = [];

  $scope.fetchFresh = function () {
    $http({
      method: 'GET',
      url: '/comments/topsList'
    }).then(function successCallback(response) {
      $scope.comments = response.data.commentList;

      response.data.shops.forEach(function (item) {
        $scope.shops[item._id] = item;
      });
      $scope.count += response.data.commentList.length;
      $scope.updateToastMsg();
      setTimeout(function () {
        $scope.count = 0;
      }, 1500);
      $scope.setupWebSocket();
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  $scope.renderHtml = function(html) {
    return $sce.trustAsHtml(html);
  };

  $scope.newItemNotify = function(newItem) {
    $scope.comments.splice(0, 0, newItem);
  }

  $scope.updateToastMsg = function () {
    $scope.toast = $scope.count + ' new';
  }

  $scope.setupWebSocket = function () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://localhost:3001');

    connection.onopen = function () {
      // connection is opened and ready to use
      console.log('connection is opened and ready to use');
    };

    connection.onerror = function (error) {
      // an error occurred when sending/receiving data
      console.log('an error occurred when sending/receiving data');
    };

    connection.onmessage = function (message) {
      // try to decode json (I assume that each message from server is json)
      try {
        var response = JSON.parse(message.data);
        response.commentList.forEach(function (item, key) {
          item.new = true;
        });

        response.shops.forEach(function (item) {
          $scope.shops[item._id] = item;
        });

        // Remove duplicated items
        var existCommentIds = $scope.comments.map(function (item) {
          return item._id;
        });

        for (var i = response.commentList.length - 1; i >= 0 ; i--) {
          if (existCommentIds.indexOf(response.commentList[i]._id) !== -1) {
            response.commentList.splice(i, 1);
          }
        }

        $scope.comments = [].concat(response.commentList, $scope.comments);

        // 已滚动高度
        var scrolledH = document.body.scrollTop || document.documentElement.scrollTop;
        var listElHeight = $('body').height();

        $scope.count += response.commentList.length;
        $scope.updateToastMsg();
        $scope.$apply();

        var newListElHeight = $('body').height();
        var newScrollTop = newListElHeight - listElHeight + scrolledH;
        $('body').scrollTop(newScrollTop);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }
    };
  }
  $scope.fetchFresh();
}]);
