const electron = require('electron');

let _loaded = false;
let position = 1;

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

electron.ipcRenderer.on('show', async(_, notify) => {
    console.log(notify)
    while(!_loaded) await delay(1000);

    const block = document.getElementById('block');

    const parent = document.createElement('div');
    parent.className = 'notify';
    parent.id = notify.id;
    parent.addEventListener('click', () => console.log('click? not click.'));
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

    setTimeout(() => {
        if(!parent) return;
        parent.id = '';
        parent.className += ' hide';
        setTimeout(() => {
            try{parent.outerHTML = '';}catch{}
        }, 850);
    }, notify.time * 1000);

    if(notify.sound){
        const audio =  document.querySelector('audio');
        audio.src = notify.sound.url;
        try{
            audio.volume = notify.sound.volume / 100;
        }catch{
            audio.volume = 0.5;
        }
        audio.play();

        setTimeout(() => {
            if(audio.src == notify.sound.url){
                audio.pause();
            }
        }, notify.time * 1000 + 900);
    }
});

electron.ipcRenderer.on('destroy', async(_, notify) => {
    const element = document.getElementById(notify);
    if(!element) return console.log('notify of id ' + notify + ' not found');
    element.id = '';
    element.className += ' hide';
    setTimeout(() => element.outerHTML = '', 850);
});