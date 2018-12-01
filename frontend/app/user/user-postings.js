import angular from 'angular'

import './user-postings.css'

const userPostingsCtrl = ($scope) => {
  $scope.status = 'ready'
}

export default angular
  .module('user.postings', [])
  .component('userPostings', {
    template: require('./user-postings.html'),
    controller: ['$scope', userPostingsCtrl]
  })
