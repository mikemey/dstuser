import angular from 'angular'
import ngWebSocket from 'angular-websocket'

import './posting-rating.css'

const ratingCtrl = ($scope, $websocket) => {
  $scope.echoServer = {}
  $scope.model = {
    result: 'started',
    message: '',
    count: 3
  }

  const open = () => {
    const ws = $websocket('ws://localhost:7001/dstuws/echo')

    ws.onError(errorEv => {
      $scope.model.result = 'Error'
      console.log(Object.getOwnPropertyNames(errorEv))
      $scope.model.message = errorEv.data
    })

    ws.onOpen(() => {
      $scope.model.result = 'connected'
      sendHello()
    })

    ws.onMessage(msgEvent => {
      $scope.model.result = $scope.model.result + ' - message received'
      messageReceived(msgEvent.data)
    })
    ws.onClose(() => {
      $scope.model.result = $scope.model.result + ' - closed'
    })

    $scope.echoServer = ws
  }

  const sendHello = () => $scope.echoServer.send('hello world')

  const messageReceived = msg => {
    $scope.model.message = msg
    if ($scope.model.count > 0) {
      $scope.model.count = $scope.model.count - 1
      $scope.echoServer.close()
      open()
    } else {
      $scope.echoServer.close()
    }
  }

  return open()
}

export default angular
  .module('user.rating', [ngWebSocket.name])
  .component('rating', {
    template: require('./posting-rating.html'),
    controller: ['$scope', '$websocket', ratingCtrl]
  })
