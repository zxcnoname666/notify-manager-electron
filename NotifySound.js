module.exports = class NotifySound {
    /**
     * @param      {string}  url     URL to sound (file:// or http(s):// or another protocol)
     * @param      {number}  volume     Volume set during playback (0 to 100)
     */
    constructor(url, volume = 100){
        this.url = url;
        this.volume = volume;
    }
};