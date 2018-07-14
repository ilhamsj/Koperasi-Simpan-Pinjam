const {ipcRenderer} = require('electron');

var id_pinjaman = localStorage.getItem("id"); //mengambil value dari HTML Storage

//variable
var id_anggota = $('#id-anggota');
var id_jenis_text = $('#id-jenis-pinjaman');
var kode_jenis_text = $('#kode-jenis');
var no_pendaftaran = $('#no');
var kode_pinjaman = $('#kode');
var nama_jenis = $('#nama-jenis-pinjaman');
var nik_anggota = $('#nik');
var nama_anggota = $('#nama');
var alamat_anggota = $('#alamat');
var tanggal_pinjaman = $('#tanggal');
var jangka_waktu = $('#jangka_waktu');
var jumlah = $('#jumlah');
var bunga = $('#bunga');
var iptw_text = $('#iptw');
var angsuran_pokok = $('#angsuran_pokok');
var total_angsuran = $('#total_angsuran');
var jml_cicilan = $('#jml_cicilan');
var sisa_angsuran = $('#sisa_angsuran');

ipcRenderer.send('request-select-data-pinjaman', id_pinjaman);

ipcRenderer.on('response-select-data-pinjaman', function(event, data_select_pinjaman, data_select_angsuran, cicilan, data_jenis_pinjaman, data_select_exists_jenis_pinjaman, ku_exists_jangka_waktu, ksb_exists_jangka_waktu, ka_exists_jangka_waktu){

    id_anggota.text(data_select_pinjaman[0].id_anggota);
    id_jenis_text.text(data_select_pinjaman[0].id_jenis_pinjaman);
    kode_jenis_text.text(data_select_pinjaman[0].kode_jenis);
    no_pendaftaran.text(data_select_pinjaman[0].no_pendaftaran);
    if(data_select_pinjaman[0].kode_pinjaman == null){
        kode_pinjaman.text("");
    }else{
        kode_pinjaman.text(data_select_pinjaman[0].kode_pinjaman);
    }
    if(data_select_pinjaman[0].nama == null){
        nama_jenis.text("");
    }else{
        nama_jenis.text(data_select_pinjaman[0].nama);
    }
    nik_anggota.text(data_select_pinjaman[0].nik_anggota);
    nama_anggota.text(data_select_pinjaman[0].nama_anggota);
    alamat_anggota.text(data_select_pinjaman[0].alamat_anggota);
    if(data_select_pinjaman[0].tgl_pinjaman == null){
        tanggal_pinjaman.text("");
    }else{
        tanggal_pinjaman.text(stringToDate(data_select_pinjaman[0].tgl_pinjaman));
    }
    jangka_waktu.text(data_select_pinjaman[0].jangka_waktu);
    bunga.text(data_select_pinjaman[0].bunga_angsuran);
    iptw_text.text(data_select_pinjaman[0].iptw);
    jumlah.text(data_select_pinjaman[0].jml_pinjaman);
    angsuran_pokok.text(data_select_pinjaman[0].angsuran_pokok);
    total_angsuran.text(data_select_pinjaman[0].total_angsuran);
    if(cicilan == null){
        jml_cicilan.text("0");
        sisa_angsuran.text("0");
    }else{
        jml_cicilan.text(cicilan);
        sisa_angsuran.text(parseInt(data_select_pinjaman[0].total_angsuran) - parseInt(cicilan));
    }
    
    getHtml(data_select_pinjaman, data_jenis_pinjaman, data_select_exists_jenis_pinjaman, ku_exists_jangka_waktu, ksb_exists_jangka_waktu, ka_exists_jangka_waktu);

    tableAngsuran(data_select_angsuran);
});

ipcRenderer.on('response-simpan-data-pinjaman', function(event){
    alert('Data Pinjaman Berhasil disimpan');
    location.reload();
});

ipcRenderer.on('response-update-data-angsuran', function(event){
    alert('Pembayaran Berhasil');
    location.reload();
});

ipcRenderer.on('response-cek-jenis-pinjaman', function(event, results){
    alert("Jenis Pinjaman '"+results[0].nama+"' dengan jangka waktu '"+results[0].jangka_waktu+"' telah dipakai");
});

ipcRenderer.on('response-tambah-data-pinjaman', function(event, id){
    alert("Data Pinjaman Berhasil Ditambah");
    localStorage.setItem("id", id); //menyimpan id ke HTML Storage
    window.location.replace("profil_pinjaman_nasabah.html");
});

ipcRenderer.on('response-ganti-jenis-pinjaman', function(event, results){
    localStorage.setItem("id", results[0].id); //menyimpan id ke HTML Storage
    window.location.replace("profil_pinjaman_nasabah.html");
});

ipcRenderer.on('response-ganti-sub-jenis-pinjaman', function(event, results){
    localStorage.setItem("id", results[0].id); //menyimpan id ke HTML Storage
    window.location.replace("profil_pinjaman_nasabah.html");
});

ipcRenderer.on('response-select-bayar-angsuran', function(event, data_select_bayar_angsuran, data_cek_iptw, data_select_angsuran){
    $('#dialogFormBayar').dialog('open');

    /*
    var waktu_sekarang = new Date("2019-11-12");

    var denda = 5000;

    if(stringToDate(data_select_bayar_angsuran[0].tgl_batas_pinjaman) < stringToDate(waktu_sekarang)){
        $('#harga-denda').text((denda*data_select_bayar_angsuran[0].selisih_bulan));
    }else{
        $('#harga-denda').text("0");
    }
    */

    $('#id-angsuran').val(data_select_bayar_angsuran[0].id);
    $('#angsuran-ke').text(data_select_bayar_angsuran[0].angsuran_ke);

    $('button[title=Close]').on('click', function(){
        location.reload();
    });

    $('#btn-simpan-angsuran').on('click', function(){
        var id_angsuran = $('#id-angsuran').val();
        var tanggal_bayar = $('#tgl-bayar').val();
        var jumlah_bayar = $('#jml-bayar').val();
        var harga_denda = $('#harga-denda').text();
        var sisa_bayar = (parseInt(data_select_bayar_angsuran[0].total_bayar) - parseInt(data_select_bayar_angsuran[0].jml_bayar));

        var iptw = 0;

        if(tanggal_bayar == ""){
            alert("Tanggal bayar tidak boleh kosong");
        }else if(jumlah_bayar == ""){
            alert("Jumlah bayar tidak boleh kosong");
        }else{

            if(data_cek_iptw.length == 0){
                
                if(data_select_bayar_angsuran[0].angsuran_ke == 6){
                    var array_tgl_batas = [];
                    var array_tgl_bayar = [];
                    var array_cek_tgl = [];

                    for(var i = 1; i < (parseInt(jangka_waktu.text()) - 5) - 1; i++){
                        array_tgl_batas[i-1] = stringToDate(moment(moment().add(i, 'month')).valueOf());
                    }

                    for(var i = 1; i < (parseInt(jangka_waktu.text()) - 5) - 1; i++){
                        array_tgl_bayar[i-1] = stringToDate(data_select_angsuran[i-1].tgl_bayar);
                    }
                    
                    for(var i = 1; i < (parseInt(jangka_waktu.text()) - 5) - 1; i++){
                        var a = moment(array_tgl_batas[i]);
                        var b = moment(array_tgl_bayar[i]);
                        array_cek_tgl[i-1] = moment(a).isSameOrAfter(b);
                    }

                    if(array_cek_tgl.indexOf(false) == -1){
                        iptw = (parseInt(jumlah_bayar) * parseInt(iptw_text.text())/100) * 12;
                    }else{
                        iptw = 0;
                    }
                }
            }else{
                iptw = 0;
            }

            if(jumlah_bayar > sisa_bayar){
                alert("Jumlah Bayar tidak bisa lebih dari "+sisa_bayar);
            }else{
                var temp_jml_bayar = 0;
                if(data_select_bayar_angsuran[0].jml_bayar == 0){
                    temp_jml_bayar = 0
                }else{
                    temp_jml_bayar = data_select_bayar_angsuran[0].jml_bayar;
                }
                var data = {
                    id_angsuran: parseInt(id_angsuran),
                    tanggal_bayar: tanggal_bayar,
                    iptw: iptw,
                    jumlah_bayar: (parseInt(jumlah_bayar)+parseInt(temp_jml_bayar))
                }

                ipcRenderer.send('request-update-data-angsuran', data);
            }
        }
    });
});

function get_tambah_jenis() {
    var inputs = $('input[name=id-tambah-jenis]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }
    }
}

function get_jenis() {
    var inputs = $('input[name=id-jenis]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }
    }
}

function getHtml(data_select_pinjaman, data_jenis_pinjaman, data_select_exists_jenis_pinjaman, ku_exists_jangka_waktu, ksb_exists_jangka_waktu, ka_exists_jangka_waktu){
    var htmlForm = "";
    var htmlDialogForm = "";
    var htmlSwitch = "";
    
    if(data_select_pinjaman[0].kode_pinjaman == null){
        htmlForm += '<br><label><b>Jenis Pinjaman</b></label><br>';
        data_jenis_pinjaman.forEach(function(result){
            htmlForm += '<input type="radio" name="id-jenis" value="'+result.id+'" kode="'+result.kode_jenis+'"><span>'+result.nama+'</span><br>';
        });
        htmlForm += '<br><label><b>Jumlah Pinjaman</b></label><br>';
        htmlForm += '<input type="number" id="id-jumlah"><br>';
        htmlForm += '<br><label><b>Tanggal Pinjam</b></label><br>';
        htmlForm += '<input type="date" id="id-tgl-pinjam"><br>';
        htmlForm += '<br><label><b>Jangka Waktu</b></label><br>';
        htmlForm += '<input type="number" id="jangka-waktu"><br>';
        htmlForm += '<br><label><b>Bunga</b></label><br>';
        htmlForm += '<input type="number" id="id-bunga"><br><br>';

        htmlForm += '<button id="btn-simpan">Simpan</button>'; 
    }else{
        htmlSwitch += '<label><b>Ganti Jenis Pinjaman</b></label><br>';
        htmlSwitch += '<select id="id-switch-jenis">';
        htmlSwitch += '<option disabled selected>Pilih Jenis Pinjaman</option>';
        data_select_exists_jenis_pinjaman.forEach(function(result){
            htmlSwitch += '<option values="'+result.id+'">'+result.nama+'</option>';
        });
        htmlSwitch += '</select>';
        htmlSwitch += '<button id="btn-ganti-jenis">Ganti</button>';

        htmlDialogForm += '<button id="openFormDialogTambahPinjaman">Tambah Pinjaman</button>';
        htmlDialogForm += '<div id="dialogFormTambahPinjaman" title="Tambah Pinjaman">';
        htmlDialogForm += '<label><b>Jenis Pinjaman</b></label><br>';
        data_jenis_pinjaman.forEach(function(result){
            htmlDialogForm += '<input type="radio" name="id-tambah-jenis" value="'+result.id+'" kode="'+result.kode_jenis+'"><span>'+result.nama+'</span><br>';
        });
        htmlDialogForm += '<br><label><b>Tanggal Pinjam</></label><br>';
        htmlDialogForm += '<input type="date" id="id-tambah-tgl-pinjam"><br><br>';
        htmlDialogForm += '<label><b>Jangka Waktu</b></label><br>';
        htmlDialogForm += '<input type="number" id="id-tambah-jangka-waktu"><br><br>';
        htmlDialogForm += '<label><b>Jumlah Pinjaman</b></label><br>';
        htmlDialogForm += '<input type="number" id="id-tambah-jumlah"><br><br>';
        htmlDialogForm += '<label><b>Bunga</b></label><br>';
        htmlDialogForm += '<input type="number" id="id-tambah-bunga"><br><br>';
        htmlDialogForm += '<button id="dialog-btn-simpan">Simpan</button>';
        htmlDialogForm += '</div>';
    }

    $('#form').html(htmlForm);
    $('#form-tambah-jenis-pinjaman').html(htmlDialogForm);
    $('#switch-jenis-pinjaman').html(htmlSwitch);

    show_hide_show_jenis(ku_exists_jangka_waktu, ksb_exists_jangka_waktu, ka_exists_jangka_waktu);

    btnSwitch();

    dialogFormTambahPinjaman();

    btnSimpan();
}

function show_hide_show_jenis(ku_exists_jangka_waktu, ksb_exists_jangka_waktu, ka_exists_jangka_waktu){
    $('#id-switch-jenis').on('change', function(data){
        var htmlPilihSub = "";

        var value = data.target.value;
        if(value == "Kredit Umum"){
            htmlPilihSub += '<br><label><b>Pilih Jangka Waktu</b></label>';
            htmlPilihSub += '<br><select id="id-switch-sub-jenis">';
            ku_exists_jangka_waktu.forEach(function(result){
                htmlPilihSub += '<option values="'+result.id+'">'+result.jangka_waktu+'</option>';
            });
            htmlPilihSub += '</select>';
            htmlPilihSub += '<button id="btn-sub-switch">Ganti</button>';

            $('#btn-ganti-jenis').hide();
        }else if(value == "Kredit Subsidi BBM"){
            htmlPilihSub += '<br><label><b>Pilih Jangka Waktu</b></label>';
            htmlPilihSub += '<br><select id="id-switch-sub-jenis">';
            ksb_exists_jangka_waktu.forEach(function(result){
                htmlPilihSub += '<option values="'+result.id+'">'+result.jangka_waktu+'</option>';
            });
            htmlPilihSub += '</select>';
            htmlPilihSub += '<button id="btn-sub-switch">Ganti</button>';

            $('#btn-ganti-jenis').hide();
        }else{
            $('#btn-ganti-jenis').show();
        }
        
        $('#switch-sub-jenis-pinjaman').html(htmlPilihSub);

        btnSubSwitch();
    });
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
            
            ipcRenderer.send('request-ganti-sub-jenis-pinjaman', data);
        }
    });
}

function btnSwitch(){
    $('#btn-ganti-jenis').on('click', function(){ //button untuk ganti jenis simpanan
        var id_jenis = $('#id-switch-jenis :selected').attr('values');
        if(id_jenis == null){
            alert("Jenis Pinjaman belum dipilih");
        }else{
            var data = {
                id_jenis: id_jenis,
                no_pendaftaran: no_pendaftaran.text()
            };

            //mengirim request ganti-jenis-simpanan ke profil_simpanan_nasabah_controller.js
            ipcRenderer.send('request-ganti-jenis-pinjaman', data);
        }
        
    });
}

function dialogFormTambahPinjaman(){
    $(function(){
        $('#dialogFormTambahPinjaman').dialog({ 
            autoOpen: false
        });

        $('#openFormDialogTambahPinjaman').on('click', function(){ 
            $('#dialogFormTambahPinjaman').dialog('open');
        });

        $('#dialog-btn-simpan').on('click', function(){
            var jenis = get_tambah_jenis();
            var jumlah = $('#id-tambah-jumlah').val();
            var tanggal = $('#id-tambah-tgl-pinjam').val();
            var bunga = $('#id-tambah-bunga').val();
            var jangka_waktu = $('#id-tambah-jangka-waktu').val();

            if(jenis == undefined){
                alert("Jenis belum di pilih");
            }else if(jumlah == ""){
                alert("Jumlah Pinjam Tidak Boleh Kosong");
            }else if(tanggal == ""){
                alert("Tanggal Pinjam Tidak Boleh Kosong");
            }else if(bunga == ""){
                alert("Bunga Pinjam Tidak Boleh Kosong");
            }else if(jangka_waktu == ""){
                alert("Jangka Waktu Pinjam Tidak Boleh Kosong");
            }else{
                var angsuran = parseInt(jumlah)/parseInt(jangka_waktu);
                var t_bunga = (parseInt(angsuran)*parseInt(bunga))/100;
                var gtotal = 0;
                var total = 0;
                for(var i = 1; i <= jangka_waktu; i++){
                    total = parseInt(angsuran) + parseInt(t_bunga);
                    gtotal = total * i;
                }

                var data_pinjaman = {
                    id_pinjaman: id_pinjaman,
                    tgl_bayar: null,
                    jml_bayar: 0,
                    angsuran: parseInt(angsuran),
                    bunga: parseInt(t_bunga),
                    iptw: 0,
                    total_bayar: total,
                    id_anggota: id_anggota.text(),
                    id_jenis: jenis,
                    tgl_pinjaman: tanggal,
                    jangka_waktu: jangka_waktu,
                    jml_pinjaman: jumlah,
                    angsuran_pokok: total,
                    bunga_angsuran: bunga,
                    total_angsuran: gtotal
                }

                ipcRenderer.send('request-tambah-data-pinjaman', data_pinjaman);
            }
        });
    });
}

function btnSimpan(){
    $('#btn-simpan').on('click', function(event){
        var id_jenis = get_jenis();
        var idAnggota = id_anggota.text();
        var jumlah = $('#id-jumlah').val();
        var no = no_pendaftaran.text();
        var kode = kode_pinjaman.text();
        var tanggal = $('#id-tgl-pinjam').val();
        var jangkaWaktu = $('#jangka-waktu').val();
        var b = $('#id-bunga').val();

        if(id_jenis == undefined){
            alert("Jenis Pinjaman belum dipilih");
        }else if(jumlah == ""){
            alert("Jumlah Pinjaman tidak boleh kosong");
        }else if(tanggal == ""){
            alert("Tanggal Pinjaman tidak boleh kosong");
        }else if(jangkaWaktu == ""){
            alert("Jangka Waktu tidak boleh kosong");
        }else if(b == ""){
            alert("Bunga tidak boleh kosong");
        }else{
            var angsuran = parseInt(jumlah)/parseInt(jangkaWaktu);
            var t_bunga = (parseInt(angsuran)*parseInt(b))/100;
            var gtotal = 0;
            var total = 0;
            for(var i = 1; i <= jangkaWaktu; i++){
                total = parseInt(angsuran) + parseInt(t_bunga);
                var data_angsuran = {
                    id_pinjaman: id_pinjaman,
                    angsuran_ke: i,
                    tgl_bayar: null,
                    jml_bayar: 0,
                    angsuran: parseInt(angsuran),
                    bunga: parseInt(t_bunga),
                    iptw: 0,
                    total_bayar: total
                };
                gtotal = total * i;

                ipcRenderer.send('request-simpan-data-angsuran', data_angsuran);
            }

            var data_pinjaman = {
                id_pinjaman: id_pinjaman,
                id_anggota: idAnggota,
                id_jenis: id_jenis,
                no_pendaftaran: no,
                kode_pinjaman: kode,
                tgl_pinjaman: tanggal,
                jangka_waktu: jangkaWaktu,
                jml_pinjaman: jumlah,
                angsuran_pokok: total,
                bunga_angsuran: b,
                total_angsuran: gtotal
            }

            ipcRenderer.send('request-simpan-data-pinjaman', data_pinjaman);
        }
    });
}

function stringToDate(date){
    var d = new Date(date).toISOString().slice(0, 10);
    return d;
}

function tableAngsuran(data_select_angsuran){
    var html = "";
    var htmlDialog = "";

    data_select_angsuran.forEach(function(result){
        html += '<tr>';
        html += '<td>';
        html += result.angsuran_ke;
        html += '</td>';
        html += '<td>';
        html += result.angsuran;
        html += '</td>';
        html += '<td>';
        html += result.bunga;
        html += '</td>';
        html += '<td>';
        html += result.total_bayar;
        html += '</td>';
        if(result.tgl_bayar == null){
            html += '<td>';
            html += '';
            html += '</td>';
        }else{
            html += '<td>';
            html += stringToDate(result.tgl_bayar);
            html += '</td>';
        }
        if(result.iptw == 0){
            html += '<td>';
            html += result.iptw;
            html += '</td>';
        }else{
            html += '<td>';
            html += result.iptw;
            html += '</td>';
        }
        if(result.jml_bayar == 0){
            html += '<td>';
            html += '';
            html += '</td>';
        }else{
            html += '<td>';
            html += result.jml_bayar;
            html += '</td>';
        }
        if(result.jml_bayar == 0){
            html += '<td>';
            html += '';
            html += '</td>';
        }else{
            html += '<td>';
            html += (parseInt(result.total_bayar) - parseInt(result.jml_bayar));
            html += '</td>';
        }
        if(result.jml_bayar == result.total_bayar){
            html += '<td>';
            html += 'Lunas';
            html += '</td>';
        }else{
            html += '<td>';
            html += '<a href="#" id="bayar-'+result.id+'">Bayar</a>';
            html += '</td>';
        }    
        html += '</tr>';
    });

    htmlDialog += '<div id="dialogFormBayar" title="Bayar Angsuran">';
    htmlDialog += '<input type="hidden" id="id-angsuran">';
    htmlDialog += '<label>Angsuran Ke : </label><label id="angsuran-ke"></label><br><br>';
    htmlDialog += '<label>Denda : </label><label id="harga-denda"></label><br><br>';
    htmlDialog += '<label>Tanggal Bayar</label><br>';
    htmlDialog += '<input type="date" id="tgl-bayar"><br><br>';
    htmlDialog += '<label>Jumlah Bayar</label><br>';
    htmlDialog += '<input type="number" id="jml-bayar"><br><br>';
    htmlDialog += '<button id="btn-simpan-angsuran">Simpan</button>';
    htmlDialog += '</div>';

    $('#form-bayar-pinjaman').html(htmlDialog);

    document.querySelector("#table > tbody").innerHTML = html;

    tableSorter();

    selectData()
}

function selectData(){
    $('#dialogFormBayar').dialog({
        autoOpen: false
    });

    var a = $('a');

    for(var i = 0; i < a.length; i++){     
        $('#'+a[i].id).click(function(data){
            
            var id_edit = data.target.id;
            var edit = id_edit.match(/[\d]/gi);
            
            var id = edit.join('');
            var data = {
                id: id,
                kode_pinjaman: kode_pinjaman.text()
            }

            ipcRenderer.send('request-select-bayar-angsuran', data);
        });        
    }
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
