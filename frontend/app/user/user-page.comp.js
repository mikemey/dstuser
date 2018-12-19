import angular from 'angular'

import './user-page.comp.css'

const DISABLED = 'disabled'

const userPageCtrl = ($scope, $http, $location, $routeParams, $window) => {
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
      return $http.get('/dstu/api/userprofile/' + $scope.model.userId)
        .then(response => { $scope.model.content = response.data })
        .catch(response => {
          $scope.model.errorMessage = response.data
            ? response.data.error
            : response.message
        })
        .finally(() => {
          updateFilterEnabled()
          focusField()
          $scope.model.loading = false
        })
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
    controller: ['$scope', '$http', '$location', '$routeParams', '$window', userPageCtrl]
  })
