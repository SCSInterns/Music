const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Logo = require("../models/Logo");
const Feesreciept = require("./FeesRecieptc");
const fs = require("fs/promises");
const SocialLinks = require("../models/SocialLinks");
const Credentials = require("./RazorPayAcademyCred")
const SubscriptionR = require("./SubscriptionRecieptc")

dotenv.config();

const retriveacademygooglecred = async (academyname) => {

  const details = await Credentials.retrivemailcred(academyname)

  if (details) {
    const mailid = details.mail
    const pwd = details.pwd

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${mailid}`,
        pass: `${pwd}`,
      },
    });
    return { transporter, mailid, pwd }
  } else {
    throw new Error("Academy email credentials not found.");
  }
}


const sendAcademyMail = async (email, otp) => {

  const pass = process.env.APP_PWD;
  const user = process.env.MAIL;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${user}`,
      pass: `${pass}`,
    },
  });


  const mailOptions = {
    from: user,
    to: email,
    subject: "Your OTP Code For Music Academy Application ",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendMail = async (email, otp, academyname) => {

  const googlecred = await retriveacademygooglecred(academyname)

  const frommail = googlecred.mailid

  const mailOptions = {
    from: frommail,
    to: email,
    subject: "Your OTP Code For Music Academy Application ",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    let info = await googlecred.transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendpaymentmail = async (email, amount, name, academyname) => {

  const googlecred = await retriveacademygooglecred(academyname)

  const frommail = googlecred.mailid

  const mailOptions = {
    from: frommail,
    to: email,
    subject: "Reminder for payment",
    text: ` Please pay your pending fees of music academy course . 

           Find your details here :- 
           Student Name - ${name} 
           Amount due - ₹ ${amount} 
           
           This is system generate mail , 
           Please ignore if you have already paid payment . 
           Have a nice day
           Thank you , 
           ${academyname} Music Academy 
        `,
  };

  try {
    let info = await googlecred.transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// payment custom button nodification

const sendcustomnodi = async (req, res) => {
  const { email, amount, name, academyname, role } = req.body;

  const googlecred = await retriveacademygooglecred(academyname)

  const frommail = googlecred.mailid

  const mailOptions = {
    from: frommail,
    to: email,
    subject: "Reminder for payment",
    text: ` Please pay your pending fees of music academy course . 

           Find your details here :- 
           Student Name - ${name} 
           Amount due - ₹ ${amount} 
           
           This is system generate mail , 
           Please ignore if you have already paid payment . 
           Have a nice day
           Thank you , 
           ${academyname} Music Academy 
        `,
  };

  try {
    if (role === "Admin") {
      let info = await googlecred.transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);

      if (info) {
        res.status(200).json({ msg: " Email send success " });
      } else {
        res.status(404).json({ msg: " Email sending failed " });
      }
    } else {
      res.status(401).json({ msg: "Unauthorized Access" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// email for pin and welcoming new user

const welcome = async (email, username, academyname, password, role) => {
  const academylogo = await Logo.findOne({ academyname: academyname });
  const logolink = await academylogo.link;

  const googlecred = await retriveacademygooglecred(academyname)

  const frommail = googlecred.mailid

  const mailOptions = {
    from: frommail,
    to: email,
    subject: `Welcome to ${academyname} Music Academy`,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src=${logolink} alt="Academy Logo" width="150"/>
            </div>
            <h2 style="text-align: center; color: #004b87;">Welcome to ${academyname}!</h2>
            <p>Hello ${username},</p>
            <p>We are excited to welcome you to our academy. Below are your login credentials:</p>
            
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Username:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${username}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Password:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${password}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Academy Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${academyname}</td>
                </tr>
            </table>
            
            <p style="text-align: center; margin-top: 20px;">
                <a href=${`http://localhost:3000/${academyname}/login`} style="display: inline-block; padding: 10px 20px; background-color: #004b87; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
            </p>
            
            <p>If you have any questions, feel free to reach out to us. We're here to help you succeed!</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <img src="https://img.freepik.com/premium-vector/banner-speech-bubble-thank-you_136321-98.jpg?w=1000&h=200" alt="Ending Pic" width="150"/>
            </div>

            <p style="text-align: center; color: #aaa; margin-top: 20px;">&copy; ${academyname}, All rights reserved.</p>
        </div>
        `,
  };

  try {
    if (role === "Admin") {
      let info = await googlecred.transporter.sendMail(mailOptions);
      return info;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

async function sendInvoiceEmail(email, invoiceData) {
  const academylogo = await Logo.findOne({
    academyname: invoiceData.academyName,
  });
  const logo = await academylogo.link;

  const googlecred = await retriveacademygooglecred(invoiceData.academyName)

  const frommail = googlecred.mailid

  const invoicePath = await Feesreciept.generateInvoice(invoiceData, logo);
  const mailOptions = {
    from: frommail,
    to: email,
    subject: `Your Fees Receipt from ${invoiceData.academyName} Music Academy`,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Thank you for your payment!</h2>
            <p>Dear ${invoiceData.name},</p>
            <p>Attached is the receipt for your payment to ${invoiceData.academyName} Music Academy.</p>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>${invoiceData.academyName} Music Academy</p>
        </div>
        `,
    attachments: [
      {
        filename: "FeesReceipt.pdf",
        path: invoicePath,
      },
    ],
  };

  googlecred.transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }

    try {
      await fs.unlink(invoicePath);
    } catch (deleteError) {
      console.error("Error deleting file:", deleteError);
    }
  });
}

const paymentfailed = async (academyname, email, paymentdate, amount) => {
  const links = await SocialLinks.findOne({ academyname: academyname });
  const mailid = links.mail;
  const academylogo = await Logo.findOne({ academyname: academyname });
  const logolink = academylogo.link;
  const altname = `${academyname} Music Academy`;
  const retrypayment = `http://localhost:3000/${academyname}/login`;

  const googlecred = await retriveacademygooglecred(academyname)

  const frommail = googlecred.mailid

  const mailOptions = {
    from: frommail,
    to: email,
    subject: `There was a problem with your payment`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #1DB954;
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
    .header h1 {
      margin: 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #333;
    }
    .heading { 
      text-align: center;
    }
      
    .button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #1DB954;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  width: 200px;
}

    .table-container {
      margin: 20px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 16px;
    }
    table th, table td {
      padding: 10px;
      text-align: left;
      border: 1px solid #ddd;
    }
    table th {
      background-color: #f4f4f4;
      color: #333;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #888;
    }
    .footer a {
      color: #1DB954;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${logolink}" alt="logo" style="max-height: 50px; margin-right: 10px;">
      <h3 class="heading">${altname}</h3>
    </div>
    <div class="content">
      <h2>Oh no, your payment failed </h2>
      <p>Don't worry. We'll try your payment again over the next few days.</p>
      <p>To continue enjoying at ${altname}, you may need to update your payment details.</p>
    </div>
    <div class="table-container">
      <h3>Failed Payment Details</h3>
      <table>
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${paymentdate}</td>
            <td>Rs. ${amount}</td>
            <td style="color: red;">Failed</td>
          </tr>
        </tbody>
      </table>
    </div>
    <a href="${retrypayment}" class="button">Retry Payment</a>
    <div class="footer">
      <p>If you have any questions or complaints, please <a href="${mailid}">contact us</a>.</p>
      <p>Thank you and have a nice day!</p>
    </div>
  </div>
</body>
</html>
`,
  };

  try {
    let info = await googlecred.transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const onboardingmail = async (academyname, email, name) => {

  const pass = process.env.APP_PWD;
  const user = process.env.MAIL;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${user}`,
      pass: `${pass}`,
    },
  });

  const mailOptions = {
    from: user,
    to: email,
    subject: `Transform Your ${academyname} Music Academy Experience Today! 🎶`,
    html: `
      <!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 700px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(90deg, #4caf50, #008cba);
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
        }

        .content {
            padding: 30px;
        }

        .content h2 {
            color: #333333;
            font-size: 22px;
            margin-top: 0;
        }

        .features {
            margin: 20px 0;
        }

        .feature {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .feature img {
            width: 24px;
            margin-right: 15px;
        }

        .cta-button {
            display: inline-block;
            margin: 30px auto;
            padding: 15px 25px;
            background-color: #4caf50;
            color: #ffffff;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #388e3c;
        }

        .image-banner {
            width: 100%;
            height: auto;
        }

        .footer {
            text-align: center;
            background-color: #f9f9f9;
            padding: 15px;
            font-size: 14px;
            color: #777777;
            border-top: 1px solid #dddddd;
        }

        .footer strong {
            color: #333333;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <h1>Welcome to a New Era of Music Academy Management  🎶</h1>
        </div>

        <!-- Image Banner -->
        <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Music Academy Banner" class="image-banner">

        <!-- Content Section -->
        <div class="content">
            <p>Dear ${name} ,</p>
            <p>Take your academy to the next level with Team SoftCoding Solution, Ahmedabad! We provide you with the perfect tools to manage your academy efficiently and effectively.</p>

            <h2>Why Choose Our Advance Package (₹4000/year)?</h2>
            <div class="features">
                <div class="feature">
                     <span style="margin-right: 10px;">✅</span>
                    <span><strong>  Student Hub:</strong> Centralize student data effortlessly.</span>
                </div>
                <div class="feature">
                     <span style="margin-right: 10px;">✅</span>
                    <span><strong>  Pay Wise:</strong> Simplify fee management like never before.</span>
                </div>
                <div class="feature">
                     <span style="margin-right: 10px;">✅</span>
                    <span><strong>  Class Flow:</strong> Organize and manage classes seamlessly.</span>
                </div>
                <div class="feature">
                     <span style="margin-right: 10px;">✅</span>
                    <span><strong>  Website Pilot:</strong> Give your academy a digital edge.</span>
                </div>
                <div class="feature">
                     <span style="margin-right: 10px;">✅</span>
                    <span><strong>  Attendance Ease:</strong> Simplify attendance tracking for teachers and students.</span>
                </div>
                <div class="feature">
                     <span style="margin-right: 10px;">✅</span>
                    <span><strong>  White Labeling:</strong> Build your academy’s unique brand.</span>
                </div>
            </div>

            <p><strong>Ready to Transform?</strong></p>
            <p>Click below to get started now and join hundreds of academies already making a difference!</p>

            <!-- Call to Action Button -->
            <div style="text-align: center;" >
            <a href="http://localhost:3000/business#pricing" class="cta-button">Sign Up Now</a>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>Warm Regards,</p>
            <p><strong>Team SoftCoding Solution, Ahmedabad</strong></p>
            <p><em>Empowering Your Academy, Note by Note.</em></p>
        </div>
    </div>
</body>

</html>
    
    ` ,
  }


  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}


const sendsubscriptioninvoice = async (
  email, name, academyaddress, invoiceno, issuedate, renewaldate, planname, amount, gst, toatalamount
) => {
  try {

    const sampleData = {
      providerName: "SoftCoding Solutions",
      providerAddress1: "518 Solaris Business Hub Near Bhuyangdev Cross Road, Sola Rd,",
      providerAddress2: "opp. Parshwanath Jain mandir, Ahmedabad, Gujarat 380061",
      providerContact: "support@softcodingsolutions.com",
      buyerName: name,
      buyerAddress: academyaddress,
      invoiceNumber: invoiceno,
      issueDate: issuedate,
      dueDate: renewaldate,
      totalAmount: toatalamount,
      paymentMethod: "Online (Razorpay)",
      plans: {
        headers: ['Payment Date', 'Plan', 'Renewal Date', 'SubTotal', 'GST (INR)', 'Total'],
        rows: [
          [issuedate, planname, renewaldate, amount, gst, toatalamount]
        ]
      }
    };

    const pass = process.env.APP_PWD;
    const user = process.env.MAIL;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${user}`,
        pass: `${pass}`,
      },
    });

    const generatedinvoice = await SubscriptionR.generateInvoice(sampleData)

    const mailOptions = {
      from: user,
      to: email,
      subject: `Your Invoice from Softcoding Solutions `,
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <h2>Thank you for your payment!</h2>
              <p>Dear ${sampleData.buyerName},</p>
              <p>Attached is the receipt for your payment to ${sampleData.providerName} .</p>
              <p>If you have any questions, feel free to contact us.</p>
              <p>Best regards,<br>${sampleData.providerName} </p>
          </div>
          `,
      attachments: [
        {
          filename: "Invoice.pdf",
          path: generatedinvoice,
        },
      ],
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }

      try {
        await fs.unlink(generatedinvoice);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    })
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}


const renewalreminderemail = async (
  academyname, duedate, amount, email
) => {
  const pass = process.env.APP_PWD;
  const user = process.env.MAIL;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${user}`,
      pass: `${pass}`,
    },
  });

  const mailOptions = {
    from: user,
    to: email,
    subject: `🎵 Don't Miss a Beat! Your Music Vista Subscription is Due `,
    html: ` 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Reminder - Music Vista</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #ddd;
        }
        .email-header h1 {
            color: #3f72af;
        }
        .email-body {
            padding: 20px 0;
        }
        .features-list {
            margin: 20px 0;
            padding-left: 20px;
        }
        .features-list li {
            margin: 5px 0;
            font-size: 16px;
        }
        .payment-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .payment-link {
            color: #3f72af;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            font-size: 14px;
            text-align: center;
            color: #888;
            padding-top: 20px;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="email-header">
            <h1>🎶 Reminder: Your Music Vista Subscription Renewal 🎶</h1>
        </div>
        <div class="email-body">
            <p>Dear <strong>${academyname} - Music Academy </strong>,</p>
            <p>We hope you're making the most of your <strong>Music Vista</strong> experience! Our platform is designed to bring harmony to your music academy, and we’re excited to continue being a part of your musical journey. 🎵</p>
            
            <p>This is a friendly reminder that your subscription is coming up for renewal soon. To keep the music flowing, please make sure your payment is completed by <strong>${duedate}</strong>.</p>

            <h3>What’s waiting for you with Music Vista?</h3>
            <ul class="features-list">
                <li><strong>🎹 Student Hub</strong>: Your one-stop space for all class updates, schedules, and more!</li>
                <li><strong>💸 Pay Wise</strong>: Simplified payment management for smooth transactions.</li>
                <li><strong>🎶 Class Flow</strong>: Effortless class tracking and management, so you never miss a beat.</li>
                <li><strong>🌐 Website Pilot</strong>: Showcase your academy’s brand online with a professional website.</li>
                <li><strong>📈 Attendance Ease</strong>: Track student attendance in a snap!</li>
                <li><strong>🔧 White Labeling</strong>: Fully customize the platform to reflect your academy’s unique identity.</li>
            </ul>

            <div class="payment-details">
                <p><strong>Amount Due:</strong> ${amount}</p>
                <p><strong>Due Date:</strong> ${duedate}</p>
                <p>Ready to renew? Click the link below to complete your payment and keep the rhythm going:</p>
                <p><a href="http://localhost:3000/business#pricing" class="payment-link">🔗 Complete Your Payment</a></p>
            </div>

            <p>If you have any questions or need assistance, our support team is just a click away. Reach out to us at <a href="mailto:sales@softcodingsolutions.com">sales@softcodingsolutions.com</a>.</p>

            <p>Thank you for choosing <strong>Music Vista</strong>. We’re excited to help you compose a future full of melody, growth, and success!</p>
        </div>

        <div class="footer">
            <p>🎶 Keep creating, keep learning, and keep playing! 🎶</p>
            <p>&copy; 2024 Music Vista | All Rights Reserved</p>
            <p><a href="http://localhost:3000/business">Visit our website</a></p>
        </div>
    </div>

</body>
</html>

    `
  }

  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }

}

const sendeventpass = async (academyname, email, bgcover, qrcode, eventname, planname, attendene, eventdate, eventtime, eventvenue, amount, Ticketid) => {
  const googlecred = await retriveacademygooglecred(academyname)

  const frommail = googlecred.mailid

  const mailOptions = {
    from: frommail,
    to: email,
    subject: `Your Tickets`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Pass</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        :root {
            --primary: #4a90e2;
            --background: #f8f9fa;
            --foreground: #333;
            --muted: #6c757d;
            --border: #dee2e6;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background: var(--background);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .event-card {
            width: 100%;
            max-width: 380px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            position: relative;
            transition: transform 0.3s ease-in-out;
        }

        .event-card:hover {
            transform: translateY(-5px);
        }

        /* Banner Section */
        .event-banner {
            position: relative;
            height: 280px;
            background: url`({ bgcover })` center/cover;
        }

        .gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(74, 144, 226, 0.4), rgba(0, 0, 0, 0.8));
        }

        /* Header */
        .event-header {
            background: var(--primary);
            color: white;
            padding: 12px 20px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }

        /* Event Details */
        .event-content {
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .info-block {
            display: flex;
            flex-direction: column;
        }

        .info-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--muted);
            text-transform: uppercase;
        }

        .info-value {
            font-size: 15px;
            font-weight: bold;
            color: var(--foreground);
        }

        .highlight {
            color: var(--primary);
        } 

         .event-venue {
            padding: 15px 20px;
            background: #eef5ff;
            border-top: 2px solid var(--primary);
        }

        .venue-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--muted);
            text-transform: uppercase;
        }

        .venue-details {
            font-size: 14px;
            font-weight: bold;
            color: var(--foreground);
            margin-top: 5px;
        }

        /* Ticket Footer */
        .event-footer {
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px dashed var(--border);
        }

        .qr-container {
            width: 70px;
            height: 70px;
            background: white;
            padding: 5px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .ticket-id {
            font-size: 14px;
            font-weight: bold;
            font-family: 'Courier New', Courier, monospace;
            color: var(--foreground);
        }
    </style>
</head>
<body>

    <div class="event-card">
        <!-- Event Banner -->
        <div class="event-banner">
            <div class="gradient-overlay"></div>
        </div>

        <!-- Header -->
        <div class="event-header">EVENT PASS</div>

        <!-- Event Details -->
        <div class="event-content">
            <div class="info-block">
                <span class="info-title">Event</span>
                <span class="info-value">${eventname}</span>
            </div>
            <div class="info-block">
                <span class="info-title">Plan</span>
                <span class="info-value highlight">${planname}</span>
            </div>
            <div class="info-block">
                <span class="info-title">Amount</span>
                <span class="info-value">${amount}</span>
            </div>
            <div class="info-block">
                <span class="info-title">Attendee's</span>
                <span class="info-value">${attendene}</span>
            </div>
            <div class="info-block">
                <span class="info-title">Date & Time</span>
                <span class="info-value">${eventdate}</span>
                <span class="info-value" style="font-size: 12px; color: var(--muted);">${eventtime}</span>
            </div>
        </div> 

         <div class="event-venue">
            <span class="venue-title">Venue</span>
            <p class="venue-details">${eventvenue}</p>

        </div>

        <!-- Ticket Footer with QR -->
        <div class="event-footer">
            <div>
                <span class="info-title">Ticket ID</span>
                <span class="ticket-id">${Ticketid}</span>
            </div>
            <div class="qr-container">
                <img src=${qrcode} width="100%" height="100%" alt="QR Code">
            </div>
        </div>
    </div>

</body>
</html>
        `,
  };

  try {
    let info = await googlecred.transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = {
  sendMail,
  sendpaymentmail,
  sendcustomnodi,
  welcome,
  sendInvoiceEmail,
  paymentfailed,
  sendAcademyMail,
  retriveacademygooglecred,
  onboardingmail,
  sendsubscriptioninvoice,
  renewalreminderemail,
  sendeventpass
};
