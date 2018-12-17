import angular from 'angular'
import ngWebSocket from 'angular-websocket'

const karmaCtrl = function ($scope, $websocket, $window) {
  this.$onChanges = () => loadKarma(this.userId, this.postings)

  $scope.model = {
    message: '',
    karma: {
      pos: ['lala', 'user2'],
      neg: ['user3']
    }
  }

  const loadKarma = (userId, postings) => {
    const postingIds = postings.map(post => post.postingId)
    const loc = $window.location
    const websocketUrl =
      (loc.protocol === 'https:' ? 'wss://' : 'ws://') +
      loc.host +
      '/dstuws/karma/' +
      userId

    const ws = $websocket(websocketUrl)
    ws.onOpen(() => {
      ws.send(JSON.stringify(postingIds))
    })

    ws.onMessage(msgEvent => {
      $scope.model.karma = JSON.parse(msgEvent.data)
    })

    ws.onError(errorEv => { $scope.model.message = errorEv.data })
  }
}

export default angular
  .module('user.karma', [ngWebSocket.name])
  .component('karmaPoints', {
    template: require('./karma.comp.html'),
    controller: ['$scope', '$websocket', '$window', karmaCtrl],
    bindings: {
      userId: '<',
      postings: '<'
    }
  })
