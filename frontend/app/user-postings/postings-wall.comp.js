import angular from 'angular'
import ngSanitize from 'angular-sanitize'

import './postings-wall.comp.css'
import './section-colors.css'

const postingsCtrl = function ($scope, $sce, $sanitize) {
  this.$onChanges = () => {
    loadPostings(this.postings, this.filter)
  }

  $scope.postingsPerPage = 48
  $scope.model = {
    filter: '',
    allPostings: null,
    visiblePostings: null,
    visibleFromIx: 0,
    visibleToIx: $scope.postingsPerPage,
    filteredPostingsCount: 0
  }

  const setFromIx = newFrom => {
    $scope.model.visibleFromIx = Math.max(newFrom, 0)
  }

  const setToIx = newTo => {
    $scope.model.visibleToIx = Math.min(newTo, $scope.model.filteredPostingsCount)
  }

  $scope.$watch('model.filter', () => {
    $scope.model.visibleFromIx = 0
    $scope.model.visibleToIx = $scope.postingsPerPage
  })

  const loadPostings = (postings, filter) => {
    $scope.model.filter = filter
    $scope.model.allPostings = addFilterContent(postings)
    separatePostings()
  }

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

  $scope.showMorePostings = direction => {
    switch (direction) {
      case 'head':
        setFromIx($scope.model.visibleFromIx - $scope.postingsPerPage)
        break
      case 'tail':
        setToIx($scope.model.visibleToIx + $scope.postingsPerPage)
        break
      default: console.log(`direction not recognized: ${direction}`)
        return
    }
    separatePostings()
  }

  $scope.jumpTo = offset => {
    setFromIx(offset)
    setToIx(offset + $scope.postingsPerPage)
    separatePostings()
  }

  const separatePostings = () => {
    const filteredPosts = $scope.model.allPostings
      .filter(post => post.filterContent.includes($scope.model.filter.toLowerCase()))
    $scope.model.filteredPostingsCount = filteredPosts.length
    $scope.model.visiblePostings = filteredPosts.slice($scope.model.visibleFromIx, $scope.model.visibleToIx)
  }
}

export default angular
  .module('user.postings.wall', [ngSanitize])
  .component('postingsWall', {
    template: require('./postings-wall.comp.html'),
    controller: ['$scope', '$sce', '$sanitize', postingsCtrl],
    bindings: { postings: '<', filter: '<' }
  })
