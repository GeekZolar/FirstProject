var gtw = angular.module('starter');
gtw.controller('billsHistoryCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {

  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      HistoryType: "Bills Payment",
    }
  }

            Gtbank.wait(true);
            console.log($scope.form.data);
            CallService.doPost($scope.form.data, ACTION_URLS.BILLS_HISTORY)
                .then(function (response) {
                    var res = angular.fromJson(angular.fromJson(response.data));
                    if (res.StatusCode != 0) {
                      Gtbank.wait(false);
                        UtilityService.showErrorAlert(res.Message);
                    } else {
                      Gtbank.wait(false);
                        var data = angular.fromJson(res.Message);
                        $scope.billsHistory = data;
                    }
                }, function(reason) {
                  Gtbank.wait(false);
                  UtilityService.showErrorAlert('Error communicating with host, please try again later.');
                });
});
