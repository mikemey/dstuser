import angular from 'angular'

import './user-postings.css'

const userPostingsCtrl = ($scope, $http) => {
  $scope.status = 'ready'
  $scope.model = {
    userId: '',
    content: null,
    loading: false
  }

  $scope.search = () => {
    $scope.model.loading = true
    return $http.get('/dstuapi/userprofile/' + $scope.model.userId)
      .then(response => ($scope.model.content = response.data))
      .finally(() => {
        $scope.model.loading = false
      })
  }
}

export default angular
  .module('user.postings', [])
  .component('userPostings', {
    template: require('./user-postings.html'),
    controller: ['$scope', '$http', userPostingsCtrl]
  })
