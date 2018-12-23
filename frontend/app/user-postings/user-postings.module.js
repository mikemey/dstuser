import angular from 'angular'

import postings from './postings.comp'
import postingRating from './posting-rating.comp'

export default angular.module('user-stats', [
  postings.name,
  postingRating.name
])
