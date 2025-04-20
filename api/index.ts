const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Middleware

const allowCors = (fn) => async (req, res) => {
  const corsMiddleware = cors({
    origin: [
      "http://localhost:88",
      "http://mailer-six-alpha.vercel.app",
      "https://care-sync-demo.web.app",
    ],
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  return corsMiddleware(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  });
};

app.use(bodyParser.json());

// HTML Email Template Generator
const generateHtmlEmail = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <h1 style="color: #2c3e50;">Caresync Experts</h1>
        <h2 style="color: #4CAF50;">New Client Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Contact Number:</strong> ${data.phone}</p>
        <p><strong>Company Address:</strong> sss</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Number of Care Recipients:</strong> ${data.clients}</p>
      </div>
      <footer style="margin-top: 20px; font-size: 12px; color: #888;">
        <p>This email was generated from your website form.</p>
      </footer>
    </div>
  `;
};

// Route to Send Email
const handler = async (req, res) => {
  const { name, phone, address, clients, email } = req.body;
  console.log(name, phone, address, clients, email);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  const htmlContent = generateHtmlEmail({
    name,
    phone,
    address,
    clients,
    email,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "riyaskhan7973@gmail.com", // ⚠️ Move this to environment variable
      pass: "nggp iixd dazl xmpj", // ⚠️ Move this to environment variable
    },
  });

  const mailOptions = {
    from: email,
    to: "riyaskhan7973@gmail.com",
    subject: `New Inquiry from ${name}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send({ message: "Failed to send email" });
  }
};

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
module.exports = allowCors(handler);
