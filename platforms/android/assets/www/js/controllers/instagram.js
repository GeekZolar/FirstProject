var starter = angular.module('starter');
starter.controller('InstaCtrl', function($scope, instagramFactory,$ionicPlatform,$cordovaOauth) {
  var instagramKey = 'STORAGE.INSTAGRAM.KEY';
  var myToken = '';
  var clientId ='37ff57a8fed544858173fb49ff4621a7';
  var appScope = [];
  var options = {};
    // $ionicPlatform.ready(function() {
    myToken = JSON.parse(window.localStorage.getItem(instagramKey));
    console.log(myToken);
    if (myToken === '' || myToken === null) {
        $cordovaOauth.instagram(clientId, appScope, options).then(function (succ) {
          console.log(succ);
        myToken = succ;
        console.log('I am here');
        window.localStorage.setItem(twitterKey, JSON.stringify(succ));
        $scope.showHomeTimeline();
      }, function(error) {
        console.log(error);
      });
    } else {
    //  $twitterApi.configure(clientId, clientSecret, myToken);
      $scope.showHomeTimeline();
    }
    // });
    var _access_token = '<YOUR_ACCESS_TOKEN>';

    // user id converter: http://jelled.com/instagram/lookup-user-id
    instagramFactory.getUserById({
        userId:"416104304",
        access_token:_access_token,
    }).then(function(_data){
        console.info("user by id", _data);
    });

    // user id converter: http://jelled.com/instagram/lookup-user-id
    instagramFactory.getMediaFromUserById({
        userId:"416104304",
        access_token:_access_token,
    }).then(function(_data){
        console.info("media from user by id", _data);
    });

    instagramFactory.getMediaByTag({
        tag:"camping",
        count:20,
        access_token:_access_token,
    }).then(function(_data){
        console.info("media by tag", _data);
    });

    instagramFactory.getMediaFromLocationById({
        locationId:"24245",
        access_token:_access_token,
    }).then(function(_data){
        console.info("media from location by id", _data);
    });

    instagramFactory.getMediaByCoordinates({
        lat:"48.097919294",
        lng:"11.55422501",
        distance:5000,
        count:20,
        access_token:_access_token,
    }).then(function(_data){
        console.info("media from coordinates", _data);
    });

});
