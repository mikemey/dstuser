import angular from 'angular'

import postingsWall from './postings-wall.comp'
import postingRating from './posting-rating.comp'
import pagingLinks from './paging-links.comp'

export default angular.module('user.postings', [
  postingsWall.name,
  postingRating.name,
  pagingLinks.name
])
