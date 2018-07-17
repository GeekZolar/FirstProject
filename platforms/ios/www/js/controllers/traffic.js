var gtw = angular.module('starter');

gtw.controller('TrafficCtrl',['$ionicPlatform','Gtbank','$http', '$rootScope', '$scope','$state', '$window','$cordovaGeolocation','$timeout','$cordovaDialogs','UtilityService',
    function($ionicPlatform,Gtbank,$http, $rootScope,$scope,$state, $window,$cordovaGeolocation,$timeout,$cordovaDialogs,UtilityService) {

      $scope.data = {};
      $ionicPlatform.ready(function () {
        document.addEventListener("deviceready", function(){
          if (ionic.Platform.isAndroid()) {
            if (window.cordova) {
                cordova.plugins.diagnostic.isLocationEnabled(function (e) {
                    if (e) {
                        return false;
                    } else {
                        $cordovaDialogs.confirm('Would you like to enable Location Service?', 'Location Service Disabled', ['Yes', 'No'])
                            .then(function (buttonIndex) {
                              Gtbank.wait(false);
                              // no button = 0, 'OK' = 1, 'Cancel' = 2 - on browser
                              // no button = 0, 'OK' = 2, 'Cancel' = 1 - on device
                              var btnIndex = buttonIndex;
                              if (btnIndex == 1) {
                                  cordova.plugins.diagnostic.switchToLocationSettings();
                              }else {
                                  return false;
                              }
                            });
                    }
                }, function () {
                    Gtbank.wait(false);
                    UtilityService.showErrorAlert('Location Service is not enabled');
                });
            }
          }
        }, false);
    });

      $scope.getTrafficMap = function() {

        // GTTraffic
          var options = {timeout: 20000, enableHighAccuracy: true};

          $cordovaGeolocation.getCurrentPosition(options).then(function(position){

              var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              var mapData = new google.maps.Map(document.getElementById("map"), {center: latLng,zoom: 17,disableDefaultUI: true});
              var geocoder = new google.maps.Geocoder;
              var infowindow = new google.maps.InfoWindow;

              geocodeLatLng(geocoder, mapData, infowindow,position.coords.latitude,position.coords.longitude);

              var trafficLayer = new google.maps.TrafficLayer();
              trafficLayer.setMap(mapData);
          });
      }

      function geocodeLatLng(geocoder, map, infowindow, lat, lng) {

              var latlng = {lat: lat, lng: lng};

              geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                  if (results[1]) {
                    map.setZoom(17);
                    var marker = new google.maps.Marker({
                      position: latlng,
                      map: map,
                      animation: google.maps.Animation.DROP
                    });
                    infowindow.setContent(results[1].formatted_address);
                    $scope.data.start = results[1].formatted_address;
                  }
                }
              });
            }

      $scope.initAutocomplete = function (id) {
        var pacInput = document.getElementById(id);
         if (window.google && window.google.maps) {
            var autocomplete = new google.maps.places.Autocomplete((pacInput), {componentRestrictions: {country: 'TZ'}});
        }
       $timeout(function(){
           var predictionContainer = angular.element(document.getElementsByClassName('pac-container'));
           predictionContainer.attr('data-tap-disabled', true);
           predictionContainer.css('pointer-events', 'auto');
           predictionContainer.bind('click', function(){
             document.getElementById(id).blur();
           });
         }, 200);bv
       }

      $scope.search= function () {

         var startAddress = document.getElementById('start-input').value;

         var endAddress = document.getElementById('end-input').value;
             if(!startAddress || !endAddress){
                 UtilityService.showErrorAlert('Please fill all input fields.');
                 return false;
             }

             if(startAddress === endAddress){
                 UtilityService.showErrorAlert('Same origin and destination address. Please enter different addresses and try again');
                 return false;
             }

         Gtbank.wait(true);
         $http.get('http://maps.google.com/maps/api/geocode/json?&address=' + startAddress + '&sensor=false')
           .success(function (mapData) {
             angular.extend($scope, mapData);
             if (mapData.status !== "OK") {
                 Gtbank.wait(false);
                 UtilityService.showErrorAlert('Invalid origin address, please enter a correct address and try again.');
                 return;
             }
             else {
             var originLongitude = mapData.results[0].geometry.location.lng;
             var originLatitude = mapData.results[0].geometry.location.lat;

         $http.get('http://maps.google.com/maps/api/geocode/json?&address=' + endAddress + '&sensor=false')
                .success(function (mapData) {
                  angular.extend($scope, mapData);
                  if (mapData.status !== "OK") {
                      Gtbank.wait(false);
                      UtilityService.showErrorAlert('Invalid destination address, please enter a correct address and try again.');
                      return;
                  }
                  else {
                   var  destLongitude = mapData.results[0].geometry.location.lng;
                   var  destLatitude = mapData.results[0].geometry.location.lat;
                  }

                  if ($window.google && $window.google.maps) {

                        var trafficLayer = new google.maps.TrafficLayer();
                        var directionsService = new google.maps.DirectionsService;
                        var directionsDisplay = new google.maps.DirectionsRenderer;
                         $scope.map = new google.maps.Map(document.getElementById('map'), {
                          zoom: 14,
                          center: {lat: 6.435661, lng: 3.424553},
                          disableDefaultUI: true
                        });
                        trafficLayer.setMap($scope.map);
                        directionsDisplay.setMap($scope.map);
                        //directionsDisplay.setPanel(document.getElementById('directions-panel'));
                        directionsService.route({
                            origin: new google.maps.LatLng(originLatitude, originLongitude),
                            destination: new google.maps.LatLng(destLatitude, destLongitude),
                            travelMode: google.maps.TravelMode.DRIVING

                          }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                              directionsDisplay.setDirections(response);
                              $scope.$apply(function () {
                              });
                            } else {
                              $scope.$apply(function () {
                              });
                            }
                          Gtbank.wait(false);
                          });
                        }
               })
             }
           })
       }

  }])
