import angular from 'angular'

import userPage from './user-page.comp'
import postings from './postings.comp'
import postingRating from './posting-rating.comp'

export default angular.module('user', [
  userPage.name,
  postingRating.name,
  postings.name
])
