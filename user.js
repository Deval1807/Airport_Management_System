const ams = require("./connection");

let db = {};

// db.newUser = (fname, lname, email, passwd) =>{
//     return new Promise((resolve, reject) => {
//         ams.query("INSERT INTO user VALUES(?,?,?,?)",[fname, lname, email, passwd], (error, result) =>{
//             if(error){
//                 return reject(error);
//             }
//             return resolve(console.log("Inserted"));
//         });
//     });
// };

// db.getUserByEmail = (email) => {
//     return new Promise((resolve, reject) => {
//         ams.query("SELECT * from user WHERE email = ?",[email],(error, result) =>{
//             if(error){
//                 return reject(error);
//             }
//             return resolve(result);
//         });
//     });
// }

db.login = (email) => {
    return new Promise((resolve, reject) => {
        ams.query("SELECT * from users WHERE EMAIL = ?",[email], (error, result) =>{
            if(error){
                return reject(error);
            }else{
                return resolve(result);
            }
        });
    });
}

db.newUser = (fname, lname, email, passwd, cnfpasswd) =>{
    return new Promise((resolve, reject) => {
        ams.query("SELECT NEW_USER(?,?,?,?,?)",[fname, lname, email, passwd, cnfpasswd], (error, result) =>{
            if(error){
                return reject(error);
            }else{
            return resolve(result);
            }
        });
    });
};

// db.check = () =>{
//     ams.query("call FLIGHT_DETAIL(\"Ahmedabad\", \"Surat\")",(error, result) =>{
//         if(error){
//             return console.error(error.message);
//         }else{
//             console.log(result[0]);
//         }
//     })
// }


module.exports = db;

// db.newUser("Preksha","Morbia","preksha@gmail.com",111);

// db.check();