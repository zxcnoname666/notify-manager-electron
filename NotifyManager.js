const { BrowserWindow, screen, shell, ipcMain } = require('electron');
const Notify = require('./Notify');
const Extensions = require('./Extensions');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
        this.onclickEvents = [];
        this.activeNotifications = [];

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

        this.win.setVisibleOnAllWorkspaces(true);
        this.win.setIgnoreMouseEvents(true, {forward:true});
        this.win.setFocusable(false);
        this.win.showInactive();

        (async() => {
            await this.win.loadURL('file://' + __dirname + '/files/render.html');
            this.win.webContents.setWindowOpenHandler(({ url }) => {
                shell.openExternal(url);
                return { action: 'deny' };
            });
            this.win.send('load-position', this.position);
            this.win.send('custom-style', customStyle);
            this.loaded = true;
            //this.win.webContents.openDevTools({mode: 'detach'});

            ipcMain.on('notify-manager-set-visibly', (ev, boolean) => {
                if(ev.sender != this.win.webContents) return;
                this.win.setIgnoreMouseEvents(!boolean, {forward:true});
            });
            ipcMain.on('notify-manager-onclick', (ev, id) => {
                if(ev.sender != this.win.webContents) return;
                const element = this.onclickEvents.find(x => x.id == id);
                if(!element) return;
                try{
                    if(typeof element.event == 'function'){
                        element.event();
                    }
                }catch(e){
                    console.error(e);
                }
            });
            ipcMain.on('notify-manager-destory', (ev, id) => {
                if(ev.sender != this.win.webContents) return;
                const notify = this.activeNotifications.find(x => x.id == id);
                if(!notify) return;
                Extensions.destroyNotify(notify, this);
            });
        })();
    }

    /**
     * @param      {Notify}  notify     Notification to show
     */
    async show(notify, onclick = null){
        while(!this.loaded) await delay(1000);
        
        this.win.send('show', {
            id: notify.id,
            title: notify.title,
            body: notify.body,
            time: notify.time,
            image: notify.image,
            sound: notify.sound,
        }, !(!onclick));

        this.activeNotifications.push(notify);

        setTimeout(() => {
            Extensions.destroyNotify(notify, this);
        }, notify.time * 1000);

        if(onclick){
            if(typeof onclick != 'function'){
                console.error('onclick is not a function');
                return notify;
            }
            const arrElement = {
                event: onclick,
                id: notify.id,
            }
            this.onclickEvents.push(arrElement);
        }

        return notify;
    }
    
    /**
     * @param      {Notify}  notify     Notification to destroy
     */
    destroy(notify){
        if(!this.loaded) throw new Error('window not initialized yet');
        this.win.send('destroy', {
            id: notify.id,
            sound: notify.sound
        });

        Extensions.destroyNotify(notify, this);
    }
};