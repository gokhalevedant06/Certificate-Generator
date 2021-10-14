import "./App.css";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Footer from "./footer";
import Carousel from "./carousel.js";
import uptemp from "./upload_image.png";

function App() {
  var toggled = true;
  const [image, setImage] = useState();
  const [name, setName] = useState(" ");
  const [preview, setPreview] = useState();
  const [color, setColor] = useState("black");
  const [csvData, setCsvData] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [filename, setFileName] = useState("certificate.jpg");
  const [textColor, setTextColor] = useState("black");
  const [font, setFont] = useState("Open Sans Condensed");
  const [fontfile, setFontfile] = useState("OpenSansCondensed-Light");
  const [tempuploaded, settempuploaded] = useState(false);
  const [csvuploaded, setcsvuploaded] = useState("");
  const [fontSize, setFontSize] = useState("2rem");
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const modalBackgroundColor = {
    content: {
      backgroundColor: "	#c0e6dc",
    },
  };
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        document.getElementById("App").style.height = "auto";
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
    document.querySelector("#App").style.width = "auto";
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


  // To generate certificates
  const generate_certificate = () => {
    var text = document.querySelector("#name");
    setFontSize(parseInt(text.style.fontSize));
    setTop(
      parseFloat(text.style.top) +
        1.017 * parseFloat(window.getComputedStyle(text).fontSize, 10)
    );
    setLeft(parseFloat(text.style.left));
    setTextColor(text.style.color);
    var protofont = text.style.fontFamily;
    if (protofont === "Carattere, cursive") {
      setFontfile("Carattere-Regular");
      setFont("Carattere");
    } else if (protofont === '"Playfair Display", serif') {
      setFontfile("PlayfairDisplay-VariableFont_wght");
      setFont("Playfair Display");
      console.log("Its playfair display");
    } else if (protofont === "Merienda, cursive") {
      setFontfile("Merienda-Regular");
      setFont("Merienda");
      console.log("its merienda");
    } else if (protofont === "Oswald, sans-serif") {
      setFontfile("Oswald");
      setFont("Oswald ExtraLight");
      console.log("oswald");
    } else if (protofont === '"Kaushan Script", cursive') {
      setFontfile("KaushanScript-Regular");
      setFont("Kaushan Script");
    } else if (protofont === '"Open Sans Condensed", sans-serif') {
      setFont("Open Sans Condensed Light");
      setFontfile("OpenSansCondensed-Light");
    } else if (protofont === '"Nanum Gothic", sans-serif') {
      setFontfile("NanumGothic");
      setFont("Nanum Gothic");
      console.log("its gothic");
    } else {
      setFont("Open Sans Condensed Light");
      setFontfile("OpenSansCondensed-Light");
      console.log("No match");
    }

  };

  /**
   * To parse CSV
   * Stores parsed CSV in csvData state
   */
  //  let csvuploaded=false;
  var retrieveddata = [];
  const readCSV = (event) => {
    console.log(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (e) {
      const text1 = e.target.result;
      retrieveddata = text1.split("\r\n");
      if((retrieveddata.length)===1){
      retrieveddata = retrieveddata[0].split('\n')
      }
      setCsvData(retrieveddata.slice(0, -1));
    };
    reader.readAsText(event.target.files[0]);
  };

  // To post data to the sever using fetch API
  const post = async (e) => {
    e.preventDefault();
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        csvData: csvData,
        fileName: filename,
        Email: email,
        Password: password,
        top: top,
        left: left,
        color: textColor,
        font: font,
        fontfile: fontfile,
        fontsize: fontSize,
        emailsubject: emailSubject,
        emailbody: emailBody,
      }),
    });
    console.log(res);
    alert("Sending Mails");
  };

  const sendEmailFormat = () => {
    console.log("Email format Set");
  };

  const uploadTemplate = async (e) => {
    e.preventDefault();
    let file = image;
    console.log(file);
    let formdata = new FormData();
    formdata.append("template", file);
    generate_certificate();
    const response = await axios({
      url: "/upload",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formdata,
    });
    console.log(response);
  };

  useEffect(() => {
    if (
      csvuploaded.includes("1") &&
      csvuploaded.includes("2") &&
      csvuploaded.includes("3") &&
      csvuploaded.includes("4")
    ) {
      document.getElementById("sendmailbut").disabled = false;
    }
  }, [csvuploaded]);

  useEffect(() => {
    document.querySelector("#sendmailbut").disabled = true;
    document.getElementById("progressbar").style.width = "0%";
    document.querySelector("#name").addEventListener("mousedown", mousedown);
    function mousedown(e) {
      console.log("mousedown");

      let init_left = e.target.clientX;
      let init_top = e.target.clientY;
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);

      function mousemove(e) {
        let new_left;
        let new_top;
        console.log("mousemove");
        new_left = e.clientX - init_left;
        new_top = e.clientY - init_top;
        document.querySelector("#name").style.left =
          parseInt(document.querySelector("#name").style.left) +
          new_left +
          "px";
        document.querySelector("#name").style.top =
          parseInt(document.querySelector("#name").style.top) + new_top + "px";
        init_left = e.clientX;
        init_top = e.clientY;
      }
      function mouseup(e) {
        console.log("mouseup");
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      }
    }
  }, []);

  return (
    <div>
      <div id="main">
        <div id="App">
          <div id="capture">
            <p id="name">{name}</p>
            {preview ? (
              <img src={preview} alt="" id="template" />
            ) : (
              <p id="template"> </p>
            )}
          </div>
          <div id="guidelines" className="mr-4">
            <div className="row">
              <div className="col-sm ml-2 mt-2 ">
                <div className="card  text-dark" style={{ border: 0 + "px" }}>
                  <img
                    src={"1_home_left.png"}
                    height="670px"
                    width="700px"
                    className="card-img "
                    alt="..."
                  />
                   <div className="card-img-overlay">
                    <p style={{ fontSize: 5 + "rem" }} className="card-title ">
                    Certificate Generator
                    </p>
                    <h2
                      style={{ fontFamily: "Barlow" }}
                      className="card-text ml-2 "
                    >
                      Send all your mails <br />
                      with click of a button
                    </h2>
                    <p className="card-text"></p>
                  </div>
                </div>
              </div>
              <div className="col-sm-5 mr-5" id="outer">
                <Carousel />
                <div
                  className="card"
                  id="uploadcard"
                  style={{ width: 100 + "%",
                  backgroundImage: `url(${uptemp})`, }}
                >
                 <div className="card-body">
                    <h2
                      className="mt-5"
                      style={{
                        fontSize: 2 + "rem",
                        fontFamily: "Noto Sans Display",
                      }}
                      id="uploadtitle"
                    >
                      <strong>
                        Upload The <br />
                        Certificate Template
                      </strong>
                    </h2>
                    <input
                      className="btn btn pl-0  mt-3"
                      style={{ fontFamily: "Nanum Myeongjo" }}
                      type="file"
                      name="template"
                      id="image_input"
                      accept="image/*"
                      onChange={(e) => {
                        document.getElementById("guidelines").style.display =
                          "none";
                        document.getElementById("template").style.position =
                          "absolute";
                        settempuploaded(true);
                        const file = e.target.files[0];
                        if (file) {
                          setImage(file);
                          setFileName(file.name);
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
            <img
            alt=""
              marginLeft="0rem"
              id="toggle"
              height="39px"
              width="38px"
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Toggle Options"
              src={"2_toggleOut.png"}
              onClick={() => {
                if (toggled === true) {
                  var sidepanel = document.getElementById("side-panel");
                  sidepanel.style.transform = "translate3d(0.5px,0,0)";

                  document.getElementById("toggle").src = "3_toggleIn.png";
                  toggled = false;
                } else {
                  sidepanel = document.getElementById("side-panel");
                  sidepanel.style.transform = "translate3d(236.5px,0,0)";
                  document.getElementById("toggle").src = "2_toggleOut.png";
                  toggled = true;
                }
              }}
            />

            <i
              class="fas fa-envelope fa-2x"
              id="envelope"
              onClick={openModal}
              title="Set Email Format"
            ></i>

<Modal
              id="customModal"
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Example Modal"
              style={modalBackgroundColor}
            >
              <h1
                style={{ fontSize: 3 + "rem", fontFamily: "Quicksand" }}
                id="#advopts"
              >
                Advanced Options
              </h1>
              <div className="fcontainer">
                <div className="ml-5 mr-5 inputs">
                  <div className="subject">
                    <label
                      className="label mt-2"
                      style={{
                        width: 358 + "px",
                        marginLeft: 0 + "rem",
                        fontSize: 1.2 + "rem",
                      }}
                      htmlFor="subject_input"
                    >
                      Enter Subject 
                    </label>
                    <br />
                    <input
                      style={{
                        width: 358 + "px",
                        marginLeft: 0 + "rem",
                        border: "1.4px solid",
                        height: 50 + "px"
                      }}
                      className="mb-2 mt-2"
                      type="text"
                      name="subject_input"
                      onChange={(e) => {
                        setEmailSubject(e.target.value);
                      }}
                    />
                  </div>
                  <br />
                  <div className="email_body">
                    <textarea
                      name="email_body"
                      cols="45"
                      rows="10"
                      style={{
                        border: "1.4px solid",
                        paddingLeft: 0.3 + "rem",
                      }}
                      onChange={(e) => {
                        setEmailBody(e.target.value);
                      }}
                    >
                      Enter HTML Body here. Enter $ for name
                    </textarea>
                  </div>
                  <br />

                  <button
                    className="btn btn-primary"
                    id="setemail"
                    type="submit"
                    onClick={() => {
                      sendEmailFormat();
                      closeModal();
                      document.getElementById("progressbar").style.width =
                        "15%";
                    }}
                  >
                    Set Email Format
                  </button>
                </div>
                <div className="sample-image">
                  <img
                    style={{ border: "2px solid", borderColor: "#757575" }}
                    src="EmailFormat.jpg"
                    className="mr-5 mt-4 "
                    height="400px"
                    width="400px"
                    alt=""
                  />
                </div>
              </div>

              
            </Modal>

            <i class="fas fa-pen fa-2x" id="pen" title="Enter Example Text"></i>
            <i class="fas fa-font fa-2x" id="font" title="Choose Font"></i>
  
            <i class="fas fa-palette fa-2x" id="color_icon" title="Pick a color for example text"></i>

            <i
              class="fas fa-plus fa-2x"
              title="Increase Font"
              id="fontplus"
              onClick={() => {
                fontplus();
                document.getElementById("progressbar").style.width = "70%";
              }}
            ></i>
            <i
              class="fas fa-minus fa-2x"
              title="Decrease Font"
              id="fontminus"
              onClick={() => {
                fontmin();
                document.getElementById("progressbar").style.width = "70%";
              }}
            ></i>

            <i class="fas fa-key fa-2x" id="key" title="Sender's details"></i>
          </div>
          <div id="controls">
            <br />
            <br />
            <button className="btn btn-light" onClick={openModal}>
              Set Email Format
            </button>
            <div className="example_name">
              <input
                id="entertesttext"
                type="text"
                name=""
                placeholder="Enter your name"
                onChange={(e) => {
                  setName(e.target.value);
                  document.getElementById("progressbar").style.width = "35%";
                }}
              />
            </div>
            <select
              className="btn bg-light text-dark"
              id="fontselect"
              onChange={(x) => {
                document.getElementById("name").style.fontFamily =
                  x.target.value;
                document.getElementById("progressbar").style.width = "48%";
              }}
            >
              <option value="'Oswald', sans-serif">Oswald</option>
              <option selected value="'Open Sans Condensed', sans-serif">
                Open Sans
              </option>
              <option value="'Playfair Display', serif">
                {" "}
                Playfair Display
              </option>
              <option value="'Nanum Gothic', sans-serif">Nanum Gothic</option>
              <option value="'Carattere', cursive">Carattere Cursive</option>
              <option value="'Kaushan Script', cursive">Kaushan Script</option>
              <option value="'Merienda', cursive">Merienda Cursive</option>
            </select>
            <input
              className="btn btn-light"
              id="colorsbut"
              type="color"
              onChange={(e) => {
                setColor(e.target.value);
                changeColor();
                document.getElementById("progressbar").style.width = "60%";
              }}
            />
            <button
              className="btn btn-light"
              onClick={() => {
                fontplus();
                document.getElementById("progressbar").style.width = "70%";
              }}
            >
              Increase Font
            </button>
            <button
              className="btn btn-light"
              onClick={() => {
                fontmin();
                document.getElementById("progressbar").style.width = "70%";
              }}
            >
              Decrease Font
            </button>

            <button
              style={{ marginBottom: 1 + "rem" }}
              type="button"
              className="btn btn-light"
              data-toggle="modal"
              data-target="#detailsmodal"
            >
              Enter Details
            </button>
            <label>Progress</label>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                id="progressbar"
                style={{ width: 25 + "%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade bd-example-modal-xl"
        id="detailsmodal"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
            <div className="modal-header">
              
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div id="down">
                <p className="hugetext">Enter Details and shoot victories!</p>
                <div className="flexit">
                  <div>
                    <label className="label">Upload CSV </label>
                    <input
                      id="upcsv"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      name="csv"
                      onChange={(e) => {
                        readCSV(e);
                        setcsvuploaded(csvuploaded + "1");
                        document.getElementById("progressbar").style.width =
                          "82%";
                      }}
                    />
                    <p style={{ marginLeft: 1.4 + "rem" }}>
                      Upload according to the format specified in guidelines
                    </p>
                    <hr />
                    <label className="label">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setcsvuploaded(csvuploaded + "2");
                      }}
                    />
                    <br />
                    <label className="label">Password</label>
                    <input
                      required
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        document.getElementById("progressbar").style.width =
                          "100%";
                        setcsvuploaded(csvuploaded + "3");
                      }}
                    />
                  </div>
                  <div>
                    <button
                      className="btn "
                      style={{
                        backgroundImage: "radial-gradient(#002e62,#005d81)",
                        color: "white",
                        width: 220 + "px",
                        height: 60 + "px",
                        fontSize: 1.3 + "rem",
                        marginTop: 7 + "rem",
                        marginLeft: 4 + "rem",
                        fontFamily: "Barlow",
                      }}
                      onClick={(e) => {
                        if (tempuploaded) {
                          uploadTemplate(e);
                          setcsvuploaded(csvuploaded + "4");
                          alert("Successfully uploaded Certificate Template");
                        } else {
                          alert("Please upload the Certificate Image first");
                        }
                        document.getElementById("progressbar").style.width =
                          "99%";
                      }}
                    >
                      Upload Template
                    </button>
                    <br />
                    <button
                      id="sendmailbut"
                      className="btn "
                      type="button"
                      style={{
                        backgroundImage: "radial-gradient(#002e62,#005d81)",
                        color: "white",
                        height: 60 + "px",
                        width: 220 + "px",
                        fontSize: 1.3 + "rem",
                        marginTop: 1 + "rem",
                        marginLeft: 4 + "rem",
                        fontFamily: "Barlow",
                      }}
                      onClick={post}
                    >
                      {" "}
                      Send Emails
                    </button>
                  </div>
                </div>

                <hr />
              </div>
          
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default App;
