var mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    name: String,
    number: Number,
    sweName: String,
    suggestedOrderAmount: Number,
    bagSize: Number,
    actualOrderAmount: Number,
    amountInStock: Number
});
