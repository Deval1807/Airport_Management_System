const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const db = require("./connection");
const userRout = require("./userRouter");
const empRout = require("./empRouter");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(userRout);
app.use(empRout);

const port = process.env.PORT;

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/userLogin", (req, res) =>
  res.sendFile(__dirname + "/userLogin.html")
);
app.get("/empLogin", (req, res) => res.sendFile(__dirname + "/empLogin.html"));
app.get("/usersignup", (req, res) =>
  res.sendFile(__dirname + "/usersignup.html")
);
app.get("/booking", (req, res) => res.sendFile(__dirname + "/booking.html"));
app.get("/emppassinfo", (req, res) =>
  res.sendFile(__dirname + "/passenger-info.html")
);
app.get("/manageflight", (req, res) =>
  res.sendFile(__dirname + "/flight.html")
);
app.get("/userhelp", (req, res) => res.sendFile(__dirname + "/help.html"));
app.get("/addflight", (req, res) =>
  res.sendFile(__dirname + "/addflight.html")
);
app.get("/deleteflight", (req, res) =>
  res.sendFile(__dirname + "/deleteflight.html")
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
