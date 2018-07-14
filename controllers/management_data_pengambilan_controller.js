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
    ipcMain.on('request-management-data-pengambilan', function(event){
        koneksi.query("SELECT tbl_anggota.no_pendaftaran, tbl_simpanan.kode_simpanan, tbl_jenis_simpanan.nama, tbl_ambil_simpanan.* FROM tbl_ambil_simpanan LEFT JOIN tbl_simpanan ON tbl_ambil_simpanan.id_simpanan = tbl_simpanan.id LEFT JOIN tbl_anggota ON tbl_ambil_simpanan.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_simpanan ON tbl_ambil_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id ORDER BY tbl_ambil_simpanan.tgl_pengambilan ASC", function(error, results, fields){
            if(error) throw error;

            var management_data_pengambilan = results;

            event.sender.send("response-management-data-pengambilan", management_data_pengambilan);
        })
    });
}