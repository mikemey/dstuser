import angular from 'angular'
import ngSanitize from 'angular-sanitize'

import './postings.comp.css'
import './section-colors.css'

const postingsCtrl = function ($scope, $sce, $sanitize) {
  this.$onChanges = () => {
    loadPostings(this.postings)
    setFilter(this.filter)
  }

  $scope.model = {
    postings: null,
    filter: ''
  }

  const loadPostings = postings => { $scope.model.postings = postings.map(addFilterContent) }
  const setFilter = filter => { $scope.model.filter = filter }

  const addFilterContent = post => {
    post.filterContent = `${post.title} ${post.content} ${post.article.title}`.toLowerCase()
    return post
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
