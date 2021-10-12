import React,{useEffect} from 'react';
import './carousel.css'

 export default function Carousel(){
    function scbybutton(n){
    var i=0;
    var slides=document.getElementsByClassName("slide");
    var texts=document.getElementsByClassName("text");
    for(i=0;i<slides.length;i++){
        slides[i].style.display="none";
        texts[i].style.display="none";
    }
slides[n-1].style.display="block";
texts[n-1].style.display="block";
var buttonsl=document.getElementsByClassName("slbutton");
for(i=0;i<buttonsl.length;i++){
    buttonsl[i].className=buttonsl[i].className.replace("active","");
}
buttonsl[n-1].className +="active";
k=n;

}
var k=0;

function autoslideshow(){
    var j=0;
    var y=document.getElementsByClassName("slide");
    var x=document.getElementsByClassName("text");
    for(j=0;j<y.length;j++){
        y[j].style.display="none";
        x[j].style.display="none";
    }
    k++;
    if (k > y.length) {k = 1}    

y[k-1].style.display="block";
x[k-1].style.display="block";
var getbutton =document.getElementsByClassName("slbutton");
for(var p=0;p<getbutton.length;p++){
    getbutton[p].className=getbutton[p].className.replace("active","");
}

getbutton[k-1].className +="active";
setTimeout(autoslideshow,6000);
}
    useEffect(()=>{
        autoslideshow();
        // eslint-disable-next-line
    },[])
    
    return(
        
            <div className="card mb-4 mt-3 " style={{backgroundColor:'#dfdfdf', width:100+'%'}}>
                <div className="d-flex justify-content-center pb-2 pt-3" >
            <div className="slide active w-100 h-auto"><img alt=""  height="300px" width="100%" src={"11_guidelines.jpg"}></img></div>
            <div className="slide w-100 h-auto"><img alt="" height="300px"  width="100%" src={"12_guidelines.jpg"}></img></div>
            <div  className="slide w-100 h-auto"><img alt="" height="300px"  width="100%" src={"13_guidelines.jpg"}></img></div>
            <div  className="slide w-100 h-auto"><img  alt="" height="300px"  width="100%" src={"14_guidelines.jpg"}></img></div>
            </div>
  <div className="card-body pt-0">
  <div className=" pt-2 pb-1 d-flex justify-content-center">
                <button onClick={()=>{scbybutton(1)}} className="slbutton active"></button>
                <button onClick={()=>{scbybutton(2)}} className="slbutton "></button>
                <button onClick={()=>{scbybutton(3)}} className="slbutton "></button>
                <button onClick={()=>{scbybutton(4)}} className="slbutton "></button>
            </div>
    <p className="card-text text active" style={{marginBottom:0+'rem'}}><em><b>Step 1 :</b> 
         </em> Upload the template <b>1240 X 700 px</b>(preferred). Note that <b>.jfif</b> extension is <b>not</b> compatible. Go through side-panel tools sequentially.</p>
    <p  className=" card-text text " style={{marginBottom:0+'rem'}}><em><b>Step 2 :</b> 
         </em>After entering, <b>drag</b> the text to position where you want the CSV names to appear.<b>Hover</b> over side-panel <b>shortcuts</b> to know what they're or <b>toggle</b> it.</p>
    <p  className="card-text text " style={{marginBottom:0+'rem'}}><em><b>Step 3 :</b>
         </em> You can <b>customize the email</b> subject and body from 'Set Email Format'. Use <b>$ notation</b> for dynamic CSV name to appear in body. </p>
    <p  className="card-text text " style={{marginBottom:0+'rem'}}><em><b>Step 4 :</b> 
        </em> Lastly upload the CSV of containing names and emails. Click on <b>Upload template</b> and then <b>Send Mails</b> to shoot the mails.</p>
  </div>
</div>
            
           
    
    )
}

