const { app, BrowserWindow, screen } = require('electron');
const fs = require('fs');
const path = require('path');

app.on('ready', ()=>{

  const {width, height} = screen.getPrimaryDisplay().workAreaSize;

  let win = new BrowserWindow({
    width,
    height,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  win.loadFile('./public/index.html');
  win.maximize();
  //win.removeMenu();

});