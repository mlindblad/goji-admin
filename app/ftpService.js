var JSFtp = require("jsftp"),
    config = require("../config/config"),

    downloadFileUsingFtp = function(fileName, callback) {
        var ftp = new JSFtp({
            host: config.host,
            port: config.port, // defaults to 21
            user: config.user, // defaults to "anonymous"
            pass: config.pass // defaults to "@anonymous"
        });
        ftp.get(fileName, fileName, function(hadErr) {
            if (hadErr) {
                console.error('There was an error retrieving the file.');
            } else {
                console.log('File copied successfully!');
            }
            closeConnection(ftp);
            callback();
        });
    }

function closeConnection(ftp) {
    ftp.raw.quit(function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("Bye!");
    });
}

exports.downloadFileUsingFtp = downloadFileUsingFtp