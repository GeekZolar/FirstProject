var gtw = angular.module('starter');
gtw.controller('GTCollCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {

  $scope.accounts= Gtbank.getAccountInfo();
});
