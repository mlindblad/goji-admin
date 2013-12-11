app.factory('pdfFactory', function() {
    "use strict";

    var self = this,
        xStart = 20,
        yStart = 20,
        yLineStart = yStart + 10,
        textMargin = 2,
        cellHeight = 15,
        headerHeight = 10,
        defaultLineWidth = 0.5,
        defaultFontSize = 12,
        verticalXs = [20, 50, 105, 165, 190];

    this.drawTitle = function(doc, orderSeqNumber) {
        doc.text(xStart, yStart, 'Följesedel Order 00' + orderSeqNumber + ' ' + moment(new Date()).format('YYYY-MM-DD'));
    };

    this.drawHorisontalLines = function(doc, orderItems) {
        var self = this,
            tableStartX = xStart,
            currentY = yLineStart,
            tableWidth = 170,
            cellHeight = 15;
        this.drawHorisontalLine(doc,tableStartX, tableWidth, currentY);
        currentY += 10;
        this.drawHorisontalLine(doc,tableStartX, tableWidth, currentY);
        currentY += cellHeight;
        _.each(orderItems, function() {
            self.drawHorisontalLine(doc, tableStartX, tableWidth, currentY);
            currentY += cellHeight;
        });
    }

    this.drawHorisontalLine = function(doc, xStart, width, y) {
        doc.line(xStart, y, xStart + width, y);
    };

    this.drawVerticalLines = function(doc, orderItems) {
        var self = this;
        _.each(verticalXs, function(x) {
            self.drawVerticalLine(doc,yLineStart, orderItems.length * cellHeight + headerHeight, x);
        });
    };

    this.drawVerticalLine = function(doc, yStart, height, x) {
        doc.line(x,yStart,x,yStart+height);
    };

    this.drawTable = function(doc, orderItems) {
       doc.setLineWidth(defaultLineWidth);
       this.drawHorisontalLines(doc, orderItems);
       this.drawVerticalLines(doc, orderItems);
    };

    this.drawHeader = function(doc) {
        doc.setFontSize(defaultFontSize);
        doc.setFontType("bold");
        doc.text(verticalXs[0] + textMargin, 37, 'Artikelnr');
        doc.text(verticalXs[1] + textMargin, 37, 'Benämning');
        doc.text(verticalXs[2] + textMargin, 37, 'Originalbenämning');
        doc.text(verticalXs[3] + textMargin, 37, 'Antal');
    };

    this.drawMainText = function(doc, orderItems) {
        doc.setFontType("normal");
        var currentY = yLineStart + headerHeight + 5;
        _.each(orderItems, function(orderItem) {
             doc.text(verticalXs[0]+textMargin, currentY, orderItem.number + '');
             doc.text(verticalXs[1]+textMargin, currentY, orderItem.sweName);
             doc.text(verticalXs[2]+textMargin, currentY, orderItem.name);
             doc.text(verticalXs[3]+textMargin, currentY, orderItem.actualOrderAmount + ' x ' + orderItem.bagSize + 'g');
            currentY += cellHeight;
        });
    };

    return {
        createPdfDocument : function(doc, orderItems, orderSeqNumber) {
            self.drawTitle(doc, orderSeqNumber);
            self.drawHeader(doc);
            self.drawTable(doc, orderItems);
            self.drawMainText(doc, orderItems);
            return doc;
        }

    }
});