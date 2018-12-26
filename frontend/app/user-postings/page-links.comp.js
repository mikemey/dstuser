import angular from 'angular'

import './page-links.comp.css'

const pageLinksCtrl = function ($scope) {
  this.$onChanges = () => {
    $scope.model.postingsPerPage = this.postingsPerPage
    $scope.model.pageCallback = this.onPageClick
    calculateLinkBar(this.postingCount)
  }

  $scope.model = {
    pageCallback: null,
    postingsPerPage: null,
    linkbar: null,
    currentPageIx: 0
  }

  const calculateLinkBar = postingCount => {
    const pages = Math.ceil(postingCount / $scope.model.postingsPerPage)
    $scope.model.linkbar = Array.from({ length: pages }).map((_, ix) => ix)
  }

  $scope.showPage = pageIx => {
    $scope.model.currentPageIx = pageIx
    const offset = pageIx * $scope.model.postingsPerPage
    $scope.model.pageCallback({ offset })
  }
}

export default angular
  .module('user.postings.pagelinks', [])
  .component('pageLinks', {
    template: require('./page-links.comp.html'),
    controller: ['$scope', pageLinksCtrl],
    bindings: { onPageClick: '&', postingCount: '<', postingsPerPage: '<' }
  })
