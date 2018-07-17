var starter = angular.module('starter');

starter.service('CallService_Gaps', function (GAPS,$http, $q, $timeout, UrlConstants,AUTH,USEFUL_CNSTS) {

    return {

      doGapsPost: function (actionUrl,data) {

          // Encrypt with the public key...
          var encrypt = new JSEncrypt();
          encrypt.setPublicKey(USEFUL_CNSTS.ENC_KEY_GAPS);
          var req = encrypt.encrypt(JSON.stringify(data));
          var timeout = $q.defer(), result = $q.defer(), timedOut = false;
          $timeout(function () {
                  timedOut = true;
                  timeout.resolve();
              },
              (1000 * 500));
          $http({
              url: GAPS.BASE_URL +""+ actionUrl,
              data: '"'+req+'"',
              method: UrlConstants.METHOD_POST,
              headers: {'Authorization': AUTH.getBaAuth("ttest:test")},
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

        }
      }
});
