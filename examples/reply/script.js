const { app, BrowserWindow, ipcMain } = require('electron');
const Manager = require('../../files/index').NotifyManager;
const Notify = require('../../files/index').Notify;
const Sound = require('../../files/index').NotifySound;
const fs = require('original-fs');

const text = fs.readFileSync(__dirname + '/body.html', 'utf-8');

const init = async() => {
    const _manager = new Manager(2);

    const uid = GenerateRandom();

    const _notify = new Notify('New message', '', 10, null, new Sound('https://cdn.fydne.dev/another/sdb1c4qrbpt5/meow1.mp3', 50));

    _notify.body = text
    .replaceAll('{message}', GenerateMessage())
    .replaceAll('{uid}', uid)
    .replaceAll('{notify.id}', _notify.id);

    ipcMain.on('reply.message', (ev, id, message) => {
        if(ev.sender != _manager.win.webContents) return;
        console.log(`received reply from notify (id: ${id} / current notify: ${id == uid}):\n${message}\n------------------------`);
        _manager.destroy(_notify);
    });
    
    _manager.show(_notify);
};

app.whenReady().then(() => {
    init();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) init();
    });
});

function GenerateMessage() {
    const messages = [
        'Hello. How are you?',
        'Hi. What\'s the status on the new update? Did you finish it yet?',
        'Hi. Do you even go for a walk sometimes?',
        'There will be an event today at 12 a.m. Will you come with us?'
    ];
    const rand = Math.round(Math.random() * messages.length);
    if(0 >= rand) return 'Hello. How are you?';
    return messages[rand - 1];
}
function GenerateRandom() {
    return 'xxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random()*32|0).toString(32));
}