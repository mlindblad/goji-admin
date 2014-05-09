function generateOrders(orders) {
    _.each(orders, function(order) {
        order.getOrderItem = function(number) {
            return _.find(this.orderItems, function(orderItem) {
                return orderItem.number === number;
            });
        }
    });
    return orders;
}

function generateProducts(data, orders) {
    _.each(data, function (product) {
        product.totalWeight = function () {
            return (product.bagSize * product.actualOrderAmount) / 1000;
        }
        product.actualOrderAmount = 0;
        product.getOrderedAmount = function() {
            var orderedAmount = 0;
            _.each(orders, function(order) {
                var orderItem = order.getOrderItem(product.number);
                if (orderItem !== undefined) {

                    orderedAmount = orderItem.actualOrderAmount;
                }
            });
            return orderedAmount;
        }
        product.averageAmountSoldPerDay = function() {
            var total = 0;
            _.each(product.amountSoldPerDay, function(amountObject) {
                total += amountObject.amount;
            });
            return Math.round((total/product.amountSoldPerDay.length) * 10) / 10;
        }
        product.suggestedOrderAmount = function() {
            var stockLengthInDays = 60;
            return product.averageAmountSoldPerDay() * stockLengthInDays;
        }

        product.codeRed = function() {
            return (this.amountInStock + this.getOrderedAmount() < (this.averageAmountSoldPerDay() * 14))

        }
        product.codeYellow = function() {
            return (this.amountInStock + this.getOrderedAmount() >= (this.averageAmountSoldPerDay() * 14)
                && this.amountInStock + this.getOrderedAmount() <= (this.averageAmountSoldPerDay() * 21))
        }

    });
    return data;
}

function generatePdf(pdfFactory, data, orderSeqNumber) {
    var doc = new jsPDF();
    pdfFactory.createPdfDocument(doc, data, orderSeqNumber);
    doc.save('Följsesedel Order 00' + orderSeqNumber + ' ' + moment(new Date()).format('YYYY-MM-DD') + '.pdf');
}

app.controller('OrderCtrl', function (pdfFactory, $http) {
    var self = this;

    this.totalWeight = function (data) {
        var totalWeight = 0;
        _.each(data, function (product) {
            totalWeight += product.totalWeight();
        });
        return totalWeight;
    }

    this.mostImportant = function(product) {
        return (product.amountInStock + product.getOrderedAmount())/product.averageAmountSoldPerDay();
    }

    $http.get('/api/orders')
        .then(function(result) {
            self.orders = generateOrders(result.data);
            return $http.get('/products');
        }).then(function(mockData){
            self.data = generateProducts(mockData.data, self.orders);
        });

    this.createOrderAndGeneratePdf = function(data, orderSeqNumber) {
       //Create new order
        var postData = {
            name : "Följsesedel Order 00" + orderSeqNumber + " " + moment(new Date()).format('YYYY-MM-DD'),
            orderItems: data
        }
        $http.post('/api/order', postData)
            .success(function(response) {

                console.log(response);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        generatePdf(pdfFactory, data, orderSeqNumber);
    }
});

