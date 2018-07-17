var gtw = angular.module('starter');
gtw.controller('LoginCtrl', function ($scope,$state,$ionicPush,ACTION_URLS,Gtbank,CallService,UtilityService,$localStorage,$cordovaDevice,$ionicPlatform) {

$scope.$on('$ionicView.beforeEnter', function () {

$ionicPlatform.ready(function () {

  document.addEventListener("deviceready", function () {
  var device = $cordovaDevice.getDevice();
var did = device.uuid || null;
  //var did= '123456';
  Gtbank.setUuid(did);
  Gtbank.setDevice(device);
  });

try {
  if (!$localStorage.deviceToken) {
    $ionicPush.register().then(function(t) {
        return $ionicPush.saveToken(t);
      }).then(function(t) {
        $localStorage.deviceToken= t.token;
     });
  }
} catch (e) {
  console.log(e);
}

  $scope.pinOptionSelected= function(){
    $state.go('indemnity', {useToken:0});
    cancelAuthorization();
  }
  $scope.enableAuthorization = function(){
    UtilityService.showModal('option_dialog.html', $scope);
  };

  $scope.tokenOptionSelected = function(){
    Gtbank.setUseToken(0);
    $state.go('switch-token', {useToken:1});
    cancelAuthorization();
  };

  var cancelAuthorization = function(){
    $scope.modal.hide();
  };

  $scope.form = {
    data:{
      Uuid: Gtbank.getUuid() || null,
     // Uuid: '123456',
      Platform: Gtbank.getDevice().platform || null,
      Model: Gtbank.getDevice().model || null,
      Manufacturer: Gtbank.getDevice().manufacturer || null,
      DeviceToken: $localStorage.deviceToken || "",
      OtherParams:undefined
    },
    Others:{
      UserId: $localStorage.gtworldUsername || undefined,
      Password: undefined
    }
   }

     $scope.login = function () {
       document.activeElement.blur();
       if (!$scope.form.Others.UserId || !$scope.form.Others.Password) {
         UtilityService.showErrorAlert("Please fill input field correctly.");
       }
        else {
          $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);
          console.log($scope.form.data);
         Gtbank.wait(true);
         CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.LOGIN)
           .then(function (response) {
             Gtbank.wait(false);
             console.log(response);
             $scope.form.hasOldPassword = false;
             $scope.form.OldPassword = $scope.form.Others.Password;
             Gtbank.setData($scope.form);

            var res = angular.fromJson(angular.fromJson(response.data));
             if (res.StatusCode == 0) {
               if (angular.fromJson(res.Message).CODE == '2000') {
                 Gtbank.setResCode(2000);
                 Gtbank.setUserId($scope.form.Others.UserId);
                 $state.go("device-authorization");
               }
               else if (angular.fromJson(res.Message).CODE == '2002') {
                 Gtbank.setResCode(2002);
                 Gtbank.setUserId($scope.form.Others.UserId);
                 $state.go("terms-declined");
               }
               else if (angular.fromJson(res.Message).CODE == '2001') {
                 Gtbank.setResCode(2001);
                 Gtbank.setUserId($scope.form.Others.UserId);
                 $state.go("device-authorization");
               }
               else if (angular.fromJson(res.Message).PWD_FLAG == '1') {
                 //$scope.form.Others.Password = "";
                 $scope.form.hasOldPassword = true;
                 Gtbank.setData($scope.form);
                 var data = angular.fromJson(res.Message);
                 Gtbank.setBvn(data.BVN);
                 Gtbank.setUserId(data.USERID);
                 Gtbank.setUseToken(data.USETOKEN);
                 $localStorage.gtworldUsername = $scope.form.Others.UserId;
                 Gtbank.setAccountInfo(data.ACCOUNTS.ACCOUNT);
                 $state.go("change-password");
               }else {
                 $scope.form.Others.Password = "";
                 var data = angular.fromJson(res.Message);
                 Gtbank.setBvn(data.BVN);
                 Gtbank.setUserId(data.USERID);
                 Gtbank.setUseToken(data.USETOKEN);
                 $localStorage.gtworldUsername = $scope.form.Others.UserId;
                 Gtbank.setAccountInfo(data.ACCOUNTS.ACCOUNT);
                 $state.go("dashboard");
               }
             }
              else {
                   Gtbank.wait(false);
                   UtilityService.showErrorAlert(res.Message);
                   $scope.form.Others.Password = "";
             }
           }, function (reason) {
             console.log(reason);
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
             $scope.form.Others.Password = "";
           });
       }
   };
 });
});
});
