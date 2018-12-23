import angular from 'angular'
import ngSanitize from 'angular-sanitize'

import './postings.comp.css'
import './section-colors.css'

const POSTINGS_PER_PAGE = 48
const postingsCtrl = function ($scope, $sce, $sanitize) {
  this.$onChanges = () => {
    loadPostings(this.postings)
    setFilter(this.filter)
  }

  $scope.model = {
    allPostings: null,
    visiblePostings: null,
    postingsLimit: POSTINGS_PER_PAGE,
    filter: ''
  }

  const loadPostings = postings => {
    $scope.model.allPostings = addFilterContent(postings)
    filterPostings()
  }

  const setFilter = filter => { $scope.model.filter = filter }

  const addFilterContent = postings => {
    postings.filter(post => !post.filterContent)
      .forEach(post => {
        post.filterContent = `${post.title} ${post.content} ${post.article.title}`.toLowerCase()
      })
    return postings
  }

  $scope.highlight = (text, search) => {
    text = $sanitize(text)
    if (!search) {
      return $sce.trustAsHtml(text)
    }
    search = $sanitize(search)
    return $sce.trustAsHtml(text.replace(
      new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>')
    )
  }

  $scope.showMorePostings = () => {
    $scope.model.postingsLimit += POSTINGS_PER_PAGE
    filterPostings()
  }

  const filterPostings = () => {
    $scope.model.visiblePostings = $scope.model.allPostings
      .filter(post => post.filterContent.includes($scope.model.filter.toLowerCase()))
      .slice(0, $scope.model.postingsLimit)
  }
}

export default angular
  .module('user.postings', [ngSanitize])
  .component('postings', {
    template: require('./postings.comp.html'),
    controller: [
      '$scope', '$sce', '$sanitize', postingsCtrl
    ],
    bindings: {
      postings: '<',
      filter: '<'
    }
  })
