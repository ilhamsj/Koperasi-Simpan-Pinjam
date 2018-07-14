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
    //menerima request dari profil_simpanan_nasabah.js
    ipcMain.on("request-fetch-select-simpanan", function(event, id_simpanan){
        //untuk menampilkan detail simpanan
        koneksi.query("SELECT tbl_anggota.*, tbl_jenis_simpanan.*, tbl_simpanan.* FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id WHERE tbl_simpanan.id='"+id_simpanan+"'", function(error, results, fields){
            
            var data_select_simpanan = results;

            //untuk menampilkan semua jenis simpanan
            koneksi.query("SELECT * FROM tbl_jenis_simpanan", function(error, results, fields){
                var data_jenis_simpanan = results;

                //untuk menampilkan history simpanan berdasarkan kode_simpanan
                koneksi.query("SELECT tbl_anggota.no_pendaftaran, tbl_simpanan.kode_simpanan, tbl_jenis_simpanan.*, tbl_history_simpanan.* FROM tbl_history_simpanan LEFT JOIN tbl_anggota ON tbl_history_simpanan.id_anggota = tbl_anggota.id LEFT JOIN tbl_simpanan ON tbl_history_simpanan.id_simpanan = tbl_simpanan.id LEFT JOIN tbl_jenis_simpanan ON tbl_history_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id WHERE tbl_simpanan.kode_simpanan = '"+data_select_simpanan[0].kode_simpanan+"' ORDER BY tbl_history_simpanan.id ASC", function(error, results, fields){
                    var data_history_simpanan = results;
                        
                    //untuk menampilkan data jenis simpanan yang sudah diambil berdasarkan id_anggota
                    koneksi.query("SELECT * FROM tbl_jenis_simpanan WHERE EXISTS (SELECT * FROM tbl_simpanan WHERE tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id AND tbl_simpanan.id_anggota = "+data_select_simpanan[0].id_anggota+")", function(error, results, fields){
                        var data_select_exists_jenis_simpanan = results;

                        koneksi.query("SELECT tbl_simpanan.* FROM tbl_simpanan LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id WHERE tbl_jenis_simpanan.kode_jenis = 'SP' AND id_anggota = "+data_select_simpanan[0].id_anggota, function(error, results, fields){
                            var data_exists_jenjang = results;

                            koneksi.query("SELECT tbl_simpanan.* FROM tbl_simpanan LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id WHERE tbl_jenis_simpanan.kode_jenis = 'SJK' AND id_anggota = "+data_select_simpanan[0].id_anggota, function(error, results, fields){
                                var data_exists_jangka_waktu = results;

                                koneksi.query("SELECT tbl_history_simpanan.*, tbl_simpanan.kode_simpanan FROM tbl_history_simpanan LEFT JOIN tbl_simpanan ON tbl_history_simpanan.id_simpanan = tbl_simpanan.id WHERE tbl_simpanan.kode_simpanan = '"+data_select_simpanan[0].kode_simpanan+"' AND tbl_history_simpanan.bunga <> 0", function(error, results, fields){
                                    var data_cek_bunga = results;
        
                                    //mengirim response ke profil_simpanan_nasabah.js
                                    event.sender.send("response-fetch-select-simpanan", data_select_simpanan, data_jenis_simpanan, data_history_simpanan, data_select_exists_jenis_simpanan, data_exists_jenjang, data_exists_jangka_waktu, data_cek_bunga);
                                });  
                            });
                        });
                    });
                });
            });
        });
    });

    //menerima request dari profil_simpanan_nasabah.js
    ipcMain.on('request-ganti-jenis-simpanan', function(event, data){
        //untuk menampilkan jenis simpanan beradasarkan no_pendaftaran dan id_jenis
        koneksi.query("SELECT tbl_simpanan.id FROM tbl_simpanan INNER JOIN tbl_anggota ON tbl_simpanan.id_anggota=tbl_anggota.id WHERE tbl_anggota.no_pendaftaran = '"+data.no_pendaftaran+"' AND tbl_simpanan.id_jenis_simpanan = "+data.id_jenis, function(error, results, fields){
            if(error) throw error;
            //mengirim response ke profil_simpanan_nasabah.js
            event.sender.send('response-ganti-jenis-simpanan', results);
        });
    });

    ipcMain.on('request-ganti-sub-jenis-simpanan', function(event, data){
        //untuk menampilkan jenis simpanan beradasarkan no_pendaftaran dan id_jenis
        koneksi.query("SELECT tbl_simpanan.id FROM tbl_simpanan INNER JOIN tbl_anggota ON tbl_simpanan.id_anggota=tbl_anggota.id WHERE tbl_anggota.no_pendaftaran = '"+data.no_pendaftaran+"' AND tbl_simpanan.id = "+data.id_jenis, function(error, results, fields){
            if(error) throw error;
            //mengirim response ke profil_simpanan_nasabah.js
            event.sender.send('response-ganti-sub-jenis-simpanan', results);
        });
    });

    //menerima request dari profil_simpanan nasabah.js
    ipcMain.on('request-tambah-data-simpanan-nasabah', function(event, data){
        //untuk menampilkan semua jenis simpanan
        koneksi.query("SELECT * FROM tbl_jenis_simpanan", function(error, results, fields){
            
            //generate kode_simpanan
            now = new Date();
            y = "" + now.getFullYear();
            yRegex = y.match(/[0-9][0-9]$/gi);
            year   = yRegex.join('');

            var temp_kode = "";
            var temp_ks_char = "";

            results.forEach(function(result){
                if(data.id_jenis == result.id){
                    temp_ks_char = result.kode_jenis;
                    temp_kode = temp_ks_char + year + "000";
                }
            });

            k_simpan = temp_kode;

            //mencari nilai value kode_simpanan terbesar
            koneksi.query("SELECT MAX(REGEXP_REPLACE(kode_simpanan, '[A-Z]', '')) AS kode_simpanan FROM tbl_simpanan WHERE kode_simpanan LIKE '%"+temp_ks_char+"%'", function(error, results, fields){
                var kode_simpanan = "";
                k_regex = k_simpan.match(/[\d]/gi);
                //bandingkan nilai terbesar k_regex.join('') dan results[0].kode_simpanan
                var max_no = Math.max(k_regex.join(''), results[0].kode_simpanan);
                
                if(max_no == results[0].kode_simpanan){ //jika max_no (180003) sama dengan kode_simpanan (180003) maka nilai max_no ditambah satu (180004)
                    kode_simpanan = temp_ks_char + (++max_no);
                }else{ //jika max_no (190000) tidak sama dengan kode_simpanan (180003) maka nilai max_no ditambah satu (190001)
                    kode_simpanan = temp_ks_char + (++max_no);
                }

                koneksi.query("SELECT tbl_jenis_simpanan.nama FROM tbl_simpanan LEFT JOIN tbl_jenis_simpanan ON tbl_simpanan.id_jenis_simpanan = tbl_jenis_simpanan.id LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id WHERE tbl_simpanan.id_jenis_simpanan="+data.id_jenis+" AND tbl_simpanan.id_anggota = "+data.id_anggota+" AND tbl_jenis_simpanan.kode_jenis <> 'SP' AND tbl_jenis_simpanan.kode_jenis <> 'SJK'", function(error, results, fields){
                    if(error) throw error;

                    var cek_id_jenis_simpanan = results;

                    if(cek_id_jenis_simpanan.length == 0){

                        koneksi.query("SELECT tbl_simpanan.jenjang FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id WHERE tbl_simpanan.jenjang = '"+data.jenjang+"' AND tbl_simpanan.id_anggota = "+data.id_anggota, function(error, results, fields){
                            if(error) throw error;
                            
                            var cek_jenjang_data_simpanan = results;

                            if(cek_jenjang_data_simpanan.length == 0){

                                koneksi.query("SELECT tbl_simpanan.jangka_waktu FROM tbl_simpanan LEFT JOIN tbl_anggota ON tbl_simpanan.id_anggota = tbl_anggota.id WHERE tbl_simpanan.jangka_waktu = "+data.jangka_waktu+" AND tbl_simpanan.id_anggota = "+data.id_anggota, function(error, results, fields){
                                    if(error) throw error;

                                    var cek_jangka_waktu_simpanan = results;

                                    if(cek_jangka_waktu_simpanan.length == 0){
                                        
                                        var data_simpanan = {
                                            kode_simpanan: kode_simpanan,
                                            id_anggota: data.id_anggota,
                                            id_jenis_simpanan: data.id_jenis,
                                            saldo_awal: data.jumlah,
                                            tgl_simpanan: data.tanggal,
                                            jml_simpanan: data.jumlah,
                                            saldo_akhir: data.jumlah,
                                            bunga: data.bunga,
                                            jangka_waktu: data.jangka_waktu,
                                            jenjang: data.jenjang
                                        };
                                        
                                        //untuk menambahkan data simpanan baru
                                        koneksi.query("INSERT INTO tbl_simpanan SET ?", data_simpanan, function(error, results, fields){
                                            
                                            var id = results.insertId;
                                            var data_history_simpanan = {
                                                id_simpanan: id,
                                                id_anggota: data.id_anggota,
                                                id_jenis_simpanan: data.id_jenis,
                                                tgl_simpanan: data.tanggal,
                                                saldo_awal: data.jumlah,
                                                kredit: data.jumlah,
                                                saldo_akhir: data.jumlah,
                                                status: data.status,
                                                bunga: 0,
                                                jangka_waktu: data.jangka_waktu,
                                                jenjang: data.jenjang
                                            }
                        
                                            //untuk menambahkan data history
                                            koneksi.query("INSERT INTO tbl_history_simpanan SET ?", data_history_simpanan, function(error, results, fields){
                                                if(error) throw error;
                        
                                                //mengirim response ke profil_simpanan_nasabah.js
                                                event.sender.send("response-tambah-data-simpanan-nasabah", id);
                                            });
                                        });
                                        
                                    }else{
                                        event.sender.send('response-cek-jangka-waktu-simpanan', cek_jangka_waktu_simpanan);
                                    }
                                });
                            }else{
                                event.sender.send('response-cek-jenjang-data-simpanan-nasabah', cek_jenjang_data_simpanan)
                            }
                        });
                    }else{
                        event.sender.send('response-cek-id_jenis-data-simpanan-nasabah', cek_id_jenis_simpanan)
                    }
                });    
            });
        });    
    });

    //menerima request dari profil_simpanan_nasabah.js
    ipcMain.on('request-simpan-data-simpanan-nasabah', function(event, data){
        //untuk menampilkan semua jenis simpanan
        koneksi.query("SELECT * FROM tbl_jenis_simpanan", function(error, results, fields){
            //generate kode_simpanan
            now = new Date();
            y = "" + now.getFullYear();
            yRegex = y.match(/[0-9][0-9]$/gi);
            year   = yRegex.join('');

            var temp_kode = "";
            var temp_ks_char = "";

            results.forEach(function(result){
                if(data.id_jenis == result.id){
                    temp_ks_char = result.kode_jenis;
                    temp_kode = temp_ks_char + year + "000";
                }
            });

            k_simpan = temp_kode;

            //mencari nilai value kode_simpanan terbesar
            koneksi.query("SELECT MAX(REGEXP_REPLACE(kode_simpanan, '[A-Z]', '')) AS kode_simpanan FROM tbl_simpanan WHERE kode_simpanan LIKE '%"+temp_ks_char+"%'", function(error, results, fields){
                if(data.kode == ""){ //UPDATE DATA SIMAPANAN PERTAMA
                    var kode_simpanan = "";
                    k_regex = k_simpan.match(/[\d]/gi);
                    //bandingkan nilai terbesar k_regex.join('') dan results[0].kode_simpanan
                    var max_no = Math.max(k_regex.join(''), results[0].kode_simpanan);
                    
                    if(max_no == results[0].kode_simpanan){ //jika max_no (180003) sama dengan kode_simpanan (180003) maka nilai max_no ditambah satu (180004)
                        kode_simpanan = temp_ks_char + (++max_no);
                    }else{ //jika max_no (190000) tidak sama dengan kode_simpanan (180003) maka nilai max_no ditambah satu (190001)
                        kode_simpanan = temp_ks_char + (++max_no);
                    }

                    //untuk update data simpanan pertama
                    koneksi.query("UPDATE `tbl_simpanan` SET `kode_simpanan` = ?, `id_jenis_simpanan` = ?, `saldo_awal` = ?, `tgl_simpanan` = ?, `tgl_ambil` = ?, `jml_simpanan` = ?, `saldo_akhir` = ?, `bunga` = ?, `jangka_waktu` = ?, `jenjang` = ? WHERE `tbl_simpanan`.`id` = ?", [kode_simpanan, data.id_jenis, data.jumlah, data.tanggal, data.tgl_ambil, data.jumlah, data.jumlah, data.bunga, data.jangka_waktu, data.jenjang, data.id_simpanan], function(error, results, fields){
                        if(error) throw error;

                        var data_history_simpanan = {
                            id_simpanan: data.id_simpanan,
                            id_anggota: data.id_anggota,
                            id_jenis_simpanan: data.id_jenis,
                            tgl_simpanan: data.tanggal,
                            saldo_awal: data.jumlah,
                            kredit: data.jumlah,
                            saldo_akhir: data.jumlah,
                            status: data.status,
                            bunga: 0,
                            jangka_waktu: data.jangka_waktu,
                            jenjang: data.jenjang
                        }

                        koneksi.query("INSERT INTO tbl_history_simpanan SET ?", data_history_simpanan, function(error, results, fields){
                            if(error) throw error;

                            event.sender.send('response-simpan-data-simpanan-nasabah');
                        });
                    });
                }else{ //UPDATE SIMPANAN DATA BERLANJUT

                    //untuk update data simpanan berlanjut
                    koneksi.query("UPDATE `tbl_simpanan` SET `saldo_awal` = ?, `tgl_simpanan` = ?, `jml_simpanan` = ?, `saldo_akhir` = ? WHERE `tbl_simpanan`.`id` = ?", [data.saldo_awal, data.tanggal, data.jumlah, data.saldo_akhir, data.id_simpanan], function(error, results, fields){
                        if(error) throw error;

                        var data_history_simpanan = {
                            id_simpanan: data.id_simpanan,
                            id_anggota: data.id_anggota,
                            id_jenis_simpanan: data.id_jenis,
                            tgl_simpanan: data.tanggal,
                            saldo_awal: data.saldo_awal,
                            kredit: data.jumlah,
                            saldo_akhir: data.saldo_akhir,
                            bunga: data.t_bunga,
                            jangka_waktu: data.jangka_waktu,
                            jenjang: data.jenjang,
                            status: data.status
                        }

                        //untuk menambahkan data history
                        koneksi.query("INSERT INTO tbl_history_simpanan SET ?", data_history_simpanan, function(error, results, fields){
                            if(error) throw error;

                            //mengirim response ke profil_nasabah.js
                            event.sender.send('response-simpan-data-simpanan-nasabah');
                        });
                    });
                }
            });
        });
    });

    //menerima request dari profil_simpanan_nasabah.js
    ipcMain.on('request-ambil-data-simpanan-nasabah', function(event, data){

        //untuk update data simpanan (AMBIL SIMPANAN)
        koneksi.query("UPDATE `tbl_simpanan` SET `saldo_awal` = ?, `tgl_simpanan` = ?, `tgl_ambil` = ?, `jml_simpanan` = ?, `saldo_akhir` = ? WHERE `tbl_simpanan`.`id` = ?", [data.saldo_awal, data.tanggal, data.tgl_ambil, data.jumlah, data.saldo_akhir, data.id_simpanan], function(error, results, fields){
            if(error) throw error;

            var data_ambil_simpanan = {
                id_simpanan: data.id_simpanan,
                id_anggota: data.id_anggota,
                id_jenis_simpanan: data.id_jenis,
                saldo_awal: data.saldo_awal,
                tgl_pengambilan: data.tanggal,
                jml_pengambilan: data.jumlah
            };

            koneksi.query("INSERT INTO tbl_ambil_simpanan SET ?", data_ambil_simpanan, function(error, results, fields){
                if(error) throw error;

                var data_history_simpanan = {
                    id_simpanan: data.id_simpanan,
                    id_anggota: data.id_anggota,
                    id_jenis_simpanan: data.id_jenis,
                    tgl_simpanan: data.tanggal,
                    saldo_awal: data.saldo_awal,
                    kredit: data.jumlah,
                    saldo_akhir: data.saldo_akhir,
                    bunga: data.bunga,
                    jangka_waktu: data.jangka_waktu,
                    jenjang: data.jenjang,
                    status: data.status
                }
    
                //untuk menambahkan data history
                koneksi.query("INSERT INTO tbl_history_simpanan SET ?", data_history_simpanan, function(error, results, fields){
                    if(error) throw error;
    
                    //mengirim response ke profil_nasabah_simpanan
                    event.sender.send('response-ambil-data-simpanan-nasabah');
                });
            });
        });

    });
}