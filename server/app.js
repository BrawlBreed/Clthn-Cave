const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const cors = require("cors");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// const credentials = {
//   apiKey: 'AIzaSyCOkZsI4MgJq-PbLdzWnz1A73hRAJrOkUI',
// };

// const client = new google.auth.GoogleAuth({
//   credentials,
// });


function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service : 'hotmail',
      auth : {
        user : 'clthncave@outlook.com',
        pass : 'Gunz&Granadez187'
      }
      // Tried very hard to do it with gmail but unfortunately :(
      // service: 'gmail'
      //auth: {
        // user: 'zantonius999@gmail.com',       
        // pass: 'Gunz&Granadez187',        
        // type: 'OAuth2',
        // clientId:"292129650909-dg8ujmcev10osblp4lr9u0dak435h5cj.apps.googleusercontent.com",
        // clientSecret:"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",
        // refreshToken:"1//04PH_1URRwS_KCgYIARAAGAQSNwF-L9IrCFq-C7gGzk9VBnKadYXe8qidbYr420xwShLJBG3vBmISi0eM0YuaFEehucP1G7Odgps",
        // xoauth2: client,
      //},
    });

    const mail_configs = {
      from: 'clthncave@outlook.com',
      to: recipient_email,
      subject:"PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"></a>
    </div>
    <p style="font-size:1.1em">Hi there, Customer!</p>
    <p>Thank you for choosing Clthn'Cave. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 2px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards, Clthn'Cave<br /></p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Clthn'Cave</p>
      <p>Sofia</p>
      <p>Bulgaria</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

app.get("/", (req, res) => {
  console.log(process.env.MY_EMAIL);
});

app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailerProjectsss is listening at http://localhost:${port}`);
});
