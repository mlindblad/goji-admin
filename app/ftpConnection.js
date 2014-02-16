//set up
var JSFtp = require("jsftp");
var fs = require("fs");
var xml2js = require("xml2js");
var async = require('async');
var Product = require('./models/product');
var Order = require('./models/order');
var _ = require('underscore');

//update products
//var cronJob = require('cron').CronJob;
//new cronJob('* * * * * *', function(){
//    console.log('You will see this message every second');
//}, null, true, "America/Los_Angeles");
//
//Connect to ftp
//Convert xml to json
//
//amountSoldPerDay; [
//  {
//      day: { type: Date, default: Date.now },
//      amountSold : Number
//  }
// ]



var getStockStatus = function(callbackFunc) {
    var stockData = {},
        orders = {};

    async.series([
        //Load user to get userId first
//        function(callback) {
//            var ftp = new JSFtp({
//                host: "ftp.e3pl.se",
//                port: 21, // defaults to 21
//                user: "149993_39_ex", // defaults to "anonymous"
//                pass: "gojibar39" // defaults to "@anonymous"
//            });
//            var str = ""; // Will store the contents of the file
//            ftp.get('lagersaldo.xml', 'lagersaldo.xml', function(hadErr) {
//                if (hadErr)
//                    console.error('There was an error retrieving the file.');
//                else
//                    console.log('File copied successfully!');
//                callback()
//            });
//        },
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
            Order.find(function(err, result) {
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                orders = result;
                callback();
            });
        },
        function(callback) {
            //console.log(orders);
            Product.find(function(err, products) {
                for (var i=0;i<stockData.lagersaldo.artikel.length;i++) {
                    //Add amount sold today
                    var product = _.find(products, function(product) {
                        return (product.number === stockData.lagersaldo.artikel[i].artnr[0])
                    });

                    if (product) {
                        product.addAmountSoldToday(stockData.lagersaldo.artikel[i].antal[0], getOrderedAmountForProduct(orders, product));
                        product.amountInStock = stockData.lagersaldo.artikel[i].antal[0];
                        product.save(function(err) {
                            // we've updated the dog into the db here
                            if (err) throw err;
                        });
                    }
                }
                callbackFunc();
            });
        }
    ]);
};

var getOrderedAmountForProduct = function(orders, product) {
    var orderedAmount = 0;
    _.find(orders, function(order) {
        var foundOrderItem =  _.find(order.orderItems, function(orderItem) {
            if (typeof product !== 'undefined') {
                if (product.number === orderItem.number) {
                    orderedAmount = orderItem.actualOrderAmount;
                    return true;
                }
            }
        });
        return (typeof foundOrderItem !== 'undefined');
    });
    return orderedAmount
}

exports.getStockStatus = getStockStatus