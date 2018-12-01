import angular from 'angular'

import './user-postings.css'

function userPostingsCtrl ($scope) {
  $scope.status = 'ready'
}

export default angular
  .module('user.postings', [])
  .component('userPostings', {
    template: require('./user-postings.html'),
    controller: ['$scope', userPostingsCtrl]
  })
