import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './karma.comp.css'

const karmaCtrl = function ($scope) {
  this.$onChanges = () => {
    $scope.model = this.postings.reduce((sums, post) => {
      sums.pos += post.rating.pos
      sums.neg += post.rating.neg
      return sums
    }, { pos: 0, neg: 0 })
  }

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
