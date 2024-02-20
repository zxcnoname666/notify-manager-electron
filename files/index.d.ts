import { BrowserWindow } from "electron";

export class Notify {
    /**
     * @param title Title of notify
     * @param body Body of notify
     * @param time Duration of notification display in seconds
     * @param imageUrl Link to image of notification (file:// or http(s):// or another protocol)
     * @param sound Sound to play when a notification is shown
     */
    constructor(title: string, body: string, time: number = 10, imageUrl: string = null, sound: NotifySound = null);

    /**
     * The sequence number of the notification in the current {NotifyManager} class
     */
    id: number;

    /**
     * Title of notify.
     * 
     * You can change it before the notification is displayed, 
     * changing it afterwards will not affect to the notification.
     */
    title: string;

    /**
     * Body of notify.
     * 
     * You can change it before the notification is displayed, 
     * changing it afterwards will not affect to the notification.
     * 
     * HTML allowed.
     */
    body: string;

    /**
     * The duration of the notification in seconds.
     * 
     * You can change it before the notification is displayed, 
     * changing it afterwards will not affect to the notification.
     */
    time: number;

    /**
     * The notification image that will be displayed on the left.
     * 
     * URL format is used.
     * 
     * Both file:// protocol and http(s):// protocol are available, 
     * as well as individual protocols that are optionally connected.
     * 
     * You can change it before the notification is displayed, 
     * changing it afterwards will not affect to the notification.
     */
    image?: string;

    /**
     * The sound that will be played when the notification is displayed.
     * 
     * You can change it before the notification is displayed, 
     * changing it afterwards will not affect to the notification.
     */
    sound?: NotifySound;

    /**
     * Returns a boolean variable indicating whether the 
     * notification was destroyed in any way.
     */
    isDestroyed(): boolean;

    /**
     * Calls the "func" method when destroying the notification in any case.
     * 
     * @param func The function that will be called when the notification is destroyed.
     */
    onDestroy(func: void): void;
};

export class NotifySound {
    /**
     * @param url URL to sound (file:// or http(s):// or another protocol)
     * @param volume Volume set during playback (0 to 100)
     */
    constructor(url: string, volume: number = 100);
};

export class NotifyManager {
    /**
     * @param position Position of NotifyManager
     * 
     * 1 - bottom-right;
     * 
     * 2 - top-right;
     * 
     * 3 - top-left;
     * 
     * 4 - bottom-left;
     * 
     * @param customStyle Your personal style for notifications
     */
    constructor(position: number = 1, customStyle: string = '');

    /**
     * Shows the specified notification
     * 
     * @param notify Notification to show
     * @param onclick onClick callback
     */
    async show(notify: Notify, onclick: void = null): Promise<Notify>;

    /**
     * Destroys the specified notification
     * 
     * @param notify Notification to destroy
     */
    destroy(notify: Notify): void;

    /**
     * Displays whether initialization has ended or not.
     */
    isLoaded(): boolean;

    /**
     * Gets the BrowserWindow of notification manager.
     */
    getWindow(): BrowserWindow;
};