const { app, BrowserWindow, shell } = require('electron');
const Manager = require('./index').NotifyManager;
const Notify = require('./index').Notify;
const Sound = require('./index').NotifySound;

app.whenReady().then(() => {
    init();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) init();
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
    setTimeout(() => _manager.show(new Notify('notify', 'text after 10 seconds')), 10000);
    setTimeout(() => {
        // Open by click
        _manager.show(new Notify('notify', 'click to open link', 20), () => shell.openExternal('https://github.com/fydne/notify-manager-electron'));
    }, 11000);
    setTimeout(() => {
        // Play and open music on soundcloud
        _manager.show(new Notify('notify', 'notify with sound & html'+
        '<img style="width:1px;min-width:1px;height:1px;min-height:1px;" '+
        'src="https://cdn.fydne.dev/another/j7jtku7ebf86/1px.svg" '+
        'onload="window.open(`https://soundcloud.com/subhadramusic/sneg-feat-jormunng-feat-mxp-prod-pink-flex-subhadra`);">',
        45, 'https://github.com/fydne/SoundCloud-Desktop/raw/main/icons/appLogo.png',
        new Sound('https://cdn.fydne.dev/another/rgq05ekp8k4k/sneg.mp3', 50)));
    }, 20000);
};