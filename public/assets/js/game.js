//file for the game logic
const playButton = document.getElementById("playButton");

// Global array containing 9 objects containing image files.
const allQuestions = [
  { id: "0", name: "aqq", img: "aqq.jpg", audio: "aqq.wav" },
  { id: "1", name: "eliey", img: "eliey.jpg", audio: "eliey.wav" },
  { id: "2", name: "kesalk", img: "kesalk.jpg", audio: "kesalk.wav" },
  { id: "3", name: "kil", img: "kil.jpg", audio: "kil.wav" },
  { id: "4", name: "ltu", img: "ltu.jpg", audio: "ltu.wav" },
  { id: "5", name: "mijisi", img: "mijisi.jpg", audio: "mijisi.wav" },
  { id: "6", name: "nin", img: "nin.jpg", audio: "nin.wav" },
  { id: "7", name: "teluisi", img: "teluisi.jpg", audio: "teluisi.wav" },
  { id: "8", name: "wiktm", img: "wiktm.jpg", audio: "wiktm.wav" },
];

//make a copy of all the questions to manipulate freely.
//This way, when user beats the game, we can reset the array contaiing all the questions
//and do not need to worry about destructive manipulation.
var remainingQuestions = JSON.parse(JSON.stringify(allQuestions));

//variable instantiation. Plurals are lists.
var correctAnswers = [];
//variable to hod current correct answer (changes each round)
var correctAnswer;
//variable to hold the list containing the current questions being asked each round.
var currentQuestions;

// Function for generating ints within a range
//     Author: Olly Macdonald
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/*
  function to get n random elements from an array without having
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

  Author: Lucas Waddell
 */
function getRandoms(questions, n) {
  const randomized = [...questions].sort(() => 0.5 - Math.random());

  return randomized.slice(0, n);
}

function findElement(key, val) {
  var audioName = remainingQuestions.find((element) => element.name == val)[
    key
  ];
  return audioName;
}

/*
  The purpose of this function is to play the audio clip for the current word.
  Author: Lucas Waddell
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
  audio.play().catch((err) => {
    console.log(err);
    alert("There was an error. please try again later");
  });
}

/*
  The purpose of this function is to load the questions for the user. 
  It is first loaded at runtime and then gets called again should the user pick the correct answer. 

  Authors: Olly Macdonald, Lucas Waddell
*/
function loadQuestions() {
  //if the user got all answers right, call beatTheGame
  if (correctAnswers.length == 9) {
    beatTheGame();
  }

  //If there are less than three questions left and all q's havent been answered
  if (remainingQuestions.length < 3 && correctAnswers.length < 9) {
    //console.log(JSON.stringify(correctAnswers));
    //pick a correct answer from the remaining questions

    //pick a correct answer from the remaining questions
    correctAnswer =
      remainingQuestions[getRandomInt(0, remainingQuestions.length - 1)];
    //console.log(`correct answer is: ${JSON.stringify(correctAnswer)}`)

    //Determine how many questions will need to be added to the current remaining ones
    var numQuestionsToAdd = 3 - remainingQuestions.length;
    //console.log(`questions to add: ${numQuestionsToAdd}`);

    //pick however many questions at random from ones user has already gotten correct
    var questionsToAdd = getRandoms(correctAnswers, numQuestionsToAdd);
    //console.log(`questions to add from correct ones are: ${JSON.stringify(questionsToAdd)}`);

    //push those questions onto the array of remaining questions
    remainingQuestions.push(questionsToAdd[0]);

    //console.log(`remaining questions are now: ${JSON.stringify(remainingQuestions)}`);

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
  var picNum = 1;
  //iterate through the randomly ordered list of questions
  randomOrderedQuestions.forEach((question) => {
    let dimensions = `" width="325" height="325" onclick="choose('${question.name}')""/>`;
    document.getElementById(`pic${picNum}`).innerHTML =
      params + question.img + dimensions;
    picNum += 1;
  });
}

/*
  Function to remove a desired JSON object from a JSON array.
  User supplies the array to remove and the name of the element to remove
*/
function removeElement(arr, answer) {
  const indexToRemove = arr.findIndex((element) => element.name === answer);
  if (indexToRemove !== undefined) {
    arr.splice(indexToRemove, 1);
  }
}

/*
  Function called each time the user clicks on a picture. 
  If the selection is correct, we push the correct answer onto
  the list of questions they have gotten correctly, then we remove
  this question from the list of remaining questions to that it will 
  not be asked again. 
*/
function choose(selection) {
  if (selection == correctAnswer.name) {
    //add correct answer to correctAnswers:
    correctAnswers.push(correctAnswer);

    //remove question from all questions
    removeElement(remainingQuestions, selection);

    //let user know they got it right
    //instead of alerts these could be function calls to create modals
    alert("Congratulations!!");

    // reload the questions
    loadQuestions();
  } else {
    //Could maybe put the logic here to deal with prioritizing words

    //instead of alerts these could be function calls to create modals
    alert("Please Try Again");
  }
}

/*
  Display alert once user beats the game (list of correct answer has length of 9)
  This should probably use a modal that has buttons for yes or no. Could also display 
  some fun graphics or play a congratulatory noise or something idk 
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
  Hide the element passed to function
 */
function hideElement(element) {
  var e = document.getElementById(element);
  if (e.style.display === "none") {
    e.style.display = "block";
  } else {
    e.style.display = "none";
  }
}

// adding the event listener to playSound button
playButton.addEventListener("click", playSound, false);
