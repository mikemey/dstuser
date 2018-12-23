import angular from 'angular'

import userPage from './user-page.comp'
import userStats from './stats.comp'
import postings from './postings.comp'
import postingRating from './posting-rating.comp'
import karma from './karma.comp'

export default angular.module('user', [
  userPage.name,
  userStats.name,
  postingRating.name,
  postings.name,
  karma.name
])
