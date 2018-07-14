//import library mysql
var mysql = require('mysql');

//config mysql
var koneksi = mysql.createConnection({
    host    :"localhost",
    user    :"root",
    pass    :null,
    database:"project_ksp"
});

//koneksi
koneksi.connect();

//membuat module dengan parameter ipcMain 
module.exports = function(ipcMain){
    //menerima request-login dari loginForm.js
    ipcMain.on('request-login', function(event, data){
        //query
        koneksi.query("SELECT * FROM user WHERE username=? && password=?", [data.user, data.pass], function(error, results, fields){
            //jika username dan password salah
            if(results.length == 0){
                //mengirim response error ke loginForm.js
                event.sender.send('response-error');
            }else{ //jika username dan password benar
                //jika level sama dengan admin
                if(results[0].level == "admin"){
                    //mengirim response admin-login-success ke loginForm.js
                    event.sender.send('response-admin-login-success', 'adminPanel');  
                }else if(results[0].level == "user"){//jika level sama dengan user
                    //mengirim reponse user-login-success ke loginForm.js
                    event.sender.send('response-user-login-success', 'userPanel');
                }
            }                   
        });
    });
}