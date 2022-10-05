const path = require("path"); // allow access to env
const express = require("express");
const app = express(); //instantiate express app
const port = process.env.PORT || 3000; //port 3000 or one defined in env

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

