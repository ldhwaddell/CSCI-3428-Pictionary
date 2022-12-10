/*
  To fix the http/https issues, can go to:
  "chrome://flags/#unsafely-treat-insecure-origin-as-secure"
  and add "http://ugdev.cs.smu.ca" to the list. This allows the http access
  to be considered secure so recording works and we can communicate with the server. 

  Purpose: The purpose of this file is to serve as a possible server for the backend of our game. 
  Due to http/https issues, this server is not actually being implemented in our game. However, it is still being
  commented for perhaps someone in the future who decides to use this logic.

  Authors: Sebastian Cox, Lucas Waddell
*/

// ------------------------------Global Constants and Variables------------------------------
const path = require("path"); // allow access to env
const express = require("express");
const app = express(); //instantiate express app
const port = process.env.PORT || 3000; //port 3000 or one defined in env
const { MongoClient } = require("mongodb");

app.use(express.json()); // implement JSON recognition
app.use(express.urlencoded({ extended: true })); // implement incoming name:value pairs to be any type

let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow any origin
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // allow any method
  res.header("Access-Control-Allow-Headers", "Content-Type"); // accept only headers with this type
  next(); // middleware callback function required for processing
};

// credential string elements
let head = "mongodb://";
let user = "group23C";
let password = "66IndiaHorseStop";
let localHost = "127.0.0.1";
let localPort = "27017";
let database = "group23C";
let connectionString =
  head + user + ":" + password + "@" + localHost + ":" + localPort + "/" + user;


/*
  Purpose: Asynchronous function to instantiate the server.

  Parameters: None

  Return: None

  Author: Sebastian Cox, Lucas Waddell
*/
async function instantiateServer() {
  app.use(express.static("public/assets")); // expose the directory public/assets
  app.use(allowCrossDomain); // implement allowable domain characteristics

  // Function to tell us if the server is running, and what port it is running on
  app.listen(port, () => {
    console.log(`Listening at port ${port}`);
  });
}

/*
  Purpose: Asynchronous function to connect to the mongoDB backend

  Parameters: None

  Return: None

  Author: Sebastian Cox, Lucas Waddell
*/
async function connectMongoDB() {
  const db = new MongoClient(connectionString);
  try {
    // Connect to the MongoDB cluster
    await db.connect();
    console.log("Successfully connected to DB");
  } catch (e) {
    console.error(`Process Quitting - Fatal Error: ${e}`);
    process.exit(1);
  } finally {
    await db.close();
  }
}

/*
  Purpose: Test sending information from game to backend

  Parameters: "/testSettings" the url destination to be recognized
              Purpose: To test that the information was successfully received by logging it to console
              Parameters: (1) req: The request object
              Returns: None
  Return: None

  Author: Sebastian Cox, Lucas Waddell
*/
app.post("/testSettings", function (req) {
  // Log success and the body of request if a success
  console.log("success");
  console.log(req.body);
});

//Instantiate the server and connect to mongoDB.

//calls each function and then catches any errors, logging them to console
instantiateServer().catch(console.error);
connectMongoDB().catch(console.error);
