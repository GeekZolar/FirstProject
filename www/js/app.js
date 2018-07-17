// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.cloud','ngStorage','ngCordova','angularMoment','ngResource','ngIdle','ionic.ion.imageCacheFactory','fcsa-number','jtt_instagram','ngCordovaOauth','ngTwitter'])

    .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom'); // other values: top
        $ionicConfigProvider.views.swipeBackEnabled(false);//disable swipe to back
        //$ionicConfigProvider.views.maxCache(0);
    }])


    .config( function ($ionicCloudProvider) {

      $ionicCloudProvider.init({
        "core": {
          "app_id": "26f688d3"
        },
        "push": {
          "sender_id": "359848636384",
          "pluginConfig": {
            "ios": {
              "badge": true,
              "sound": true
            },
            "android": {
              "iconColor": "#343434"
            }
          }
        }
      });
    })

    .config(function (IdleProvider, KeepaliveProvider) {
        IdleProvider.idle(3 * 60);
        IdleProvider.timeout(3 * 60);
        KeepaliveProvider.interval(3 * 60);

    })

    .run(function (Idle, Gtbank, $rootScope, $state, $location, UtilityService, $ionicHistory, $ionicPlatform, $cordovaDialogs) {

        $ionicPlatform.ready(function () {
          $rootScope.pageHeight = window.innerHeight - 65;

          if (ionic.Platform.isAndroid()) {
                $ionicPlatform.registerBackButtonAction(function() {
                  $cordovaDialogs.confirm('Are you sure you want to exit the application?', 'Quit', ['Yes','No'])
                    .then(function(buttonIndex) {
                      // no button = 0, 'OK' = 1, 'Cancel' = 2
                      var btnIndex = buttonIndex;
                      if (btnIndex == 1) {
                        ionic.Platform.exitApp();
                      }
                      if (btnIndex == 2) {
                        return;
                      }
                    });
                  }, 100);
            }
            Idle.watch();
            $rootScope.$on('IdleTimeout', function () {
                if ($location.path() == "/login" ||$location.path() == "/gl-login") {
                    Idle.unwatch();
                    console.log('i am not watching');
                }
                else {
                    Gtbank.wait(false);
                    $state.go('login');
                    UtilityService.showErrorAlert('Session timeout, please re-login.');
                }
            });
            $rootScope.$on('IdleStart', function () {
              console.log("idle starts");
            });

            $rootScope.$on('IdleEnd', function () {
              console.log("idle Ends");
            });

              //Ionic Push Notification line of code

           $rootScope.$on('cloud:push:notification', function(event, data) {

            var msg = data.message;
            $cordovaDialogs.alert( msg.text , msg.title , 'Ok' );

            if (!$localStorage.pushData) {
                $localStorage.pushData = [];
            }else {
                id = $localStorage.pushData.length;
            }
            var newMessage = {id: id, title: msg.title, msg: msg.text, date: UtilityService.getLoginDateTime()};
            $localStorage.pushData.push(newMessage);

          });
        })
    })

    .run(function ($localStorage, $timeout, $state, $rootScope, $location, $cordovaLocalNotification, $ionicPlatform, $cordovaDevice, $cordovaPush, $cordovaToast, $cordovaSplashscreen, $cordovaDialogs, $cordovaMedia, UtilityService, Gtbank) {

        $ionicPlatform.ready(function () {
          document.addEventListener("deviceready", function(){

            setTimeout(function () {
                      $cordovaSplashscreen.hide()
                  }, 200);
          }, false);

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                //cordova.plugins.Keyboard.disableScroll(false);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
                //StatusBar.styleLightContent();
            }
         });
    })

    // .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {
    //
    //     OpenFB.init('1669166053383977');
    //
    //     // $ionicPlatform.ready(function () {
    //     //     if (window.StatusBar) {
    //     //         StatusBar.styleDefault();
    //     //     }
    //     // });
    //
    //     $rootScope.$on('$stateChangeStart', function(event, toState) {
    //         if (toState.name !== "facebooklogin" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
    //             $state.go('facebooklogin');
    //             event.preventDefault();
    //         }
    //     });
    //
    //     $rootScope.$on('OAuthException', function() {
    //         $state.go('facebooklogin');
    //     });
    //
    // })
