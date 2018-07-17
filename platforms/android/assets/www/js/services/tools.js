var starter = angular.module('starter')

    starter.factory('ConnectivityService', function ($cordovaDialogs, $cordovaVibration) {
        return {
            isAppConnectedToInternet: function () {

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
            }
        }
    })
