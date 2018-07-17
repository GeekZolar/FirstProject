var gtw = angular.module('starter');
gtw.controller('statementCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory,$filter) {

  $scope.utilityService = UtilityService;
  $scope.req = {
    FromDate: new Date(),
    ToDate: new Date()
  };

  $scope.data = {UserId: Gtbank.getUserId()};
  $scope.accounts = Gtbank.getAccountInfo();

  $scope.sendStatement = function() {

       $scope.data.StartDate = $filter("date")($scope.req.FromDate, 'MM-dd-yyyy');
       $scope.data.EndDate = $filter("date")($scope.req.ToDate, 'MM-dd-yyyy');

       if (!$scope.data.StartDate || !$scope.data.EndDate || !$scope.data.SourceAccount) {
         UtilityService.showErrorAlert('Please fill inputs correctly');
         return false;
       }

      Gtbank.wait(true);
      CallService.doPost($scope.data, ACTION_URLS.REQUEST_STATEMENT)
        .then(function (response) {
          console.log(response);
          Gtbank.wait(false);
          var msg = angular.fromJson(response.data);
          if (msg.StatusCode == 0) {
            var data = angular.fromJson(msg.Message);
            UtilityService.showErrorAlert(data.MESSAGE);
          }else {
            UtilityService.showErrorAlert(msg.Message);
          }
        }, function (reason) {
          Gtbank.wait(false);
        });
      }
  });
