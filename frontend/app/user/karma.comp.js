import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './karma.comp.css'

const karmaCtrl = function ($scope) {
  this.$onInit = () => this.postings.forEach(post => {
    $scope.model.pos += post.rating.pos
    $scope.model.neg += post.rating.neg
  })

  $scope.model = {
    pos: 0,
    neg: 0
  }
}

export default angular
  .module('user.karma', [ngWebSocket.name])
  .component('karmaPoints', {
    template: require('./karma.comp.html'),
    controller: ['$scope', karmaCtrl],
    bindings: { postings: '<' }
  })
