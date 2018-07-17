var gtw = angular.module('starter');
gtw.controller('confirmEmailCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService) {

  $scope.message = Gtbank.getData();

});
