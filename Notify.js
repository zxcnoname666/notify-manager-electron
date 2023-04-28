const NotifySound = require('./NotifySound');

let id = 0;

module.exports = class Notify {
    /**
     * @param      {string}  title     Title of notify
     * @param      {string}  body     Body of notify
     * @param      {number}  time     Duration of notification display in seconds
     * @param      {string}  imageUrl     Link to image of notification (file:// or http(s):// or another protocol)
     * @param      {NotifySound}  sound     Sound to play when a notification is shown
     */
    constructor(title, body, time = 10, imageUrl = null, sound = null){
        this.id = id++;
        this.title = title;
        this.body = body;
        this.time = time;
        this.image = imageUrl;
        this.sound = sound;

        this.destroyed = false;
        this.destroyEvents = [];
    }

    onDestroy(func) {
        if(typeof func != 'function'){
            console.error('func is not a function');
            return;
        }
        this.destroyEvents.push(func);
    }
};