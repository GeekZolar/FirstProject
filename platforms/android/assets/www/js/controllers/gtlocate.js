var gtw = angular.module('starter');

gtw.controller('GtLocateCtrl',['LocationBased','ACTION_URLS','CallService','Gtbank','$http', '$rootScope', '$scope','$state', '$window','$cordovaGeolocation','$timeout','$cordovaDialogs','UtilityService',
    function(LocationBased,ACTION_URLS,CallService,Gtbank,$http, $rootScope,$scope,$state, $window,$cordovaGeolocation,$timeout,$cordovaDialogs,UtilityService) {

      $scope.data = {};
      $scope.parseFloat = window.parseFloat;

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

      $scope.getMapInit = function() {

        // GTLocate
          Gtbank.wait(true);
          var options = {timeout: 20000, enableHighAccuracy: true};

          $cordovaGeolocation.getCurrentPosition(options).then(function(position){

              var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //  var mapData = new google.maps.Map(document.getElementById("map"), {center: latLng,zoom: 13,disableDefaultUI: true});
              var geocoder = new google.maps.Geocoder;
            //  var infowindow = new google.maps.InfoWindow;

              geocodeLatLng(geocoder,position.coords.latitude,position.coords.longitude);
          });
      };

      function geocodeLatLng(geocoder, lat, lng) {

              var latlng = {lat: lat, lng: lng};

              geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                  if (results[1]) {
                  //  map.setZoom(13);
                  //  infowindow.setContent(results[1].formatted_address);
                    $scope.data.start = results[1].formatted_address;
                    LocationBased.setSearchAddress(results[1].formatted_address);

                    var request = {
                              BranchTypeId: 0,
                              Distance: 10,
                              Latitude: parseFloat(lat),
                              Longitude: parseFloat(lng),
                              TotalNumber: 5
                          }
                          LocationBased.setPageData(request);

                          CallService.doPostWithoutEnc(request, ACTION_URLS.BRANCHES)
                              .then(function (response) {
                                Gtbank.wait(false);
                                  $scope.ResponseMessage = angular.fromJson(response.data);
                                  //$scope.quickSearchPane = false;
                                  for (var i = 0; i < $scope.ResponseMessage.length; i++) {
                                    var dep =0;
                                    var withdrw =0;
                                    for (var j = 0; j < $scope.ResponseMessage[i].Resources.length; j++) {
                                      if ($scope.ResponseMessage[i].Resources[j].ResourceTypeId == 1) {
                                        dep = dep +1;
                                      }
                                    }
                                    for (var j = 0; j < $scope.ResponseMessage[i].Resources.length; j++) {
                                      if ($scope.ResponseMessage[i].Resources[j].ResourceTypeId == 2) {
                                        withdrw = withdrw +1;
                                      }
                                    }
                                    $scope.ResponseMessage[i].Deposit = dep;
                                    $scope.ResponseMessage[i].Withdrawal = withdrw;

                                  }
                                  LocationBased.setSearchResults($scope.ResponseMessage);
                              }, function (reason) {
                                Gtbank.wait(false);
                              });
                  }
                }
              });
            }

      $scope.initAutocomplete = function (id) {
        var pacInput = document.getElementById(id);
         if (window.google && window.google.maps) {
            var autocomplete = new google.maps.places.Autocomplete((pacInput), {componentRestrictions: {country: 'NG'}});
        }
       $timeout(function(){
           var predictionContainer = angular.element(document.getElementsByClassName('pac-container'));
           predictionContainer.attr('data-tap-disabled', true);
           predictionContainer.css('pointer-events', 'auto');
           predictionContainer.bind('click', function(){
             document.getElementById(id).blur();
           });
         }, 200);
       }

      $scope.search= function () {

         var startAddress = document.getElementById('start-input').value;

         if(!startAddress){
             UtilityService.showErrorAlert('Please input a valid address.');
             return false;
         }
         Gtbank.wait(true);
         $http.get('http://maps.google.com/maps/api/geocode/json?&address=' + startAddress + '&sensor=false')
           .success(function (mapData) {
             angular.extend($scope, mapData);
             if (mapData.status !== "OK") {
                 UtilityService.showErrorAlert('Invalid origin address, please enter a correct address and try again.');
                 return;
             }
             else {
             var originLongitude = mapData.results[0].geometry.location.lng;
             var originLatitude = mapData.results[0].geometry.location.lat;
             request = {Longitude:originLongitude,Latitude:originLatitude};
             LocationBased.setPageData(request);
             var latLng = new google.maps.LatLng(originLatitude, originLongitude);
          //   var mapData1 = new google.maps.Map(document.getElementById("map"), {center: latLng,zoom: 13,disableDefaultUI: true});
             var geocoder = new google.maps.Geocoder;
            // var infowindow = new google.maps.InfoWindow;
             geocodeLatLng(geocoder,originLatitude,originLongitude);

             }
           })
       }

      $scope.getDirections = function(sId,objId){

        LocationBased.setTravelMode('DRIVING');
        $state.go("search-directions", {
            searchResultId: sId,
            objIndex: objId
        });

      };

  }])

  gtw.controller('searchDirectionCtrl', function (Gtbank,$scope, $state, $ionicLoading, UtilityService, $stateParams, $window, $timeout, LocationBased) {

        Gtbank.wait(true);
        $scope.objIndex = $stateParams.objIndex;
        $scope.searchResultId = $stateParams.searchResultId;
        $scope.searchResultName = LocationBased.getSearchResults()[$scope.objIndex].Name;
        $scope.searchResultDistance = LocationBased.getSearchResults()[$scope.objIndex].Distance;
        $scope.origin = LocationBased.getSearchAddress();
        $scope.destination = LocationBased.getSearchResults()[$scope.objIndex].Address;

        if ($window.google && $window.google.maps) {
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            directionsDisplay.setPanel(document.getElementById('directions-panel'));

            var selectedMode = LocationBased.getTravelMode();

            directionsService.route({
                origin: new google.maps.LatLng(LocationBased.getPageData().Latitude, LocationBased.getPageData().Longitude),
                destination: new google.maps.LatLng(LocationBased.getSearchResults()[$scope.objIndex].Latitude, LocationBased.getSearchResults()[$scope.objIndex].Longitude),
                travelMode: google.maps.TravelMode[selectedMode]
            }, function (response, status) {
              Gtbank.wait(false);
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    UtilityService.showErrorAlert('Sorry!!! Google failed to load directions.');
                }
            });
        }
      })
