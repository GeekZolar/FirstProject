var starter = angular.module('starter');
starter.service('UtilityService', function (Gtbank,USEFUL_CNSTS,$timeout, $rootScope, $ionicLoading, $cordovaDialogs, $ionicModal, $cordovaVibration, $cordovaInAppBrowser, USEFUL_CNSTS) {
    var UtilityService = {};


    UtilityService.wait = function (show) {
        if (show)
            $(".spinner").show();
        else
            $(".spinner").hide();
    };

    UtilityService.showErrorAlert = function (txtMessage) {
          document.addEventListener("deviceready", function () {
              $cordovaDialogs.alert(txtMessage, 'Alert', 'Ok');
              $cordovaVibration.vibrate(300);
          }, false);
    };

      UtilityService.showSuccessAlert = function (txtMessage) {
          document.addEventListener("deviceready", function () {
              $cordovaDialogs.alert(txtMessage, 'Alert', 'Ok');
          }, false);
      };

      UtilityService.showConfirmAlert = function (msg,title,confirm,dConfirm) {
        return $cordovaDialogs.confirm(msg, title, [confirm, dConfirm]);
      };

      UtilityService.openInAppBrowser = function(url){
        if (ionic.Platform.isIOS()) {
          $cordovaInAppBrowser.open(url, '_blank', {location: 'no',toolbar: 'yes',zoom: 'yes'});
        } else{
          window.open(encodeURI(url), '_blank', 'location=yes,EnableViewPortScale=yes,toolbar=no');
        }
      };

      UtilityService.showModal = function (tpl, $scope) {
          var promise;
          $scope = $scope || $rootScope.$new();

          promise = $ionicModal.fromTemplateUrl(tpl, {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function (modal) {
            setTimeout(function () {
                      Gtbank.wait(false)
                  }, 200);
              $scope.modal = modal;
              $scope.modal.show();
              //return modal;
          });

          //var openModal = function () {
          //    $scope.modal.show();
          //};

          var closeModal = function () {
              $scope.modal.hide();
          };

          $rootScope.sessionTimer = setTimeout(function () {
            closeModal();
          }, 120 * 1000);

          $scope.$on('$destroy', function () {
              $scope.modal.remove();
          });

          return promise;
      };

      UtilityService.encryptData = function (data) {
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(USEFUL_CNSTS.ENC_KEY);
        return encrypt.encrypt(JSON.stringify(data));
      };

      UtilityService.isAppConnectedToInternet = function () {

          if (window.Connection) {
              if (navigator.connection.type == Connection.NONE) {
                  document.addEventListener("deviceready", function () {
                      $cordovaDialogs.alert('Internet is disconnected on your device.', 'Alert', 'Ok');
                      $cordovaVibration.vibrate(200);
                  }, false);
                  return false;
              }
              return true;
          }
          return true;
      };

      UtilityService.validateEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
      };

      UtilityService.getFirstThreeCharacters = function( text ){
        if (text ==null) {
          return '';
        }
        if (text == 'GT SPEND2SAVE') {
            text = 'SPEND2SAVE';
        }
        if (text == 'GT TARGET') {
            text = 'TARGET';
        }
        return text.charAt(0)+text.charAt(1)+text.charAt(2);
      };

      UtilityService.validateAuthCode = function(token, $scope){
        if ($scope.form.useToken == 1) {
          if (!$scope.form.Token) {
            UtilityService.showErrorAlert("Please enter a valid Token Code");
            return false;
           }
           if ($scope.form.Token.length < 6) {
             UtilityService.showErrorAlert("Please enter a 6 digit Token");
             return false;
           }
          $scope.form.Others.TokenCode = $scope.form.Token;
          return true;
        }else {

          if (!$scope.form.Token) {
            UtilityService.showErrorAlert("Please enter a valid PIN");
            return false;
           }
           if ($scope.form.Token.length < 4) {
             UtilityService.showErrorAlert("Please enter a 4 digit PIN");
             return false;
           }
           if ($scope.form.Others) {
             $scope.form.Others.TokenCode = $scope.form.Token;
           }else {
             $scope.form.TokenCode = $scope.form.Token;
           }
          return true;
        }
      };


    return UtilityService;
})
