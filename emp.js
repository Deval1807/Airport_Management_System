const ams = require("./connection");

let db = {};

db.getEmpByEmail = (email) => {
    return new Promise((resolve, reject) => {
        ams.query("SELECT * from emps WHERE email = ?",[email],(error, result) =>{
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
}

db.login = (email) => {
    return new Promise((resolve, reject) => {
        ams.query("SELECT * from emps WHERE email = ?",[email], (error, result) =>{
            if(error){
                return reject(error);
            }else{
                return resolve(result);
            }
        });
    });
}

module.exports = db;