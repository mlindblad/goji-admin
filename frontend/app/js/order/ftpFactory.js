app.factory('ftpFactory', function() {
    "use strict";

    return {
        createFtpObject : function() {
            var JSFtp = require("jsftp");

            var ftp = new JSFtp({
                host: "ftp.e3pl.se",
                port: 3331, // defaults to 21
                user: "149993_39_ex", // defaults to "anonymous"
                pass: "gojibar39" // defaults to "@anonymous"
            });
            return ftp;
        }

    }
});