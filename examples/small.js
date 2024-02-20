const { app, BrowserWindow, shell } = require('electron');
const Manager = require('../files/index').NotifyManager;
const Notify = require('../files/index').Notify;
const Sound = require('../files/index').NotifySound;

app.whenReady().then(() => {
    init();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            init();
        }
    });
});

async function init() {
    const _manager = new Manager(1);

    const _notify = new Notify('hello', 'this is test');
    _notify.onDestroy(() => console.log('first notify has been destroyed'));
    _manager.show(_notify);
    
    _manager.show(new Notify('test', 'something text'));

    const _t = await _manager.show(new Notify('yea?', 'hide it in one second'));
    setTimeout(() => _manager.destroy(_t), 1000);

    setTimeout(() => {
        _manager.show(new Notify('notify', 'text after 10 seconds'));
    }, 10000);

    setTimeout(() => {
        // Open by click
        _manager.show(new Notify('notify', 'click to open link', 20), () => shell.openExternal('https://github.com/zxcnoname666/notify-manager-electron'));
    }, 11000);

    setTimeout(() => {
        // Play notify and open music on soundcloud
        _manager.show(new Notify('notify with sound & html', '<span style="color:red !important;">meow</span>',
            10, 'https://github.com/favicon.ico',
            new Sound('https://github.com/zxcnoname666/repo-files/raw/main/notify-manager-electron/meow1.mp3', 50)
        ));
    }, 20000);
};