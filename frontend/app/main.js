import angular from 'angular'
import ngRoute from 'angular-route'
import 'bootstrap/dist/css/bootstrap.css'

import userModule from './user/user.module'

import main from './main.html'
import './main.css'

const MODULE_NAME = 'dstu'

const mainRouter = $routeProvider => $routeProvider
  .when('/search', {
    template: main
  })
  .when('/search/:userId', {
    template: main
  })
  .otherwise({ redirectTo: '/search' })

angular
  .module(MODULE_NAME, [
    ngRoute,
    userModule.name
  ])
  .factory('wsurl', ['$window', $window => {
    const loc = $window.location
    return (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host + '/dstu/ws'
  }])
  .config(['$routeProvider', mainRouter])

export default MODULE_NAME
