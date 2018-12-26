import angular from 'angular'

import postingsWall from './postings-wall.comp'
import postingRating from './posting-rating.comp'
import pageLinks from './page-links.comp'

export default angular.module('user.postings', [
  postingsWall.name,
  postingRating.name,
  pageLinks.name
])
