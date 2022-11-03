/*---------------
Created by Sebastian Cox 15/10/2022
-------------------*/

//Aquire fs module for file manipulation
const fs = require('fs')
//Aquire http to deliver files to client
const http = require('http')

//specify port
const port = 4223

//create server
http.createServer((req,res)=>{

    //function call to get photo specified in url
    getPhoto(req.url,res)

//listening on specified port
}).listen(port)

/**
 * 
 * @param {name of picture} name 
 * @param {response object} res 
 */
function getPhoto(name,res){

    //read file from directory
    fs.readFile('nov'+name+'.jpg',(err,content)=>{

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

