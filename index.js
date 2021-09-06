const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer(app);
const io = require("socket.io");

app.use(express.static("public"))

http.listen(port, () => console.log(`Localhost running on: ${port}`));