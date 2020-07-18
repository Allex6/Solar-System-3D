const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const {Worker, isMainThread} = require('worker_threads');

function createWindow () {
  // Cria uma janela de navegação.
  let win = new BrowserWindow({
    width: 1020,
    height: 720,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  // e carrega o index.html do aplicativo.
  win.loadFile('./public/index.html');
}

app.whenReady().then(createWindow);



/*const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  console.log("Cluster Master Running...");

  for(let i = 0; i < numCPUs; i++){
    cluster.fork();
  }

} else {

  function createWindow () {
    // Cria uma janela de navegação.
    let win = new BrowserWindow({
      width: 1020,
      height: 720,
      fullscreen: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
    });

    // e carrega o index.html do aplicativo.
    win.loadFile('./public/index.html');
  }

  app.whenReady().then(createWindow);

}

*/