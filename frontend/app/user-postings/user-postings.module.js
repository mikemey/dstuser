import angular from 'angular'

import postings from './postings.comp'
import postingRating from './posting-rating.comp'

export default angular.module('user.postings.module', [
  postings.name,
  postingRating.name
])
