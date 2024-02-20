# Notify Manager
<p align="center">
<a href="javascript:void(0)">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=10000&color=DB33F7&center=true&vCenter=true&width=435&lines=Notify+Manager">
</a>
</p>
<p align="center">
Create beautiful and functional notifications on electron
</p>

# Info
You can test the library with `npm run test` or `npm run test.reply`. And also see the source code of [examples](https://github.com/zxcnoname666/Notify-Manager-electron/tree/main/examples)

#### Approximate result:
<a href="javascript:void(0)">
<img src="https://github.com/zxcnoname666/repo-files/raw/main/notify-manager-electron/example.png">
</a>

> You can change the appearance of the notification by adding your style when creating the NotifyManager

You can use your own sounds when showing a notification.

# Demo
## Standart notify
Example: [Click](https://github.com/zxcnoname666/Notify-Manager-electron/tree/main/examples/small.js)

Demo:

https://user-images.githubusercontent.com/121295212/219909789-5f343998-814b-4c2a-814b-d290ea1fe3a2.mp4

## Reply notify
Example: [Click](https://github.com/zxcnoname666/Notify-Manager-electron/tree/main/examples/reply)

Demo:

https://user-images.githubusercontent.com/121295212/235345354-4be5234a-fdef-4861-be74-37538c8e22b7.mp4

# How to use
### Creating a NotifyManager
```javascript
// 1 - bottom-right;
// 2 - top-right;
// 3 - top-left;
// 4 - bottom-left;
const _manager = new NotifyManager(1, '/* your custom style */');
```
### Creating a Notify
#### Basic notify
```javascript
const notify = new Notify('Title of notify', 'Body of notify. HTML allowed.');

// show notify
_manager.show(notify);
```
#### Hook onDestroy of notify
```javascript
const notify = new Notify('Test notify', 'Test.');

notify.onDestroy(() => console.log('destroyed'));
notify.onDestroy(() => console.log('2nd console log of notify destroy'));

// show notify
_manager.show(notify);
```
#### Hook onclick of notify
```javascript
const notify = new Notify('Click hook', 'Click on the notify.');

// show notify
_manager.show(notify, () => {
    console.log('clicked on the notify');
    //..... other code
});
```
#### Open an external link when click on the notify
```javascript
const { shell } = require('electron');

const notify = new Notify('Click hook', 'Click to open link');

_manager.show(notify, () => shell.openExternal('https://github.com/zxcnoname666/notify-manager-electron'));
```
#### Notification with image & custom duration
Recommended image size - 55x55px
```javascript
const duration = 30; // in seconds
const notify = new Notify('Your App', 'Your beautiful message', duration, 'https://github.com/favicon.ico');

// show notify
_manager.show(notify);
```
#### Notify with sound
##### Attention: It is not recommended to use music playing for a long time. Instead, use sounds up to 10 seconds long.
```javascript
// url, volume
const sound = new NotifySound('https://github.com/zxcnoname666/repo-files/raw/main/notify-manager-electron/meow1.mp3', 50);

const body = '<span style="color:red !important;">text</span>';
const image = 'https://github.com/zxcnoname666/SoundCloud-Desktop/raw/main/icons/appLogo.png';

const notify = new Notify('notify with sound & html', body, 60, image, sound);

// show notify
_manager.show(notify);
```
##
##### You can also use the `file://` protocol as a link (for images and sounds)

<p align="center">
<a href="javascript:void(0)">
<img src="https://profile-counter.glitch.me/notify-manager-electron/count.svg" width="200px" />
</a>
