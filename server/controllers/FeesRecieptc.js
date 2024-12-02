const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function generateInvoice(data, logo) {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'feesreciept.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    const image = await loadImage(logo);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const buffer = canvas.toBuffer('image/jpeg');
    doc.image(buffer, 50, 50, { width: 100 })
        .fontSize(20)
        .text('Fees Receipt', 200, 50, { align: 'right' })
        .fontSize(10)


    doc.moveDown()
        .text(`Name: ${data.name}`, 50, 150)
        .text(`Email: ${data.email}`, 50, 180)
        .text(`Course: ${data.course}`, 50, 195)
        .text(`Receipt Number: ${data.receiptNumber}`, 300, 150)
        .text(`Date of Payment: ${data.dateOfPayment}`, 300, 165);


    doc.moveDown()
        .fontSize(12)
        .fillColor('black')
        .text('Payment Method', 50, 250)
        .text(`Online ( Manual )`, 50, 265)
        .text('Total Amount (₹)', 50, 280)
        .text(`${data.amount}`, 50, 295);

    doc.moveDown()
        .fontSize(10)
        .text(`Thank you for choosing ${data.academyName} Music Academy . This is an auto-generated receipt.`, 50, 335)


    doc.fontSize(10).text(`© ${data.academyName}, All rights reserved.`, 50, 750, {
        align: 'center',
    });

    doc.end();
    return filePath;
}


module.exports = { generateInvoice }
