import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './posting-rating.css'

const ratingCtrl = function ($scope, $websocket) {
  this.$onInit = () => loadRating(this.postingId)

  $scope.model = {
    message: '',
    rating: null
  }

  const loadRating = postingId => {
    const ws = $websocket(`ws://localhost:7001/dstuws/rating/${postingId}`)

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
    controller: ['$scope', '$websocket', ratingCtrl],
    bindings: {
      postingId: '@'
    }
  })
