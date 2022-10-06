// Elements needed from webpage
const recordButton = document.getElementById("recordButton");
const recordButtonImage = document.getElementById("recordButtonImage");
const recordedAudioContainer = document.getElementById(
  "recordedAudioContainer"
);
const discardAudioButton = document.getElementById("discardButton");
const saveAudioButton = document.getElementById("saveButton");

let chunks = [];
let mediaRecorder = null;
let audioBlob = null; //blob that holds recorded audio

function record() {
  console.log("clicked");
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

//Triggered when a recording is done.
//When called, handled dataavailable event by pushing the blob on to the chunks array
function mediaRecorderDataAvailable(e) {
  chunks.push(e.data);
}

// called upon stopping the recording
function mediaRecorderStop() {
  //Check if any previous recordings have been left behind. if so, remove them
  if (recordedAudioContainer.firstElementChild.tagName === "AUDIO") {
    recordedAudioContainer.firstElementChild.remove();
  }
  // create new audio element to hold the recorded audio on html
  const audioElm = document.createElement("audio");
  audioElm.setAttribute("controls", ""); //add controls

  // Create a new blob from the recorded audio chunks
  audioBlob = new Blob(chunks, { type: "audio/mp3" });
  const audioURL = window.URL.createObjectURL(audioBlob);
  audioElm.src = audioURL;
  // insert audio html element
  recordedAudioContainer.insertBefore(
    audioElm,
    recordedAudioContainer.firstElementChild
  );
  recordedAudioContainer.classList.add("d-flex");
  recordedAudioContainer.classList.remove("d-none");
  //Empty mediaRecorder and chunks for future recordings
  mediaRecorder = null;
  chunks = [];
}

function discardRecording() {
  // confirm user wants to delete
  if (confirm("Are you sure you want to discard the recording?")) {
    resetRecording();
  }
}

function resetRecording() {
  //if first item in audio container has audio tag
  if (recordedAudioContainer.firstElementChild.tagName === "AUDIO") {
    //remove it
    recordedAudioContainer.firstElementChild.remove();
    //hide recorded audio buttons
    recordedAudioContainer.classList.add("d-none");
    recordedAudioContainer.classList.remove("d-flex");
  }
  //empty blob fo rnext recording
  audioBlob = null;
}

recordButton.addEventListener("click", record);
discardAudioButton.addEventListener("click", discardRecording);
