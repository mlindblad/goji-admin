

function generateProducts(data) {
    _.each(data, function (product) {
        product.totalWeight = function () {
            return (product.bagSize * product.actualOrderAmount) / 1000;
        }
        product.actualOrderAmount = 0;
    });
    return data;
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

    $http.get('/products')
        .success(function(mockData) {
            self.data = generateProducts(mockData);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    this.generatePdf = function(data, orderSeqNumber) {
        var doc = new jsPDF();
        pdfFactory.createPdfDocument(doc, data, orderSeqNumber);
        doc.save('Följsesedel Order 00' + orderSeqNumber + ' ' + moment(new Date()).format('YYYY-MM-DD') + '.pdf');
    }
});

