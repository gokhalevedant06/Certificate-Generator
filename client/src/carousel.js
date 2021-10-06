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
setTimeout(autoslideshow,4000);
}
    useEffect(()=>{
       
        autoslideshow();
       
    },[])
    
    return(
        
            <div class="card mb-4 mt-4 dark " style={{backgroundColor:'#BDC7C9', width:100+'%'}}>
                <div class="d-flex justify-content-center pb-2 pt-3" >
            <div className="slide active w-100 h-auto"><img  height="300px" width="100%" src={"Firstc.png"}></img></div>
            <div className="slide w-100 h-auto"><img height="300px"  width="100%" src={"secondc.png"}></img></div>
            <div  className="slide w-100 h-auto"><img  height="300px"  width="100%" src={"thirds.png"}></img></div>
            <div  className="slide w-100 h-auto"><img   height="300px"  width="100%" src={"fourths.png"}></img></div>
            </div>
  <div class="card-body pt-0">
  <div class=" pt-2 pb-1 d-flex justify-content-center">
                <button onClick={()=>{scbybutton(1)}} className="slbutton active"></button>
                <button onClick={()=>{scbybutton(2)}} className="slbutton "></button>
                <button onClick={()=>{scbybutton(3)}} className="slbutton "></button>
                <button onClick={()=>{scbybutton(4)}} className="slbutton "></button>
            </div>
    <p className="card-text text active"><em>Step 1 :  </em>Upload the template. Note that the preferred size is 1240 X 700.</p>
    <p  className=" card-text text "><em>Step 2 :  </em> From the side-panel, follow the steps sequentially. You can track progress by toggling it. </p>
    <p  className="card-text text "><em>Step 3 : </em> After entering the text, drag the text where you want. You can optionally modify it's font, color nad size from side-panel </p>
    <p  className="card-text text "><em>Step 4 : </em> You can set the Email format. Lastly enter the sender's details and shoot the mails.</p>
  </div>
</div>
            
           
    
    )
}

