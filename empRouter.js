const express = require('express');
const empRouter = express.Router();
const { validationResult} = require('express-validator');
const empdb = require("./emp");
const ams = require("./connection");
const moment = require("moment");

empRouter.use(express.json());
var empemail;

var addflighttext = `
                <!DOCTYPE html>
    <html>
    <head>
        <title>BookMyFlight.com</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Poppins">
        <style>
            /* Navigation bar style */
            body{
                font-family: 'Poppins', sans-serif;
                background-color: #4fb4fd;
            }
            .navbar {
                background-color: #007BFF;
                overflow: hidden;
            }
            /* Success message style */
            .success-message {
                margin: 20px;
                padding: 10px;
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-inverse" style="border-radius:0px !important; margin:0;border: 0; background-color: #2b7dbb;">
            <div class="container-fluid">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>                       
                  </button>
                  <a class="navbar-brand" style="color: aliceblue;" href="index.html">BookMyFlight.com</a>
                </div>
                    
            </div>
        </nav>
        <div class="success-message">
            Flight added successfully
        </div>
    </body>
    </html>
                `

var delflighttext = `
                <!DOCTYPE html>
    <html>
    <head>
        <title>BookMyFlight.com</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Poppins">
        <style>
            /* Navigation bar style */
            body{
                font-family: 'Poppins', sans-serif;
                background-color: #4fb4fd;
            }
            .navbar {
                background-color: #007BFF;
                overflow: hidden;
            }
            /* Success message style */
            .success-message {
                margin: 20px;
                padding: 10px;
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-inverse" style="border-radius:0px !important; margin:0;border: 0; background-color: #2b7dbb;">
            <div class="container-fluid">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>                       
                  </button>
                  <a class="navbar-brand" style="color: aliceblue;" href="index.html">BookMyFlight.com</a>
                </div>
                    
            </div>
        </nav>
        <div class="success-message">
            Flight deleted successfully
        </div>
    </body>
    </html>
                `


var emmpresno = `
                <!DOCTYPE html>
    <html>
    <head>
        <title>BookMyFlight.com</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Poppins">
        <style>
            /* Navigation bar style */
            body{
                font-family: 'Poppins', sans-serif;
                background-color: #4fb4fd;
            }
            .navbar {
                background-color: #007BFF;
                overflow: hidden;
            }
            /* Success message style */
            .success-message {
                margin: 20px;
                padding: 10px;
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-inverse" style="border-radius:0px !important; margin:0;border: 0; background-color: #2b7dbb;">
            <div class="container-fluid">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>                       
                  </button>
                  <a class="navbar-brand" style="color: aliceblue;" href="index.html">BookMyFlight.com</a>
                </div>
                    
            </div>
        </nav>
        <div class="success-message">
            Incorrect ssn no or employee dont exist
        </div>
    </body>
    </html>
                `

var empresyes = `
                <!DOCTYPE html>
    <html>
    <head>
        <title>BookMyFlight.com</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Poppins">
        <style>
            /* Navigation bar style */
            body{
                font-family: 'Poppins', sans-serif;
                background-color: #4fb4fd;
            }
            .navbar {
                background-color: #007BFF;
                overflow: hidden;
            }
            /* Success message style */
            .success-message {
                margin: 20px;
                padding: 10px;
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-inverse" style="border-radius:0px !important; margin:0;border: 0; background-color: #2b7dbb;">
            <div class="container-fluid">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>                       
                  </button>
                  <a class="navbar-brand" style="color: aliceblue;" href="index.html">BookMyFlight.com</a>
                </div>
                    
            </div>
        </nav>
        <div class="success-message">
            Employee deleted succesfully
        </div>
    </body>
    </html>
                `


empRouter.post("/emplogin",async(req,res,next)=>{
    try {
        // const {email, passwd} = req.body;
        const email = req.body.email;
        empemail = email;
        const passwd = req.body.password;
        const emplog = await empdb.login(email);
        console.log(emplog);
        if (emplog[0].PASSWORD === passwd){
            console.log("correct passwd")
            res.sendFile(__dirname + "/emphomepage.html")
        }else{A
            res.send({msg:"Invalid password"})
        }
        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

empRouter.get("/flightdetail", async (req,res,next)=>{
    try {
        ams.query("SELECT * FROM FLIGHT", (error, result)=>{
           if(error){
               return (error);
           }else{
               var jsonres = JSON.parse(JSON.stringify(result));
                res.render(__dirname + '/views/allflight.ejs', {jsonres})
               return (console.log(result)); 
           }
       })
   } catch (error) {
       console.log(error);
       res.sendStatus(400);
   }
})

empRouter.post("/addflight",async(req,res,next)=>{
    try {
        const flc = req.body.FLC;
        const ald = req.body.ALD;
        const frpl = req.body.from_place;
        const topl = req.body.to_place;
        const dept = req.body.departure;
        const arr = req.body.arrival;
        const seat = req.body.noofseat;
        const dur = req.body.duration;
        ams.query("INSERT INTO FLIGHT VALUES(?,?,?,?,?,?,?,?)",[flc,ald,frpl,topl,dept,arr,seat,dur], (error, result)=>{
            if(error){
                return (error);
            }else{
                console.log(result);
                var check = 223;
                res.send(addflighttext);
                return (console.log("Flight added!!"));
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

empRouter.post("/deleteflight",async(req,res,next)=>{
    try {
        const flc = req.body.FLC;
        ams.query("DELETE FROM FLIGHT WHERE FLIGHT_CODE = ?",[flc], (error, result)=>{
            if(error){
                return (error);
            }else{
                // console.log(result[0]);
                // res.send(result);
                res.send(delflighttext);
                return (console.log("Flight deleted!!"));
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

empRouter.post("/passinfo", async (req, res, next)=>{
    try {
         const flc = req.body.flightcode;
         const tdate = req.body.traveldate  
         ams.query("CALL PASS_FL(?,?)",[flc,tdate], (error, result)=>{
            if(error){
                return (error);
            }else{
                var jsonres = JSON.parse(JSON.stringify(result[0]));
                for(var i=0; i < jsonres.length; i++){
                    var old_date = (jsonres[i].BOOKING_DATE);
                    var new_date = moment(old_date).format('YYYY-MM-DD');
                    jsonres[i].BOOKING_DATE = new_date;
                }                        
                for(var i=0; i < jsonres.length; i++){
                    var old_date = (jsonres[i].TRAVEL_DATE);
                    var new_date = moment(old_date).format('YYYY-MM-DD');
                    jsonres[i].TRAVEL_DATE = new_date;
                }
                res.render(__dirname + '/views/passengerinfo.ejs', {jsonres})
                return (console.log(result[0]));
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

empRouter.get("/empresign", async (req, res, next)=>{
    try {
         const ssn = req.body.ssn;  
        ams.query("SELECT GET_SSN(?)",[empemail], (error, result)=>{
            if(error){
                return (error);
            }else{                
                var ssno = Number(Object.values(result[0]));
                ams.query("SELECT DEL_EMP(?)",[ssno], (error, result1)=>{
                    if(error){
                        return (error);
                    }else{
                        var val = Number(Object.values(result1[0]));
                        console.log(val);
                        if(val===0){
                            res.send(emmpresno)
                        }else{
                            res.send(empresyes)
                        }
                        return (console.log(result1));
                    }
                })
                return (console.log(ssno));
            }
        })
         
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

module.exports = empRouter;