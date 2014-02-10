var mongoose = require('mongoose');

module.exports = mongoose.model('OrderItem', {
    _creator : { type: Number, ref: 'Order' },
    name : String,
    number : Number,
    amount : Number
});