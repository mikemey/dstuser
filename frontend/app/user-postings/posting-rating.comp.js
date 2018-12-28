import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './posting-rating.comp.css'

const ratingCtrl = function ($scope, $websocket, wsurl) {
  this.$onInit = () => loadRating(this.postingId)

  $scope.model = {
    message: '',
    rating: null
  }

  const loadRating = postingId => {
    const websocketUrl = wsurl + '/rating/' + postingId
    const ws = $websocket(websocketUrl)

    ws.onMessage(msgEvent => {
      $scope.model.rating = extractRating(msgEvent.data)
    })
    ws.onError(errorEv => { $scope.model.message = errorEv.data })
  }

  const extractRating = data => {
    const ratingResponse = JSON.parse(data)
    const pos = ratingResponse.pos.map(convertRater)
    const neg = ratingResponse.neg.map(convertRater)
    return { pos, neg }
  }

  const convertRater = rater => {
    if (rater.userId) {
      rater.link = '#!/search/' + rater.userId
    }
    return rater
  }
}

export default angular
  .module('user.posting.rating', [ngWebSocket.name])
  .component('postingRating', {
    template: require('./posting-rating.comp.html'),
    controller: ['$scope', '$websocket', 'wsurl', ratingCtrl],
    bindings: {
      postingId: '@'
    }
  })
