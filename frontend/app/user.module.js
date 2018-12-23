import angular from 'angular'

import userPage from './user-page/user-page.comp'
import userPostings from './user-postings/user-postings.module'
import userStats from './user-stats/user-stats.module'

export default angular.module('user', [
  userPostings.name,
  userStats.name,
  userPage.name
])
