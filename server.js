/*---------------
Created by Sebastian Cox 15/10/2022
Backend server code to fetch pictures from directory
-------------------*/

//Aquire fs module for file manipulation
const fs = require('fs')
//Aquire http to deliver files to client
const http = require('http')

const mongodb = require('mongodb').MongoClient

const picArr = ["aqq", 'eliey','kesalk','kil','itu','mijisi','nin','teluisi','wiktm']

var globalDB

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  }
/*
let dataObj = {aqq:{right:0,wrong:0},
            eliey:{right:0,wrong:0},
            kesalk:{right:0,wrong:0},
            kil:{right:0,wrong:0},
            itu:{right:0,wrong:0},
            mijisi:{right:0,wrong:0},
            nin:{right:0,wrong:0},
            teluisi:{right:0,wrong:0},
            wiktm:{right:0,wrong:0}}
*/
// credential string elements
let head = "mongodb://";
let user = "group23C";
let password = "66IndiaHorseStop";
let localHost = "127.0.0.1";
let localPort = "27017";
let database = "group23C";
let connectionString =
  head + user + ":" + password + "@" + localHost + ":" + localPort + "/" + user;

//specify port
const port = 4223

let allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // allow any origin
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // allow any method
    res.header("Access-Control-Allow-Headers", "Content-Type"); // accept only headers with this type
    next(); // middleware callback function required for processing
  };



//create server
var server = http.createServer((req,res)=>{

    let urlSplit = req.url.split('_')

    

    //function call to get photo specified in url
    if(urlSplit[0]=='/pic'){
        getPhoto(urlSplit[1],res)
    }
    
    //catch audio response
    if(urlSplit[0]=='/audio'){
        getAudio(urlSplit[1],res)
    }

    //recird wrong answers
    if(urlSplit[0]=='/wrong'){
        updateWrongAns(urlSplit[1],res)
    }

    //record right answers
    if(urlSplit[0]=='/right'){
        updateRightAns(urlSplit[1],res)
    }

    //get data for guesses from database
    if(urlSplit[0]=='/data'){
        getData(urlSplit[1],res)
    }

//listening on specified port
}).listen(port)


server

/**
 * 
 * @param {name of picture} name 
 * @param {response object} res 
 */
function getPhoto(name,res){

    //read file from directory
    fs.readFile('nov/'+name+'.jpg',(err,content)=>{

        //handle error if photo not found
        if(err){

            //return error message
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err)
            res.end('No such image')
        }else{

            //specify the content type
            res.writeHead(200,{'Content-type':'image/jpg'})
            //write content to http
            res.end(content)
        }
    })
}

/**
 * 
 * @param {*} name 
 * @param {*} res 
 */
function getAudio(name,res){
    fs.readFile('nov/'+name+'.wav',(err,content)=>{

        if(err){
            res.writeHead(400,{'Content-type':'text/html'})
            console.log(err)
            res.end(content)
        }else{
            console.log('we got it')
            res.writeHead(200,{'Content-type':'audio/wav'})

            res.end(content)
        }
    })
}

/**
 * 
 * @param {*} word 
 * @param {*} res 
 */
function updateWrongAns(word,res){
    console.log('wrong: ' +word)

    let query = {name:word}
    let obj
    let numbWrong
    let numbRight
    
    globalDB.collection('data').findOne(query,(err,dataReturned)=>{

        if(err) {throw err}

        console.log(dataReturned)

        numbWrong = dataReturned.wrong
        numbRight = dataReturned.right

        numbWrong++

        

        let value = {$set: {right:numbRight,wrong: numbWrong}}


        globalDB.collection('data').updateOne(query,value,(err)=>{
            if(err!=null){throw err}
        })

    })

    res.writeHead(200).end()
}

/**
 * 
 * @param {*} word 
 * @param {*} res 
 */
function updateRightAns(word,res){
    console.log('right: '+word)

    let query = {name:word}
    let obj
    let numbWrong
    let numbRight
    
    globalDB.collection('data').findOne(query,(err,dataReturned)=>{

        if(err) {throw err}

        console.log(dataReturned)

        numbWrong = dataReturned.wrong
        numbRight = dataReturned.right

        numbRight++
        

        let value = {$set: {right:numbRight,wrong: numbWrong}}


        globalDB.collection('data').updateOne(query,value,(err)=>{
            if(err!=null){throw err}
        })

    })



    res.writeHead(200).end()
}

function getData(name,res){

    
    let obj
    

    let query = {name:name}

    globalDB.collection('data').findOne(query,(err,dataReturned)=>{

        if(err){throw err}
        
        obj = dataReturned

        console.log(obj)

            
            res.writeHead(200,{ "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET", 
            'Content-type':'text/html'})
            res.write(JSON.stringify(obj))
            res.end()
        })
            
}
        
    




mongodb.connect(connectionString,(error, client)=>{
    if (error) {
        throw error;
    }


  // This version of mongodb returns a client object
  // which contains the database object
  globalDB = client.db("group23C");

  // "process" is an already available global variable with information
  // about this particular Node.js application.
  //
  // If the SIGTERM event occurs, use the anonymous function to
  // close the database and server in a controlled way.
  process.on("SIGTERM", function () {
    console.log("Shutting server down.");
    client.close();
    server.close();
  });
})
