

function generateProducts(data, orders) {
    _.each(data, function (product) {
        product.totalWeight = function () {
            return (product.bagSize * product.actualOrderAmount) / 1000;
        }
        product.actualOrderAmount = 0;
        product.getOrderedAmount = function() {
            return getOrderedAmountForProduct(orders, product);
        }
        product.averageAmountSoldPerDay = function() {
            var total = 0;
            _.each(product.amountSoldPerDay, function(amountObject) {
                total += amountObject.amount;
            });
            return total/product.amountSoldPerDay.length;
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
        console.log("kommer hit");
        return (product.amountInStock + product.getOrderedAmount())/product.averageAmountSoldPerDay();
    }

    $http.get('/api/orders')
        .then(function(result) {
            self.orders = result.data;
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

