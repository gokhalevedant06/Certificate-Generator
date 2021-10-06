import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import domtoimage from "dom-to-image";
import axios from 'axios'
import emailTemplate from '../src/EmailFormat.jpg'
import Footer from './footer'

function App() {
  var toggled = true;
  const [image, setImage] = useState();
  const [name, setName] = useState(' ');
  const [preview, setPreview] = useState();
  const [color, setColor] = useState("black");
  const [csvData, setCsvData] = useState("");
  const [sendData, setSendData] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSubject,setEmailSubject] = useState("")
  const [emailBody,setEmailBody] = useState("")
  //*********** */
  const [top,setTop]=useState(0);
  const [left,setLeft]=useState(0);
  const [filename,setFileName]=useState('certificate.jpg')
  const [textColor,setTextColor]=useState("black");
  const [font,setFont]=useState("Open Sans Condensed");
  const [fontfile,setFontfile]=useState("OpenSansCondensed-Light");

  const [fontSize,setFontSize]=useState("2rem");
  //**************** */

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        document.getElementById('App').style.height="auto";
    // document.getElementById('App').style.height=document.querySelector('#capture img').style.height;
    
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  

  /**
   * Called when template is uploaded
   */
  function uploaded() {
    document.getElementById("name").style.position = "absolute";
    document.querySelector("#name").style.top = "100px";
    document.querySelector("#name").style.left = "100px";
    document.getElementById("name").style.fontSize = "32px";
    // document.getElementById('name-container').style.width=document.getElementById("name").getBoundingClientRect().width+"px"
    // document.getElementById('name-container').style.height=document.getElementById("name").getBoundingClientRect().height+"px"
    // document.getElementById('name-container').style.top=document.getElementById("name").getBoundingClientRect().top+"px"
    // document.getElementById('name-container').style.left=document.getElementById("name").getBoundingClientRect().left+"px"
    // document.getElementById('name-container').style.left=document.getElementById("name").getBoundingClientRect().left+"px"
    console.log(document.getElementById("name").getBoundingClientRect().width)
    // document.getElementById("name").style.backgroundColor = "pink";
    document.querySelector('#App').style.width="auto";
    // console.log(parseInt(document.width),parseInt(document.querySelector('#template').style.width))
// document.getElementById('scroll').style.display="block";

    document.getElementById("name").style.fontweight = "bold";
    document.getElementById("name").style.color = "black";
    
  }
  
  // To move name down
  
  // To increase font size of name
  const fontplus = () => {
    document.getElementById("name").style.fontSize =
      parseFloat(document.getElementById("name").style.fontSize) + 16 + "px";
  };

  //To decrease font size of name
  const fontmin = () => {
    document.getElementById("name").style.fontSize =
      parseFloat(document.getElementById("name").style.fontSize) - 16 + "px";
  };

  // To change font color of name
  const changeColor = () => {
    document.getElementById("name").style.color = color;
  };

  // To download the certificate template
  var downloaded = false
  const download = () => {
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    let text=document.querySelector("#name")
    text.style.top =parseInt(text.style.top) - 71+ "px";
    text.style.left =parseInt(text.style.left) - 5.3 + "px";
    var node = document.getElementById("capture");
    domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        setSendData(dataUrl);
        downloadURI(dataUrl, "Certificate");
        text.style.top =parseInt(text.style.top) + 71 + "px";
        text.style.left =parseInt(text.style.left) + 5.3 + "px";
        downloaded = true
        window.alert("Certificate Downloaded!");
       
      })
      .catch((err) => {
        console.log(err);
        window.alert("Certificate Download Failed");
      });
  };

  // To generate certificates
  const generate_certificate = ()=>{
   
    var text=document.querySelector('#name')
    setFontSize(parseInt(text.style.fontSize));
    // if(fontSize>32){
    //   text.style.top = parseInt(text.style.top) -47+(fontSize) -16+ "px";
    // }
    // else{
    //   text.style.top = parseInt(text.style.top) -50 + "px";
    // }

    // text.style.left = parseInt(text.style.left) -18  +"px";
    // console.log("first done")
    console.log("here is height ",parseInt(window.getComputedStyle(text).fontSize, 10))
    setTop(parseFloat(text.style.top)+1.017*parseFloat(window.getComputedStyle(text).fontSize, 10))
    console.log("second done")

    setLeft(parseInt(text.style.left))
    setTextColor(text.style.color)
    
    console.log("This is the font family",text.style.fontFamily)
    var protofont=text.style.fontFamily
    if(protofont=='Carattere, cursive'){
      setFontfile("Carattere-Regular")
      setFont('Carattere')
    }
    else if(protofont=='"Playfair Display", serif'){
      setFontfile("PlayfairDisplay-VariableFont_wght")
      setFont('Playfair Display')
      console.log('Its playfair display')
    }
    else if(protofont=='Merienda, cursive'){
      setFontfile('Merienda-Regular')
      setFont('Merienda')
      console.log("its merienda")
    }
    else if(protofont=='Oswald, sans-serif'){
      setFontfile('Oswald')
      setFont('Oswald ExtraLight')
      console.log("oswald")
    }
    else if(protofont=='"Kaushan Script", cursive'){
      setFontfile('KaushanScript-Regular')
      setFont('Kaushan Script')
    }
    else if(protofont=='"Open Sans Condensed", sans-serif'){
      setFont('Open Sans Condensed Light')
      setFontfile('OpenSansCondensed-Light')
    }
    else if(protofont=='"Nanum Gothic", sans-serif'){
      setFontfile('NanumGothic')
      setFont('Nanum Gothic')
      console.log("its gothic")
    }
    else{
      setFont('Open Sans Condensed Light')
      setFontfile('OpenSansCondensed-Light')
      console.log('No match')
    }
    
    
    console.log("font size",text.style.fontSize)
    // text.style.top = parseInt(text.style.top) +10+ "px";
    // text.style.left = parseInt(text.style.left) +7 + "px";
    // text.style.top = parseInt(text.style.top) + 71 + "px";
    // text.style.left =parseInt(text.style.left) - 5.3 + "px";
    // text.style.top = parseInt(text.style.top) + 10 + "px";
    // text.style.left = parseInt(text.style.left) - 12.3 + "px";
    // text.style.top = parseInt(text.style.top) - 66 + "pt";
    // text.style.left = parseInt(text.style.left) -24 + "pt";
    // if(fontSize>32){
    //   text.style.top = parseInt(text.style.top) +47-(fontSize) +16+ "px";
    // }
    // else{
    //   text.style.top = parseInt(text.style.top) +50 + "px";
    // }
    // text.style.left = parseInt(text.style.left) +18 + "px";
  }

/**
 * To parse CSV 
 * Stores parsed CSV in csvData state
 */
//  let csvuploaded=false;
  var datatosend = [];
  var retrieveddata = [];
  var uploadedtheCSV = false;
  const readCSV = (event) => {
    // csvuploaded=true
    console.log(event.target.files[0]);
    uploadedtheCSV = true;
    const reader = new FileReader();
    reader.onload = function (e) {
      const text1 = e.target.result;
      retrieveddata = text1.split("\r\n");
      datatosend.push(text1);
      setCsvData(retrieveddata.slice(0,-1));
      
    };
    reader.readAsText(event.target.files[0]);
  };



// To post data to the sever using fetch API
  const post = async (e) => {
    e.preventDefault();
    // console.log(csvuploaded)
    // if(window.csvuploaded){
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          csvData: csvData,
          fileName:filename,
          Email:email,
          Password:password,
          top:top,
          left:left,
          color:textColor,
          font:font,
          fontfile:fontfile,
          fontsize:fontSize,
          emailsubject:emailSubject,
          emailbody:emailBody
         }
         ),
  });
      console.log(res);
      alert("Sending Mails")
    // }
//     else{
//      var alertcsv= document.getElementById('alertcsv')
//      alertcsv.innerHTML="<strong>Please upload the csv first</strong>"
     
// alertcsv.style.margin="0px";
//     }
   
  };

  const sendEmailFormat = ()=>{
      console.log("Email format Set")
  }

  const uploadTemplate = async (e)=>{
    e.preventDefault();
     let file = image;
     console.log(file);
     let formdata = new FormData();
     formdata.append('template',file)
     console.log(formdata);
     generate_certificate();
    const response = await axios({
       url:'/upload',
       method:"POST",
       headers:{
        'Content-Type': 'multipart/form-data',
       },
       data: formdata
     })
     console.log(response);
     };
    useEffect(()=>{
    
      // if(!document.querySelector('#mouse').onmouseout && document.querySelector('p').onclick ){
        document.querySelector('#name').addEventListener('mousedown',mousedown);
        function mousedown(e){
          console.log("mousedown")
          // document.querySelector('#name').style.color="blue"
            let init_left=e.target.clientX
            let init_top=e.target.clientY
           window.addEventListener('mousemove',mousemove)
            window.addEventListener('mouseup',mouseup)
            // document.querySelector('#name').addEventListener('mousemove',mousemovee)
            // document.querySelector('#name').addEventListener('mouseup',mouseupp)
            
            function mousemove(e){
              let new_left
              let new_top
              console.log("mousemove")
              // if(e.clientY<737){
                new_left=e.clientX-init_left
                new_top=e.clientY-init_top
              // }
              // else{
              //    new_left=e.clientX-init_left
              //  new_top=(e.clientY-init_top)
              // }
              
           console.log(document.querySelector('#name').style.top,window.innerHeight, document.body.scrollHeight, document.body.offsetHeight, 
            document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight,document.documentElement.scrollHeight )
              // const rect=document.querySelector('#name').getBoundingClientRect()
              document.querySelector('#name').style.left=parseInt(document.querySelector('#name').style.left)+new_left+"px";
              document.querySelector('#name').style.top=parseInt(document.querySelector('#name').style.top)+new_top+"px";
              // document.querySelector('#name-container').style.left=rect.left+new_left+"px";
              // document.querySelector('#name-container').style.top=rect.top+new_top+"px";
              init_left=e.clientX
              init_top=e.clientY
            }
            function mouseup(e){
              console.log("mouseup")
             window.removeEventListener('mousemove',mousemove)
              window.removeEventListener('mouseup',mouseup)
            }
        }
         
      //      const extendtools=document.querySelector('.br')
      //      extendtools.addEventListener('mousedown',mouseD)
      // function mouseD(e){
        
      //   extendtools.addEventListener('mouseup',mouseU)
      //   extendtools.addEventListener('mousemove',mouseM)
      //   const rect=document.querySelector('#name').getBoundingClientRect()
      //   let init_height=rect.height;
      //  let init_x=e.clientX
      //   function mouseM(e){
      //     let perc=(e.clientX-init_x)*100/init_height
      //     document.querySelector('#name').style.fontSize=parseInt(document.querySelector('#name').style.fontSize)+perc+"px"
      //     document.querySelector('#name-container').style.width=parseInt(document.querySelector('#name').style.width)+"px"
      //     document.querySelector('#name-container').style.height=parseInt(document.querySelector('#name').style.height)+"px"
      //     init_x=e.clientX
      //   }
      //   function mouseU(e){
      //     extendtools.removeEventListener('mousemove',mouseM)
      //     extendtools.removeEventListener('mouseup',mouseU)
      //   }

        
      // }
                
    // }
  },[])
  return (
    <div>
      {/* <div id="navbar"> */}
        {/* <img height="35px" width="35px" src={"download.png"}/>  */}
        {/* <strong>  Developer Students Club Vishwakarma Institute of Technology Pune  </strong> */}
        {/* <img height="35px" width="35px" src={"download.png"}/>  */}

      {/* </div> */}
      <div id="main" class="container">
      <div class="card" style="width: 18rem;">
        <div  class="card-body" id="App">
        
          <div id="capture" >
            {/* <div id="mouse"> */}
            
             {/* <div  id="name-container"
              // onClick={(e)=>{e.target.style.backgroundColor="yellow";e.target.style.top=e.clientY+"px";e.target.style.left=e.clientX+"px";console.log("done")} }
              >
              <div class="extend tl"></div>
              <div class="extend tr"></div>
              
              <div class="extend bl"></div>
              <div class="extend br"></div>
              </div>  */}
              <p id="name">{name}</p>
            {preview ? (
              <img src={preview} alt=""  id="template" />
            ) : (
              <p id="template"> </p>
            )}
          {/* </div> */}
          </div>
          <div id="guidelines">
            {/* <br/> */}
           {/* <h1>hello</h1> */}
            <h2 class="card-title" id="uploadtitle">Upload the certificate template</h2>
            <input
              type="file"
              name="template"
              id="image_input"
              accept="image/*"
              onChange={(e) => {
                document.getElementById("guidelines").style.display = "none";
                document.getElementById("template").style.position = "absolute";
                
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  //************* */
                  setFileName(file.name)
                  //********** */
                  uploaded();
                } else {
                  setImage(null);
                }
              }}
            />
          
            </div>
         
        
        </div>
        {/* <br /> <br /> */}
        </div>
        <div id="side-panel">
          <div id="tools">
            {/* <br /> */}
            <img
              id="toggle"
              height="35px"
              width="35px"
              src={"gdgtogglein.png"}
              onClick={() => {
                if (toggled == true) {
                  var sidepanel = document.getElementById("side-panel");
                  sidepanel.style.transform = "translate3d(0.5px,0,0)";
                
                  document.getElementById("toggle").src = "gdgtoggleout.png";
                  toggled = false;
                } else {
                  var sidepanel = document.getElementById("side-panel");
                  sidepanel.style.transform = "translate3d(250.5px,0,0)";
                  document.getElementById("toggle").src = "gdgtogglein.png";
                  toggled = true;
                }
              }}
            />
            <br />
            <br />
            <img onClick={openModal} height="30px" id="ado"
              width="30px" src={"advanced-options.png"}/>
              
            {/* <img src=""  id="advanced_btn" onClick={openModal}></img> */}
        <Modal
        
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <h2 id="#advopts" >Advanced Options</h2>
        <div className="fcontainer">
          <div className="inputs">
            <div className="subject">
            <label htmlFor="subject_input">Enter Subject : </label>
            <input type="text" name="subject_input" onChange={(e)=>{
                setEmailSubject(e.target.value)
            }}/>
            </div>
            <br />
            <div className="email_body">
              <textarea name="email_body" id="" cols="40" rows="22" onChange={(e)=>{
                setEmailBody(e.target.value)
              }}>Enter HTML Body here. Enter $ for name</textarea>
            </div>
            <br />
            <button id="setemail" type="submit" onClick={sendEmailFormat}>Set Email Format</button>
          </div>
          <div className="sample-image">
            <img src={emailTemplate} alt="" />
          </div>
        </div>
        
        <button id="close" onClick={closeModal}>close</button>
      </Modal>
      {/* <br /> */}
            {/* <br /> */}
            <img
              src={"font.png"}
              height="30px"
              width="30px"
              onClick={() => {
                // var sidepanel = document.getElementById("side-panel");
                // sidepanel.style.transform = "translate3d(0.5px,0,0)";
                // document.getElementById("toggle").src = "gdgtoggleout.png";
                if( document.getElementById('fontselect').style.display==="block")
                document.getElementById('fontselect').style.display="none"
                else
                document.getElementById('fontselect').style.display="block"

              }}
            />
            <select
              id="fontselect"
              onChange={(x) => {
                console.log(x.target.value);
                document.getElementById("name").style.fontFamily =
                  x.target.value;
              }}
            >
              <option value="'Oswald', sans-serif">Oswald</option>
              <option selected value="'Open Sans Condensed', sans-serif">Open Sans</option>
              <option value="'Playfair Display', serif"> Playfair Display</option>
              <option value="'Nanum Gothic', sans-serif">Nanum Gothic</option>
              <option value="'Carattere', cursive">Carattere Cursive</option>
              <option value="'Kaushan Script', cursive">Kaushan Script</option>
              <option value="'Merienda', cursive">Merienda Cursive</option>
              
            </select>
            <br />
            <br />
            {/* <img
              src={"color.png"}
              onClick={() => {
                var sidepanel = document.getElementById("side-panel");
                sidepanel.style.transform = "translate3d(0.5px,0,0)";
                document.getElementById("toggle").src = "gdgtoggleout.png";
              }}
              height="25px"
              width="25px"
            /> */}
            <input
              id="colors"
              type="color"
              onChange={(e) => {
                setColor(e.target.value);
                changeColor();
                
              }}
            />
            {/* <br />
            <br />
            <img src={"up.png"} onClick={move_up} height="25px" width="25px" />
            
            <br />
            <br /> */}
            <br/><br/>
            {/* <img
              src={"down.png"}
              onClick={move_down}
              height="25px"
              width="25px"
            />
           
            <br />
            <br />
            <img
              src={"left.png"}
              onClick={move_left}
              height="25px"
              width="25px"
            />
            
            <br />
            <br />
            <img
              src={"right.png"}
              onClick={move_right}
              height="25px"
              width="25px"
            />
             */}
           {/* <br/> */}
           {/* <br/> */}
            <img
              src={"expansion.png"}
              onClick={fontplus}
              height="30px"
              width="30px"
            />
            <br />
            <br />
            <img
            
              src={"minus.png"}
              onClick={fontmin}
              height="30px"
              width="30px"
            />
            
            <img />
          </div>
          <div id="controls">
         <div class="steps" id="step1">
         
{/* <p >Step 1: Upload Template</p> */}
         {/* <p>Step 2: Enter sample text</p> */}
         <input
              id="entertesttext"
              type="text"
              name=""
              placeholder="Enter your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
         </div>
         <div class="steps" id="step2">
         <br />
          {/* <label>Step 2: Upload the CSV</label> */}
            {/* <label id="csvlabel">Upload CSV</label> */}
            <br />
            <br />
            <input id="upcsv" type="file" name="csv" onChange={readCSV} />
            <br />
         </div>
         <div class="steps" id="step3">
        
         <p>Enter Sender's details</p>
         
         <input id="email" type="email" placeholder="Enter your email" onChange={(e)=>{
              setEmail(e.target.value)
            }} />
            <input id="password" type="password" placeholder="Enter your password" onChange={(e)=>{
              setPassword(e.target.value)
            }} />
             <p id="alertcsv"></p>
         </div>
         <div class="steps" id="step4">    <br />
            {/* <button type="button" onClick={generate_certificate}>
              Generate Certificates
            </button> */}
            
            <button  onClick={uploadTemplate}>Upload Template</button>
            <br />
            <button  type="button" onClick={post}>
              Send Emails
            </button>
           
          <br />
          <button  onClick={download}>Download</button> 
          </div>
  
        
        
  
        </div>
        </div>
      </div>
      {/* <div id="scroll"></div> */}
      <Footer/>
    </div>
  );
}

export default App;
