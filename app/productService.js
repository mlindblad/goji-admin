var JSFtp = require("jsftp"),
    config = require("../config/config"),
    Product = require('./models/product'),
    _ = require('underscore'),

    updateAmountSoldToday = function(jsonResult, orders, callback) {
        Product.find(function(err, products) {
            for (var i=0;i<jsonResult.lagersaldo.artikel.length;i++) {
                //Add amount sold today
                var product = _.find(products, function(product) {
                    return (product.number === jsonResult.lagersaldo.artikel[i].artnr[0])
                });

                if (product) {
                    product.addAmountSoldToday(jsonResult.lagersaldo.artikel[i].antal[0], getOrderedAmountForProduct(orders, product));
                    product.amountInStock = jsonResult.lagersaldo.artikel[i].antal[0];
                    product.save(function(err) {
                        // we've updated the dog into the db here
                        if (err) throw err;
                    });
                }
            }
            callback();
        });
    }

function getOrderedAmountForProduct(orders, product) {
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

exports.updateAmountSoldToday = updateAmountSoldToday