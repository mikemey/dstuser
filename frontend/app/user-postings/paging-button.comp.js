import angular from 'angular'

export default angular
  .module('user.postings.paging.more', [])
  .component('pagingMoreButton', {
    template: require('./paging-button.comp.html'),
    controllerAs: 'ctrl',
    bindings: { onBtnClick: '&', from: '<', to: '<', total: '<' }
  })
