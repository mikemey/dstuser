import angular from 'angular'

import './user-postings.css'

const userPostingsCtrl = ($scope, $http, $location, $routeParams) => {
  $scope.status = 'ready'
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
          $scope.model.loading = false
        })
    }
  }
  return loadUserData()
}

export default angular
  .module('user.postings', [])
  .component('userPostings', {
    template: require('./user-postings.html'),
    controller: ['$scope', '$http', '$location', '$routeParams', userPostingsCtrl]
  })
