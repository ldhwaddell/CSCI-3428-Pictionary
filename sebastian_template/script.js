let pics = ['aqq.jpg','eliey.jpg','kesalk.jpg','kil.jpg','itu.jpg',
    'mijisi.jpg','nin.jpg','teluisi.jpg','wiktm.jpg']

let sounds = ['aqq.wav','eliey.wav','kesalk.wav','kil.wav','itu.wav',
'mijisi.wav','nin.wav','teluisi.wav','wiktm.wav']

let path = 'nov/'

let imgTagStart = '<img src = '+path
let imgTagEnd = '>'

$('body').ready(()=>{
    $('#pic1').append(imgTagStart+pics[1]+imgTagEnd)
    $('#pic2').append(imgTagStart+pics[2]+imgTagEnd)
    $('#pic3').append(imgTagStart+pics[3]+imgTagEnd)
})
