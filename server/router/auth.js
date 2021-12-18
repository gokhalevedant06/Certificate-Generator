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


var i=null;
var currRecipient=null;
var recipientlength;

const setRecipient =(recipient_name)=>{
  if(i!==recipientlength)
  currRecipient=recipient_name;
  else
  currRecipient="All mails sent sucessfully"
}
const getCounter =()=>{
  if(i!=null)
  return String((i)*100/recipientlength);
  else
  return "0"
}
showrecipients=()=>{
  
    if(currRecipient!=null)
    return currRecipient
  else {
  return 'Please initiate the sending process'
  }

}

router.get('/logs',(req,res)=>{
  let logs ={
    count :getCounter(),
    log: showrecipients()
}
  res.send(logs);
})

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
  
  let recipients =csvData.slice(1,-1)
  
  recipientlength=recipients.length
  i=0
  setRecipient(null)

  for (const element of recipients) {
    var date = Date.now();
    
    let emailBody = emailbody;
    for (var j = 0; j < csvData[0].length; j++) {
      emailBody = emailBody.replace(`$${csvData[0][j]}`, element[j]);
    }
    console.log(emailBody);

    let image = new Image(`uploads/${fileName}`);
    await image
      .loadFont(`fonts/${fontfile}.ttf`)
      .draw((ctx) => {
        ctx.fillStyle = color;
        ctx.font = `${fontsize} ${font}`;
        ctx.fillText(`${element[0]}`, left[i], top);
      })
      .save(`out/${element[0]}-certificate-${date}.jpg`)
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
      to: element[1],
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
    console.log(`Email sent to ${element[0]}`);
    
    i++;
    setRecipient(element[0])
    
  }
  console.log("All emails sent successfully");
});



module.exports = router;





