import angular from 'angular'

import './user-postings.css'

const userPostingsCtrl = ($scope, $http, $location, $routeParams, $window) => {
  $scope.model = {
    userId: null,
    content: null,
    loading: false,
    errorMessage: null
  }

  $scope.search = () => {
    $location.url('/search/' + $scope.model.userId)
  }

  const loadUserData = () => {
    if ($routeParams.userId) {
      $scope.model.loading = true
      $scope.model.userId = $routeParams.userId
      return $http.get('/dstuapi/userprofile/' + $scope.model.userId)
        .then(response => { $scope.model.content = response.data })
        .catch(response => { $scope.model.errorMessage = response.data.error })
        .finally(() => {
          focusField()
          $scope.model.loading = false
        })
    }
  }

  const focusField = () => {
    const uidFields = $window.document.querySelectorAll('input[id^="userId-"]')
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
  .module('user.postings', [])
  .component('userPostings', {
    template: require('./user-postings.html'),
    controller: ['$scope', '$http', '$location', '$routeParams', '$window', userPostingsCtrl]
  })
