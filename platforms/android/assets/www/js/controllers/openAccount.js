var gtw = angular.module('starter');
gtw.controller('openAccountCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter) {
  $scope.data = {};
  $scope.req = {
    BirthDate: null
  };
  $scope.val = {
    MobileNo: undefined,
    Bvn:undefined
  };

      $scope.openAccountWithBvn = function (){
        if (!$scope.val.MobileNo || !$scope.val.Bvn){
          UtilityService.showErrorAlert("Please fill Bvn and Mobile Number Fields")
        }
        else{
          Gtbank.wait(true);
          CallService.doPost($scope.val, ACTION_URLS.OPEN_ACCOUNT_WITH_BVN)
            .then(function (response) {
              Gtbank.setResponse(angular.fromJson(response.data));
              var res = angular.fromJson(response.data);
              if (res.Code != 0)
              {
                Gtbank.wait(false);
                $state.go("register-instant");
                UtilityService.showErrorAlert(angular.fromJson(res.Message).ResponseDesc);
              }
              // if (res.Code === -1)
              // {
              //   Gtbank.wait(false);
              //   UtilityService.showErrorAlert(angular.fromJson(res.Message).ResponseDesc);
              //   $state.go("login");
              // }
              else
              {
                Gtbank.wait(false);
                Gtbank.setNewAccountNumber(angular.fromJson(res.Message).AccountNo);
                $state.go("register-instant-opened");
              }
            },function (reason)
            {
              Gtbank.wait(false);
            });
        }
      }

      $scope.openAccount = function () {
        document.activeElement.blur();

        $scope.data.MobileNo = $scope.val.MobileNo;
      if (!$scope.data.FirstName || !$scope.data.LastName || !$scope.req.BirthDate
        ||!$scope.data.Address||!$scope.data.Gender ||!$scope.data.Email ||!$scope.data.MobileNo || !$scope.data.MotherMaiden) {
        UtilityService.showErrorAlert("Please fill all input fields correctly.");
      }
       else {
         request = {Email:$scope.data.Email}
         Gtbank.wait(true);
         CallService.doPost(request, ACTION_URLS.DOES_CUSTOMER_EXIST)
           .then(function (response) {
             Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
             var res = angular.fromJson(response.data);
             if (res.Code == 1000) {

               $scope.data.BirthDate = $filter("date")($scope.req.BirthDate, 'dd/MM/yyyy');

               CallService.doPost($scope.data, ACTION_URLS.OPEN_ACCOUNT)
                 .then(function (response) {
                   Gtbank.setResponse(angular.fromJson(response.data));
                   var res = angular.fromJson(response.data);
                   if (res.Code != 0) {
                     Gtbank.wait(false);
                     UtilityService.showErrorAlert(res.Message);
                   } else {
                     Gtbank.wait(false);
                     Gtbank.setNewAccountNumber(angular.fromJson(res.Message).NUBAN);
                     $state.go("register-instant-opened");
                   }
                 }, function (reason) {
                   Gtbank.wait(false);
                 });
             }
              else {
               Gtbank.wait(false);
               UtilityService.showErrorAlert(res.Message);
             }
           }, function (reason) {
             Gtbank.wait(false);
           });
     }
   }

   $scope.nuban = Gtbank.getNewAccountNumber();

});
