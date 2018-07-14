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
    //Menerima request fetchAll-data-simpanan dari data_simpanan.js
    ipcMain.on("request-fetchAll-data-simpanan", function(event){
        koneksi.query("SELECT tbl_anggota.no_pendaftaran, tbl_anggota.nik_anggota, tbl_anggota.nama_anggota, tbl_anggota.alamat_anggota, tbl_simpanan.id, tbl_simpanan.kode_simpanan, tbl_simpanan.tgl_simpanan, tbl_simpanan.jml_simpanan, tbl_simpanan.saldo_akhir, tbl_jenis_simpanan.nama FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id ORDER BY tbl_anggota.id DESC", function(error, results, fields){
            var data_simpanan = results;

            //mengirim reponse fetchAll-data-simpanan ke data_simpanan.js
            event.sender.send("response-fetchAll-data-simpanan", data_simpanan);
        })
    });

    //menerima request select-data dari data_simpanan.js
    ipcMain.on("request-select-data", function(event, id){
        koneksi.query("SELECT tbl_anggota.no_pendaftaran, tbl_jenis_simpanan.*, tbl_simpanan.* FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id WHERE tbl_simpanan.id='"+id+"'", function(error, results, fields){
            //mengirim response select-data ke data_simpanan.js
            event.sender.send("response-select-data", results);
        });
    });
}