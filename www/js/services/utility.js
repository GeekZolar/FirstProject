var ctrls = angular.module('starter')
ctrls.service('UtilityServiceGaps',function($localStorage,$ionicLoading, $http, $state, $ionicModal, $cordovaInAppBrowser, $cordovaDialogs, $cordovaVibration, $rootScope, $window) {

      function showErrorAlert(txtMessage) {
          document.addEventListener("deviceready", function () {
              $cordovaDialogs.alert(txtMessage, 'Alert', 'Ok');
              $cordovaVibration.vibrate(300);
          }, false);
      }

      function showSuccessAlert(txtMessage) {
          document.addEventListener("deviceready", function () {
              $cordovaDialogs.alert(txtMessage, 'Success', 'Ok');
              $cordovaVibration.vibrate(300);
          }, false);
      }

      function showConfirmAlert(msg,title,confirm,dConfirm) {
        return $cordovaDialogs.confirm(msg, title, [confirm, dConfirm]);
      }

      var getObjectInArray = function(arrayOfObject,keyName,value)
    {
        var found = 0;
        var count = 0;
        var obj = {};

        while(count < arrayOfObject.length && found == 0)
        {

            if(arrayOfObject[count][keyName] == value)
            {
                obj = arrayOfObject[count];
                found = 1;
            }

            count++;
        }
        return obj;
    }

    var checkAmountToPay = function(arrayOfObject,accNum,amtTocheck)
    {
        var found = 0;
        var count = 0;

        while(count < arrayOfObject.length && found == 0)
        {
            if(arrayOfObject[count]['Nuban'] == accNum)
            {
              var bal = arrayOfObject[count]['AvailableBalance'].trim().replace(/[^0-9\.-]+/g,"");
              if(bal == ".00"){
                bal = 0;
              }
                if(Number(amtTocheck) > Number(bal)){
                    found = 1;
                }
            }
            count++;
        }
        return found;
    }

    function doesValueExistInArray(arrayOfObject,keyName,value)
    {

        var found = 0;
        var count = 0;

        while(count < arrayOfObject.length && found == 0)
        {
                var obj = arrayOfObject[count][keyName].trim();
                var val = value.trim();

                if(obj.toUpperCase() == val.toUpperCase())
                {
                    found = 1;
                }

            count++;
        }
        return found == 1;
    }

        function filterToGetDistinctObject(arrayOfObject,keyName)
        {
            var newArray = [];
            angular.forEach(arrayOfObject,function(value,key){
                newArray.push(value[keyName]);
            })

            var uniqueArray = newArray.filter(function(item,pos){
                return newArray.indexOf(item) == pos;
            })
            var newAr = [];
                var done = [];
            angular.forEach(uniqueArray,function(value,key){
               var found = 0;
                var count = 0;
                while(found == 0)
                {
                    if(done.indexOf(value) == -1)
                    {
                        if(arrayOfObject[count][keyName] == value)
                        {
                            newAr.push(arrayOfObject[count]);
                            found = 1;
                        }
                    }
                    else
                    {
                        found = 1;
                    }
                    count++;
                }
            })

            return newAr;
        }

      var CurrentAppId = -1;

      function setCurrentAppId(appId) {
          CurrentAppId = appId;
      }

      function getCurrentAppId() {
          return CurrentAppId;
      }

      return {
          showErrorAlert: showErrorAlert,
          showSuccessAlert: showSuccessAlert,
          showConfirmAlert: showConfirmAlert,
          setCurrentAppId: setCurrentAppId,
          filterToGetDistinctObject:filterToGetDistinctObject,
          doesValueExistInArray:doesValueExistInArray,
          getCurrentAppId: getCurrentAppId,
          getObjectInArray:getObjectInArray,
          checkAmountToPay: checkAmountToPay,

          getLoginDateTime: function () {
              var loginDateTime = new Date();
              return loginDateTime;
          },
          getAweekAgo: function () {
              var d = moment();
              d.add(-7, 'days');
              return moment(d).format('DD/MM/YYYY');
          },
          getToday: function () {
              var d = moment();
              return moment(d).format('DD/MM/YYYY');
          },
          openInAppBrowser: function(url){
            if (ionic.Platform.isIOS()) {
              $cordovaInAppBrowser.open(url, '_blank', {location: 'no',toolbar: 'yes',zoom: 'yes'});
              } else{
                window.open(encodeURI(url), '_blank', 'location=yes,EnableViewPortScale=yes,toolbar=no');
              }
          },
          getScreenHeight: function () {
              return $window.innerHeight;
          },
          getScreenWidth: function () {
              return $window.innerWidth;
          },
          unique : function(origArr) {
              var newArr = [],
                  origLen = origArr.length,
                  found, x, y;
              for (x = 0; x < origLen; x++) {
                  found = undefined;
                  for (y = 0; y < newArr.length; y++) {
                      if (origArr[x] === newArr[y]) {
                          found = true;
                          break;
                      }
                  }
                  if (!found) {
                      newArr.push(origArr[x]);
                  }
              }
              return newArr;
          },
          isAppConnectedToInternet: function () {
              if (window.Connection) {
                  if (navigator.connection.type == Connection.NONE) {
                      $ionicLoading.hide();
                      return false;
                  }
                  return true;
              }
              return true;
          },
          checkSession: function(){
              if($rootScope.sessionOut == 1 && $rootScope.appId === 1){
                  $state.go('mb-login');
                  showErrorAlert('Session timeout, please re-login.');
              }

              if($rootScope.sessionOut == 1 && $rootScope.appId === 2){
                  $state.go('gl-login');
                  showErrorAlert('Session timeout, please re-login.');
              }
          },
          validateEmail: function(email) {
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(email);
          },
          showModal: function (tpl, $scope) {

                var promise;
                $scope = $scope || $rootScope.$new();

                promise = $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
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

                var timer = setTimeout(function () {
                  closeModal();
                }, 120 * 1000);

                $scope.$on('$destroy', function () {
                    clearTimeout(timer);
                    $scope.modal.remove();
                });

                return promise;
            }
      }



    });
