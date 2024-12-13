const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function generateInvoice(data, logo) {
    const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const filePath = path.join(__dirname, 'invoice.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    // Load and draw the logo
    const image = await loadImage(logo);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const buffer = canvas.toBuffer('image/jpeg');

    doc.rect(50, 50, 500, 45)
        .fill('#f3f3f3')
        .stroke('#000000');

    doc.image(buffer, 50, 50, { width: 100 });

    // Add service provider name and address
    doc.fillColor('#000000')
        .fontSize(16)
        .text(data.providerName, 160, 60, { align: 'left' })
        .fontSize(10)
        .text(data.providerAddress1, 160, 80, { align: 'left' })
        .fontSize(10)
        .text(data.providerAddress2, 160, 100, { align: 'left' });

    // Add buyer's name and address
    doc.fontSize(12)
        .fillColor('#000000')
        .text('Buyer Details:', 50, 130, { underline: true });

    doc.fontSize(10)
        .text(`Name: ${data.buyerName}`, 50, 150)
        .text(`Address: ${data.buyerAddress}`, 50, 165);

    // Add invoice details
    doc.fontSize(12)
        .fillColor('#000000')
        .text('Invoice Details:', 50, 190, { underline: true });

    doc.fontSize(10)
        .text(`Invoice Number: ${data.invoiceNumber}`, 50, 210)
        .text(`Date of Issue: ${data.issueDate}`, 50, 225)
        .text(`Due Date: ${data.dueDate}`, 50, 240);

    // Subscription plan details
    doc.fontSize(12)
        .fillColor('#000000')
        .text('Subscription Plan Details:', 50, 270, { underline: true });

    const plans = data.plans || [];
    let planY = 290;
    plans.forEach((plan) => {
        doc.fontSize(10).text(`- ${plan.name}: Rs. ${plan.cost}`, 60, planY);
        planY += 15;
    });

    // Add a Payment Details table with headers
    doc.fontSize(12)
        .fillColor('#000000')
        .text('Payment Details:', 50, planY + 20, { underline: true });

    drawTable(doc, 50, planY + 40, data.paymentDetails);

    // Footer
    doc.moveTo(50, 750)
        .lineTo(550, 750)
        .stroke();

    doc.fontSize(10)
        .fillColor('black')
        .text(
            `Thank you for using our services. If you have any questions, contact us at ${data.providerContact}.`,
            50,
            680,
            { align: 'center' }
        );

    doc.fontSize(10)
        .text(`© ${data.providerName}, All rights reserved.`, 50, 700, {
            align: 'center',
        });

    doc.end();
    return filePath;
}

function drawTable(doc, x, y, tableData) {
    const cellPadding = 5;
    const rowHeight = 20;
    const columnWidths = [100, 100, 150, 150];  // Adjust the column widths as needed

    if (!tableData || !Array.isArray(tableData.headers) || !Array.isArray(tableData.rows)) {
        throw new Error("Invalid table data format. Ensure headers and rows are arrays.");
    }

    const headers = tableData.headers;
    let currentX = x;
    let currentY = y;

    // Draw headers
    headers.forEach((header, index) => {
        const cellWidth = columnWidths[index] || 100;
        doc.rect(currentX, currentY, cellWidth, rowHeight)
            .fillColor('#003366')
            .fill()
            .stroke();

        doc.fontSize(10)
            .fillColor('#ffffff')
            .text(header || 'N/A', currentX + cellPadding, currentY + cellPadding, {
                width: cellWidth - cellPadding * 2,
                align: 'center',
            });

        currentX += cellWidth;
    });

    currentY += rowHeight;  // Move to the next row

    // Draw table rows
    tableData.rows.forEach((row) => {
        if (!Array.isArray(row)) {
            console.error('Row is not an array:', row);
            return; // Skip non-array rows
        }

        currentX = x;
        row.forEach((cell, colIndex) => {
            const cellWidth = columnWidths[colIndex] || 100; // Default column width
            const cellValue = cell === undefined ? 'N/A' : cell;

            // Set the background color for cells (you can set this to any color)
            doc.fillColor('#F0F0F0')  // Light gray background for cells
                .rect(currentX, currentY, cellWidth, rowHeight)
                .fill();

            // Set the border color (black)
            doc.strokeColor('#000000')
                .rect(currentX, currentY, cellWidth, rowHeight)
                .stroke();

            // Set text color (black for the text)
            doc.fillColor('#000000') // Text color
                .text(cellValue, currentX + cellPadding, currentY + cellPadding, {
                    width: cellWidth - cellPadding * 2,
                    align: 'center',
                });

            // Update currentX for the next column
            currentX += cellWidth;
        });

        // After finishing the row, update the Y position to move to the next row
        currentY += rowHeight;

    });
}

module.exports = { generateInvoice };
