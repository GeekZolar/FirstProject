var starter = angular.module('starter')
starter.factory('AUTH', function (USEFUL_CNSTS) {
    return {
      getBasicAuth: function (user,application) {
        //user credential pulled here are already encrypted
        //so we do a secondary layer encryption again
        var string = application + ':' + user;
        // Encode the String
        var encodedString = btoa(string);
        var auth = 'Basic ' + encodedString;
        return auth;
      },
      getBaAuth: function (user,application) {
        //user credential pulled here are already encrypted
        //so we do a secondary layer encryption again
        var string =  user + ':' + application;
        // Encode the String
        var encodedString = btoa(string);
        return 'Basic ' + encodedString;
      },
      getEncData:function(data){
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(USEFUL_CNSTS.ENC_KEY_GAPS);
        return encrypt.encrypt(data);
      }
    }
});
