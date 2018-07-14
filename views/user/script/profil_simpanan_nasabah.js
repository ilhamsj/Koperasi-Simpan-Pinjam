const {ipcRenderer} = require('electron');

var id_simpanan = localStorage.getItem("id"); //mengambil value dari HTML Storage

//variable
var jenjang_text = $('#jenjang');
var id_kode_jenis = $('#id-kode-jenis');
var id_anggota = $('#id-anggota');
var id_jenis = $('#id-jenis');
var no_pendaftaran = $('#no');
var kode_simpanan = $('#kode');
var nik_anggota = $('#nik');
var nama_anggota = $('#nama');
var alamat_anggota = $('#alamat');
var jenis_simpanan = $('#jenis');
var saldo_awal = $('#saldo-awal');
var tanggal_simpanan = $('#tanggal');
var kredit = $('#kredit');
var saldo_akhir = $('#saldo-akhir');
var bunga_text = $('#bunga');
var jangka_waktu_text = $('#jangka_waktu');

//mengirim request fetch-select-simpanan ke profil_simpanan_nasabah_controller.js
ipcRenderer.send('request-fetch-select-simpanan', id_simpanan);

//menerima response fetchfetch-select-simpananAll dari profil_simpanan_nasabah_controller.js
ipcRenderer.on('response-fetch-select-simpanan', function(event, data_select_simpanan, data_jenis_simpanan, data_history_simpanan, data_select_exists_jenis_simpanan, data_exists_jenjang, data_exists_jangka_waktu, data_cek_bunga){

    //tampilkan data detail simpanan nasabah
    id_anggota.text(data_select_simpanan[0].id_anggota);
    id_jenis.text(data_select_simpanan[0].id_jenis_simpanan);

    if(data_select_simpanan[0].kode_jenis == null){
        id_kode_jenis.text("");
    }else{
        id_kode_jenis.text(data_select_simpanan[0].kode_jenis);
    }
    no_pendaftaran.text(data_select_simpanan[0].no_pendaftaran);
    if(data_select_simpanan[0].kode_simpanan == null){
        kode_simpanan.text("");
    }else{
        kode_simpanan.text(data_select_simpanan[0].kode_simpanan);
    }
    nik_anggota.text(data_select_simpanan[0].nik_anggota);
    nama_anggota.text(data_select_simpanan[0].nama_anggota);
    alamat_anggota.text(data_select_simpanan[0].alamat_anggota);
    if(data_select_simpanan[0].nama == null){
        jenis_simpanan.text("");
    }else{
        jenis_simpanan.text(data_select_simpanan[0].nama);
    }
    saldo_awal.text(data_select_simpanan[0].saldo_awal);
    if(data_select_simpanan[0].tgl_simpanan == null){
        tanggal_simpanan.text("");
    }else{
        tanggal_simpanan.text(stringToDate(data_select_simpanan[0].tgl_simpanan));
    }
    kredit.text(data_select_simpanan[0].jml_simpanan);
    saldo_akhir.text(data_select_simpanan[0].saldo_akhir);
    
    if(data_select_simpanan[0].kode_jenis == "SUM"){
        bunga_text.text(data_select_simpanan[0].bunga);
        jangka_waktu_text.text("0");
        jenjang_text.text("");
    }else if(data_select_simpanan[0].kode_jenis == "SJK"){
        bunga_text.text("0");
        jangka_waktu_text.text(data_select_simpanan[0].jangka_waktu); 
        jenjang_text.text(""); 
    }else if(data_select_simpanan[0].kode_jenis == "SP"){
        bunga_text.text("0");
        jangka_waktu_text.text("0");
        jenjang_text.text(data_select_simpanan[0].jenjang);
    }else{
        bunga_text.text("0");
        jangka_waktu_text.text("0");
        jenjang_text.text("");
    }

    //tampilkan form
    getHtml(data_select_simpanan, data_jenis_simpanan, data_select_exists_jenis_simpanan, data_history_simpanan, data_exists_jenjang, data_exists_jangka_waktu, data_cek_bunga);

    //tampilkan tabel history simpanan
    tableHistory(data_history_simpanan);

});

//menerima response simpan-data-simpanan-nasabah dari profil_simpanan_nasabah_controller.js
ipcRenderer.on('response-simpan-data-simpanan-nasabah', function(event){
    alert("Data Simpanan Nasabah berhasil disimpan");
    location.reload();
});

//menerima response ganti-jenis-simpanan dari profil_simpanan_nasabah_controller.js
ipcRenderer.on('response-ganti-jenis-simpanan', function(event, results){
    localStorage.setItem("id", results[0].id); //menyimpan id ke HTML Storage
    window.location.replace("profil_simpanan_nasabah.html");
});

ipcRenderer.on('response-ganti-sub-jenis-simpanan', function(event, results){
    localStorage.setItem("id", results[0].id); //menyimpan id ke HTML Storage
    window.location.replace("profil_simpanan_nasabah.html");
});

//menerima response tambah-data-simpanan-nasabah dari profil_simpanan_nasabah_controller.js
ipcRenderer.on('response-tambah-data-simpanan-nasabah', function(event, id){
    alert("Data Simpanan Berhasil Ditambah");
    localStorage.setItem("id", id); //menyimpan id ke HTML Storage
    window.location.replace("profil_simpanan_nasabah.html");
});

//menerima response ambil-data-simpanan-nasabah dari profil_simpanan_nasabah_controller.js
ipcRenderer.on('response-ambil-data-simpanan-nasabah', function(event){
    alert("Data Ambil Simpanan berhasil disimpan");
    location.reload();
});

ipcRenderer.on('response-cek-jenjang-data-simpanan-nasabah', function(event, cek_jenjang_data_simpanan){
    alert("Jenjang '"+cek_jenjang_data_simpanan[0].jenjang+"' telah dipakai");
});

ipcRenderer.on('response-cek-id_jenis-data-simpanan-nasabah', function(event, cek_id_jenis_simpanan){
    alert("Jenis Simpanan '"+cek_id_jenis_simpanan[0].nama+"' telah dipakai");
});

ipcRenderer.on('response-cek-jangka-waktu-simpanan', function(event, cek_jangka_waktu_simpanan){
    alert("Jangka waktu '"+cek_jangka_waktu_simpanan[0].jangka_waktu+" bulan' telah dipakai");
});

//fungsi untuk convert string ke format date
function stringToDate(date){
    var d = new Date(date).toISOString().slice(0, 10);
    return d;
}

//fungsi untuk mengambil value jenis dari radio button
function get_jenis() {
    var inputs = $('input[name=id-jenis]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }
    }
}

//fungsi untuk mengambil value jenis dari radio button
function get_kode_jenis() {
    var inputs = $('input[name=id-jenis]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].getAttribute('kode');
      }
    }
}

//fungsi untuk mengambil value jenis dari radio button
function get_tambah_kode_jenis() {
    var inputs = $('input[name=id-tambah-jenis]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].getAttribute('kode');
      }
    }
}

function show_hide_switch_jenis(data_exists_jenjang, data_exists_jangka_waktu){

    $('#id-switch-jenis').on('change', function(data){
        var htmlPilihSub = "";

        var value = data.target.value;
        if(value == "Simpanan Pendidikan"){
            htmlPilihSub += '<br><label><b>Pilih Jenjang</b></label>';
            htmlPilihSub += '<br><select id="id-switch-sub-jenis">';
            data_exists_jenjang.forEach(function(result){
                htmlPilihSub += '<option values="'+result.id+'">'+result.jenjang+'</option>';
            });
            htmlPilihSub += '</select>';
            htmlPilihSub += '<button id="btn-sub-switch">Ganti</button>';

            $('#btn-ganti-jenis').hide();
        }else if(value == "Simpanan Berjangka"){
            htmlPilihSub += '<br><label><b>Pilih Jangka Waktu</b></label>';
            htmlPilihSub += '<br><select id="id-switch-sub-jenis">';
            data_exists_jangka_waktu.forEach(function(result){
                htmlPilihSub += '<option values="'+result.id+'">'+result.jangka_waktu+' Bulan</option>';
            });
            htmlPilihSub += '</select>';
            htmlPilihSub += '<button id="btn-sub-switch">Ganti</button>';

            $('#btn-ganti-jenis').hide();
        }else{
            $('#btn-ganti-jenis').show();
        }
        
        $('#switch-sub-jenis-simpanan').html(htmlPilihSub);

        btnSubSwitch();
    });
}

//fungsi untuk mengambil value jenis dari radio button
function show_hide_form_jenis() {
    $('#form-bunga').hide();
    $('#form-jangka-waktu').hide();

    $('#form-tambah-bunga').hide();
    $('#form-tambah-jangka-waktu').hide();

    $('#form-jenjang').hide();
    $('#form-tambah-jenjang').hide();

    $('#form-tgl-ambil').hide();
    $('#form-tambah-tgl-ambil').hide();

    $('input[name=id-jenis]').on('change', function(data){
        var kode = data.target.getAttribute('kode');
        if(kode == "SUM"){
            $('#form-bunga').show();
            $('#form-jenjang').hide();
            $('#form-jangka-waktu').hide();
            $('#form-tgl-ambil').hide();
        }else if(kode == "SJK"){
            $('#form-bunga').hide();
            $('#form-jenjang').hide();
            $('#form-jangka-waktu').show();
            $('#form-tgl-ambil').hide();
        }else if(kode == "SP"){
            $('#form-bunga').hide();
            $('#form-jenjang').show();
            $('#form-jangka-waktu').hide();
            $('#form-tgl-ambil').hide();
        }else if(kode == "SK"){
            $('#form-bunga').hide();
            $('#form-jenjang').hide();
            $('#form-jangka-waktu').hide();
            $('#form-tgl-ambil').show();
        }else{
            $('#form-bunga').hide();
            $('#form-jenjang').hide();
            $('#form-jangka-waktu').hide();
            $('#form-tgl-ambil').hide();
        }
    });

    $('input[name=id-tambah-jenis]').on('change', function(data){
        var kode = data.target.getAttribute('kode');
        if(kode == "SUM"){
            $('#form-tambah-bunga').show();
            $('#form-tambah-jenjang').hide();
            $('#form-tambah-jangka-waktu').hide();
            $('#form-tambah-tgl-ambil').hide();
        }else if(kode == "SJK"){
            $('#form-tambah-bunga').hide();
            $('#form-tambah-jenjang').hide();
            $('#form-tambah-jangka-waktu').show();
            $('#form-tambah-tgl-ambil').hide();
        }else if(kode == "SP"){
            $('#form-tambah-bunga').hide();
            $('#form-tambah-jenjang').show();
            $('#form-tambah-jangka-waktu').hide();
            $('#form-tambah-tgl-ambil').hide();
        }else if(kode == "SK"){
            $('#form-tambah-bunga').hide();
            $('#form-tambah-jenjang').hide();
            $('#form-tambah-jangka-waktu').hide();
            $('#form-tambah-tgl-ambil').show();
        }else{
            $('#form-tambah-bunga').hide();
            $('#form-tambah-jenjang').hide();
            $('#form-tambah-jangka-waktu').hide();
            $('#form-tambah-tgl-ambil').hide();
        }
    });
}

//fungsi untuk mengambil value jenis dari radio button
function get_tambah_jenis() {
    var inputs = $('input[name=id-tambah-jenis]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }
    }
}

function ambil_simpanan(id_simpanan, id_anggota, id_jenis, jml_simpanan, status,
    mSaldo_awal, tgl_ambil, total, bunga, jangka_waktu, jenjang, tgl_lebaran){
        
        data = {
            id_simpanan: id_simpanan,
            id_anggota: id_anggota,
            id_jenis: id_jenis,
            jumlah: jml_simpanan,
            status: status,
            saldo_awal: mSaldo_awal,
            tanggal: tgl_ambil,
            saldo_akhir: total,
            bunga: bunga,
            jangka_waktu: jangka_waktu,
            jenjang: jenjang,
            tgl_ambil: tgl_lebaran
        };
        console.log(data);
        //mengirim request ambil-data-simpanan-nasabah ke profil_simpanan_nasabah_controller.js
        ipcRenderer.send('request-ambil-data-simpanan-nasabah', data);
}

function update_simpanan_pertama(id_simpanan, idAnggota, id_jenis, jumlah, no, status,
    kode,mSaldo_awal,tanggal,mKredit,mSaldo_akhir,bunga,jangka_waktu, jenjang, tgl_ambil){
    data = {
        id_simpanan: id_simpanan,
        id_anggota: idAnggota,
        id_jenis: id_jenis,
        jumlah: jumlah,
        no: no,
        status: status,
        kode: kode,
        saldo_awal: mSaldo_awal,
        tanggal: tanggal,
        kredit: mKredit,
        saldo_akhir: mSaldo_akhir,
        bunga: bunga,
        jangka_waktu: jangka_waktu,
        jenjang: jenjang,
        tgl_ambil: tgl_ambil
    };

    //mengirim request simpan-data-simpanan-nasabah ke profil_simpanan_nasabah_controller.js
    ipcRenderer.send('request-simpan-data-simpanan-nasabah', data);   
}

function update_simpanan_lanjutan(idSimpanan, idAnggota, idJenis, jml_simpanan, no, 
    status, kode, mSaldo_awal, tanggal, total, bunga, jangka_waktu, jenjang){
        data = {
            id_simpanan: idSimpanan,
            id_anggota: idAnggota,
            id_jenis: idJenis,
            jumlah: jml_simpanan,
            no: no,
            status: status,
            kode: kode,
            saldo_awal: mSaldo_awal,
            tanggal: tanggal,
            kredit: jml_simpanan,
            saldo_akhir: total,
            t_bunga: bunga,
            jangka_waktu: jangka_waktu,
            jenjang: jenjang
        };

        //mengirim request simpan-data-simpanan-nasabah ke prequest-simpan-data-simpanan-nasabahrofil_simpanan_nasabah_controller.js
        ipcRenderer.send('request-simpan-data-simpanan-nasabah', data);
}

function dialog_tambah_simpanan(id_anggota, jenis,status,jumlah, tgl, bunga, jangka_waktu, jenjang){
    var data = {
        id_anggota: id_anggota,
        id_jenis: jenis,
        status: status,
        jumlah: jumlah,
        tanggal: tgl,
        bunga: bunga,
        jangka_waktu: jangka_waktu,
        jenjang: jenjang
    };

    //mengirim request tambah-data-simpanan-nasabah
    ipcRenderer.send('request-tambah-data-simpanan-nasabah', data);
}

//fungsi untuk menampilkan semua form
function getHtml(data_select_simpanan, data_jenis_simpanan,
                data_select_exists_jenis_simpanan,
                data_history_simpanan,
                data_exists_jenjang,
                data_exists_jangka_waktu,
                data_cek_bunga){
    var htmlForm = "";
    var htmlDialogForm = "";
    var htmlSwitch = "";
    var htmlFormAmbil = "";
    
    if(data_select_simpanan[0].kode_simpanan == null){ //jika kode_simpanan kosong maka tampilkan form jenis simpanan dan jumlah simpanan
        //form jenis simpanan
        htmlForm += '<label><b>Jenis Simpanan</b></label><br>';
        data_jenis_simpanan.forEach(function(result){ //menampilkan semua jenis simpanan
            htmlForm += '<input type="radio" name="id-jenis" value="'+result.id+'" kode="'+result.kode_jenis+'"><span>'+result.nama+'</span><br>';
            if(result.kode_jenis == "SUM"){
                htmlForm += '<div id="form-bunga">';
                htmlForm += '&ensp;&ensp;&ensp;<label><b>Bunga</b></label><br>'
                htmlForm += '&ensp;&ensp;&ensp;<input type="number" id="id-bunga-simpan" minLength="5"> %<br>';
                htmlForm += '</div>';
            }else if(result.kode_jenis == "SJK"){
                htmlForm += '<div id="form-jangka-waktu">';
                htmlForm += '&ensp;&ensp;&ensp;<label><b>Jangka Waktu</b></label><br>'
                htmlForm += '&ensp;&ensp;&ensp;<select id="id-pilih-jw">';
                htmlForm += '<option disabled selected>Pilih Jangka Waktu</option>';
                htmlForm += '<option values="6">6 Bulan</option>';
                htmlForm += '<option values="9">9 Bulan</option>';
                htmlForm += '<option values="12">12 Bulan</option>';
                htmlForm += '</select><br>';
                htmlForm += '</div>';
            }else if(result.kode_jenis == "SP"){
                htmlForm += '<div id="form-jenjang">';
                htmlForm += '&ensp;&ensp;&ensp;<label><b>Jenjang</b></label><br>'
                htmlForm += '&ensp;&ensp;&ensp;<select id="id-pilih-jenjang">';
                htmlForm += '<option disabled selected>Pilih Jenjang</option>';
                htmlForm += '<option values="TK">TK</option>';
                htmlForm += '<option values="SD">SD</option>';
                htmlForm += '<option values="SMP">SMP</option>';
                htmlForm += '<option values="SMA">SMA</option>';
                htmlForm += '<option values="Perguruan Tinggi">Perguruan Tinggi</option>';
                htmlForm += '</select><br>';
                htmlForm += '</div>';
            }else if(result.kode_jenis == "SK"){
                htmlForm += '<div id="form-tgl-ambil">';
                htmlForm += '&ensp;&ensp;&ensp;<label><b>Tanggal Hari Raya Idul Adha</b></label><br>'
                htmlForm += '&ensp;&ensp;&ensp;<input type="date" id="tgl-ambil"><br>';
                htmlForm += '</div>';
            } 
        });
        htmlForm += '<br><label><b>Tanggal Simpan</b></label><br>';
        htmlForm += '<input type="date" id="id-tgl-simpan"><br>';
        //form jumlah simpanan
        htmlForm += '<br><label><b>Jumlah Simpanan</b></label><br>';
        htmlForm += '<input type="number" id="id-jumlah"><br><br>';
    }else{ //jika kode_simpanan tidak kosong maka tampilkan form ganti jenis simpanan, tambah simpanan, ambil simpanan, dan jumlah simpanan

        //form ganti jenis simpanan
        htmlSwitch += '<label><b>Ganti Jenis Simpanan</b></label><br>';
        htmlSwitch += '<select id="id-switch-jenis">';
        htmlSwitch += '<option disabled selected>Pilih Jenis Simpanan</option>';
        data_select_exists_jenis_simpanan.forEach(function(result){ //menampilkan jenis simpanan yang sudah diambil
            htmlSwitch += '<option values="'+result.id+'" kode="'+result.kode_jenis+'">'+result.nama+'</option>';
        });
        htmlSwitch += '</select>';
        htmlSwitch += '<button id="btn-ganti-jenis">Ganti</button>';

        //form dialog tambah simpanan
        htmlDialogForm += '<button id="openFormDialogTambahSimpanan">Tambah Simpanan</button>';
        htmlDialogForm += '<div id="dialogFormTambahSimpanan" title="Tambah Simpanan">';
        htmlDialogForm += '<label><b>Jenis Simpanan</b></label><br>';
        data_jenis_simpanan.forEach(function(result){ //menampilkan jenis simpanan yang belum diambil
            htmlDialogForm += '<input type="radio" name="id-tambah-jenis" value="'+result.id+'" kode="'+result.kode_jenis+'"><span>'+result.nama+'</span><br>';
            if(result.kode_jenis == "SUM"){
                htmlDialogForm += '<div id="form-tambah-bunga">';
                htmlDialogForm += '&ensp;&ensp;&ensp;<label><b>Bunga</b></label><br>'
                htmlDialogForm += '&ensp;&ensp;&ensp;<input type="number" id="id-bunga-tambah" minLength="5"> %<br>';
                htmlDialogForm += '</div>';
            }else if(result.kode_jenis == "SJK"){
                htmlDialogForm += '<div id="form-tambah-jangka-waktu">';
                htmlDialogForm += '&ensp;&ensp;&ensp;<label><b>Jangka Waktu</b></label><br>'
                htmlDialogForm += '&ensp;&ensp;&ensp;<select id="id-tambah-pilih-jw">';
                htmlDialogForm += '<option disabled selected>Pilih Jangka Waktu</option>';
                htmlDialogForm += '<option values="6">6 Bulan</option>';
                htmlDialogForm += '<option values="9">9 Bulan</option>';
                htmlDialogForm += '<option values="12">12 Bulan</option>';
                htmlDialogForm += '</select><br>';
                htmlDialogForm += '</div>';
            }else if(result.kode_jenis == "SP"){
                htmlDialogForm += '<div id="form-tambah-jenjang">';
                htmlDialogForm += '&ensp;&ensp;&ensp;<label><b>Jenjang</b></label><br>'
                htmlDialogForm += '&ensp;&ensp;&ensp;<select id="id-tambah-pilih-jenjang">';
                htmlDialogForm += '<option disabled selected>Pilih Jenjang</option>';
                htmlDialogForm += '<option values="TK">TK</option>';
                htmlDialogForm += '<option values="SD">SD</option>';
                htmlDialogForm += '<option values="SMP">SMP</option>';
                htmlDialogForm += '<option values="SMA">SMA</option>';
                htmlDialogForm += '<option values="Perguruan Tinggi">Perguruan Tinggi</option>';
                htmlDialogForm += '</select><br>';
                htmlDialogForm += '</div>';
            }else if(result.kode_jenis == "SK"){
                htmlDialogForm += '<div id="form-tambah-tgl-ambil">';
                htmlDialogForm += '&ensp;&ensp;&ensp;<label><b>Tanggal Hari Raya Idul Adha</b></label><br>'
                htmlDialogForm += '&ensp;&ensp;&ensp;<input type="date" id="tambah-tgl-ambil"><br>';
                htmlDialogForm += '</div>';
            } 
        });
        htmlDialogForm += '<br><label><b>Tanggal Simpan</></label><br>';
        htmlDialogForm += '<input type="date" id="id-tambah-tgl-simpan"><br><br>';
        htmlDialogForm += '<label><b>Jumlah Simpanan</b></label><br>';
        htmlDialogForm += '<input type="number" id="id-tambah-jumlah"><br><br>';
        htmlDialogForm += '<button id="dialog-btn-simpan">Simpan</button>';
        htmlDialogForm += '</div>';

        if(data_select_simpanan[0].saldo_akhir != 0){
            if(id_kode_jenis.text() == "SK"){
            
                var now = moment(stringToDate(new Date("2019-04-17")));
                var end = moment(stringToDate(data_select_simpanan[0].tgl_ambil));
    
                if(end.diff(now, "days") <= 30){
                    htmlFormAmbil += '<button id="openFormDialogAmbilSimpanan">Ambil Simpanan</button>';
                    htmlFormAmbil += '<div id="dialogFormAmbilSimpanan" title="Ambil Simpanan">';
                    htmlFormAmbil += '<br><label><b>Tanggal Pengambilan</></label><br>';
                    htmlFormAmbil += '<input type="date" id="id-ambil-tgl-simpan"><br>';
                    htmlFormAmbil += '<br><label><b>Tanggal Hari Raya Idul Adha</></label><br>';
                    htmlFormAmbil += '<input type="date" id="id-ambil-tgl-ambil"><br><br>';
                    htmlFormAmbil += '<label><b>Jumlah Ambil Simpanan</b></label><br>';
                    htmlFormAmbil += '<input type="number" id="jml-ambil-simpanan">';
                    htmlFormAmbil += '<button id="dialog-btn-ambil-simpanan">Simpan</button>';
                    htmlFormAmbil += '</div>';
                }else{
                    
                }
            }else {
                //form dialog ambil simpanan
                htmlFormAmbil += '<button id="openFormDialogAmbilSimpanan">Ambil Simpanan</button>';
                htmlFormAmbil += '<div id="dialogFormAmbilSimpanan" title="Ambil Simpanan">';
                htmlFormAmbil += '<br><label><b>Tanggal Pengambilan</></label><br>';
                htmlFormAmbil += '<input type="date" id="id-ambil-tgl-simpan"><br><br>';
                htmlFormAmbil += '<label><b>Jumlah Ambil Simpanan</b></label><br>';
                htmlFormAmbil += '<input type="number" id="jml-ambil-simpanan">';
                htmlFormAmbil += '<button id="dialog-btn-ambil-simpanan">Simpan</button>';
                htmlFormAmbil += '</div>';
            }
        }else{

        }
    
        htmlForm += '<br><label><b>Tanggal Simpan</b></label><br>';
        htmlForm += '<input type="date" id="id-tgl-simpan"><br>';
        //form jumlah simpanan
        htmlForm += '<br><label><b>Jumlah Simpanan</b></label><br>';
        htmlForm += '<input type="number" id="id-jumlah"><br><br>';
    }
    
    htmlForm += '<button id="btn-simpan">Simpan</button>'; //button simpan data simpanan
    
    $('#form').html(htmlForm); //gabungkan htmlForm ke id form

    $('#form-tambah-jenis-simpanan').html(htmlDialogForm); //gabungkan htmlDialogForm ke id form-tambah-jenis-simpanan

    $('#switch-jenis-simpanan').html(htmlSwitch); //gabungkan htmlSwitch ke id switch-jenis-simpanan

    $('#form-ambil-simpanan').html(htmlFormAmbil); //gabungkan htmlFormAmbil ke id form-ambil-simpanan

    show_hide_switch_jenis(data_exists_jenjang, data_exists_jangka_waktu);

    show_hide_form_jenis();
    
    btnSwitch(); //event ganti jenis simpanan

    dialogFormTambahSimpanan(); //event dialog tambah simpanan

    dialogFormAmbilSimpanan(); //event dialog ambil simpanan

    btnSimpanan(data_history_simpanan, data_cek_bunga); //event simpan data simpanan

}

function btnSubSwitch(){
    $('#btn-sub-switch').on('click', function(){
        var id_sub_jenis = $('#id-switch-sub-jenis :selected').attr('values');

        if(id_sub_jenis == null){
            alert("Jenjang belum dipilih");
        }else{
            var data = {
                id_jenis: id_sub_jenis,
                no_pendaftaran: no_pendaftaran.text()
            }
            
            ipcRenderer.send('request-ganti-sub-jenis-simpanan', data);
        }
    });
}

//fungsi untuk ganti jenis simpanan
function btnSwitch(){
    $('#btn-ganti-jenis').on('click', function(){ //button untuk ganti jenis simpanan
        var id_jenis = $('#id-switch-jenis :selected').attr('values');
        if(id_jenis == null){
            alert("Jenis Simpanan belum dipilih");
        }else{
            var data = {
                id_jenis: id_jenis,
                no_pendaftaran: no_pendaftaran.text()
            };

            //mengirim request ganti-jenis-simpanan ke profil_simpanan_nasabah_controller.js
            ipcRenderer.send('request-ganti-jenis-simpanan', data);
        }
        
    });
}

//fungsi untuk menyimpan data simpanan
function btnSimpanan(data_history_simpanan, data_cek_bunga){

    $('#btn-simpan').on('click', function(event){

        var idAnggota = id_anggota.text();
        var idJenis = id_jenis.text();
        var jumlah = $('#id-jumlah').val();
        var no = no_pendaftaran.text();
        var kode = kode_simpanan.text();
        var mSaldo_awal = saldo_awal.text();
        var mKredit = kredit.text();
        var mSaldo_akhir = saldo_akhir.text();
        var tanggal = $('#id-tgl-simpan').val();

        var bunga = 0;
        var jangka_waktu = null;
        var jenjang = null;
        var tgl_ambil = null;
        var data = {};

        if(kode == ""){ //jika kode simpanan kosong maka data simpanan akan diupdate (pertama)
            if(get_jenis() == undefined){
                alert("Jenis belum di pilih");
            }else if(tanggal == ""){
                alert("Tanggal Simpan Tidak Boleh Kosong");
            }else if(jumlah == ""){
                alert("Jumlah Simpanan Tidak Boleh Kosong");
            }else{
                var value_bunga = $('#id-bunga-simpan').val();
                var value_jangka_waktu = $('#id-pilih-jw :selected').attr('values');
                var value_jenjang = $('#id-pilih-jenjang :selected').attr('values');
                var value_tgl_ambil = $('#tgl-ambil').val();

                if(get_kode_jenis() == "SUM"){
                    if(value_bunga == ""){
                        alert("Bunga tidak boleh kosong");
                    }else{
                        bunga = value_bunga;

                        update_simpanan_pertama(id_simpanan, idAnggota, get_jenis(), jumlah, no,"Tambah Simpanan",
                                            kode,mSaldo_awal,tanggal,mKredit,mSaldo_akhir,bunga,jangka_waktu, jenjang, tgl_ambil);
                    }
                }else if(get_kode_jenis() == "SJK"){
                    if(value_jangka_waktu == null){
                        alert("Jangka Waktu tidak boleh kosong");
                    }else{
                        jangka_waktu = value_jangka_waktu;

                        update_simpanan_pertama(id_simpanan, idAnggota, get_jenis(), jumlah, no,"Tambah Simpanan",
                                            kode,mSaldo_awal,tanggal,mKredit,mSaldo_akhir,bunga,jangka_waktu, jenjang, tgl_ambil);
                    }
                }else if(get_kode_jenis() == "SP"){
                    if(value_jenjang == null){
                        alert("Jenjang tidak boleh kosong");
                    }else{
                        jenjang = value_jenjang;

                        update_simpanan_pertama(id_simpanan, idAnggota, get_jenis(), jumlah, no,"Tambah Simpanan",
                                            kode,mSaldo_awal,tanggal,mKredit,mSaldo_akhir,bunga,jangka_waktu, jenjang, tgl_ambil);
                    }
                }else if(get_kode_jenis() == "SK"){
                    if(value_tgl_ambil == ""){
                        alert("Tangal Hari Raya tidak boleh kosong");
                    }else{
                        tgl_ambil = value_tgl_ambil;

                        update_simpanan_pertama(id_simpanan, idAnggota, get_jenis(), jumlah, no,"Tambah Simpanan",
                                            kode,mSaldo_awal,tanggal,mKredit,mSaldo_akhir,bunga,jangka_waktu, jenjang, tgl_ambil);
                    }
                }else{

                    update_simpanan_pertama(id_simpanan, idAnggota, get_jenis(), jumlah, no,"Tambah Simpanan",
                                            kode,mSaldo_awal,tanggal,mKredit,mSaldo_akhir,bunga,jangka_waktu, jenjang, tgl);
                }
            }
        }else{ //jika kode_simpanan tidak kosong maka data simpanan diupdate (berlanjut)
            if(tanggal == ""){
                alert("Tanggal Simpan Tidak Boleh Kosong");
            }else if(jumlah == ""){
                alert("Jumlah Simpanan Tidak Boleh Kosong");
            }else{
                var mBunga = 0;

                var jml_simpanan = jumlah;
                var mSaldo_awal = saldo_akhir.text();
                var mSaldo_akhir = saldo_akhir.text();

                if(id_kode_jenis.text() == "SUM"){
                    
                    var end = moment(tanggal);
                    var start = null;

                    if(data_cek_bunga.length == 0){
                        
                        for(var i = 0 ; i < data_history_simpanan.length; i++){
                            start = moment(stringToDate(data_history_simpanan[i].tgl_simpanan));
                        }

                        if(start.isSame(end, 'month')){
                            mBunga = (parseInt(jml_simpanan)*parseInt(bunga_text.text()))/100;
                        }
                    }else{
                        mBunga = 0;
                    }

                    var total = parseInt(mSaldo_akhir) + parseInt(jml_simpanan) + parseInt(mBunga);

                    update_simpanan_lanjutan(id_simpanan, idAnggota, idJenis, jml_simpanan, no, 
                                                    "Tambah Simpanan", kode, mSaldo_awal, tanggal, total, mBunga, jangka_waktu, jenjang);
                }else if(id_kode_jenis.text() == "SJK"){
                    var total = parseInt(mSaldo_akhir) + parseInt(jml_simpanan) + parseInt(mBunga);
                    jangka_waktu = jangka_waktu_text.text();

                    update_simpanan_lanjutan(id_simpanan, idAnggota, idJenis, jml_simpanan, no, 
                        "Tambah Simpanan", kode, mSaldo_awal, tanggal, total, mBunga, jangka_waktu, jenjang);
                }else if(id_kode_jenis.text() == "SP"){
                    var total = parseInt(mSaldo_akhir) + parseInt(jml_simpanan) + parseInt(mBunga);
                    jenjang = jenjang_text.text();

                    update_simpanan_lanjutan(id_simpanan, idAnggota, idJenis, jml_simpanan, no, 
                        "Tambah Simpanan", kode, mSaldo_awal, tanggal, total, mBunga, jangka_waktu, jenjang);
                }else{
                    var total = parseInt(mSaldo_akhir) + parseInt(jml_simpanan) + parseInt(mBunga);

                    update_simpanan_lanjutan(id_simpanan, idAnggota, idJenis, jml_simpanan, no, 
                                            "Tambah Simpanan", kode, mSaldo_awal, tanggal, total, mBunga, jangka_waktu, jenjang);
                } 
            }
        }    
    });
}

//fungsi untuk menghandle form Ambil Simpanan
function dialogFormAmbilSimpanan(){
    $(function(){
        $('#dialogFormAmbilSimpanan').dialog({ //jangan menampilkan dialog saat pertama kali dibuka
            autoOpen: false
        });

        $('#openFormDialogAmbilSimpanan').on('click', function(){ //jika button di klik maka form dialog akan ditampilkan
            $('#dialogFormAmbilSimpanan').dialog('open');
        });

        $('#dialog-btn-ambil-simpanan').on('click', function(){ //button untuk menyimpan data ambil simpanan

            var jumlah = $('#jml-ambil-simpanan').val();
            var tgl_ambil = $('#id-ambil-tgl-simpan').val();
            var tgl_lebaran = null;
            var bunga = 0;
            var jenjang = null;
            var jangka_waktu = null;

            if(tgl_ambil == ""){
                alert("Tanggal Ambil Simpanan Tidak Boleh Kosong");
            }else if(jumlah == ""){
                alert("Jumlah Ambil Simpanan Tidak Boleh Kosong");
            }else{

                var value_tgl_lebaran = $('#id-ambil-tgl-ambil').val();

                var jml_simpanan = jumlah;
                var mSaldo_awal = saldo_akhir.text();
                var mSaldo_akhir = saldo_akhir.text(); 
                
                if(parseInt(jml_simpanan) > parseInt(mSaldo_akhir)){
                    alert("Jumlah Pengambilan tidak bisa lebih dari "+mSaldo_akhir);
                }else{
                    if(id_kode_jenis.text() == "SUM"){

                        var total = parseInt(mSaldo_akhir) - parseInt(jml_simpanan);
    
                        ambil_simpanan(id_simpanan, id_anggota.text(), id_jenis.text(), jml_simpanan, "Ambil Simpanan",
                                    mSaldo_awal, tgl_ambil, total, bunga, jangka_waktu, jenjang, tgl_lebaran);
    
                    }else if(id_kode_jenis.text() == "SJK"){
                        jangka_waktu = jangka_waktu_text.text();
    
                        var total = parseInt(mSaldo_akhir) - parseInt(jml_simpanan);
    
                        ambil_simpanan(id_simpanan, id_anggota.text(), id_jenis.text(), jml_simpanan, "Ambil Simpanan",
                                    mSaldo_awal, tgl_ambil, total, bunga, jangka_waktu, jenjang, tgl_lebaran);
    
                    }else if(id_kode_jenis.text() == "SP"){
                        jenjang = jenjang_text.text();
    
                        var total = parseInt(mSaldo_akhir) - parseInt(jml_simpanan);
    
                        ambil_simpanan(id_simpanan, id_anggota.text(), id_jenis.text(), jml_simpanan, "Ambil Simpanan",
                                    mSaldo_awal, tgl_ambil, total, bunga, jangka_waktu, jenjang, tgl_lebaran);
    
                    }else if(id_kode_jenis.text() == "SK"){
                        tgl_lebaran = value_tgl_lebaran;
    
                        var total = parseInt(mSaldo_akhir) - parseInt(jml_simpanan);
    
                        ambil_simpanan(id_simpanan, id_anggota.text(), id_jenis.text(), jml_simpanan, "Ambil Simpanan",
                                    mSaldo_awal, tgl_ambil, total, bunga, jangka_waktu, jenjang, tgl_lebaran);
                    }else{
    
                        var total = parseInt(mSaldo_akhir) - parseInt(jml_simpanan);
    
                        ambil_simpanan(id_simpanan, id_anggota.text(), id_jenis.text(), jml_simpanan, "Ambil Simpanan",
                                    mSaldo_awal, tgl_ambil, total, bunga, jangka_waktu, jenjang, tgl_lebaran);
                    }
                }
            }
        });
    });
}

//fungsi untuk menghandle form tambah simpanan
function dialogFormTambahSimpanan(){
    $(function(){
        $('#dialogFormTambahSimpanan').dialog({ //jangan menampilkan dialog saat pertama kali dibuka
            autoOpen: false
        });

        $('#openFormDialogTambahSimpanan').on('click', function(){ //jika button di klik maka form dialog akan ditampilkan
            $('#dialogFormTambahSimpanan').dialog('open');
        });

        $('#dialog-btn-simpan').on('click', function(){ //button untuk menambah data simpanan
            var jenis = get_tambah_jenis();
            var jumlah = $('#id-tambah-jumlah').val();
            var tgl = $('#id-tambah-tgl-simpan').val();
            var bunga = 0;
            var jangka_waktu = 0;
            var jenjang = "";

            if(get_tambah_jenis() == undefined){
                alert("Jenis belum di pilih");
            }else if(tgl == ""){
                alert("Tanggal Simpan Tidak Boleh Kosong");
            }else if(jumlah == ""){
                alert("Jumlah Simpanan Tidak Boleh Kosong");
            }else{

                var value_bunga = $('#id-bunga-tambah').val();
                var value_jangka_waktu = $('#id-tambah-pilih-jw :selected').attr('values');
                var value_jenjang = $('#id-tambah-pilih-jenjang :selected').attr('values');

                if(get_tambah_kode_jenis() == "SUM"){
                    if(value_bunga == ""){
                        alert("Bunga tidak boleh kosong");
                    }else{
                        bunga = value_bunga;

                        dialog_tambah_simpanan(id_anggota.text(), jenis, "Tambah Simpanan",jumlah, tgl, bunga, jangka_waktu, null);
                    }
                }else if(get_tambah_kode_jenis() == "SJK"){
                    if(value_jangka_waktu == null){
                        alert("Jangka Waktu tidak boleh kosong");
                    }else{
                        jangka_waktu = value_jangka_waktu;

                        dialog_tambah_simpanan(id_anggota.text(), jenis, "Tambah Simpanan",jumlah, tgl, bunga, jangka_waktu, null);
                    }
                }else if(get_tambah_kode_jenis() == "SP"){
                    if(value_jenjang == null){
                        alert("Jenjang tidak boleh kosong");
                    }else{
                        jenjang = value_jenjang;

                        dialog_tambah_simpanan(id_anggota.text(), jenis, "Tambah Simpanan",jumlah, tgl, bunga, jangka_waktu, jenjang);
                    }
                }else{

                    dialog_tambah_simpanan(id_anggota.text(), jenis, "Tambah Simpanan",jumlah, tgl, bunga, jangka_waktu, null);
                }
            }
        });
    });
}

//fungsi untuk menampilkan data history simpanan ke tabel
function tableHistory(data_history_simpanan){
    var html = "";
    var htmlHeadBunga = '';
    var htmlHeadJangkaWaktu = '';
    var htmlHeadJenjang = '';

    htmlHeadBunga += '<th>Bunga</th>';
    htmlHeadJangkaWaktu += '<th>Jangka Waktu</th>';
    htmlHeadJenjang += '<th>Jenjang</th>';

    data_history_simpanan.forEach(function(result){
        html += '<tr>';
        html += '<td>';
        html += result.no_pendaftaran;
        html += '</td>';
        html += '<td>';
        html += result.kode_simpanan;
        html += '</td>';
        html += '<td>';
        html += result.nama;
        html += '</td>';
        html += '<td>';
        html += result.saldo_awal;
        html += '</td>';
        html += '<td>';
        html += stringToDate(result.tgl_simpanan);
        html += '</td>';
        html += '<td>';
        html += result.kredit;
        html += '</td>';
        html += '<td>';
        html += result.saldo_akhir;
        html += '</td>';
        html += '<td>';
        html += result.status;
        html += '</td>';
        if(result.kode_jenis == "SUM"){
            html += '<td>';
            html += result.bunga;
            html += '</td>';
        }else if(result.kode_jenis == "SJK"){
            html += '<td>';
            html += result.jangka_waktu + " Bulan";
            html += '</td>';
        }else if(result.kode_jenis == "SP"){
            html += '<td>';
            html += result.jenjang;
            html += '</td>';
        }else{

        }
        html += '</tr>';
    });

    if(data_history_simpanan.length == 0){
        
    }else{
        if(data_history_simpanan[0].kode_jenis == "SUM"){
            $('#tbhead').append(htmlHeadBunga);
        }else if(data_history_simpanan[0].kode_jenis == "SJK"){
            $('#tbhead').append(htmlHeadJangkaWaktu);
        }else if(data_history_simpanan[0].kode_jenis == "SP"){
            $('#tbhead').append(htmlHeadJenjang);
        }else{
            
        }
    }
    
    document.querySelector("#table > tbody").innerHTML = html;

    tableSorter();
}

function tableSorter(){
    $(function(){  
        $('#table').tablesorter({
            theme: 'default',
			widthFixed: true,
            widgets: ['zebra', 'filter', 'pager'],
            widgetOptions: {
                pager_css: {
					container   : 'tablesorter-pager',    // class added to make included pager.css file work
					errorRow    : 'tablesorter-errorRow', // error information row (don't include period at beginning); styled in theme file
					disabled    : 'disabled'              // class added to arrows @ extremes (i.e. prev/first arrows "disabled" on first page)
                },
                pager_selectors: {
					container   : '.pager',       // target the pager markup (wrapper)
					first       : '.first',       // go to first page arrow
					prev        : '.prev',        // previous page arrow
					next        : '.next',        // next page arrow
					last        : '.last',        // go to last page arrow
					gotoPage    : '.gotoPage',    // go to page selector - select dropdown that sets the current page
					pageDisplay : '.pagedisplay', // location of where the "output" is displayed
					pageSize    : '.pagesize'     // page size selector - select dropdown that sets the "size" option
                },
                pager_output: '{startRow:input} &ndash; {endRow} / {totalRows} rows', // '{page}/{totalPages}'
                pager_updateArrows: true,
                pager_startPage: 0,
                pager_pageReset: 0,
                pager_size: 10,
                pager_countChildRows: false,
                pager_savePages: true,
                pager_storageKey: "tablesorter-pager",
                pager_fixedHeight: true,
                pager_removeRows: false,
                filter_useParsedData: false,
                filter_startsWith: false,
                filter_searchDelay: 300,
                filter_reset: null,
                filter_ignoreCase: true,
                filter_hideFilters: false,
                filter_functions: null,
                filter_cssFilter: "tablesorter-filter",
                filter_columnFilters: true,
                filter_childRows: false
            }
        })
        
        .bind('pagerChange pagerComplete pagerInitialized pageMoved', function(e, c) {
			var p = c.pager, // NEW with the widget... it returns config, instead of config.pager
				msg = '"</span> event triggered, ' + (e.type === 'pagerChange' ? 'going to' : 'now on') +
				' page <span class="typ">' + (p.page + 1) + '/' + p.totalPages + '</span>';
			$('#display')
				.append('<li><span class="str">"' + e.type + msg + '</li>')
				.find('li:first').remove();
        })
        
        $('.goto').click(function() {
			// triggering "pageAndSize" without parameters will reset the
			// pager to page 1 and the original set size (10 by default)
			// $('table').trigger('pageAndSize')
			$table.trigger('pageAndSize', [1, 10]);
        });    
    });
}