import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './posting-rating.css'

const ratingCtrl = function ($scope, $websocket, $window) {
  this.$onInit = () => loadRating(this.postingId)

  $scope.model = {
    message: '',
    rating: null
  }

  const loadRating = postingId => {
    const loc = $window.location
    const websocketUrl =
      (loc.protocol === 'https:' ? 'wss://' : 'ws://') +
      loc.host +
      '/dstuws/rating/' +
      postingId

    const ws = $websocket(websocketUrl)

    ws.onMessage(msgEvent => {
      const ratingResponse = JSON.parse(msgEvent.data)
      $scope.model.rating = ratingResponse.rating
    })
    ws.onError(errorEv => { $scope.model.message = errorEv.data })
  }
}

export default angular
  .module('user.rating', [ngWebSocket.name])
  .component('rating', {
    template: require('./posting-rating.html'),
    controller: ['$scope', '$websocket', '$window', ratingCtrl],
    bindings: {
      postingId: '@'
    }
  })
