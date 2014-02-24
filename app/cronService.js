var cronJob = require('cron').CronJob,
    ftpService = require('./ftpService'),
    xmlToJsonService = require('./xmlToJsonService'),
    productService = require('./productService'),
    config = require('../config/config'),
    async = require('async'),
    Order = require('./models/order'),

    createAndStartCronJob = function() {
    var job = new cronJob({
        cronTime: '00 00 18  * * 1-5',
        //cronTime: '* * * * * *',
        onTick: function() {
            var jsonResult = {},
                orders = {};

            async.series([
                    function(callback) {
                        ftpService.downloadFileUsingFtp(config.fileName, callback)
                    },
                    function(callback) {
                        xmlToJsonService.transform(config.fileName, callback, function(result) {
                            jsonResult = result;
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
                        productService.updateAmountSoldToday(jsonResult, orders, callback);
                    }
                ],

                function(err, results){
                    console.log("Products updated");
                }
            );
        },
        start: false,
        timeZone: "Europe/Amsterdam"
    });
    job.start();
}

exports.createAndStartCronJob = createAndStartCronJob