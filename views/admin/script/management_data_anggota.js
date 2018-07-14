const {ipcRenderer} = require('electron');

ipcRenderer.send('request-management-data-anggota');

ipcRenderer.on('response-management-data-anggota', function(event, results){
    selectAllData(results);

    selectData();
});

ipcRenderer.on('response-select-edit-data-anggota', function(event, results){
    
    $('#dialogFormAnggota').dialog('open');

    $('#id-anggota').val(results[0].id);
    $('#nm-anggota').val(results[0].nama_anggota);
    $('#alamat-anggota').text(results[0].alamat_anggota);
    $('#no-telp').val(results[0].no_telp_anggota);

    $('#btn-simpan').on('click', function(){
        var id = $('#id-anggota').val();
        var nama = $('#nm-anggota').val();
        var alamat = $('#alamat-anggota').val();
        var no = $('#no-telp').val();

        if(nama == ""){
            alert("Nama tidak boleh kosong");
        }else if(alamat == ""){
            alert("Alamat tidak boleh kosong");
        }else if(no == ""){
            alert("No Telp tidak boleh kosong");
        }else{
            var data = {
                id: id,
                nama: nama,
                alamat: alamat,
                no: no
            }
            
            ipcRenderer.send('request-update-data-anggota', data);
        }
    });
});

ipcRenderer.on('response-update-data-anggota', function(event){
    alert('Data Anggota berhasil diubah');
    location.reload();
});

ipcRenderer.on('response-hapus-data-anggota', function(event){
    alert('Data Anggota berhasil dihapus');
    location.reload();
});

ipcRenderer.on('response-cek-id-anggota', function(event, results){
    alert(results[0].no_pendaftaran+' telah dipakai pada data simpanan, tidak dapat dihapus');
});

function selectAllData(results){
    var html = "";
    var htmlDialog = "";

    results.forEach(function(result){
        html += '<tr>';
        html += '<td>';
        html += result.no_pendaftaran;
        html += '</td>';
        html += '<td>';
        html += result.nama_anggota;
        html += '</td>';
        html += '<td>';
        html += result.nik_anggota;
        html += '</td>';
        html += '<td>';
        html += result.alamat_anggota;
        html += '</td>';
        html += '<td>';
        html += result.jk_anggota;
        html += '</td>';
        html += '<td>';
        html += result.no_telp_anggota;
        html += '</td>';
        html += '<td>';
        html += stringToDate(result.tgl_masuk);
        html += '</td>';
        html += '<td>';
        html += '<a href="#" id="edit-'+result.id+'">Edit</a>';
        html += '</td>';
        html += '<td>';
        html += '<a href="#" id="hapus-'+result.id+'">Hapus</a>';
        html += '</td>';
        html += '</tr>';
    });

    htmlDialog += '<div id="dialogFormAnggota" title="Edit Anggota">';
    htmlDialog += '<input type="hidden" id="id-anggota">';
    htmlDialog += '<label>Nama Anggota</label><br>';
    htmlDialog += '<input type="text" id="nm-anggota"><br><br>';
    htmlDialog += '<label>Alamat Anggota</label><br>';
    htmlDialog += '<textarea id="alamat-anggota"></textarea><br><br>';
    htmlDialog += '<label>No Telp</label><br>';
    htmlDialog += '<input type="text" id="no-telp"><br><br>';
    htmlDialog += '<button id="btn-simpan">Simpan</button>';
    htmlDialog += '</div>';

    $('#my-data').html(html);

    $('#dialog-section').html(htmlDialog);

    tableSorter();
}

function selectData(results){

    $('#dialogFormAnggota').dialog({
        autoOpen: false
    });

    var a = $('a');
    for(var i = 0; i < a.length; i++){
        $('#edit-'+i).click(function(data){
            var id_edit = data.target.id;
            var edit = id_edit.match(/[\d]/gi);

            var id = edit.join('');

            ipcRenderer.send('request-select-edit-data-anggota', id);
        }); 

        $('#hapus-'+i).click(function(data){
            var id_hapus = data.target.id;
            var hapus = id_hapus.match(/[\d]/gi);

            var id = hapus.join('');
            console.log(id);
            ipcRenderer.send('request-hapus-data-anggota', id);
        }); 
        
    }
}

function stringToDate(date){
    var d = new Date(date).toISOString().slice(0, 10);
    return d;
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