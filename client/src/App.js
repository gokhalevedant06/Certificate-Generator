import "./App.css";
import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import domtoimage from "dom-to-image";
import axios from 'axios'
import emailTemplate from '../src/EmailFormat.jpg'
import Footer from './footer'
import Carousel from './carousel.js'

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
 const [tempuploaded,settempuploaded]=useState(false)
 const [csvuploaded,setcsvuploaded]=useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
     
      console.log(document.getElementById("name").getBoundingClientRect().width)
    
      document.querySelector('#App').style.width="auto";
   
  
      document.getElementById("name").style.fontweight = "bold";
      document.getElementById("name").style.color = "black";
      
    }
    
 
  
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
     
      console.log("here is height ",parseInt(window.getComputedStyle(text).fontSize, 10))
      setTop(parseFloat(text.style.top)+1.017*parseFloat(window.getComputedStyle(text).fontSize, 10))
      console.log("second done")
  
      setLeft(parseFloat(text.style.left))
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
        document.getElementById('progressbar').style.width="0%"
          document.querySelector('#name').addEventListener('mousedown',mousedown);
          function mousedown(e){
            console.log("mousedown")
    
              let init_left=e.target.clientX
              let init_top=e.target.clientY
             window.addEventListener('mousemove',mousemove)
              window.addEventListener('mouseup',mouseup)
             
              function mousemove(e){
                let new_left
                let new_top
                console.log("mousemove")
                // if(e.clientY<737){
                  new_left=e.clientX-init_left
                  new_top=e.clientY-init_top
               
                
             console.log(document.querySelector('#name').style.top,window.innerHeight, document.body.scrollHeight, document.body.offsetHeight, 
              document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight,document.documentElement.scrollHeight )
                document.querySelector('#name').style.left=parseInt(document.querySelector('#name').style.left)+new_left+"px";
                document.querySelector('#name').style.top=parseInt(document.querySelector('#name').style.top)+new_top+"px";
                init_left=e.clientX
                init_top=e.clientY
              }
              function mouseup(e){
                console.log("mouseup")
               window.removeEventListener('mousemove',mousemove)
                window.removeEventListener('mouseup',mouseup)
              }
          }
           
    },[])

    
    return (
        <div>
       
        <div id="main" >
          <div id="App">
          
            <div id="capture" >
            
                <p id="name">{name}</p>
              {preview ? (
                <img src={preview} alt=""  id="template" />
              ) : (
                <p id="template"> </p>
              )}
            {/* </div> */}
            </div>
            <div id="guidelines" className="mr-4" >
            <div className="row">
  <div className="col-sm ml-2 mt-2 " >
  <div className="card  text-dark" style={{border:0+'px'}}>
  <img src={'dsccertph3.png'} height="635px" width="700px" className="card-img " alt="..."/>
  <div className="card-img-overlay">
    <p style={{fontSize:5+'rem'}} className="card-title ">Certificate Generator</p>
    <hr
        style={{
            color: color,
            backgroundColor: '#493d46',
            height: 3
        }}
    />
    <h3 className="card-text ml-2 ">Send all your mails with click of a button.</h3>
    <p className="card-text"></p>
  </div>
</div>
    
  </div>
    <div className="col-sm-5 mr-5"  id="outer" >
          <Carousel/>
        <div className="card" id="uploadcard" style={{width:100+'%'}}>
          <div className="card-body">
            <h2 className="mt-2" style={{fontSize:2+'rem'}} id="uploadtitle" ><strong>Upload the certificate template</strong></h2>
            <input className="mt-5"
              type="file"
              name="template"
              id="image_input"
              accept="image/*"
              onChange={(e) => {
                document.getElementById("guidelines").style.display = "none";
                document.getElementById("template").style.position = "absolute";
                settempuploaded(true)
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
    
  </div>
</div>
          

              </div>
          
          </div>
       
          
          <div id="side-panel">
            <div id="tools">
              {/* <br /> */}
              <img
              marginLeft="0rem"
                id="toggle"
                height="39px"
                width="38px"
                data-bs-toggle="tooltip" data-bs-placement="left" title="Toggle Options"
                src={"toggleout2.png"}
                onClick={() => {
                  if (toggled == true) {
                    var sidepanel = document.getElementById("side-panel");
                    sidepanel.style.transform = "translate3d(0.5px,0,0)";
                  
                    document.getElementById("toggle").src = "togglein.png";
                    toggled = false;
                  } else {
                    var sidepanel = document.getElementById("side-panel");
                    sidepanel.style.transform = "translate3d(236.5px,0,0)";
                    document.getElementById("toggle").src = "toggleout2.png";
                    toggled = true;
                  }
                }}
              />
            
             
              <img onClick={openModal} height="36px" id="ado"
              data-bs-toggle="tooltip" data-bs-placement="left" title="Set Email Format"
                width="40px" src={"gmail.png"}/>
               
              {/* <img src=""  id="advanced_btn" onClick={openModal}></img> */}
          <Modal
          
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
        >
          <h1 id="#advopts" >Advanced Options</h1>
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
                <textarea name="email_body"  cols="45" rows="10" onChange={(e)=>{
                  setEmailBody(e.target.value)
                }}>Enter HTML Body here. Enter $ for name</textarea>
              </div>
              <br />
              
              <button className="btn btn-primary" id="setemail" type="submit" onClick={()=>{sendEmailFormat();document.getElementById('progressbar').style.width="15%"}}>Set Email Format</button>
            </div>
            <div className="sample-image">
              <img src={emailTemplate} alt="" />
            </div>
          </div>
          
          <button  className="btn btn-danger" id="close" onClick={closeModal}>Close</button>
        </Modal>
        {/* <br /> */}
              {/* <br /> */}

              <img
              data-bs-toggle="tooltip" data-bs-placement="left" title="Enter Sample Text"
                src={"note.png"}
                data-toggle="modal" data-target="#detailsmodal"
                height="39px"
                width="42px"
               style={{marginTop:2+'rem'}}
              />
             <img src={"font4.png"}  onClick={() => {
                  var sidepanel = document.getElementById("side-panel");
                  sidepanel.style.transform = "translate3d(0.5px,0,0)";
                  document.getElementById("toggle").src = "togglein.png";
                
                }} 
                data-bs-toggle="tooltip" data-bs-placement="left" title="Font"
                style={{marginTop:3+'rem'}} width="37px" height="40px" />
              <br />
              <br />
              <input
              data-bs-toggle="tooltip" data-bs-placement="left" title="Text Color"
              className="btn btn"
                id="colors"
                type="color"
                onChange={(e) => {
                  setColor(e.target.value);
                  changeColor();
                  document.getElementById('progressbar').style.width="60%"
                }}
                style={{marginTop:2+'rem'}}
              />
             
              <img
              data-bs-toggle="tooltip" data-bs-placement="left" title="Increase Font"
                src={"plus2.png"}
                onClick={()=>{fontplus();document.getElementById('progressbar').style.width="70%"}}
                height="40px"
                width="40px"
              />
              
              <br />
              <br />
              <img
              data-bs-toggle="tooltip" data-bs-placement="left" title="Decrease Font"
              style={{marginTop:2+'rem'}}
                src={"minus1.png"}
                onClick={()=>{fontmin();document.getElementById('progressbar').style.width="70%"}}
                height="39px"
                width="39px"
              />
              
              <img data-toggle="modal" data-bs-toggle="tooltip" data-bs-placement="left" title="Sender's details" data-target="#detailsmodal" style={{marginTop:4+'rem'}} src={"details.png"} height="35px" weight="35px"/>
            </div>
            <div id="controls">
          <br/><br/>
           <button classNameName="btn btn-light" onClick={openModal}>Set Email Format</button>
      
           <button type="button" className="btn btn-light" data-toggle="modal" data-target="#detailsmodal">
  Enter Sample Text
</button>
                 
<select
className='btn bg-light text-dark'
                id="fontselect"
                onChange={(x) => {
                  console.log(x.target.value);
                  document.getElementById("name").style.fontFamily =
                    x.target.value;
                    document.getElementById('progressbar').style.width="48%"
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
              <input
              classNameName="btn btn-light"
                id="colorsbut"
                type="color"
                onChange={(e) => {
                  setColor(e.target.value);
                  changeColor();
                  document.getElementById('progressbar').style.width="60%"
                  
                }}
              />
              <button classNameName="btn btn-light" onClick={()=>{fontplus();document.getElementById('progressbar').style.width="70%"}}>Increase Font</button>
              <button classNameName="btn btn-light" onClick={()=>{fontmin();document.getElementById('progressbar').style.width="70%"}}>Decrease Font</button>
           
            <button style={{marginBottom:1+'rem'}} type="button" className="btn btn-light" data-toggle="modal" data-target="#detailsmodal">
 Enter Details
</button>
<label >Process Progress</label>
<div className="progress">
  <div className="progress-bar progress-bar-striped progress-bar-animated" id="progressbar" style={{width: 25+'%'}}></div>
</div>
          </div>
          </div>
        </div>
    

<div className="modal fade bd-example-modal-xl" id="detailsmodal" tabindex="-1" role="dialog" aria-hidden="true">
  <div className="modal-dialog modal-xl" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <p className="modal-title" id="exampleModalLabel">Upload CSV -{'>'} Enter sample text -{'>'} Save changes and adjust text -{'>'} Enter Email, Password -{'>'} Upload Template -{'>'} Send Mails!</p>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      
      <div id="down">
         
         <p className="hugetext">Enter Details and shoot victories!</p>
         <div className="flexit">
           <div>
           <label className="label">Upload CSV </label>
           <input id="upcsv" type="file" accept=".csv,.xlsx,.xls" name="csv" onChange={(e)=>{readCSV(e);setcsvuploaded(true);document.getElementById('progressbar').style.width="82%"}} />
           <p style={{marginLeft:1.4+'rem'}}>Upload according to the format specified in guidelines</p><hr/>
         <label className="label">Enter Sample Text</label>
       <input
               id="entertesttext"
               type="text"
               name=""
               placeholder="Enter your name"
               onChange={(e) => {
                 setName(e.target.value);
                 document.getElementById('progressbar').style.width="35%"
               }}
             /><br/>
             <label className="label">Email</label>
             <input id="email" type="email" placeholder="Enter your email" onChange={(e)=>{
               setEmail(e.target.value)
               
             }} />
             <br/>
             <label className="label">Password</label>
             <input id="password" type="password" placeholder="Enter your password" onChange={(e)=>{
               setPassword(e.target.value)
               document.getElementById('progressbar').style.width="100%"
             }} />
           
             </div>
             <div>
             <button className="btn " style={{backgroundImage:'radial-gradient(#002e62,#005d81)',color:'white',width:220+'px',height:60+'px',fontSize:1.3+'rem',marginTop:7+'rem',marginLeft:4+'rem'}} onClick={(e)=>{ if(tempuploaded){uploadTemplate(e);
             document.getElementById('sendmailbut').disabled=false}
             else{
               alert("Please upload the Certificate Image first")
             };document.getElementById('progressbar').style.width="95%"}}>Upload Template</button>
            <br/>
              <button id="sendmailbut" className="btn " type="button" style={{backgroundImage:'radial-gradient(#002e62,#005d81)',color:'white',height:60+'px',width:220+'px',fontSize:1.3+'rem',marginTop:1+'rem',marginLeft:4+'rem'}} onClick={post}> Send Emails</button>
             </div>
             </div>
             
             <hr/>


      </div>
      <div className="modal-footer">
        <p style={{marginRight:12+'rem'}}>See the guidelines for more understanding</p>
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

        
        </div>
        <Footer/>
      </div>
    
    )
}
export default App;