var ctrls = angular.module('starter');

    ctrls.constant('UrlConstants', {
            "METHOD_POST": "Post",
            "METHOD_GET": "Get",
            "TIMEOUT_VALUE":30
    })

    // ctrls.constant('USEFUL_CNSTS', {
    //    "ENC_KEY": "MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBpfk0YK6DmR1eGA7vg/xQMz+yVXgHCsnz3juIC8cm69UOWKBzgsVxJHpW+W+7TGllkY9RVzgoJSs41Jbnyr89OWxnek6XfJY2SnSzw8TEEyRICR9zPMX5Qqy/W2dOPY4Fa2IRzxcNprabqDEmQ7+r68UW3tgcgzGzw/iBlVMEeq6uyglssaSLsQ6guu03EPwJdZWHtNfJCDqMXODcdAuMX1ZlGIP3Blc9Vf2wrtfSStxAF/c2AOmk2H2sFVSvJi0QZruVVYCmwTo04EmFHNmDhyKIhRvudQBZHoaFNoBeMAfq2nSLKPoIu+UJnqqabhzPeggnFOqeHXFrh6ogHbf6jXtaIC6qUL6GkeStZxxm0t1bSg9RsiDtF31w6TORiBQY+PRusoZ+sia981kOIRDICpGrQRFSfhb1iuVyUftVZzRQ91M+9M5xbA0dglK2HsvAzKvvuGucZgX8gaN/vr7KiDWmk3315tLrkJw2UF50NQ8j9HHhOoqD3bbfqmnhyg87es8vo5VXGXuUSEtlEEAOO3Z8TO+hVp//FedWHRUSkdZXWUlaGy7QfeYRqMg69kLTtp85Sq4B0GlcNyMJUatWSC3TJA9dXPtFWuPL3qa0uhnjFi6Z0UYbV8OPsJPdjHsO0g6EPzqsm0+131WbCHx2g3+aOc9szJFKNgdThf1u1XwIDAQAB"
    //  })

     ctrls.constant("GAPS",{
        //"BASE_URL":"https://ibank.gtbank.com/GliteMobileSuite/api/",
        "BASE_URL":"http://gtmobile.gtbank.com/liteapi/api/",
        "LOGIN":"authentication/lite-login",
        "ACCOUNT_TO_DEBIT":"liteaccount/account-to-debit",
        "ACCOUNT_TO_CREDIT":"liteaccount/account-to-credit",
        "OWN_ACCOUNT_TRANSFER":"transfer/lite-own-account-transfer",
        "GET_GTB_BENEFICIARY":"beneficiary/lite-gtb-beneficiary",
        "GET_NIP_BENEFICIARY":"beneficiary/lite-nip-beneficiary",
        "GET_NEFT_BENEFICIARY":"beneficiary/lite-neft-beneficiary",
        "ADD_GTB_BENEFICIARY":"beneficiary/lite-add-gtb-beneficiary",
        "DELETE_BENEFICIARY":"beneficiary/lite-delete-beneficiary",
        "GTB_TRANSFER":"transfer/lite-gtb-transfer",
        "ADD_NIP_BENEFiCIARY":"beneficiary/lite-add-nip-beneficiary",
        "ADD_NEFT_BENEFICIARY":"beneficiary/lite-add-neft-beneficiary",
        "NIP_TRANSFER":"transfer/lite-nip-transfer",
        "NEFT_TRANSFER":"transfer/lite-neft-transfer",
        "AVAILABLE_AIRTIME": "liteairtime/lite-available-airtime",
        "AIRTIME_REQUEST":"liteairtime/lite-airtime-request",
        "FEEDBACK":"feedback/add-feedback",
        "BANKS":"banklist/get-banks",
        "GTB_ACCOUNT_NAME":"account/account-name",
        "OTHER_BANK_ACCOUNT_NAME":"namelookup/nip-name-lookup",
        "ACCOUNT_HISTORY":"account/account-history",
        "FORGOT_PASSWORD":"authentication/forgot-password",
        "CHANGE_PASSWORD":"authentication/change-password"
    })
