const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Image = require("purified-image");

// To move file into server folder
router.post("/upload", (req, res) => {
  try {
    const file = req.files.template;
    const savePath = path.join(__dirname, "../", "uploads", file.name);
    file.mv(savePath);

    console.log("Image Uploaded");
    res.status(200).json({
      success: "success",
    });
  } catch (error) {
    console.log(error);
    res.send("Error uploading file");
  }
});

router.post("/api", async (req, res) => {
  const data = req.body;
  let csvobj = await data.csvData;
  let senderEmail = data.Email;
  let senderPassword = data.Password;
  let {
    top,
    left,
    font,
    fontfile,
    fontsize,
    color,
    fileName,
    emailsubject,
    emailbody,
    Email,
    Password
  } = data;
 
  let csvNames = [];
  let csvEmails = [];

  var fontsizefinal = fontsize * 16;
  csvobj.forEach((element) => {
    csvEmails.push(element.split(",")[1]);
    csvNames.push(element.split(",")[0]);
  });

  console.log("CSV object = ",csvobj);
  console.log("top = ",top);
  console.log("left = ",left);
  console.log("font = ",font);
  console.log("fontfile = ",fontfile);
  console.log("fontsize = ",fontsize);
  console.log("fontsizefinal = ",fontsizefinal);
  console.log("color = ",color);
  console.log("filename = ",fileName);
  console.log("emailsubject = ",emailsubject);
  console.log("emailbody = ",emailbody);
  console.log("senderemail = ",senderEmail);
  console.log("senderpasswrd = ",senderPassword);
  console.log("CSV emails = ",csvEmails);
  console.log("CSV names = ",csvNames);
  

  for (const element of csvEmails) {
    var i = parseInt(csvEmails.indexOf(element));
    console.log(i);
    var certdate=Date.now();
    
    let image = new Image(`uploads/${fileName}`);
    await image
      .loadFont(`fonts/${fontfile}.ttf`)
      .draw((ctx) => {
        ctx.fillStyle = color;
        ctx.font = `${fontsize} ${font}`;
        // ctx.font = `${fontsizefinal} ${font}`;
        // ctx.fillText(`${csvNames[i]}`, 100,100);
        ctx.fillText(`${csvNames[i]}`, left, top);
      })
      .save(`out/${csvNames[i]}-certificate-${certdate}.jpg`)
      .then(() => console.log("Image Saved"))
      .catch((err) => console.log(err));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        // user: Email,
        // pass: Password,
        // user: "dummyacc012345689@gmail.com",
        // pass: "dummy@321",
        user: `${senderEmail}`,
        pass: `${senderPassword}`,
      },
    });
    const msg = {
      from: '" from dsc 👻" <dummy012345689@gmail.com>',
      to: element,
      subject: `${emailsubject}`,
      html: `${emailbody}`,
      attachments: [
        {
          filename: `${csvNames[i]}-certificate-${certdate}.jpg`,
          path: `out/${csvNames[i]}-certificate-${certdate}.jpg`,
        },
      ],
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
    console.log(`Email sent to ${element}`);
  }
  console.log("All emails sent successfully");
});

module.exports = router;
