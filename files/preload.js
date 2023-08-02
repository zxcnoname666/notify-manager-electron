const electron = require('electron');

electron.contextBridge.exposeInMainWorld('ipc', {
    on: (name, event) => electron.ipcRenderer.on(name, event),
    once: (name, event) => electron.ipcRenderer.once(name, event),
    send: (name, ...args) => electron.ipcRenderer.send(name, ...args),
});
electron.contextBridge.exposeInMainWorld('FocusNotify', (id) => FocusNotify(parseInt(id)));
electron.contextBridge.exposeInMainWorld('DefocusNotify', (id) => DefocusNotify(parseInt(id)));

let _loaded = false;
let position = 1;
const focusedNotify = [];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

window.addEventListener('DOMContentLoaded', () => _loaded = true);

electron.ipcRenderer.once('load-position', async(_, _position) => {
    while(!_loaded) await delay(1000);
    document.body.className = 'position-' + _position;
    position = _position;
});

electron.ipcRenderer.once('custom-style', async(_, style) => {
    if(!style || `${style}`.length < 1) return;
    const element = document.createElement('style');
    element.innerHTML = style;
    document.head.appendChild(element);
});

electron.ipcRenderer.on('show', async(_, notify, click) => {
    while(!_loaded) await delay(1000);

    const block = document.getElementById('block');

    const parent = document.createElement('div');
    parent.className = 'notify';
    parent.id = notify.id;
    if(click) parent.className += ' clickActive';
    if(block.children < 1 || position == 2 || position == 3){
        block.appendChild(parent);
    }else{
        block.insertBefore(parent, block.children[0]);
    }
    
    const title = document.createElement('span');
    title.className = 'title';
    title.innerHTML = notify.title;
    parent.appendChild(title);
    
    const area = document.createElement('div');
    area.style = 'display: flex;';
    parent.appendChild(area);

    if(notify.image){
        const img = document.createElement('img');
        img.src = notify.image;
        area.appendChild(img);
    }
    const body = document.createElement('p');
    body.innerHTML = notify.body;
    area.appendChild(body);

    let hideActive = false;
    let blockHide = false;
    let globalLock = false;
    let offsetX = 0;
    parent.onmousedown = (ev) => {
        if(focusedNotify.some(x => x == notify.id)) return;
        if(blockHide) return;
        hideActive = true;
        offsetX = parent.offsetLeft - ev.clientX;
    };
    parent.onmouseup = () => {
        if(globalLock) return;
        if(!hideActive) return;
        hideActive = false;
        offsetX = 0;
        blockHide = true;
        (async() => {
            const pos = parseInt(parent.style.left.replace('px', ''));
            if(pos < 1){
                parent.style.left = 0;
                blockHide = false;
                return;
            }
            const ms = (pos / 300 * 1000) / 50;
            const per = pos / 50;
            for (let i = 0; i < 50; i++) {
                parent.style.left = (pos - (per * i)) + 'px';
                await new Promise(res => setTimeout(() => res(), ms));
            }
            parent.style.left = 0;
            blockHide = false;
        })();
    };
    parent.onmousemove = (ev) => {
        if(!hideActive) return;
        if(focusedNotify.some(x => x == notify.id)){
            parent.onmouseup();
            hideActive = false;
            return;
        }
        const _px = (ev.clientX + offsetX);
        if(_px < 0 && (position == 1 || position == 2)) return;
        if(_px > 0 && (position == 3 || position == 4)) return;
        if(_px > 130 || _px < -130){
            hideActive = true;
            blockHide = true;
            globalLock = true;
            parent.id = '';
            parent.classList.add('hide');
            setTimeout(() => {
                try{
                    setTimeout(() => parent.outerHTML = '', 100);
                    parent.setAttribute('send-height', parent.clientHeight + 'px');
                    parent.classList.add('del');
                }catch{}
                electron.ipcRenderer.send('notify-manager-destory', notify.id);
            }, 750);
            StopAudio(notify);
            try{DefocusNotify(notify.id);}catch{}
            return;
        }
        parent.style.left = _px + 'px';
    };

    parent.onmouseenter = () => {
        let focus = false;
        try{focus = !(!(body.querySelector('input') || body.querySelector('textarea')));}catch{}
        electron.ipcRenderer.send('notify-manager-set-visibly', true, focus);
    };
    parent.onmouseleave = () => {
        electron.ipcRenderer.send('notify-manager-set-visibly', false);
    };
    parent.onclick = () => {
        electron.ipcRenderer.send('notify-manager-onclick', notify.id);
    };

    setTimeout(() => {
        if(focusedNotify.some(x => x == notify.id)){
            const interv = setInterval(() => {
                if(focusedNotify.some(x => x == notify.id)) return;
                clearInterval(interv);
                _destroy();
            }, 500);
            return;
        }
        _destroy();
        function _destroy() {
            if(globalLock) return;
            if(!parent) return;
            parent.id = '';
            parent.classList.add('hide');
            setTimeout(() => {
                try{
                    setTimeout(() => parent.outerHTML = '', 100);
                    parent.setAttribute('send-height', parent.clientHeight + 'px');
                    parent.classList.add('del');
                }catch{}
            }, 750);
            StopAudio(notify);
        }
    }, notify.time * 1000);

    if(notify.sound){
        const audio = document.querySelector('audio');
        audio.src = notify.sound.url;
        try{
            audio.volume = notify.sound.volume / 100;
        }catch{
            audio.volume = 0.5;
        }
        audio.play();
    }
});

electron.ipcRenderer.on('destroy', async(_, notify) => {
    const parent = document.getElementById(notify.id);
    if(!parent) return console.log('notify of id ' + notify.id + ' not found');
    parent.id = '';
    parent.classList.add('hide');
    setTimeout(() => {
        try{
            setTimeout(() => parent.outerHTML = '', 100);
            parent.setAttribute('send-height', parent.clientHeight + 'px');
            parent.classList.add('del');
        }catch{}
    }, 750);
    StopAudio(notify);
});

function StopAudio(notify) {
    if(!notify) return;
    if(!notify.sound) return;
    const audio = document.querySelector('audio');
    if(!audio) return;
    setTimeout(() => {
        if(audio.src == notify.sound.url){
            audio.pause();
        }
    }, 900);
}

function FocusNotify(id) {
    if(isNaN(id)) return;
    if(focusedNotify.indexOf(id) > -1) return;
    focusedNotify.push(id);
}
function DefocusNotify(id) {
    if(isNaN(id)) return;
    const index = focusedNotify.indexOf(id);
    if(0 > index) return;
    focusedNotify.splice(index, 1);
}