/*
  The purpose of this file is to enable the user to record their own
  audio clips. Audio clips are saved client side for ease of access and to ensure
  that existence is non-persistent. 

  Authors: 
 */

//Getting HTML elements for the recording related buttons
const recordButton = document.getElementById("recordButton");
const stopRecordingButton = document.getElementById("stopRecording");
const listenRecordingButton = document.getElementById("listenRecording");
const saveRecordingButton = document.getElementById("saveRecording");
const discardRecordingButton = document.getElementById("discardRecording");

// variables required for the saving of audio
let chunks = [];
let mediaRecorder = null;
let audioBlob = null;
var audioURL;

/*
  The purpose of this function is to push the data of audio 
  as it is being recorded into the chunks array. This is bound to the 
  mediaRecorder objects "ondataavailable" event

  Authors: Lucas Waddell
*/
function mediaRecorderDataAvailable(e) {
  chunks.push(e.data);
}

/*
  The purpose of this function is to create a new blob from the 
  chunks array and then use this blob to create an object URL that can be accessed
  and used to create the audio clip. After this, it destroys the mediarecorder 
  object and empties the chunks. This is bound to the 
  mediaRecorder objects "onstop" event

  Authors: Lucas Waddell
*/
function mediaRecorderStop() {
  // Create a new blob from the recorded audio chunks
  audioBlob = new Blob(chunks, { type: "audio/mp3" });
  audioURL = window.URL.createObjectURL(audioBlob);

  //Empty mediaRecorder and chunks for future recordings
  mediaRecorder = null;
  chunks = [];
}

/*
  The purpose of this function is to record the users audio. Once 
  the microphone button is pressed, the users audio starts being recorded and
  the recording buttons are displayed. Next a check is done to ensure
  that the browser supports recording. This requires an HTTPS connection as
  well as a supported browser. Should the user be able to create a recording, 
  a check is done to ensure that a mediarecorder object does not already exist. 
  If it does not, one is created and the audio starts being recorded. 
  The functions described above are bound to the mediaRecorder object on events
  to ensure that data can be saved and the user can stop recording. 

  Authors: Lucas Waddell
*/
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
  The purpose of this function is to allow the user to stop recording.
  It checks that a mediaRecorder currently exists, and if it does, it
  stops it.
  
  Author: Lucas Waddell
 */
function stopRecording() {
  //Check if a mediaRecorder exists
  if (mediaRecorder) {
    mediaRecorder.stop();
  } else {
    console.log("MediaRecorder has already stopped recording");
  }
}

/*
  The purpose of this function is to allow the user to listen to the
  recording they just made without having to save it. It creates a new audio 
  object from the audioURL that was created when the user stopped recording.
  It then plays the recording and catches any errors. 
  
  Author: Lucas Waddell
 */
function playRecording() {
  //Create a new audio object from the blob and play it
  let audio = new Audio(audioURL);
  //Play it
  audio.play().catch((err) => {
    console.log(err);
    alert("There was an error. please try again later");
  });
}

/*
  The purpose if this function is to discard the recording the user
  just made if they decide they do not like it. Upon pressing the button
  a check is done to stop the recording if the user had not yet stopped it. 
  The user is then asked to confirm that they want to discard the recording. 
  If they choose yes, the audioBlob is destroyed and the recording buttons
  are hidden.
  
  Author: Lucas Waddell
 */
function discardRecording() {
  //Check to see if recoding needs to be stopped
  stopRecording();
  // confirm user wants to delete
  if (confirm("Are you sure you want to discard the recording?")) {
    //Empty the audio blob
    audioBlob = null;
    //Hide buttons
    document.getElementById("recordingButtons").style.display = "none";
  }
}

/*
  The purpose of this function is to allow the user to save the audio
  clip to serve as the new sound for the current question. A check is first done
  to stop the recording if it hasnt been stopped yet. Next the current word to guess is 
  found (activeWord). If the user confirms they want to save the recording, the 
  list of remaining questions gets iterated over until the element that has the name
  that is equal to our activeWord is found. Once this happend, the audio of this element is
  then updated and the loop gets broken out of. After the element has been saved, the 
  audioBlob is destroyed and the recording buttons are hidden. 
  
  Author: Lucas Waddell
 */
function saveAudio() {
  //make sure recording is stopped
  stopRecording();
  //get the active word
  const activeWord = document.getElementById("activeWord").textContent;

  if (confirm("Are you sure you want to save the recording?")) {
    //iterate through list remaining questions until it finds the one that
    //matches currect active activeWord, then update that audio to the audioURL
    for (var i = 0; i < remainingQuestions.length; i++) {
      if (remainingQuestions[i].name === activeWord) {
        remainingQuestions[i].audio = audioURL;
        break;
      }
    }

    //Empty the audio blob
    audioBlob = null;
    //Hide buttons
    hideElement("recordingButtons");
  }
}

// adding the event listener to all recording buttons
recordButton.addEventListener("click", record, false);
discardRecordingButton.addEventListener("click", discardRecording, false);
stopRecordingButton.addEventListener("click", stopRecording, false);
listenRecordingButton.addEventListener("click", playRecording, false);
saveRecordingButton.addEventListener("click", saveAudio, false);
