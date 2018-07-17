var gtw = angular.module('starter');
gtw.controller('historyDetailCtrl', function ($ionicSlideBoxDelegate,$stateParams,$scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter) {

  // $scope.accounts = Gtbank.getAccountInfo();
  // $scope.count = {index:0};

  $scope.accId = $stateParams.acctId;
  $scope.pageId = $stateParams.pageId;
  $scope.historyDetail = Gtbank.getHistoryDetail();
  $scope.currency = Gtbank.getAccountInfo()[$scope.accId].CURRENCY;

});
