//set up
var JSFtp = require("jsftp");
var fs = require("fs");
var xml2js = require("xml2js");
var async = require('async');
var Product = require('./models/product');

var getStockStatus = function(callbackFunc) {
    var stockData = {};
    async.series([
        //Load user to get userId first
        function(callback) {
            var ftp = new JSFtp({
                host: "ftp.e3pl.se",
                port: 21, // defaults to 21
                user: "149993_39_ex", // defaults to "anonymous"
                pass: "gojibar39" // defaults to "@anonymous"
            });
            var str = ""; // Will store the contents of the file
            ftp.get('lagersaldo.xml', 'lagersaldo.xml', function(hadErr) {
                if (hadErr)
                    console.error('There was an error retrieving the file.');
                else
                    console.log('File copied successfully!');
                callback()
            });
        },
        //Load posts (won't be called before task 1's "task callback" has been called)
        function(callback) {
            var parser = new xml2js.Parser();
            fs.readFile('/Users/martin/Dev/src-code/goji-admin/lagersaldo.xml', function(err, data) {
                parser.parseString(data, function (err, result) {
                    stockData = result;
                    callback();
                });
            });
        },
        function(callback) {
            console.log(stockData);
            for (var i=0;i<stockData.lagersaldo.artikel.length;i++) {
                Product.update({'number': stockData.lagersaldo.artikel[i].artnr[0]}, {'$set': {
                    'amountInStock': stockData.lagersaldo.artikel[i].antal[0]
                }}, function(err) {
                    if (err)
                        console.log('error')
                    else
                        console.log('success')
                });
            }
            callbackFunc()
        }
    ]);



//    var data;
//    var ftp = new JSFtp({
//        host: "ftp.e3pl.se",
//        port: 21, // defaults to 21
//        user: "149993_39_ex", // defaults to "anonymous"
//        pass: "gojibar39" // defaults to "@anonymous"
//    });
//    var str = ""; // Will store the contents of the file
//    ftp.get('lagersaldo.xml', 'lagersaldo.xml', function(hadErr) {
//        if (hadErr)
//            console.error('There was an error retrieving the file.');
//        else
//            console.log('File copied successfully!');
//    });
//
//    //var file = fs.readFileSync('/Users/martin/Dev/src-code/goji-admin/lagersaldo.xml', 'utf8');
//    var parser = new xml2js.Parser();
//    fs.readFile('/Users/martin/Dev/src-code/goji-admin/lagersaldo.xml', function(err, data) {
//        parser.parseString(data, function (err, result) {
//            console.log("nisse");
//            return result.lagersaldo;
//        });
//    });
//    console.log("kalle")
};

exports.getStockStatus = getStockStatus


//module.exports = function(app) {
//
//    app.get('/hello', function(req, res){
//        var ftp = new JSFtp({
//            host: "ftp.e3pl.se",
//            port: 21, // defaults to 21
//            user: "149993_39_ex", // defaults to "anonymous"
//            pass: "gojibar39" // defaults to "@anonymous"
//        });
//        var str = ""; // Will store the contents of the file
//        ftp.get('lagersaldo.xml', 'lagersaldo.xml', function(hadErr) {
//            if (hadErr)
//                console.error('There was an error retrieving the file.');
//            else
//                console.log('File copied successfully!');
//        });
//
//        //var file = fs.readFileSync('/Users/martin/Dev/src-code/goji-admin/lagersaldo.xml', 'utf8');
//        var parser = new xml2js.Parser();
//        fs.readFile('/Users/martin/Dev/src-code/goji-admin/lagersaldo.xml', function(err, data) {
//            parser.parseString(data, function (err, result) {
//                console.dir(result);
//                console.log(result.lagersaldo.artikel[0]);
//                console.log('Done');
//            });
//        });
//        res.jsonp(200, {data: "bla bla"});
//    });
//}