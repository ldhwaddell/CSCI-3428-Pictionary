/*
  The purpose of this file is to enable the user to record their own
  audio clips. Audio clips are saved client side for ease of access and to ensure
  that existence is non-persistent. 

  Authors: Clifford Brown and Olly Macdonald focused on displaying of buttons and letting the 
  user know that they are being recorded.
  Nickeda Johnson and Sebastian Cox focused on the playing, saving, recording, and stopping of recording.
  Lucas Waddell focused on the creation of media recorder object and saving of audio clips
 */

// ------------------------------Global Constants and Variables------------------------------

//Getting HTML elements for the recording related buttons
const recordButton = document.getElementById("recordButton");
const stopRecordingButton = document.getElementById("stopRecording");
const listenRecordingButton = document.getElementById("listenRecording");
const saveRecordingButton = document.getElementById("saveRecording");
const discardRecordingButton = document.getElementById("discardRecording");

// The array to save chunks of the audio
let chunks = [];
// The variable to hole media recorder object
let mediaRecorder = null;
// The variable to hold audio blob object
let audioBlob = null;
// The variable to hold the uniform resource locator of the audio clip
var audioURL;

/*
  Purpose: The purpose of this function is to push the data of audio 
          as it is being recorded into the chunks array. This is bound to the 
          mediaRecorder objects "ondataavailable" event

  Parameters: None

  Returns: None

  Authors: Lucas Waddell
*/
function mediaRecorderDataAvailable(e) {
  chunks.push(e.data);
}

/*
  Purpose: The purpose of this function is to create a new blob from the 
          chunks array and then use this blob to create an object URL that can be accessed
          and used to create the audio clip. After this, it destroys the mediarecorder 
          object and empties the chunks. This is bound to the 
          mediaRecorder objects "onstop" event

  Parameters: None

  Returns: None

  Authors: Nickieda Johnson, Sebastian Cox
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
  Purpose: The purpose of this function is to start a countdown to let the user know
          that they are being recorded. This is bound to the record button and changes the 
          text on screen to Starting and then counts down from three. Once the countdown reaches 0, 
          the record function is called and the user start being recorded.
  
  Parameters: None

  Returns: A promise to ensure that the countdown timer reaches 0

  Author: Olly MacDonald, Clifford Brown
*/
function recordingCountdown() {
  // Get the html element to change text of
  var timeLeftText = document.getElementById("activeWord");
  timeLeftText.innerHTML = "Starting!";

  var timeLeft = 3;
  // Create a promise to ensure countdown reaches 0
  return new Promise((resolve, reject) => {
    // Set interval to one second and start countdownTimer
    var countdownTimer = setInterval(() => {
      timeLeftText.innerHTML = `Recording in ${timeLeft}`;

      // If timer reaches 0: reset, resolve promise, call record function
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        resolve(true);
        record();
      }
      timeLeft--;
    }, 1000);
  });
}

/*
  Purpose: The purpose of this function is to record the users audio. Once 
          the microphone button is pressed, the users audio starts being recorded and
          the recording buttons are displayed. Next a check is done to ensure
          that the browser supports recording. This requires an HTTPS connection as
          well as a supported browser. Should the user be able to create a recording, 
          a check is done to ensure that a mediarecorder object does not already exist. 
          If it does not, one is created and the audio starts being recorded. 
          The functions described above are bound to the mediaRecorder object on events
          to ensure that data can be saved and the user can stop recording. 

  Parameters: None

  Returns: None

  Authors: Lucas Waddell, Clifford Brown, Olly Macdonald
*/
function record() {
  //Fix activeWord
  document.getElementById("activeWord").innerHTML = correctAnswer.name;
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
  Purpose: The purpose of this function is to allow the user to stop recording.
          It checks that a mediaRecorder currently exists, and if it does, it
          stops it.

  Parameters: None

  Returns: None
  
  Author: Sebastian Cox, Nickieda Johnson
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
  Purpose: The purpose of this function is to allow the user to listen to the
          recording they just made without having to save it. It creates a new audio 
          object from the audioURL that was created when the user stopped recording.
          It then plays the recording and catches any errors. 

  Parameters: None

  Returns: None
  
  Author: Sebastian Cox, Nickieda Johnson
 */
function playRecording() {
  //Create a new audio object from the blob and play it
  let audio = new Audio(audioURL);
  //Play the audio, catch any errors and log them to the console
  audio.play().catch((err) => {
    console.log(err);
    alert("There was an error. please try again later");
  });
}

/*
  Purpose: The purpose of this function is to discard the recording the user
          just made if they decide they do not like it. Upon pressing the button
          a check is done to stop the recording if the user had not yet stopped it. 
          The user is then asked to confirm that they want to discard the recording. 
          If they choose yes, the audioBlob is destroyed and the recording buttons
          are hidden.

  Parameters: None

  Returns: None
  
  Author: Sebastian Cox, Nickieda Johnson
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
  Purpose: The purpose of this function is to allow the user to save the audio
          clip to serve as the new sound for the current question. A check is first done
          to stop the recording if it hasnt been stopped yet. Next the current word to guess is 
          found (activeWord). If the user confirms they want to save the recording, the 
          list of remaining questions gets iterated over until the element that has the name
          that is equal to our activeWord is found. Once this happend, the audio of this element is
          then updated and the loop gets broken out of. After the element has been saved, the 
          audioBlob is destroyed and the recording buttons are hidden. 

  Parameters: None

  Returns: None
  
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

// ------------------------------Binding Functions to Button Clicks------------------------------
// adding the event listener to all recording buttons
recordButton.addEventListener("click", recordingCountdown, false);
discardRecordingButton.addEventListener("click", discardRecording, false);
stopRecordingButton.addEventListener("click", stopRecording, false);
listenRecordingButton.addEventListener("click", playRecording, false);
saveRecordingButton.addEventListener("click", saveAudio, false);
