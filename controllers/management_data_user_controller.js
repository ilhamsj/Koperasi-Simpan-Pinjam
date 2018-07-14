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
    ipcMain.on('request-data-user', function(event){
        koneksi.query("SELECT * FROM user", function(error, results, fields){
            event.sender.send('response-data-user', results);
        });
    });

    ipcMain.on('request-select-edit-data-user', function(event, id){
        koneksi.query("SELECT * FROM user WHERE id="+id, function(error, results, fields){
            event.sender.send('response-select-edit-data-user', results);
        });
    });

    ipcMain.on('request-simpan-data-user', function(event, data){
        if(data.id == ""){

            koneksi.query("SELECT * FROM user WHERE username='"+data.username+"'", function(error, results, fields){
                if(results.length == 0){
                    var data_user = {
                        username: data.username,
                        password: data.password,
                        level: data.level
                    };
    
                    koneksi.query("INSERT INTO user SET ?", data_user, function(error, results, fields){
                        event.sender.send('response-simpan-data-user');
                    });
                }else{
                    event.sender.send('response-cek-username', results);
                }
            });

        }else{

            koneksi.query("UPDATE `user` SET `password` = ?, `level` = ? WHERE `id` = ?", [data.password, data.level, data.id], function(error, results, fields){
                event.sender.send('response-update-user');
            });
            
        }
    });

    ipcMain.on('request-select-hapus-data-user', function(event, id){
        koneksi.query("DELETE FROM user WHERE id="+id, function(error, results, fields){
            event.sender.send('response-select-hapus-data-user');
        });
    });
}