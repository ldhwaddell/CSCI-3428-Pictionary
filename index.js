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
app.use(allowCrossDomain); // implement allowable domain characteristics

// credential string elements
let head = "mongodb://";
let user = "group23C";
let password = "66IndiaHorseStop";
let localHost = "127.0.0.1";
let localPort = "27017";
let database = "group23C";
let connectionString =
  head + user + ":" + password + "@" + localHost + ":" + localPort + "/" + user;

async function instantiateServer() {
  app.use(express.static("public/assets")); // expose the directory public/assets

  // Function to tell us if the server is running, and what port it is running on
  app.listen(port, () => {
    console.log(`Listening at port ${port}`);
  });
}

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

app.post("/saveAudio", function (req) {
  console.log("success");
  console.log(req.body);
});

instantiateServer().catch(console.error);
connectMongoDB().catch(console.error);
