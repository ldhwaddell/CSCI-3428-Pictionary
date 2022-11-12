const recordButton = document.getElementById("recordButton");
const stopRecordingButton = document.getElementById("stopRecording");
const listenRecordingButton = document.getElementById("listenRecording");
const saveRecordingButton = document.getElementById("saveRecording");
const discardRecordingButton = document.getElementById("discardRecording");

// variables required for the saving of audio
let chunks = [];
let mediaRecorder = null;
let audioBlob = null; //blob that holds recorded audio
var audioURL;

//Triggered when a recording is done.
//When called, handled dataavailable event by pushing the blob on to the chunks array
function mediaRecorderDataAvailable(e) {
  chunks.push(e.data);
}

// called upon stopping the recording
function mediaRecorderStop() {
  // Create a new blob from the recorded audio chunks
  audioBlob = new Blob(chunks, { type: "audio/mp3" });
  audioURL = window.URL.createObjectURL(audioBlob);

  //Empty mediaRecorder and chunks for future recordings
  mediaRecorder = null;
  chunks = [];
}

function record() {
  // Display recording buttons
  document.getElementById("recordingButtons").style.display = "block";
  // Put current word on display
  document.getElementById("displayWord").innerHTML = correctAnswer.name;
  //check if browser supports getUserMedia for recording
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support recording!");
    return;
  }
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
      });
  } else {
    mediaRecorder.stop();
  }
}

/*
  Called upon pressing the stop recording button, stops current recording 
  and triggers mediaRecorderStop. Only stoped MediaRecorder if one currently
  exists
 */
function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  } else {
    console.log("MediaRecorder has already stopped recording");
  }
}

function playRecording() {
  //Create a new audio object from the blob and play it
  var audio = new Audio(audioURL);
  audio.play().catch((err) => {
    console.log(err);
    alert("There was an error. please try again later");
  });
}

function discardRecording() {
  // confirm user wants to delete
  if (confirm("Are you sure you want to discard the recording?")) {
    //Empty the audio blob
    audioBlob = null;
    //Hide buttons
    document.getElementById("recordingButtons").style.display = "none";
  }
}

function saveRecording() {}

// adding the event listener to playSound button
recordButton.addEventListener("click", record, false);
discardRecordingButton.addEventListener("click", discardRecording, false);
stopRecordingButton.addEventListener("click", stopRecording, false);
listenRecordingButton.addEventListener("click", playRecording, false);
saveRecordingButton.addEventListener("click", saveRecording, false);
