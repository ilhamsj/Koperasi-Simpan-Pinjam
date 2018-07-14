const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote
const main = remote.require('./main.js')

function sendForm(event){
    event.preventDefault();

    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;
    let data = {
        user: user,
        pass: pass
    }

    //mengirim request-login ke controller.js
    ipcRenderer.send('request-login', data)
}

//menerima response admin-login-succes dari controllers.js
ipcRenderer.on('response-admin-login-success', function(event, file){
    //mengambil window main 
    var window = remote.getCurrentWindow()
    //buka window admin
    main.openAdminWindow(file);
    //tutup window main
    window.close()
});

//menerima response user-login-success dari controllers.js
ipcRenderer.on('response-user-login-success', function(event, file){
    //mengambil window main 
    var window = remote.getCurrentWindow()
    //buka window admin
    main.openUserWindow(file);
    //tutup window main
    window.close()
});

//menerima response error dari controller.js
ipcRenderer.on('response-error', function(event){
    const responseP = document.getElementById('response');
    responseP.innerHTML = "login gagal";
})