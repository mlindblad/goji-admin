var mongoose = require('mongoose'),
    _ = require('underscore'),
    moment = require('moment'),
    config = require('../../config/config'),
    Order = require('./order'),

    Product = new mongoose.Schema({
        name: String,
        number: String,
        sweName: String,
        suggestedOrderAmount: Number,
        bagSize: Number,
        actualOrderAmount: Number,
        amountInStock: Number,
        amountSoldPerDay : [
            {
                date: String,
                amount: Number
            }
        ]
    });

/**
 * Adds to a list how many amounts of a certain product that has been sold today
 *
 * @param downloadedAmount - amount currently in stock at e3pl
 * @param orderedAmount - ordered amount of this product
 */
Product.methods.addAmountSoldToday = function(downloadedAmount, orderedAmount) {
    if (_.isEmpty(this.amountSoldPerDay)) {
        addNrOfProductsSold(this, 0);
    } else if (isSameDate(this.amountSoldPerDay[0].date)) {
        //Do nothing
    } else if (downloadedAmount > this.amountInStock) {
          addNrOfProductsSold(this, Math.abs((downloadedAmount-orderedAmount) - this.amountInStock));
//        //Check if order exist
//        if (order) {
//            var orderItem = _.find(order.orderItems, function(orderItem) {
//                return orderItem.number === self.number;
//            });
//            addNrOfProductsSold(this, downloadedAmount - orderItem.actualOrderAmount);
//
//            //Remove Order Item or Order If it only contains one order Item
//            if (order.orderItems.length == 1) {
//                console.log("hit då??");
//                Order.remove({
//                    name : order.name
//                }, function(err, order) {
//                    if (err)
//                        res.send(err);
//                });
//            } else if (order.orderItems.length > 1) {
//                for(var i = 0; i < order.orderItems.length; i++) {
//                    var obj = order.orderItems[i];
//
//                    if(_.isEqual(obj, orderItem)) {
//                        order.orderItems.splice(i, 1);
//                    }
//                }
//                order.save(function (err) {
//                    if (err) {
//                        console.log(err);
//                    }
//                    // saved!
//                });
//            }
//        }

    } else {
        addNrOfProductsSold(this, Math.abs(downloadedAmount - this.amountInStock));
    }

    if (this.amountSoldPerDay.length > config.nrOfDaysToMeasure) {
        this.amountSoldPerDay.pop();
    }

}

var addNrOfProductsSold = function(product, amount) {
    product.amountSoldPerDay.unshift({date: moment(new Date()).format('YYYY-MM-DD').toString(),amount:amount});
}

var isSameDate = function(date) {
    return moment(date).isSame(moment(new Date()).format('YYYY-MM-DD').toString())
}

module.exports = mongoose.model('Product', Product);


