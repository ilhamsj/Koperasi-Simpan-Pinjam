const {ipcRenderer} = require('electron');

$('#btn-simpan').on('click', function(){
    var id = $('#id-user').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var level = get_level();

    if(id == ""){
        if(username == ""){
            alert("Username tidak boleh kosong");
        }else if(password == ""){
            alert("Password tidak boleh kosong");
        }else if(level == undefined){
            alert("Hak Akses belum dipilih");
        }else{
            var data = {
                id: id,
                username: username,
                password: password,
                level: level
            };
        
            ipcRenderer.send('request-simpan-data-user', data);
        }
    }else{
        if(password == ""){
            alert("Password tidak boleh kosong");
        }else{
            var data = {
                id: id,
                password: password,
                level: level
            };
        
            ipcRenderer.send('request-simpan-data-user', data);
        }
    }
});

ipcRenderer.send('request-data-user');

ipcRenderer.on('response-data-user', function(event, results){
    selectAllData(results);

    selectData();
});

ipcRenderer.on('response-cek-username', function(event, results){
    alert("Username '"+results[0].username + "' sudah ada");
});

ipcRenderer.on('response-simpan-data-user', function(event){
    alert('Data User berhasil ditambah');
    location.reload();
});

ipcRenderer.on('response-update-user', function(event){
    alert('Data User berhasil diubah');
    location.reload();
})

ipcRenderer.on('response-select-hapus-data-user', function(event){
    alert('Data User berhasil dihapus');
    location.reload();
});

ipcRenderer.on('response-select-edit-data-user', function(event, results){
    $('#id-user').val(results[0].id);
    $('#username').val(results[0].username);
    $('#username').attr('disabled', true);
    $('#password').val(results[0].password);

    var inputs = $('input[name=level]');
    for (var i = 0; i < inputs.length; i++) {
      if(inputs[i].value == results[0].level){
          inputs[i].checked = true;
      }
    }
});

function get_level() {
    var inputs = $('input[name=level]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }
    }
}

function selectAllData(results){
    var html = "";

    results.forEach(function(result){
        if(result.username == "admin"){

        }else{
            html += '<tr>';
            html += '<td>';
            html += result.username;
            html += '</td>';
            html += '<td>';
            html += result.password;
            html += '</td>';
            html += '<td>';
            html += result.level;
            html += '</td>';
            html += '<td>';
            html += '<a href="#" id="edit-'+result.id+'">Edit</a>';
            html += '</td>';
            html += '<td>';
            html += '<a href="#" id="hapus-'+result.id+'">Hapus</a>';
            html += '</td>';
            html += '</tr>';
        }
    });

    $('#my-data').html(html);

    tableSorter();
}

function selectData(){
    var a = $('a');
    for(var i = 0; i < a.length; i++){
        $('#edit-'+i).click(function(data){
            var id_edit = data.target.id;
            var edit = id_edit.match(/[\d]/gi);

            var id = edit.join('');

            ipcRenderer.send('request-select-edit-data-user', id);
        }); 

        $('#hapus-'+i).click(function(data){
            var id_hapus = data.target.id;
            var hapus = id_hapus.match(/[\d]/gi);

            var id = hapus.join('');

            ipcRenderer.send('request-select-hapus-data-user', id);
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