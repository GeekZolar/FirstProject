var gtw = angular.module('starter');
gtw.controller('NotificationsCtrl', function ($localStorage,$cordovaDialogs,$rootScope,$scope) {

  $scope.pushData = {
    obj: $localStorage.pushData
  };

  $scope.deleteInfo = function(id){
    var whatIndex = null;
    angular.forEach($scope.pushData.obj, function(element, index) {
      if (element.id === id) {
         whatIndex = index;
      }
    });
    $scope.pushData.obj.splice(whatIndex, 1);
    $localStorage.pushData.splice(whatIndex, 1);
  }
});
