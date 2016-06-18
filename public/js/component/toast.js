/* eslint-disable */
(function(angular) {
  'use strict';
function ToastController($scope, $element, $attrs) {
  var ctrl = this;

  ctrl.close = function(hero, prop, value) {

  };
}

angular.module('commentForest').component('toast', {
  templateUrl: 'js/component/toast.html',
  controller: ToastController,
  bindings: {
    type: '=',
    msg: '='
  }
});
})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
