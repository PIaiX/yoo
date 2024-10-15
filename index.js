const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    menu: null,
    fullscreen: true, // Запуск в полноэкранном режиме
    frame: false, // Убираем рамку окна
    kiosk: true, // Режим киоска, окно нельзя скрыть
    webPreferences: {
      // ... другие настройки
      devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      // Добавляем настройку для загрузки ресурсов из build папки
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });
  // Запрет на закрытие окна
  win.on('close', (event) => {
    event.preventDefault();
    // Можно показать уведомление или выполнить другое действие
  });

  // Отключаем сочетание клавиш F11
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      event.preventDefault(); // Запрет на действие по умолчанию
    }
  });
  win.setMenuBarVisibility(false);
  // Загружаем index.html из папки build (после сборки ReactJS)
  win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(createWindow);