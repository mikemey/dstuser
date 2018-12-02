import angular from 'angular'

import './user-postings.css'

const userPostingsCtrl = ($scope, $http) => {
  $scope.status = 'ready'
  $scope.model = {
    userId: '',
    content: 'no comments'
  }

  $scope.search = () => {
    return $http.get('/dstuapi/userprofile/' + $scope.model.userId)
      .then(response => ($scope.model.content = response.data))
  }
}

export default angular
  .module('user.postings', [])
  .component('userPostings', {
    template: require('./user-postings.html'),
    controller: ['$scope', '$http', userPostingsCtrl]
  })
