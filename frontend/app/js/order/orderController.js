

function generateProducts(data) {
    _.each(data, function (product) {
        product.totalWeight = function () {
            return (product.bagSize * product.actualOrderAmount) / 1000;
        }
        product.actualOrderAmount = 0;
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

    $http.get('/products')
        .success(function(mockData) {
            self.data = generateProducts(mockData);
        })
        .error(function(data) {
            console.log('Error: ' + data);
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

