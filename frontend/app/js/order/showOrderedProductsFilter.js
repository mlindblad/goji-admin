app.filter('showOrderedProductsFilter', function() {
    "use strict";

    return function(products) {
        return _.filter(products, function(product) {
            return product.actualOrderAmount > 0;
        });
    };
});