 var gtw = angular.module('starter');
gtw.controller('LinkGTBankCardCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService) {
  $scope.data = {
        PhoneNumber: undefined,
        FullPan: undefined,
      }

      $scope.register = function () {
      document.activeElement.blur();
      if (!$scope.data.PhoneNumber || !$scope.data.FullPan) {
        UtilityService.showErrorAlert("Please fill all input fields correctly");
      }
       else {
        Gtbank.wait(true);
        CallService.doPost($scope.data, ACTION_URLS.LINK_ACCOUNT_GTBANKCARD)
          .then(function (response) {
            Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
            var res = angular.fromJson(response.data);
            if (res.StatusCode != 0) {
              Gtbank.wait(false);
              UtilityService.showErrorAlert(res.Message);
            } else {
              Gtbank.wait(false);
              Gtbank.setData(res.Message);
              $state.go("register-email");
            }
          }, function (reason) {
            Gtbank.wait(false);
          });
      }
    }
});
