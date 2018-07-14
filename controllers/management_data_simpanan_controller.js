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

    ipcMain.on('request-management-data-simpanan', function(event){
        koneksi.query("SELECT tbl_anggota.*, tbl_simpanan.*, tbl_jenis_simpanan.nama FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id ORDER BY tbl_anggota.id DESC", function(error, results, fields){
            var management_data_simpanan = results;

            event.sender.send("response-management-data-simpanan", management_data_simpanan);
        })
    });

    ipcMain.on('request-hapus-management-data-simpanan', function(event, data){
        koneksi.query("SELECT COUNT(*) AS count_simpanan FROM tbl_simpanan WHERE id_anggota="+data.id_anggota, function(error, results, fields){
            if(results[0].count_simpanan == 1){
                koneksi.query("UPDATE `tbl_simpanan` SET `kode_simpanan` = ?, `id_jenis_simpanan` = ?, `saldo_awal` = ?, `tgl_simpanan` = ?, `jml_simpanan` = ?, `saldo_akhir` = ? WHERE `id` = ?", [null, null, 0, null, 0, 0, data.id_simpanan], function(error, results, fields){
                    koneksi.query("DELETE FROM tbl_history_simpanan WHERE id_simpanan="+data.id_simpanan, function(error, results, fields){
                        event.sender.send('response-hapus-management-data-simpanan');
                    });
                });
            }else{
                koneksi.query("DELETE FROM tbl_simpanan WHERE id="+data.id_simpanan, function(error, results, fields){
                    event.sender.send('response-hapus-management-data-simpanan');
                });
            }
        });
    });
}