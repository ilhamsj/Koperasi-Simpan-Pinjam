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
    ipcMain.on('request-select-data-pinjaman', function(event, id_pinjaman){
        koneksi.query("SELECT tbl_anggota.*, tbl_pinjaman.*, tbl_jenis_pinjaman.* FROM tbl_pinjaman LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_pinjaman ON tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id WHERE tbl_pinjaman.id = "+id_pinjaman, function(error, results, fields){
            if(error) throw error;

            var data_select_pinjaman = results;

            koneksi.query("SELECT * FROM tbl_jenis_pinjaman", function(error, results, fields){

                var data_jenis_pinjaman = results;

                koneksi.query("SELECT * FROM tbl_jenis_pinjaman WHERE EXISTS (SELECT * FROM tbl_pinjaman WHERE tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id AND tbl_pinjaman.id_anggota = "+data_select_pinjaman[0].id_anggota+")", function(error, results, fields){
                    if(error) throw error;

                    var data_select_exists_jenis_pinjaman = results;

                    koneksi.query("SELECT tbl_pinjaman.* FROM tbl_pinjaman LEFT JOIN tbl_jenis_pinjaman ON tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id WHERE tbl_jenis_pinjaman.kode_jenis = 'KU' AND id_anggota = "+data_select_pinjaman[0].id_anggota, function(error, results, fields){
                        if(error) throw error;

                        var ku_exists_jangka_waktu = results;

                        koneksi.query("SELECT tbl_pinjaman.* FROM tbl_pinjaman LEFT JOIN tbl_jenis_pinjaman ON tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id WHERE tbl_jenis_pinjaman.kode_jenis = 'KSB' AND id_anggota = "+data_select_pinjaman[0].id_anggota, function(error, results, fields){
                            if(error) throw error;

                            var ksb_exists_jangka_waktu = results;
                            
                            koneksi.query("SELECT tbl_pinjaman.* FROM tbl_pinjaman LEFT JOIN tbl_jenis_pinjaman ON tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id WHERE tbl_jenis_pinjaman.kode_jenis = 'KA' AND id_anggota = "+data_select_pinjaman[0].id_anggota, function(error, results, fields){
                                if(error) throw error;
                                
                                var ka_exists_jangka_waktu = results;

                                koneksi.query("SELECT tbl_angsuran.* FROM tbl_angsuran WHERE id_pinjaman = "+id_pinjaman, function(error, results, fields){
                                    if(error) throw error;
                    
                                    var data_select_angsuran = results;
                    
                                    koneksi.query("SELECT SUM(tbl_angsuran.jml_bayar) as jml_cicilan FROM tbl_angsuran WHERE id_pinjaman = "+id_pinjaman, function(error, results, fields){
                                        if(error) throw error;
                    
                                        var jml_cicilan = results[0].jml_cicilan;
                
                                        event.sender.send('response-select-data-pinjaman', data_select_pinjaman, data_select_angsuran, jml_cicilan, data_jenis_pinjaman, data_select_exists_jenis_pinjaman, ku_exists_jangka_waktu, ksb_exists_jangka_waktu, ka_exists_jangka_waktu);
                                        
                                    })
                                })

                            });
                        });
                    }); 
                });
            });
        });
    });

    ipcMain.on('request-ganti-jenis-pinjaman', function(event, data){
        
        koneksi.query("SELECT tbl_pinjaman.id FROM tbl_pinjaman INNER JOIN tbl_anggota ON tbl_pinjaman.id_anggota=tbl_anggota.id WHERE tbl_anggota.no_pendaftaran = '"+data.no_pendaftaran+"' AND tbl_pinjaman.id_jenis_pinjaman = "+data.id_jenis, function(error, results, fields){
            if(error) throw error;
            
            event.sender.send('response-ganti-jenis-pinjaman', results);
        });
    });

    ipcMain.on('request-ganti-sub-jenis-pinjaman', function(event, data){
        
        koneksi.query("SELECT tbl_pinjaman.id FROM tbl_pinjaman INNER JOIN tbl_anggota ON tbl_pinjaman.id_anggota=tbl_anggota.id WHERE tbl_anggota.no_pendaftaran = '"+data.no_pendaftaran+"' AND tbl_pinjaman.id = "+data.id_jenis, function(error, results, fields){
            if(error) throw error;
            
            event.sender.send('response-ganti-sub-jenis-pinjaman', results);
        });
    });

    ipcMain.on('request-simpan-data-angsuran', function(event, data){
        var data_angsuran = {
            id_pinjaman: data.id_pinjaman,
            angsuran_ke: data.angsuran_ke,
            tgl_bayar: data.tgl_bayar,
            jml_bayar: data.jml_bayar,
            angsuran: data.angsuran,
            bunga: data.bunga,
            iptw: data.iptw,
            total_bayar: data.total_bayar
        }

        koneksi.query("INSERT INTO tbl_angsuran SET ?", data_angsuran, function(error, results, fields){
            if(error) throw error;
        });
    });

    ipcMain.on('request-simpan-data-pinjaman', function(event, data){

        koneksi.query("SELECT * FROM tbl_jenis_pinjaman", function(error, results, fields){

            now = new Date();
            y = "" + now.getFullYear();
            yRegex = y.match(/[0-9][0-9]$/gi);
            year   = yRegex.join('');

            var temp_ks_char = "";
            var temp_kode = "";

            results.forEach(function(result){
                if(data.id_jenis == result.id){
                    temp_ks_char = result.kode_jenis;
                    temp_kode = temp_ks_char + year + "000";
                }
            });

            k_pinjam = temp_kode;

            koneksi.query("SELECT MAX(REGEXP_REPLACE(kode_pinjaman, '[A-Z]', '')) AS kode_pinjaman FROM tbl_pinjaman WHERE kode_pinjaman LIKE '%"+temp_ks_char+"%'", function(error, results, fields){
                var kode_pinjaman = "";
                k_regex = k_pinjam.match(/[\d]/gi);
                
                var max_no = Math.max(k_regex.join(''), results[0].kode_pinjaman);
                
                if(max_no == results[0].kode_pinjaman){ 
                    kode_pinjaman = temp_ks_char + (++max_no);
                }else{ 
                    kode_pinjaman = temp_ks_char + (++max_no);
                }
                
                koneksi.query("UPDATE `tbl_pinjaman` SET `kode_pinjaman` = ?, `id_jenis_pinjaman` = ?, `tgl_pinjaman` = ?, `jml_pinjaman` = ?, `jangka_waktu` = ?, `angsuran_pokok` = ?, `bunga_angsuran` = ?, `total_angsuran` = ? WHERE `id` = ?", [kode_pinjaman, data.id_jenis, data.tgl_pinjaman, data.jml_pinjaman, data.jangka_waktu, data.angsuran_pokok, data.bunga_angsuran, data.total_angsuran, data.id_pinjaman], function(error, results, fields){
                    if(error) throw error;
                    event.sender.send('response-simpan-data-pinjaman');
                })
                
            });
        }); 
    })

    ipcMain.on('request-tambah-data-pinjaman', function(event, data){

        koneksi.query("SELECT * FROM tbl_jenis_pinjaman", function(error, results, fields){

            now = new Date();
            y = "" + now.getFullYear();
            yRegex = y.match(/[0-9][0-9]$/gi);
            year   = yRegex.join('');

            var temp_ks_char = "";
            var temp_kode = "";

            results.forEach(function(result){
                if(data.id_jenis == result.id){
                    temp_ks_char = result.kode_jenis;
                    temp_kode = temp_ks_char + year + "000";
                }
            });

            k_pinjam = temp_kode;

            koneksi.query("SELECT MAX(REGEXP_REPLACE(kode_pinjaman, '[A-Z]', '')) AS kode_pinjaman FROM tbl_pinjaman WHERE kode_pinjaman LIKE '%"+temp_ks_char+"%'", function(error, results, fields){
                var kode_pinjaman = "";
                k_regex = k_pinjam.match(/[\d]/gi);
                
                var max_no = Math.max(k_regex.join(''), results[0].kode_pinjaman);
                
                if(max_no == results[0].kode_pinjaman){ 
                    kode_pinjaman = temp_ks_char + (++max_no);
                }else{ 
                    kode_pinjaman = temp_ks_char + (++max_no);
                }

                koneksi.query("SELECT tbl_jenis_pinjaman.nama, tbl_anggota.no_pendaftaran, tbl_pinjaman.jangka_waktu FROM tbl_pinjaman LEFT JOIN tbl_jenis_pinjaman ON tbl_pinjaman.id_jenis_pinjaman = tbl_jenis_pinjaman.id LEFT JOIN tbl_anggota ON tbl_pinjaman.id_anggota = tbl_anggota.id WHERE tbl_pinjaman.id_jenis_pinjaman = "+data.id_jenis+" AND tbl_pinjaman.id_anggota = "+data.id_anggota+" AND tbl_pinjaman.jangka_waktu = "+data.jangka_waktu, function(error, results, fields){
                    if(error) throw error;

                    var cek_jenis_pinjaman = results;
                    
                    if(cek_jenis_pinjaman.length == 0){
                        var data_pinjaman = {
                            kode_pinjaman: kode_pinjaman,
                            id_anggota: data.id_anggota,
                            id_jenis_pinjaman: data.id_jenis,
                            tgl_pinjaman: data.tgl_pinjaman,
                            jangka_waktu: data.jangka_waktu,
                            jml_pinjaman: data.jml_pinjaman,
                            angsuran_pokok: data.angsuran_pokok,
                            bunga_angsuran: data.bunga_angsuran,
                            total_angsuran: data.total_angsuran
                        }
        
                        
                        koneksi.query("INSERT INTO tbl_pinjaman SET ?", data_pinjaman, function(error, results, fields){
                            if(error) throw error;

                            var id = results.insertId;

                            for(var i = 1; i <= data.jangka_waktu; i++){
                                var data_angsuran = {
                                    id_pinjaman: id,
                                    angsuran_ke: i,
                                    tgl_bayar: data.tgl_bayar,
                                    jml_bayar: data.jml_bayar,
                                    angsuran: data.angsuran,
                                    bunga: data.bunga,
                                    iptw: data.iptw,
                                    total_bayar: data.total_bayar
                                };
                                
                                koneksi.query("INSERT INTO tbl_angsuran SET ?", data_angsuran, function(error, results, fields){
                                    if(error) throw error;
                                });
                                
                            }   

                            event.sender.send('response-tambah-data-pinjaman', id);
                        });
                        
                    }else{
                        event.sender.send('response-cek-jenis-pinjaman', cek_jenis_pinjaman);
                    }
                });
                
            });
        }); 
    })

    ipcMain.on('request-select-bayar-angsuran', function(event, data){
        koneksi.query("SELECT TIMESTAMPDIFF(MONTH, DATE_ADD(tbl_pinjaman.tgl_pinjaman, INTERVAL (tbl_pinjaman.jangka_waktu) MONTH), '2019-11-12') as selisih_bulan, DATE_ADD(tbl_pinjaman.tgl_pinjaman, INTERVAL (tbl_pinjaman.jangka_waktu) MONTH) as tgl_batas_pinjaman, DATE_ADD(tbl_pinjaman.tgl_pinjaman, INTERVAL (tbl_pinjaman.jangka_waktu - 6) MONTH) as tgl_batas_iptw, tbl_angsuran.*, tbl_pinjaman.tgl_pinjaman FROM tbl_angsuran LEFT JOIN tbl_pinjaman ON tbl_angsuran.id_pinjaman = tbl_pinjaman.id WHERE tbl_angsuran.id="+data.id, function(error, results, fields){
            if(error) throw error;

            var data_select_bayar_angsuran = results;

            koneksi.query("SELECT tbl_angsuran.*, tbl_pinjaman.kode_pinjaman FROM tbl_angsuran LEFT JOIN tbl_pinjaman ON tbl_angsuran.id_pinjaman = tbl_pinjaman.id WHERE tbl_pinjaman.kode_pinjaman = '"+data.kode_pinjaman+"' AND tbl_angsuran.iptw <> 0", function(error, results, fields){
                if(error) throw error;

                var data_cek_iptw = results;

                koneksi.query("SELECT * FROM tbl_angsuran LEFT JOIN tbl_pinjaman ON tbl_angsuran.id_pinjaman = tbl_pinjaman.id WHERE tbl_pinjaman.kode_pinjaman = '"+data.kode_pinjaman+"'", function(error, results, fields){
                    if(error) throw error;

                    var data_select_angsuran = results;

                    event.sender.send('response-select-bayar-angsuran', data_select_bayar_angsuran, data_cek_iptw, data_select_angsuran);
                });
            });   
        });
    });

    ipcMain.on('request-update-data-angsuran', function(event, data){
        console.log(data);
        koneksi.query("UPDATE `tbl_angsuran` SET `tgl_bayar` = ?, `jml_bayar` = ?, `iptw` = ? WHERE `tbl_angsuran`.`id` = ?", [data.tanggal_bayar, data.jumlah_bayar, data.iptw, data.id_angsuran], function(error, results, fields){
            if(error) throw error;
            event.sender.send('response-update-data-angsuran');
        });
    });
}