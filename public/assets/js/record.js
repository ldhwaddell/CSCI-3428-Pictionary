// Elements needed from webpage
const recordButton = document.getElementById("recordButton");
const recordButtonImage = document.getElementById("recordButtonImage");

let chunks = [];
let mediaRecorder = null;
let audioBlob = null; //blob that holds recorded audio

function record() {
  //check if browser supports getUserMedia for recording
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support recording!");
    return;
  }
  // if it does, change microphone button to stop symbol as recording has started
  //condition ? exprIfTrue : exprIfFalse
  recordButtonImage.src = `/images/${
    mediaRecorder && mediaRecorder.state === "recording" ? "microphone" : "stop"
  }.png`;
  // if media recorder is false, start recording
  if (!mediaRecorder) {
    navigator.mediaDevices
      .getUserMedia({
        //only record audio
        audio: true,
      })
      //if success, then do:
      .then((stream) => {
        //browser prompts user here
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        //binding event handlers dataavailable and stop
        mediaRecorder.ondataavailable = mediaRecorderDataAvailable;
        mediaRecorder.onstop = mediaRecorderStop;
      })
      //catch any errors or deal with user denying mic access
      .catch((err) => {
        alert(`The following error occurred: ${err}`);
        // change image in button
        recordButtonImage.src = "/images/microphone.png";
      });
  } else {
    // stop recording
    mediaRecorder.stop();
  }
}

recordButton.addEventListener("click", record);
