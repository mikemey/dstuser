import angular from 'angular'

import userPostings from './user-postings'
import postings from './postings.comp'
import postingRating from './posting-rating.comp'

export default angular.module('user', [
  userPostings.name,
  postingRating.name,
  postings.name
])
