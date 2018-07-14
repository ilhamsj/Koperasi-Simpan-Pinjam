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
    //menerima request request-register-nasabah dari register_nasabah.js
    ipcMain.on('request-register-nasabah', function(event, data){
        //generate nomor pendaftaran
        now = new Date();
        y = "" + now.getFullYear();
        yRegex = y.match(/[0-9][0-9]$/gi);
        year   = yRegex.join('');
        date = year + "0000"; 

        //mencari nilai terbesar dari value no_pendaftaran dari tbl_anggota
        koneksi.query("SELECT MAX(no_pendaftaran) AS no_pendaftaran FROM tbl_anggota", function(error, results, fields){
            var no = 0;
            //bandingkan nilai terbesar antara date dan no_pendaftaran
            var max_no = Math.max(date, results[0].no_pendaftaran);
            
            if(max_no == results[0].no_pendaftaran){ //jika max_no (180003) sama dengan no_pendaftaran (180003) maka nilai max_no ditambah satu (180004)
                no = ++max_no;
            }else{ //jika max_no (190000) tidak sama dengan no_pendaftaran (180003) maka nilai max_no ditambah satu (190001)
                no = ++max_no;
            }
            
            //cek jika nik_anggota sudah ada
            koneksi.query("SELECT nik_anggota FROM tbl_anggota WHERE nik_anggota=?", [data.nik], function(error, results, fields){
                if(results.length == 0){
                    var data_anggota = {
                        no_pendaftaran : no,
                        nik_anggota: data.nik,
                        nama_anggota: data.nama,
                        alamat_anggota: data.alamat,
                        jk_anggota: data.jk_value,
                        no_telp_anggota: data.no_telp,
                        tgl_masuk: data.tgl_masuk
                    }
                    
                    //menambah data anggota
                    koneksi.query("INSERT INTO tbl_anggota SET ?", data_anggota, function(error, results, fields){
                        if(error) throw error

                        var id_anggota = results.insertId;

                        var data_simpanan = {
                            kode_simpanan : null,
                            id_anggota : id_anggota,
                            id_jenis_simpanan: null,
                            saldo_awal: 0,
                            tgl_simpanan: null,
                            jml_simpanan:  0,
                            saldo_akhir: 0,
                            bunga: 0,
                            jangka_waktu: 0,
                            jenjang: ""
                        };

                        //menambah data simpanan
                        koneksi.query("INSERT INTO tbl_simpanan SET ?", data_simpanan, function(error, results, fields){
                            if(error) throw error;
                            var data_pinjaman = {
                                kode_pinjaman: null,
                                id_anggota: id_anggota,
                                id_jenis_pinjaman: null,
                                tgl_pinjaman: null,
                                jangka_waktu: 0,
                                jml_pinjaman: 0,
                                angsuran_pokok: 0,
                                bunga_angsuran: 0,
                                total_angsuran: 0
                            }

                            koneksi.query("INSERT INTO tbl_pinjaman SET ?", data_pinjaman, function(error, results, fields){
                                if(error) throw error;
                                //mengirim response register-nasabah-success ke register_nasabah.js
                                event.sender.send('response-register-nasabah-success');
                            });
                        });
                    }); 
                }else{
                    event.sender.send('response-cek-nik-ada');
                }
            });
            
        });       
    });

    

    
}




  