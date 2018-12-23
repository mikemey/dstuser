import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './stats.comp.css'

const statsCtrl = function ($scope) {
  this.$onInit = () => { $scope.model.content = this.content() }

  $scope.model = {
    content: null
  }
}

export default angular
  .module('user.stats', [ngWebSocket.name])
  .component('userStats', {
    template: require('./stats.comp.html'),
    controller: ['$scope', statsCtrl],
    bindings: { content: '&' }
  })
