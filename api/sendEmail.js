

const nodemailer = require('nodemailer');





const generateHtmlEmail = (data) => {
    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
       <h1 >Caresync Experts</h1>
        <h2 style="color: #4CAF50;">New Client Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Contact Number:</strong> ${data.phone}</p>
        <p><strong>Company Address:</strong> ${data.address}</p>
         <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Number of Care Recipients:</strong> ${data.clients}</p>
      </div>
      <footer style="margin-top: 20px; font-size: 12px; color: #888;">
        <p>This email was generated from your website form.</p>
      </footer>
    </div>
    `;
  };
  
// Route
module.exports = async (req, res) => {
    const { name, phone, address, clients,email } = req.body;
  const htmlContent = generateHtmlEmail({ name, phone, address, clients,email });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'riyaskhan7973@gmail.com',      // 🔐 Use environment variables here
      pass: 'nggp iixd dazl xmpj'
    }
  });

  const mailOptions = {
    from: email,
    to: 'riyaskhan7973@gmail.com',
    subject: `New Inquiry from ${name}`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send({ message: 'Failed to send email' });
  }
}

