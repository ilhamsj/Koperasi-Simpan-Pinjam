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
    ipcMain.on('request-management-data-pinjaman', function(event){
        koneksi.query("SELECT tbl_anggota.*, tbl_pinjaman.*, tbl_jenis_pinjaman.nama FROM tbl_pinjaman LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_pinjaman ON tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id ORDER BY tbl_anggota.id DESC", function(error, results, fields){
            var management_data_pinjaman = results;

            event.sender.send("response-management-data-pinjaman", management_data_pinjaman);
        })
    });

    ipcMain.on('request-hapus-management-data-pinjaman', function(event, data){
        koneksi.query("SELECT COUNT(*) AS count_pinjaman FROM tbl_pinjaman WHERE id_anggota="+data.id_anggota, function(error, results, fields){
            if(results[0].count_pinjaman == 1){
                koneksi.query("UPDATE `tbl_pinjaman` SET `kode_pinjaman` = ?, `id_jenis_pinjaman` = ?, `tgl_pinjaman` = ?, `jangka_waktu` = ?, `jml_pinjaman` = ?, `angsuran_pokok` = ?, `bunga_angsuran` = ?, `total_angsuran` = ? WHERE `id` = ?", [null, null, null, 0, 0, 0, 0, 0, data.id_pinjaman], function(error, results, fields){
                    if(error) throw error;

                    koneksi.query("DELETE FROM tbl_angsuran WHERE id_pinjaman="+data.id_pinjaman, function(error, results, fields){
                        event.sender.send('response-hapus-management-data-pinjaman');
                    });
                });
            }else{
                koneksi.query("DELETE FROM tbl_pinjaman WHERE id="+data.id_pinjaman, function(error, results, fields){
                    if(error) throw error;
                    
                    event.sender.send('response-hapus-management-data-pinjaman');
                });
            }
        });
    });
}