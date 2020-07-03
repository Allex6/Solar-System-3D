const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow () {
  // Cria uma janela de navegação.
  let win = new BrowserWindow({
    width: 1020,
    height: 720,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // e carrega o index.html do aplicativo.
  win.loadFile('./public/index.html');
}

app.whenReady().then(createWindow);