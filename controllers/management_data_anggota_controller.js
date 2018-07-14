

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
    ipcMain.on('request-management-data-anggota', function(event){
        koneksi.query("SELECT * FROM tbl_anggota", function(error, results, fields){
            event.sender.send('response-management-data-anggota', results);
        });
    });

    ipcMain.on('request-select-edit-data-anggota', function(event, id){
        koneksi.query("SELECT * FROM tbl_anggota WHERE id = "+id, function(error, results, fields){
            event.sender.send('response-select-edit-data-anggota', results);
        });
    });

    ipcMain.on('request-update-data-anggota', function(event, data){
        koneksi.query('UPDATE `tbl_anggota` SET `nama_anggota` = ?, `alamat_anggota` = ?, `no_telp_anggota` = ? WHERE `id` = ?', [data.nama, data.alamat, data.no, data.id], function(error, results, fields){
            event.sender.send('response-update-data-anggota');
        });
    });

    ipcMain.on('request-hapus-data-anggota', function(event, id){
        koneksi.query("SELECT tbl_anggota.* FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id WHERE tbl_simpanan.id_anggota="+id+" AND tbl_simpanan.kode_simpanan IS NOT NULL", function(error, results, fields){
            if(results.length == 0){
                koneksi.query("DELETE FROM tbl_anggota WHERE id="+id, function(error, results, fields){
                    event.sender.send('response-hapus-data-anggota');
                });
            }else{
                event.sender.send('response-cek-id-anggota', results);
            }
        }); 
    });
}