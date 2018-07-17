var starter = angular.module('starter');
starter.factory('Account', [function() {
    var account = {
        id: null,
        accountNumber: null,
        accountName: null,
        braCode: null,
        cusNum: null,
        };

    var gapsCode = {
        code :null,
        accountToDebit :[],
        accountToCredit: [],
        customerId : null,
        gtbBene: [],
        nipBene:[],
        neftBene:[]
    }


    function clearGaps()
    {
      gapsCode = {
          code :null,
          accountToDebit :[],
          accountToCredit: [],
          customerId : null,
          gtbBene: [],
          nipBene:[],
          neftBene:[]
      }
    }

    function setValueInGaps(key,value)
    {
        gapsCode[key] = value;
    }

    function getValueInGaps(key)
    {
        return gapsCode[key];
    }

    function setAccountToDebit(atd)
    {
        gapsCode.accountToDebit = atd;
    }
    function setAccountToCredit(atc)
    {
        gapsCode.accountToCredit = atc;
    }
    function getAccountToDebit(){
        return gapsCode.accountToDebit;
    }
    function getAccountToCredit(){
        return gapsCode.accountToCredit;
    }

    function setGapsCode(code)
    {
        gapsCode.code = code;
    }

    function getGapsCode(){
        return gapsCode.code;
    }

    var AvailableAirtime = [];
    function setAvailableAirtime(data)
    {
        AvailableAirtime = data;
    }

    function getAvailableAirtime(){
        return AvailableAirtime;
    }

    function startAgain()
    {
        account = {
            id: null,
            accountNumber: null,
            accountName: null,
            braCode: null,
            cusNum: null
        };
    }

    function setAccount(a)
    {
        account.id = a.id;
        account.accountNumber = a.accountNumber;
        account.braCode = a.braCode;
        account.accountName = a.accountName;
        account.cusNum = a.cusNum;
    }

    function getAccount()
    {
        return account;
    }


    var api = {
        startAgain: startAgain,
        setAccount: setAccount,
        getAccount: getAccount,
        setGapsCode:setGapsCode,
        getGapsCode:getGapsCode,
        setAccountToDebit:setAccountToDebit,
        setAccountToCredit:setAccountToCredit,
        getAccountToDebit:getAccountToDebit,
        getAccountToCredit:getAccountToCredit,
        clearGaps:clearGaps,
        setValueInGaps:setValueInGaps,
        getValueInGaps:getValueInGaps,
        setAvailableAirtime:setAvailableAirtime,
        getAvailableAirtime:getAvailableAirtime
    };
    return api;

}]);
