var mongoose = require('mongoose');

var Order = new mongoose.Schema({
    name : String,
    orderItems : [{
        name : String,
        number : Number,
        actualOrderAmount : Number
    }]
});

module.exports = mongoose.model('Order', Order);