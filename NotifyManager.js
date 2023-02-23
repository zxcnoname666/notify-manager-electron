const { BrowserWindow, screen, shell } = require('electron');
const remote = require('@electron/remote/main');
const Notify = require('./Notify');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

remote.initialize();

module.exports = class NotifyManager {
    /**
     * @param      {number}  position     
     * 1 - bottom-right;
     * 2 - top-right;
     * 3 - top-left;
     * 4 - bottom-left;
     * @param      {string}  customStyle     Your personal style for notifications
     */
    constructor(position = 1, customStyle = ''){
        this.loaded = false;
        this.position = position;

        const display = screen.getPrimaryDisplay();

        this.win = new BrowserWindow({
            width: 320,
            height: display.workAreaSize.height + display.workArea.y,
            skipTaskbar: true,
            alwaysOnTop: true,
            transparent: true,
            show: false,
            resizable: false,
            minimizable: false,
            fullscreenable: false,
            focusable: false,
            frame: false,
            titleBarStyle: 'hidden',
            x: (this.position == 1 || this.position == 2) ? display.workAreaSize.width + display.workArea.x - 320 : 0,
            y: 0,
            webPreferences:{
                devTools: false,
                preload: __dirname + '/files/preload.js'
            }
        });

        remote.enable(this.win.webContents);

        this.win.setVisibleOnAllWorkspaces(true);
        this.win.setIgnoreMouseEvents(true, {forward:false});
        this.win.setFocusable(false);
        this.win.showInactive();

        (async() => {
            await this.win.loadURL('file://' + __dirname + '/files/render.html');
            this.win.webContents.setWindowOpenHandler(({ url }) => {
                shell.openExternal(url);
                return { action: 'deny' }
            });
            this.win.send('load-position', this.position);
            this.win.send('custom-style', customStyle);
            this.loaded = true;
            //this.win.webContents.openDevTools({mode: 'detach'});
        })();
    }

    /**
     * @param      {Notify}  notify     Notification to show
     */
    async show(notify){
        while(!this.loaded) await delay(1000);
        this.win.send('show', notify);
        return notify;
    }
    
    /**
     * @param      {Notify}  notify     Notification to destroy
     */
    destroy(notify){
        if(!this.loaded) throw new Error('window not initialized yet');
        this.win.send('destroy', notify.id);
    }
};