// ************************ Server Setup ******************************

const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
var expressWs = require("express-ws")(app);

require("./routes")(app);

app.use(express.json());

// ************************ Run Server ******************************
const port = process.env.PORT || 5656;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
