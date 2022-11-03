//file for the game logic

const playButton = document.getElementById("playButton");

// list all files in the directory

const pics = ['aqq.jpg','eliey.jpg','kesalk.jpg','kil.jpg','itu.jpg',
'mijisi.jpg','nin.jpg','teluisi.jpg','wiktm.jpg']


function setup() {
    let str1 = '<input class="picButton" type="image" src="./images/';
    let str2 = '" width="325" height="325""/>';
    let str3 = str1 + pics[0] + str2;
    document.getElementById("pic1").innerHTML = str3;
  
    str2 = '" width="325" height="325""/>';
    str3 = str1 + pics[1] + str2;
    document.getElementById("pic2").innerHTML = str3;
  
    str2 = '" width="325" height="325""/>';
    str3 = str1 + pics[2] + str2;
    document.getElementById("pic3").innerHTML = str3;
  }
