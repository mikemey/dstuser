import angular from 'angular'
import ngWebSocket from 'angular-websocket'

const statsCtrl = function ($scope) {
  this.$onInit = () => {
    $scope.model.content = this.content()
    $scope.$watch('model.content.partsLoaded', () => {
      $scope.model.loadedPct = $scope.model.content.partsLoaded / $scope.model.content.totalParts * 100
    })
  }

  $scope.model = {
    content: null,
    loadedPct: 0
  }
}

export default angular
  .module('user.stats', [ngWebSocket.name])
  .component('userStats', {
    template: require('./stats.comp.html'),
    controller: ['$scope', statsCtrl],
    bindings: { content: '&' }
  })
