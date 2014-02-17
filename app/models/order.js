var mongoose = require('mongoose'),

    Order = new mongoose.Schema({
        name : String,
        orderItems : [{
            name : String,
            number : String,
            actualOrderAmount : Number
        }]
    });

module.exports = mongoose.model('Order', Order);