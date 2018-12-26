import angular from 'angular'

import postings from './postings.comp'
import postingRating from './posting-rating.comp'
import pageLinks from './page-links.comp'

export default angular.module('user.postings', [
  postings.name,
  postingRating.name,
  pageLinks.name
])
