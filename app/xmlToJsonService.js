var fs = require("fs"),
    xml2js = require("xml2js"),

    transform = function(fileName, callback, returnResultFunc) {
        var parser = new xml2js.Parser();
        fs.readFile(__dirname + '/../' + fileName, function(err, data) {
            parser.parseString(data, function (err, result) {
                returnResultFunc(result);
                callback();
            });
        });
    }

exports.transform = transform