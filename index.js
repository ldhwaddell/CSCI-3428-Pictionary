//logic for aspects of recording provided by SitePoint for free use under the MIT license
// Examples can be found here: https://www.sitepoint.com/mediastream-api-record-audio/

const multer = require("multer"); // import multer
const fs = require("fs"); // allow access to file system
const path = require("path"); // allow access to env
const express = require("express");
const app = express(); //instantiate express app
const port = process.env.PORT || 3000; //port 3000 or one defined in env

const storage = multer.diskStorage({
  //configure to store files in uploads
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  //change to store files names as user+question
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split(".");
    cb(null, `${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});
// the thing that uploads the files
const upload = multer({ storage });

app.use(express.static("uploads")); // expose uploads directory
app.use(express.static("public/assets")); // expose the directory public/assets

// Function to tell us if the server is running, and what port it is running on
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// Loads the html on instantiation.
// Transfers the file at current directory + public/index.html to user
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//load all recordings so user can listen to them.
app.get("/recordings", (req, res) => {
  let files = fs.readdirSync(path.join(__dirname, "uploads"));
  //remove any files that are not audio files from variable
  files = files
    .filter((file) => {
      const fileNameArr = file.split(".");
      return fileNameArr[fileNameArr.length - 1] === "mp3";
    })
    // append a "/" to each file name
    .map((file) => `${file}`);
  return res.json({ success: true, files });
});

//Create upload endpoint upload audio and return success in json response
// add logic to validate file here
//Configure save logic to save fiels with user name, and question?
app.post("/record", upload.single("audio"), (req, res) =>
  res.json({ success: true })
);
