import angular from 'angular'

import './paging-button.comp.css'

export default angular
  .module('user.postings.paging.more', [])
  .component('pagingMoreButton', {
    template: require('./paging-button.comp.html'),
    controllerAs: 'moreBtnCtrl',
    bindings: { onBtnClick: '&', from: '<', to: '<', total: '<', arrows: '@' }
  })
