var mockData = [
    {
        name: "Organic Goji Berries",
        number: 100001,
        sweName: "Ekologiska gojibär (250g)",
        suggestedOrderAmount: 100,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Organic Bee Pollen",
        number: 100002,
        sweName: "Ekologiskt Bipollen (250g)",
        suggestedOrderAmount: 100,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Chaga Mushroom",
        number: 100028,
        sweName: "Chagapulver 125g",
        suggestedOrderAmount: 100,
        bagSize: 125,
        actualOrderAmount: 0
    },
    {
        name: "Organic Wheatgrass Powder",
        number: 100003,
        sweName: "Ekologiskt Vetegräspulver \n(250g)",
        suggestedOrderAmount: 80,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Raw Organic Maca Powder",
        number: 100004,
        sweName: "Ekologisk Maca (250g)",
        suggestedOrderAmount: 64,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Raw Organic Cacao Nibs",
        number: 100005,
        sweName: "Ekologiska Krossade \nKakaobönor (250g)",
        suggestedOrderAmount: 40,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Organic Barley Grass",
        number: 100006,
        sweName: "Ekologiskt Korngräs (250g)",
        suggestedOrderAmount: 64,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Raw Organic Mulberries",
        number: 100007,
        sweName: "Ekologiska Mullbär (250g)",
        suggestedOrderAmount: 32,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Raw Organic Cacao Powder",
        number: 100008,
        sweName: "Ekologiskt Kakaopulver \n(250g)",
        suggestedOrderAmount: 32,
        bagSize: 250,
        actualOrderAmount: 0
    },
    {
        name: "Raw Organic Freeze Dried \nAcai Powder",
        number: 100009,
        sweName: "Ekologisk Acai (125g)",
        suggestedOrderAmount: 54,
        bagSize: 125,
        actualOrderAmount: 0
    },
    {
        name: "Organic Spirulina Powder",
        number: 100010,
        sweName: "Ekologisk Spirulina (250g)",
        suggestedOrderAmount: 64,
        bagSize: 250,
        actualOrderAmount: 0
    }

];

function generateProducts(data) {
    _.each(data, function (product) {
        product.totalWeight = function () {
            return (product.bagSize * product.actualOrderAmount) / 1000;
        }
    });
    return data;
}


app.controller('OrderCtrl', function (pdfFactory) {
    this.data = generateProducts(mockData);
    this.totalWeight = function (data) {
        var totalWeight = 0;
        _.each(data, function (product) {
            totalWeight += product.totalWeight();
        });
        return totalWeight;
    }
    this.generatePdf = function(data, orderSeqNumber) {
        var doc = new jsPDF();
        pdfFactory.createPdfDocument(doc, data, orderSeqNumber);
        doc.save('Följsesedel Order 00' + orderSeqNumber + ' ' + moment(new Date()).format('YYYY-MM-DD') + '.pdf');
    }
});

