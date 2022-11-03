//file for the game logic
const playButton = document.getElementById("playButton");

// list all files in the directory

// Global array containing 9 objects containing image files.
const questions = [
  { id: "0", name: "aqq", img: "aqq.jpg", audio: "aqq.wav" },
  { id: "1", name: "eliey", img: "eliey.jpg", audio: "eliey.wav" },
  { id: "2", name: "kesalk", img: "kesalk.jpg", audio: "kesalk.wav" },
  { id: "3", name: "kil", img: "kil.jpg", audio: "kil.wav" },
  { id: "4", name: "ltu", img: "ltu.jpg", audio: "ltu.wav" },
  { id: "5", name: "mijisi", img: "mijisi.jpg", audio: "mijisi.wav" },
  { id: "6", name: "nin", img: "nin.jpg", audio: "nin.wav" },
  { id: "7", name: "teluisi", img: "teluisi.jpg", audio: "teluisi.wav" },
  { id: "8", name: "wiktm", img: "wiktm.jpg", audio: "wiktm.wav" },
  ,
];

// The purpose of this function is to generate the default layout of the page.
//      Author: Olly MacDonald

function setup() {
  // Generate a value that corresponds to an element in the words array
  // In the future this should be able to skip empty cells/words marked
  // as inactive, but for now the array is static so we just pull from it.
  var currentCorrectID = getRandomInt(0, 8);

  // Generate a value that corresponds to one of three spaces for images
  var currentCorrectSpc = getRandomInt(1, 3);

  // Generate IDs for incorrect answers.
  // Loop until unused ID found for incorrect answer 1
  do {
    var incorrectID1 = getRandomInt(0, 8);
  } while (incorrectID1 === currentCorrectID);

  // Loop until unused ID found for incorrect answer 2
  do {
    var incorrectID2 = getRandomInt(0, 8);
  } while (incorrectID2 === currentCorrectID || incorrectID2 === incorrectID1);

  // Generate space val 1 or 2 for incorrect answer 1.
  // Incorrect answer 2 will get the other.
  var incorrectSpc1 = getRandomInt(1, 2);

  // Display word associated with current correct answer
  document.getElementById("activeWord").innerHTML =
    questions[currentCorrectID].name;

  // Display images. Code derived from example provided by Terrence Goldsmith
  // To be added: padding
  let str1 = '<input class="picButton" type="image" src="./images/';
  let str2 = '" width="325" height="325" onclick="choose(corr)"/>';
  let str3 = str1 + questions[currentCorrectID].img + str2;

  // If correct answer is displayed in space 1, the others will be displayed in 2 and 3
  if (currentCorrectSpc === 1) {
    document.getElementById("pic1").innerHTML = str3;

    // If incorrect answer 1 is in space 2, incorrect answer 2 will be displayed in space 3
    // If incorrect answer 1 is in space 3, incorrect answer 2 will be displayed in space 2
    if (incorrectSpc1 === 1) {
      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID1].img + str2;
      document.getElementById("pic2").innerHTML = str3;

      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID2].img + str2;
      document.getElementById("pic3").innerHTML = str3;
    } else {
      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID1].img + str2;
      document.getElementById("pic3").innerHTML = str3;

      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID2].img + str2;
      document.getElementById("pic2").innerHTML = str3;
    }
  }

  if (currentCorrectSpc === 2) {
    document.getElementById("pic2").innerHTML = str3;

    if (incorrectSpc1 === 1) {
      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID1].img + str2;
      document.getElementById("pic1").innerHTML = str3;

      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID2].img + str2;
      document.getElementById("pic3").innerHTML = str3;
    } else {
      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID1].img + str2;
      document.getElementById("pic3").innerHTML = str3;

      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID2].img + str2;
      document.getElementById("pic1").innerHTML = str3;
    }
  }

  if (currentCorrectSpc === 3) {
    document.getElementById("pic3").innerHTML = str3;

    if (incorrectSpc1 === 1) {
      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID1].img + str2;
      document.getElementById("pic1").innerHTML = str3;

      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID2].img + str2;
      document.getElementById("pic2").innerHTML = str3;
    } else {
      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID1].img + str2;
      document.getElementById("pic2").innerHTML = str3;

      str2 = '" width="325" height="325" onclick="choose(incorr)"/>';
      str3 = str1 + questions[incorrectID2].img + str2;
      document.getElementById("pic1").innerHTML = str3;
    }
  }
}

var allQuestions = [
  { id: "0", name: "aqq", img: "aqq.jpg", audio: "aqq.wav" },
  { id: "1", name: "eliey", img: "eliey.jpg", audio: "eliey.wav" },
  { id: "2", name: "kesalk", img: "kesalk.jpg", audio: "kesalk.wav" },
  { id: "3", name: "kil", img: "kil.jpg", audio: "kil.wav" },
  { id: "4", name: "ltu", img: "ltu.jpg", audio: "ltu.wav" },
  { id: "5", name: "mijisi", img: "mijisi.jpg", audio: "mijisi.wav" },
  { id: "6", name: "nin", img: "nin.jpg", audio: "nin.wav" },
  { id: "7", name: "teluisi", img: "teluisi.jpg", audio: "teluisi.wav" },
  { id: "8", name: "wiktm", img: "wiktm.jpg", audio: "wiktm.wav" },
  ,
];

var correctAnswers = [];
var correctAnswer;

// Function for generating ints within a range
//     Written by Olly
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

/*
  The purpose of this function is to play the audio clip for the current word.
  Author: Lucas Waddell
*/
function playSound() {
  // get activeWord container
  const activeWord = document.getElementById("activeWord").textContent;
  //find the value for the audio key where the elements name is the active word
  var audioName = questions.find((element) => element.name == activeWord).audio;
  let audio = new Audio(`./audioFiles/${audioName}`);
  audio.play();
}

function loadQuestions() {
  // pick three questions from the list of all questions.
  var currentQuestions = getRandoms(allQuestions, 3);
  //console.log(currentQuestions);
  correctAnswer = currentQuestions[getRandomInt(0, 2)];
  //console.log(correctAnswer);

  // Display word associated with current correct answer
  document.getElementById("activeWord").innerHTML = correctAnswer.name;

  //randomize order of current questions;
  let randomOrderedQuestions = currentQuestions
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  let params = '<input class="picButton" type="image" src="./images/';
  var pic = 1;
  randomOrderedQuestions.forEach((question) => {
    let dimensions = `" width="325" height="325" onclick="choose('${question.name}')""/>`;
    document.getElementById(`pic${pic}`).innerHTML =
      params + question.img + dimensions;
    pic += 1;
  });
}

function choose(selection) {
  console.log(selection);
  console.log(correctAnswer);
}

// adding the event listeners to all buttons
playButton.addEventListener("click", playSound, false);
//let dimensions = `" width="325" height="325" onclick="choose('${question.name}', ${JSON.stringify(correctAnswer)})"/>`;
