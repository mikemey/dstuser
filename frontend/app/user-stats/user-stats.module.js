import angular from 'angular'

import userStats from './stats.comp'
import karma from './karma.comp'

export default angular.module('user.stats.module', [
  userStats.name,
  karma.name
])
