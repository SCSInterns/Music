const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function generateInvoice(data, logo) {
    const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const filePath = path.join(__dirname, 'feesreciept.pdf');
    doc.pipe(fs.createWriteStream(filePath));


    const image = await loadImage(logo);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const buffer = canvas.toBuffer('image/jpeg');

    doc.rect(50, 50, 500, 100)
        .fill('#f3f3f3')
        .stroke('#000000');

    doc.image(buffer, 50, 50, { width: 100 });

    doc.fillColor('#000000')
        .fontSize(20)
        .text('Fees Receipt', 150, 100, { align: 'center' });

    doc.moveDown(2)
        .fontSize(12)
        .text('Student Information', 50, 200, { underline: true });

    doc.moveDown()
    doc.fontSize(10)
        .text(`Name: ${data.name}`, 50, 220)
        .text(`Email: ${data.email}`, 50, 235)
        .text(`Course: ${data.course}`, 50, 250)
        .text(`Receipt Number: ${data.receiptNumber}`, 300, 220)
        .text(`Enrollment Date: ${data.enrollmentDate}`, 300, 235)
        .text(`Date of Payment: ${data.dateOfPayment}`, 300, 250);


    doc.moveDown()
        .fontSize(12)
        .text('Payment Details', 50, 280, { underline: true });

    doc.moveDown(2)
    doc.rect(50, 300, 500, 20)
        .fill('#e8f4fa')
        .stroke('#000000');
    doc.fillColor('#000000')
        .text('Payment Method:', 55, 302)
        .text(`${data.paymentMethod || 'Online (Manual)'}`, 150, 302)
        .text('Total Amount (Rs):', 300, 302)
        .text(`Rs. ${data.amount}`, 400, 302);

    doc.moveDown(2);
    drawTable(doc, 50, 350, data.paymentTableData);


    doc.moveTo(50, 750)
        .lineTo(550, 750)
        .stroke();

    doc.fontSize(10)
        .fillColor('black')
        .text(
            `Thank you for choosing ${data.academyName} Music Academy. This is an auto-generated receipt.`,
            50,
            680,
            { align: 'center' }
        );

    doc.fontSize(10)
        .text(`© ${data.academyName} Music Academy, All rights reserved.`, 50, 700, {
            align: 'center',
        });

    doc.end();
    return filePath;
}

function drawTable(doc, x, y, tableData) {
    const cellPadding = 5;
    const rowHeight = 20;
    const columnWidths = [100, 100, 150, 150];

    if (!tableData || !Array.isArray(tableData.headers) || !Array.isArray(tableData.rows)) {
        throw new Error("Invalid table data format. Ensure headers and rows are arrays.");
    }

    const headers = tableData.headers;
    let currentX = x;
    let currentY = y;

    headers.forEach((header, index) => {
        const cellWidth = columnWidths[index] || 100;
        doc.rect(currentX, currentY, cellWidth, rowHeight)
            .fillColor('#003366')
            .fill()
            .stroke();


        doc.fontSize(10)
            .fillColor('#ffffff');


        doc.text(header || 'N/A', currentX + cellPadding, currentY + cellPadding, {
            width: cellWidth - cellPadding * 2,
            align: 'center',
        });

        currentX += cellWidth;
    });


    currentY += rowHeight;
    currentX = x;

    tableData.rows.forEach((row, rowIndex) => {
        doc.fontSize(10).fillColor('#000000');
        headers.forEach((_, colIndex) => {
            const cellWidth = columnWidths[colIndex] || 100;
            const cellValue = row[colIndex] === undefined ? 'N/A' : row[colIndex];
            doc.rect(currentX, currentY, cellWidth, rowHeight).stroke('#000000');
            doc.text(cellValue, currentX + cellPadding, currentY + cellPadding, {
                width: cellWidth - cellPadding * 2,
                align: 'center',
            });
            currentX += cellWidth;
        });
        currentY += rowHeight;
        currentX = x;
    });
}


module.exports = { generateInvoice };
