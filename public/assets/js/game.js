/*
  The purpose of this file is to contain the logic required for the pictionary
  game. It randomizes the selection of questions, displays them, and deals with
  guessing. 

  Authors: Clifford Brown, Lucas Waddell, Sebastion, Olly MacDonald

  Work Done: Olly MacDonald focused on displaying the questions
  Clifford Brown and Sebastian Cox focusd on making guesses and creating game logic
  Nickieda Johnson and Lucas Waddell focused on logic for playing sounds
 */

// ------------------------------Global Constants and Variables------------------------------
/* The server "Socket" used to connect.
 * The Internet Protocol is 140.184.230.209 as
 * specified in the Software Requirements
 * and the Transport Layer Protocol is 3000.
 * The http server is not part of the Secure Socket Layer.
 */
const SERVER_URL = "http://140.184.230.209:3000";

// Getting playbutton, settingsbutton, success, and mistake image HTML elements
const playButton = document.getElementById("playButton");
const settingsButton = document.getElementById("settingsButton");
const successImage = document.getElementById("successImage");
const mistakeImage = document.getElementById("mistakeImage");

// Global array containing an object for each question.
// This is never manipulated and serves as the comprehensive list
// of questions
const allQuestions = [
  { id: "0", name: "aqq", img: "aqq.jpg", audio: "aqq.wav" },
  { id: "1", name: "eliey", img: "eliey.jpg", audio: "eliey.wav" },
  { id: "2", name: "kesalk", img: "kesalk.jpg", audio: "kesalk.wav" },
  { id: "3", name: "ki'l", img: "ki'l.jpg", audio: "ki'l.wav" },
  { id: "4", name: "ltu", img: "ltu.jpg", audio: "ltu.wav" },
  { id: "5", name: "mijisi", img: "mijisi.jpg", audio: "mijisi.wav" },
  { id: "6", name: "ni'n", img: "ni'n.jpg", audio: "ni'n.wav" },
  { id: "7", name: "teluisi", img: "teluisi.jpg", audio: "teluisi.wav" },
  { id: "8", name: "wiktm", img: "wiktm.jpg", audio: "wiktm.wav" },
];

//Make a copy of all the questions to manipulate freely.
//This way, when user beats the game, we can reset the array containing all the questions
//and do not need to worry about destructive manipulation.
var remainingQuestions = JSON.parse(JSON.stringify(allQuestions));

//Variable instantiation. Plurals are lists.
var correctAnswers = [];
//Variable to hold current correct answer (changes each round)
var correctAnswer;
//Variable to hold the list containing the current questions being asked each round.
var currentQuestions;

// ------------------------------Functions------------------------------

/*
  Purpose: The purpose of this function is to generate random integers within a range

  Parameters: (1) min: The minimum number in range of randoms to generate
              (2) max: The maximum number in range of randoms to generate

  Return: A random single integer in the given range

  Author: Olly Macdonald
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/*
  Purpose: The purpose of this function is to get n random elements from an array without having
        any destructive effects on the original array.
        The ... (spread syntax) is used to create a copy of the array that we
        want to pick elements from. The sort function gets passed an arrow function that 
        serves as a comparison function. 

        The sort function always takes in two items from the array. Math.random 
        returns a random number between 0 and 1. 0.5 is used to that the values that
        math.random returns can now also be negative (0.3424 - 0.5 < 0). If sort gets
        a value greater than 0, it sorts the second element before the first. 
        If the value is less than 0, it sorts the first element before the second. 

        Slice is then used to make a copy of the randomized array from the 0th index
        to the nth index that we desire, and returns it. 

        This is not purely proprietary code. It is a common problem and 
        many, many examples exist on the internet. 

  Parameters: (1) questions: The array to pick random questions from 
              (2) n: The number of random elements to return

  Return: An array of n random elements

  Author: Lucas Waddell
 */
function getRandoms(questions, n) {
  const randomized = [...questions].sort(() => 0.5 - Math.random());

  return randomized.slice(0, n);
}

/*
  Purpose: The purpose of this function of the find the desired element in
          the array of remaining questions based on a value. It searches for the element 
          whos name is the desired value, then returns the value of the user specified key.

  Parameters: (1) key: The key to return from the element that has the desired name value
              (2) val: The val of the name field in the array of remaining questions to look for

  Returns: The element that was found

  Authors: Clifford Brown
 */
function findElement(key, val) {
  return remainingQuestions.find((element) => element.name == val)[key];
}

/*
  Purpose: The purpose of this function is to play the audio clip for the current word.
          It checks if the audio clip is a reference to a .wav file, or if it is an
          audioURL that the user has created. Based on that, it will play the audio clip by either 
          loading the .wav file or creating a new audio object from the audio URL.

  Parameters: None

  Return: Plays audio if successful, logs error if failed

  Author: Lucas Waddell, Nickieda Johnson
*/
function playSound() {
  // get activeWord container
  const activeWord = document.getElementById("activeWord").textContent;
  //find the value for the audio key where the elements name is the active word
  var audioName = findElement("audio", activeWord);

  // check if audio is url or wav file
  let audio = audioName.includes(".wav")
    ? new Audio(`./assets/audioFiles/${audioName}`)
    : new Audio(audioName);
  // Play the audio file, catching any errors and logging them to console
  audio.play().catch((err) => {
    console.log(err);
    alert("There was an error. please try again later");
  });
}

/*
  Purpose: The purpose of this function is to load the questions for the user. 
            It is first loaded at runtime and then gets called again should the 
            user pick the correct answer. It checks if the user got all the questions right, and
            will reuse pictures that have already been guessed correctly when the user only has 1 or 2
            questions left. 

            To load the questions, the function picks 3 random questions from the users remaiming
            questions. It then picks a random integer between 0 and 2, and assigns that element to be
            the correct answer for this round. The middle of the screen then displays the name of the 
            correct answer. These three questions then get put in a random order. This ensure that 
            the correct question will not always be in the same box. Lastly, the three questions get
            injected into the html.

  Parameters: None

  Return: None

  Authors: Olly Macdonald, Lucas Waddell
*/
function loadQuestions() {
  //if the user got all answers right, call beatTheGame
  if (correctAnswers.length == 9) {
    beatTheGame();
  }

  //If there are less than three questions left and all q's havent been answered
  if (remainingQuestions.length < 3 && correctAnswers.length < 9) {
    //pick a correct answer from the remaining questions
    correctAnswer =
      remainingQuestions[getRandomInt(0, remainingQuestions.length - 1)];

    //Determine how many questions will need to be added to the current remaining ones
    var numQuestionsToAdd = 3 - remainingQuestions.length;

    //pick however many questions at random from ones user has already gotten correct
    var questionsToAdd = getRandoms(correctAnswers, numQuestionsToAdd);

    //push those questions onto the array of remaining questions
    remainingQuestions.push(questionsToAdd[0]);

    //set the current questions equal to the remaining questions
    currentQuestions = remainingQuestions;
  } else {
    // pick three questions from the list of all questions.
    currentQuestions = getRandoms(remainingQuestions, 3);
    //pick one to bethe right answer
    correctAnswer = currentQuestions[getRandomInt(0, 2)];
  }

  // Display word associated with current correct answer
  document.getElementById("activeWord").innerHTML = correctAnswer.name;

  //randomize order of current questions;
  //This is an application of the "Schwartzian transform". The logic behind
  //the transform can be found at : "https://en.wikipedia.org/wiki/Schwartzian_transform"
  //The source for this code was: "https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array"
  let randomOrderedQuestions = currentQuestions
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  // logic for insertion of the three chosen pictures into the game
  let params = '<input class="picButton" type="image" src="./assets/images/';
  let picNum = 1;
  //iterate through the randomly ordered list of questions
  randomOrderedQuestions.forEach((question) => {
    // Use escape quotes to deal with words that have ' in them
    let dimensions = `" width="325" height="325" onclick="choose(&quot;${question.name}&quot;)""/>`;
    document.getElementById(`pic${picNum}`).innerHTML =
      params + question.img + dimensions;
    picNum += 1;
  });
}

/*
  Purpose: The purpose of this function is to removed a desired JSON object from a JSON array.
          The index of the element to be removed is found and if that value is not undefined, 
          it gets spliced out of the array. 

  Parameters: (1) arr: The array to remove the element from
              (2) index: The name of the element to be removed 

  Returns: None

  Author: Sebastian Cox, Olly Macdonald
*/
function removeElement(arr, answer) {
  const indexToRemove = arr.findIndex((element) => element.name === answer);
  if (indexToRemove !== undefined) {
    arr.splice(indexToRemove, 1);
  }
}

/*
  Purpose: The purpose of this function is to allow the user to make guesses. 
          If the user makes a correct guess, the questions is removed from the list of 
          remaining questions and added to the list of answers they have gotten correct. A picture is shown
          on screen that correlates to them making a correct or incorrect guess
  
  Parameters: (1) selection: The selection the user made 

  Returns: None

  Author: Sebastian Cox, Clifford Brown
*/
function choose(selection) {
  if (selection == correctAnswer.name) {
    //add correct answer to correctAnswers:
    correctAnswers.push(correctAnswer);

    //remove question from all questions
    removeElement(remainingQuestions, selection);

    //show success image
    var successDiv = document.getElementById("correctAnswer");
    successDiv.style.display = "block";
    successImage.style.display = "block";
  } else {
    //show mistake photo
    var mistakeDiv = document.getElementById("incorrectAnswer");
    mistakeDiv.style.display = "block";
    mistakeImage.style.display = "block";
  }
}

/*
  Purpose: The purpose of this function is to let the user know they have gotten
          every question correct. Once this happens, it empties their list of correct answers, 
          resets the array of remaining questions they have, and sends the user back to the title page. 
  
  Parameters: None

  Returns: None

  Author: Clifford Brown, Sebastian Cox
*/
function beatTheGame() {
  alert("Woo hoo!! you won the game. Click ok to restart or close this page");
  //reset the correct answer list and restart game
  correctAnswers.length = 0;
  //add all questions back to remaining questions
  remainingQuestions = JSON.parse(JSON.stringify(allQuestions));

  //reload questions
  loadQuestions();
  //Show the title page upon getting all questions right
  var titlePage = document.getElementById("titlePage");
  titlePage.style.display = "block";
}

/*
  Purpose: The purpose of this function is to hide any element that gets
           passed to it by changing its CSS "display" properties

  Parameters: (1): The element to be hidden

  Returns: None

  Author: Lucas Waddell
 */
function hideElement(element) {
  var e = document.getElementById(element);
  if (e.style.display === "none") {
    e.style.display = "block";
  } else {
    e.style.display = "none";
  }
}

/*
  Purpose: The purpose of this function is to simply test the connection to the server. 
  Since this game does not require the server, this method is not really important.
*/
function settings() {
  console.log("settings");
  let obj = {
    test: 1,
  };
  $.post(SERVER_URL + "/testSettings", obj);
}

/*
  Purpose: The purpose of this function is to test the connection to the server.
    Wrapper for the hide element function to add into the correct event listener.
    This way when user clicks the animal, it will disappear along with the div

  Parameters: None

  Returns: None

  Author: Nickieda Johnson
 */
function hideSuccess() {
  hideElement("successImage");
  hideElement("correctAnswer");
  loadQuestions();
}

/*
  Purpose: Wrapper for the hide element function to add into the event mistake listener.
  This way when user clicks the animal, it will disappear along with the div

  Parameters: None

  Returns: None

  Author: Nickieda Johnson
 */
function hideMistake() {
  hideElement("mistakeImage");
  hideElement("incorrectAnswer");
}

// ------------------------------Binding Functions to Button Clicks------------------------------

playButton.addEventListener("click", playSound, false);
settingsButton.addEventListener("click", settings, false);
successImage.addEventListener("click", hideSuccess, false);
mistakeImage.addEventListener("click", hideMistake, false);
