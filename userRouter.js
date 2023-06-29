const express = require('express');
const userRouter = express.Router();
const { validationResult} = require('express-validator');
const userdb = require("./user");
const ams = require("./connection");
const moment = require("moment");

userRouter.use(express.json());
const app = express();
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views')
app.engine('ejs',require('ejs').__express)
var usermail;
var userpid;

userRouter.post("/reguser", async function(req, res, next){
    try {
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email;
        const passwd = req.body.password;
        const cnfpasswd = req.body.confPasswd;
        ams.query("SELECT NEW_USER(?,?,?,?,?)",[fname,lname,email,passwd,cnfpasswd], (error, result)=>{
            if(error){
                return (error);
            }else{
                var valu = Number(Object.values(result[0]));
                console.log(valu);
                if (valu===2){
                    res.json({msg: "The password dont match please retry"});
                }else if (valu===1){
                    res.json({msg: "The user already exists, try signing up with a new email"});
                }else{
                    res.sendFile(__dirname + "/userLogin.html");
                }
                return (console.log(result));
            }
         })
                
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

userRouter.post("/userlogin",async(req,res,next)=>{
    try {
        // const {email, passwd} = req.body;
        const email = req.body.email;
        usermail = email;
        const passwd = req.body.password;
        const userlog = await userdb.login(email);
        console.log(userlog);
        if (userlog[0].PASSWORD === passwd){
            console.log("correct passwd")
            res.sendFile(__dirname + "/homepage.html")
        }else{
            res.send({msg:"Invalid password"})
        }
        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

userRouter.post("/help", async (req, res, next)=>{
    try {
         const apc = req.body.apcode;
         const job = req.body.jobtype;
         await ams.query("CALL EMP_DETAIL(?,?)",[apc,job], (error, result)=>{
            if(error){
                return (error);
            }else{
                var jsonres = JSON.parse(JSON.stringify(result[0]));
                console.log(jsonres);
                console.log(result);

                res.render(__dirname + '/views/helpres.ejs', {jsonres})

                return (jsonres);
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

userRouter.get("/upcomingFlights", async (req,res,next)=>{
    try {
        ams.query("SELECT GET_PID(?)",[usermail], (error, result)=>{
            if(error){
                return (error);
            }else{
                userpid = Number(Object.values(result[0]));
                ams.query("CALL UPCOMING_FL(?)",[userpid], (error, result1)=>{
                    if(error){
                        return (error);
                    }else{
                        var jsonres = JSON.parse(JSON.stringify(result1[0]));
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
                        res.render(__dirname + '/views/upcomflight.ejs', {jsonres})
                        return (console.log(result1[0]));
                    }
                 })
                return;
            }
         })
   } catch (error) {
       console.log(error);
       res.sendStatus(400);
   }
})

userRouter.get('/compFlights', async(req,res,next)=>{
    try {
        ams.query("SELECT GET_PID(?)",[usermail], (error, result)=>{
            if(error){
                return (error);
            }else{
                userpid = Number(Object.values(result[0]));
                ams.query("CALL COMP_FLIGHTS(?)",[userpid], (error, result1)=>{
                    if(error){
                        return (error);
                    }else{
                        // res.send(result1[0]);
                        var jsonres = JSON.parse(JSON.stringify(result1[0]));
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
                        res.render(__dirname + '/views/compflights.ejs', {jsonres})
                    }
                 })
                return;
            }
         })
   } catch (error) {
       console.log(error);
       res.sendStatus(400);
   }
})
var amt;
userRouter.post("/cancelFlight",async(req,res,next)=>{
    try {
        const ticket = Number(Object.keys(req.body));
        ams.query("CALL DELETE_TIC(?)",[ticket], (error, result)=>{
            if(error){
                return (error);
            }else{
                
                ams.query("SELECT refund_amount(?)",[ticket], (error, result1)=>{
                    if(error){
                        return (error);
                    }else{
                        amt = Number(Object.values(result1[0]));
                        var text = `
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
            Flight canceled successfully
        </div>
        <script>alert("You will get rupees ${amt} refund (50%)")</script>
    </body>
    </html>
                        `
                        res.send(text);
                        return(console.log(result1));                 
                    }
                })  
            }
        })  
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})
var tr_date;
var from_place_gb;
var to_place_gb;
userRouter.post("/booking",async(req,res,next)=>{
    try {
        const frpl = req.body.fromplace;
        const topl = req.body.toplace;
        const travel_date = req.body.date1;
        tr_date = travel_date;
        from_place_gb = frpl;
        to_place_gb = topl;
        ams.query("CALL FLIGHT_DETAIL(?,?)",[frpl,topl], (error, result)=>{
            if(error){
                return (console.log(error));
            }else{
                var jsonres = JSON.parse(JSON.stringify(result[0]));
                res.render(__dirname + '/views/bookflight.ejs', {jsonres})
                return(console.log(result));                 
            }
        })  
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

var flc_pass
userRouter.post("/booking2",(req,res)=>{
    const flc = String(Object.keys(req.body));
    flc_pass = flc;
    res.sendFile(__dirname + "/booking2.html");
    console.log(flc);
})

userRouter.get("/booking2", (req,res)=>{
    // res.send("Helloo")
    // res.sendFile(__dirname + "/booking2.html");
})

userRouter.post("/bookingdetail",async(req,res,next)=>{
    try {
        const fname = req.body.F_name;
        const lname = req.body.L_name;
        const sex = req.body.gender;
        const phone = req.body.ph_no;
        const passno = req.body.pass_no;
        const mail = req.body.email;
        const dob = req.body.birth;
        const age = req.body.Age;
        const add = req.body.address;
        const cl = req.body.class;

        ams.query("CALL NEW_BOOKING(?,?,?,?,?,?,?,?,?,?,?,?)",[fname,lname,mail, phone, age, dob, add, sex, flc_pass,cl,tr_date,passno], 
        (error, result)=>{
            if(error){
                return (console.log(error));
            }else{
                ams.query("SELECT FARE(?,?,?)",[from_place_gb,to_place_gb,cl], (error, result)=>{
                    if(error){
                        return (console.log(error));
                    }else{
                        var totalfare = Number(Object.values(result[0]));
                        console.log(totalfare);
                        var text = `
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
            Flight booked successfully
        </div>
        <script>alert("You will be charged rupees ${totalfare}")</script>
    </body>
    </html>
                        `
                        res.send(text);
                        return(console.log(result));                 
                    }
                }) 
                
                return(console.log(result));                 
            }
        })  
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

module.exports = userRouter;