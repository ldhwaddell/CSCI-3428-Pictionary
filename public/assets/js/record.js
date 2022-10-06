// Elements needed from webpage
const recordButton = document.getElementById("recordButton");
const recordButtonImage = document.getElementById("recordButtonImage");
const recordedAudioContainer = document.getElementById(
  "recordedAudioContainer"
);
const discardAudioButton = document.getElementById("discardButton");
const saveAudioButton = document.getElementById("saveButton");
const recordingsContainer = document.getElementById("recordings");

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

function saveRecording() {
  // create formData object
  const formData = new FormData();
  //add recording (the blob) to FormData obj
  formData.append("audio", audioBlob, "recording.mp3");
  //send request to server
  fetch("/record", {
    method: "POST",
    body: formData,
  })
    //convert response to the response.json value
    .then((response) => response.json())
    .then(() => {
      resetRecording();
      //fetch recordings
      fetchRecordings();
    })
    .catch((err) => {
      console.log(err);
      alert("There was an error. please try again later");
      resetRecording();
    });
}

//Get all recordings from the uplaods folder for the user
function fetchRecordings () {
    fetch("/recordings")
    .then((response) => response.json())
    .then((response) => {
      //if the response was a success and contains files
      if (response.success && response.files) {
        //remove all previous recordings shown
        recordingsContainer.innerHTML = "";
        response.files.forEach((file) => {
          //create the recording element
          const recordingElement = createRecordingElement(file);
          //add it the the recordings container
          recordingsContainer.appendChild(recordingElement);
        })
      }
    })
    .catch((err) => console.error(err));
  }
  
  //create the recording button
  function createRecordingElement (file) {
    //create the div
    const recordingElement = document.createElement("div");
    recordingElement.classList.add("col-lg-2", "col", "recording", "mt-3");
    //audio element
    const audio = document.createElement("audio");
    audio.src = file;
    audio.onended = (e) => {
      //when the audio ends, change the image inside the button to play again
      e.target.nextElementSibling.firstElementChild.src = "images/play.png";
    };
    recordingElement.appendChild(audio);
    //button element
    const playButton = document.createElement("button");
    playButton.classList.add("play-button", "btn", "border", "shadow-sm", "text-center", "d-block", "mx-auto");
    //image element inside button
    const playImage = document.createElement("img");
    playImage.src = "/images/play.png";
    playImage.classList.add("img-fluid");
    playButton.appendChild(playImage);
    //add event listener to the button to play the recording
    playButton.addEventListener("click", playRecording);
    recordingElement.appendChild(playButton);
    //return the container element
    return recordingElement;
  }
  
  function playRecording (e) {
    let button = e.target;
    if (button.tagName === "IMG") {
      //get parent button
      button = button.parentElement;
    }
    //get audio sibling
    const audio = button.previousElementSibling;
    if (audio && audio.tagName === "AUDIO") {
      if (audio.paused) {
        //if audio is paused, play it
        audio.play();
        //change the image inside the button to pause
        button.firstElementChild.src = "images/pause.png";
      } else {
        //if audio is playing, pause it
        audio.pause();
        //change the image inside the button to play
        button.firstElementChild.src = "images/play.png";
      }
    }
  }

recordButton.addEventListener("click", record);
discardAudioButton.addEventListener("click", discardRecording);
saveAudioButton.addEventListener("click", saveRecording);
