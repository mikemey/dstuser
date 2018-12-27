import angular from 'angular'

import './paging-links.comp.css'

const pagingLinksCtrl = function ($scope) {
  this.$onChanges = () => {
    $scope.model.postingsPerPage = this.postingsPerPage
    $scope.model.pageCallback = this.onPageClick
    calculateLinkBar(this.from, this.to, this.postingCount)
  }

  $scope.model = {
    pageCallback: null,
    postingsPerPage: null,
    linkbar: null,
    currentPageIx: 0
  }

  const calculateLinkBar = (from, to, postingCount) => {
    const pages = Math.ceil(postingCount / $scope.model.postingsPerPage)
    $scope.model.linkbar = Array.from({ length: pages }).map((_, ix) => {
      const firstPagePostIx = ix * $scope.model.postingsPerPage
      const isCurrent = firstPagePostIx >= from && firstPagePostIx < to
      return { ix, isCurrent }
    })
  }

  $scope.showPage = pageIx => {
    $scope.model.currentPageIx = pageIx
    const offset = pageIx * $scope.model.postingsPerPage
    $scope.model.pageCallback({ offset })
  }
}

export default angular
  .module('user.postings.paging.links', [])
  .component('pagingLinks', {
    template: require('./paging-links.comp.html'),
    controller: ['$scope', pagingLinksCtrl],
    bindings: {
      onPageClick: '&',
      from: '<',
      to: '<',
      postingCount: '<',
      postingsPerPage: '<'
    }
  })
