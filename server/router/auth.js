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

  let csvData = csvobj.data;

  for (const element of csvData.slice(1, -1)) {
    let emailBody = emailbody;
    for (var i = 0; i < csvData[0].length; i++) {
      emailBody = emailBody.replace(`$${csvData[0][i]}`, element[i]);
    }

    var date = Date.now();
    let image = new Image(`uploads/${fileName}`);
    await image
      .loadFont(`fonts/${fontfile}.ttf`)
      .draw((ctx) => {
        ctx.fillStyle = color;
        ctx.font = `${fontsize} ${font}`;
        ctx.fillText(`${element[0]}`, left, top);
      })
      .save(`out/${element[0]}-certificate-${date}.jpg`)
      .then(() => console.log("Image Saved"))
      .catch((err) => console.log(err));
    console.log(emailBody);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      secureConnection: false,
      auth: {
        // user: `${senderEmail}`,
        // pass: `${senderPassword}`,
        user: 'dummy012345689@gmail.com',
        pass: 'dummy1234.',
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });
    const msg = {
      from: '" from dsc 👻" <dummy012345689@gmail.com>',
      to: element,
      subject: `${emailsubject}`,
      html: `${emailBody}`,
      attachments: [
        {
          filename: `${element[0]}-certificate-${date}.jpg`,
          path: `out/${element[0]}-certificate-${date}.jpg`,
        },
      ],
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
    console.log(`Email sent to ${element[1]}`);
    console.log();
  }

  console.log("All emails sent successfully");
});

module.exports = router;
