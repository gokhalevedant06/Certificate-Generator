const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const fileUpload = require('express-fileupload')

// // to use express-file upload 
app.use(fileUpload());

app.use(express.json({limit: '50mb'}));

// // linking routes
app.use(require('./router/auth'));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
}

app.listen(PORT,()=>{
    console.log(`The app is listening at http://localhost:${PORT}`);
});
