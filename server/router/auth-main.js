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
  } = data;

  let csvNames = [];
  let csvEmails = [];



  csvobj.forEach((element) => {
    csvEmails.push(element.split(",")[1]);
    csvNames.push(element.split(",")[0]);
  });
 
  var i=0

  for (const element of csvEmails) {
    // var i = parseInt(csvEmails.indexOf(element));
    var certdate = Date.now();
    let emailBody = emailbody.replace("$", `${csvNames[i]}`);
    let image = new Image(`uploads/${fileName}`);
    await image
      .loadFont(`fonts/${fontfile}.ttf`)
      .draw((ctx) => {
        ctx.fillStyle = color;
        ctx.font = `${fontsize} ${font}`;
        ctx.fillText(`${csvNames[i]}`, left[i], top);
      })
      .save(`out/${csvNames[i]}-certificate-${certdate}.jpg`)
      .then(() => console.log("Image Saved"))
      .catch((err) => console.log(err));

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true, // true for 465, false for other ports
      secureConnection: false,
      auth: {
        user: `${senderEmail}`,
        pass: `${senderPassword}`,
      },
      tls:{
        rejectUnAuthorized:true
    }
    });
    const msg = {
      from: '" from dsc 👻" <dummy012345689@gmail.com>',
      to: csvEmails[i],
      subject: `${emailsubject}`,
      html: `${emailBody}`,
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
    console.log(`Email sent to ${csvEmails[i]}`);
   i++
  }
  console.log("All emails sent successfully");
});


module.exports = router;





