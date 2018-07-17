var starter = angular.module('starter');

starter.service('CallService', function ($http, $q, $rootScope, $timeout,USEFUL_CNSTS,CALL_CONSTANTS,UtilityService) {

  return {
    doPost: function (req, actionUrl) {

          var timeout = $q.defer(), result = $q.defer(), timedOut = false;

         //Encrypt with the public key...
          var encrypt = new JSEncrypt();
          encrypt.setPublicKey(USEFUL_CNSTS.ENC_KEY);
          var data = encrypt.encrypt(JSON.stringify(req));
          var request = {
            AuthCode: data
          }

          $timeout(function () {
                  timedOut = true;
                  timeout.resolve();
              },
              (1000 * 600));

          $http({
              url: CALL_CONSTANTS.URL + actionUrl,
              data: JSON.stringify(request) || null,
              method: CALL_CONSTANTS.METHOD_POST,
              timeout: timeout.promise
          }).then(function (data) {
              result.resolve(data);
          }, function (err) {
              if(err.status == 0){
                result.reject({
                    statusText: 'Server unreacheable, please try again later.'
                });
              }
              if (timedOut) {
                  result.reject({
                      statusText: 'Request took longer than usual. Please try again.'
                  });
              } else {
                  result.reject(err);
              }
              result.reject(err);
          });

          return result.promise;

      },
    doPostWithoutEnc: function (req, actionUrl) {

            var timeout = $q.defer(), result = $q.defer(), timedOut = false;

            $timeout(function () {
                    timedOut = true;
                    timeout.resolve();
                },
                (1000 * 600));

            $http({
                url: CALL_CONSTANTS.URL + actionUrl,
                data: JSON.stringify(req) || null,
                method: CALL_CONSTANTS.METHOD_POST,
                timeout: timeout.promise
            }).then(function (data) {
                result.resolve(data);
            }, function (err) {
                if(err.status == 0){
                  result.reject({
                      statusText: 'Server unreacheable, please try again later.'
                  });
                }
                if (timedOut) {
                    result.reject({
                        statusText: 'Request took longer than usual. Please try again.'
                    });
                } else {
                    result.reject(err);
                }
                result.reject(err);
            });

            return result.promise;

        },
    doBrowseSpinlet: function (opCode) {

                var timeout = $q.defer(), result = $q.defer(), timedOut = false;

                var timestamp = function(){
                    return new Date().getTime();
                }

                $timeout(function () {
                        timedOut = true;
                        timeout.resolve();
                    },
                    (1000 * 600));
                var header =
                {
                    protocol_version: "1.7",
                    imsi:null,
                    imei: "1234567890123456",
                    os: 2,
                    os_version: "11",
                    manufacturer: "Spinlet",
                    model: null,
                    client_version: "1.5.1136",
                    screen_width: 400,
                    screen_height: 400,
                    conf_version: "2",
                    language: null,
                    distributor_id: null,
                    supported_media_types: null,
                    application_id: null,
                    cell_id: null,
                    lac: null,
                    client_timestamp: ""+ timestamp()
                }

                var imageInfo =  {
                    id: 123,
                    requested_width: 300,
                    requested_height: 300
                }

                var operation = {
                    op_code: opCode,
                    image_request:[],
                    id: "0",
                    country: "NG",
                    first_item: 0,
                    item_count: 5,
                    filter_key: 0
                }
                operation.image_request.push(imageInfo);
                var request =
                {
                    header: header,
                    operations: []
                }


                request.operations.push(operation);
                var root = {
                    request : request
                }


                $http({
                    url: "https://demo.spinlet.com/mobile/",
                    data: JSON.stringify(root) || null,
                    method: CALL_CONSTANTS.METHOD_POST,
                    timeout: timeout.promise
                }).then(function (data) {
                    result.resolve(data);
                }, function (err) {
                    if (timedOut) {
                        result.reject({
                            statusText: 'Request took longer than usual. Please try again.'
                        });
                    } else {
                        result.reject(err);
                    }
                    result.reject(err);
                });

                return result.promise;

            },
    doSearchWithIdSpinlet: function (opCode,id) {

                      var timeout = $q.defer(), result = $q.defer(), timedOut = false;
                      var timestamp = function(){
                          return new Date().getTime();
                      }

                      $timeout(function () {
                              timedOut = true;
                              timeout.resolve();
                          },
                          (1000 * 600));
                      var header =
                      {
                          protocol_version: "1.7",
                          imsi:null,
                          imei: "1234567890123456",
                          os: 2,
                          os_version: "11",
                          manufacturer: "Spinlet",
                          model: null,
                          client_version: "1.5.1136",
                          screen_width: 400,
                          screen_height: 400,
                          conf_version: "2",
                          language: null,
                          distributor_id: null,
                          supported_media_types: null,
                          application_id: null,
                          cell_id: null,
                          lac: null,
                          client_timestamp: ""+ timestamp()
                      }

                      var imageInfo =  {
                          id: id,
                          requested_width: 300,
                          requested_height: 300
                      }

                      var operation = {
                          op_code: opCode,
                          image_request:[],
                          id: id+"",
                          country: "NG",
                          first_item: 0,
                          item_count: 30,
                          filter_key: 0
                      }
                      operation.image_request.push(imageInfo);
                      var request =
                      {
                          header: header,
                          operations: []
                      }


                      request.operations.push(operation);
                      var root = {
                          request : request
                      }

                      $http({
                      url: "https://demo.spinlet.com/mobile/",
                      data: JSON.stringify(root) || null,
                      method: CALL_CONSTANTS.METHOD_POST,
                      timeout: timeout.promise
                  }).then(function (data) {
                      result.resolve(data);
                  }, function (err) {
                      if (timedOut) {
                          result.reject({
                              statusText: 'Request took longer than usual. Please try again.'
                          });
                      } else {
                          result.reject(err);
                      }
                      result.reject(err);
                  });

                      return result.promise;

                  },
    doPostWithHeader: function (req, actionUrl) {

                    var timeout = $q.defer(), result = $q.defer(), timedOut = false;

                    $timeout(function () {
                            timedOut = true;
                            timeout.resolve();
                        },
                        (1000 * 600));

                    $http({
                        url: CALL_CONSTANTS.URL + actionUrl,
                        data: null,
                        method: CALL_CONSTANTS.METHOD_POST,
                        headers: {'PushData':JSON.stringify(req)},
                        timeout: timeout.promise
                    }).then(function (data) {
                        result.resolve(data);
                    }, function (err) {
                        if(err.status == 0){
                          result.reject({
                              statusText: 'Server unreacheable, please try again later.'
                          });
                        }
                        if (timedOut) {
                            result.reject({
                                statusText: 'Request took longer than usual. Please try again.'
                            });
                        } else {
                            result.reject(err);
                        }
                        result.reject(err);
                    });

                    return result.promise;

            },
            doOldGtworldPost: function (credentials, actionUrl) {
                      // Encrypt with the public key...
                      var encrypt = new JSEncrypt();
                      encrypt.setPublicKey(USEFUL_CNSTS.ENC_KEY);
                        var encryptedUsr = encrypt.encrypt("1000211");
                        var encryptedPwd = encrypt.encrypt('testing');



                        var timeout = $q.defer(), result = $q.defer(), timedOut = false;

                        // //first check if the app is connected to the internet
                        // if (!UtilityService.isAppConnectedToInternet()) {
                        //     result.reject({statusText: 'Internet is disconnected on your device.'});
                        //     return result.promise;
                        // }

                        //user credential pulled here are already encrypted
                        //so we do a secondary layer encryption again
                        var string = encryptedUsr + ':' + encryptedPwd;
                        // Encode the String
                        var encodedString = btoa(string);
                        var auth = 'Basic ' + encodedString;

                        $timeout(function () {
                                timedOut = true;
                                timeout.resolve();
                            },
                            (1000 * 600));
                        $http({
                            url: CALL_CONSTANTS.MASTERSUITE_URL + actionUrl,
                            data: JSON.stringify(credentials) || null,
                            method: CALL_CONSTANTS.METHOD_POST,
                            headers: {'Authorization': auth},
                            timeout: timeout.promise
                        }).then(function (data) {
                            result.resolve(data);
                        }, function (err) {
                            // $ionicLoading.hide();
                            if (timedOut) {
                                result.reject({
                                    statusText: 'Request took longer than usual. Please try again.'
                                });
                            } else {
                                result.reject(err);
                            }
                            result.reject(err);
                        });

                        return result.promise;

                    },
            doOldGtworldGet: function (credentials, actionUrl) {

                    var timeout = $q.defer(), result = $q.defer(), timedOut = false;
                    // Encrypt with the public key...
                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey(USEFUL_CNSTS.ENC_KEY);
                    var encryptedUsr = encrypt.encrypt("1000211");
                    var encryptedPwd = encrypt.encrypt('testing');
                    // //first check if the app is connected to the internet
                    // if (!UtilityService.isAppConnectedToInternet()) {
                    //     result.reject({statusText: 'Internet is disconnected on your device.'});
                    //     return result.promise;
                    // }

                    //user credential pulled here are already encrypted
                    //so we do a secondary layer encryption again
                    var string = encryptedUsr + ':' + encryptedPwd;
                    // Encode the String
                    var encodedString = btoa(string);
                    var auth = 'Basic ' + encodedString;

                    setTimeout(function () {
                            timedOut = true;
                            timeout.resolve();
                        },
                        (1000 * 600));

                    $http({
                        url: CALL_CONSTANTS.MASTERSUITE_URL + actionUrl,
                        data: JSON.stringify(credentials) || null,
                        method: CALL_CONSTANTS.METHOD_GET,
                        headers: {'Authorization': auth},
                        timeout: timeout.promise
                    }).then(function (data) {
                        result.resolve(data);
                    }, function (err) {
                        // $ionicLoading.hide();
                        if (timedOut) {
                            result.reject({
                                statusText: 'Request took longer than usual. Please try again.'
                            });
                        } else {
                            result.reject(err);
                        }
                    });

                    return result.promise;
                }


    }

})
