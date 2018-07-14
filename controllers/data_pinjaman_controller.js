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
    ipcMain.on('request-data-pinjaman', function(event){
        koneksi.query("SELECT tbl_anggota.*, tbl_pinjaman.* FROM tbl_pinjaman LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id", function(error, results, fields){
            event.sender.send('response-data-pinjaman', results);
        });
    })
}