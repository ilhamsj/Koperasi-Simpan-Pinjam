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
    ipcMain.on('request-management-data-angsuran', function(event){
        koneksi.query("SELECT tbl_pinjaman.*, tbl_angsuran.* FROM tbl_angsuran LEFT JOIN tbl_pinjaman ON tbl_angsuran.id_pinjaman = tbl_pinjaman.id ORDER BY tbl_angsuran.id ASC", function(error, results, fields){
            if(error) throw error;

            var management_data_angsuran = results;

            event.sender.send("response-management-data-angsuran", management_data_angsuran);
        })
    });
}