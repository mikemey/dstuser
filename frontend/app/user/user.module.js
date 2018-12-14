import angular from 'angular'

import userPostings from './user-postings'
import postingRating from './posting-rating'

export default angular.module('user', [
  userPostings.name,
  postingRating.name
])
