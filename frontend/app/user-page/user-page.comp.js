import angular from 'angular'

import './user-page.comp.css'

const DISABLED = 'disabled'

const userPageCtrl = function ($scope, $websocket, $location, $routeParams, $window, wsurl) {
  this.$onDestroy = () => {
    if ($scope.ws) $scope.ws.close()
  }

  $scope.ws = null
  $scope.model = {
    userId: null,
    content: null,
    loading: false,
    errorMessage: null,
    filter: ''
  }

  $scope.search = () => {
    $location.url('/search/' + $scope.model.userId)
  }

  const loadUserData = () => {
    if ($routeParams.userId) {
      $scope.model.loading = true
      $scope.model.userId = $routeParams.userId

      const websocketUrl = wsurl + '/postings/' + $scope.model.userId
      $scope.ws = $websocket(websocketUrl)

      $scope.ws.onMessage(msgEvent => {
        const response = JSON.parse(msgEvent.data)
        if (response.error) {
          $scope.model.errorMessage = response.error
        } else {
          updateContent(response)
        }
      })

      $scope.ws.onClose(() => {
        $scope.model.loading = false
      })

      $scope.ws.onError(errorEv => { $scope.model.message = errorEv.data })
    }
  }

  let first = true
  const updateContent = partial => {
    if (first) {
      first = false
      $scope.model.content = partial
      $scope.model.content.partsLoaded = 1
      updateFilterEnabled()
    } else {
      $scope.model.content.postings = $scope.model.content.postings.concat(partial.postings)
      $scope.model.content.partsLoaded += 1
    }
  }

  const updateFilterEnabled = () => {
    if ($scope.model.content) {
      const uidFields = $window.document.querySelectorAll('input[id^="filter-"]')
      uidFields.forEach(field => field.removeAttribute(DISABLED))
    }
  }

  const focusUserIdField = () => {
    const uidFields = $window.document.querySelectorAll('input[id^="userId-"]')
    uidFields.forEach(field => {
      const style = $window.getComputedStyle(field)
      if (style.display !== 'none') {
        field.focus()
      }
    })
  }

  focusUserIdField()
  return loadUserData()
}

export default angular
  .module('user.page', [])
  .component('userPage', {
    template: require('./user-page.comp.html'),
    controller: ['$scope', '$websocket', '$location', '$routeParams', '$window', 'wsurl', userPageCtrl]
  })
