const path = require("path"); // allow access to env
const express = require("express");
const app = express(); //instantiate express app
const port = process.env.PORT || 3000; //port 3000 or one defined in env

app.use(express.static("public/assets")); // expose the directory public/assets

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
