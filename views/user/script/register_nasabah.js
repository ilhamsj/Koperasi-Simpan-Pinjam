const ipcRenderer = require('electron').ipcRenderer;

function sendForm(event){
    event.preventDefault();

    let nik = document.getElementById('id-nik').value;
    let nama = document.getElementById('id-nama').value;
    let alamat = document.getElementById('id-alamat').value;
    

    let jk_select = document.getElementById('id-jk')
    let tgl_masuk = document.getElementById('id-tgl-masuk').value;
    //mengambil value dari index
    let jk_value = jk_select.options[jk_select.selectedIndex].value;

    let no_telp = document.getElementById('id-no-telp').value;

    let data = {
        nik: nik,
        nama: nama,
        alamat: alamat,
        tgl_masuk: tgl_masuk,
        jk_value,
        no_telp 
    }

    //mengirim request register-nasabah ke controllers.js
    ipcRenderer.send('request-register-nasabah', data)
}

//menerima response register-nasabah-succcess dari controllers.js
ipcRenderer.on('response-register-nasabah-success', function(event){
    alert("Berhasil");
    window.location.replace("data_simpanan.html");
});

ipcRenderer.on('response-cek-nik-ada', function(event){
 
    alert('nik sadah ada');
    
});

