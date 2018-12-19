import angular from 'angular'

import './user-page.comp.css'

const DISABLED = 'disabled'

const userPageCtrl = ($scope, $websocket, $location, $routeParams, $window, wsurl) => {
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
      const ws = $websocket(websocketUrl)

      ws.onMessage(msgEvent => {
        const response = JSON.parse(msgEvent.data)
        if (response.error) {
          $scope.model.errorMessage = response.error
        } else {
          $scope.model.content = response
        }
      })

      ws.onClose(() => {
        updateFilterEnabled()
        focusField()
        $scope.model.loading = false
      })

      ws.onError(errorEv => { $scope.model.message = errorEv.data })
    }
  }

  const updateFilterEnabled = () => {
    const uidFields = $window.document.querySelectorAll('input[id^="filter-"]')
    uidFields.forEach(field => {
      if ($scope.model.content) {
        field.removeAttribute(DISABLED)
      }
    })
  }

  const focusField = () => {
    const selectField = $scope.model.content && $scope.model.content.postings
      ? 'input[id^="filter-"]'
      : 'input[id^="userId-"]'
    const uidFields = $window.document.querySelectorAll(selectField)
    uidFields.forEach(field => {
      const style = $window.getComputedStyle(field)
      if (style.display !== 'none') {
        field.focus()
      }
    })
  }

  return loadUserData()
}

export default angular
  .module('user.page', [])
  .component('userPage', {
    template: require('./user-page.comp.html'),
    controller: ['$scope', '$websocket', '$location', '$routeParams', '$window', 'wsurl', userPageCtrl]
  })
