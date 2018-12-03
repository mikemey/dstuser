import angular from 'angular'
import ngRoute from 'angular-route'

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
  .config(['$routeProvider', mainRouter])

export default MODULE_NAME
