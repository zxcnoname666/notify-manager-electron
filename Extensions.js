const arrConstructor = ([]).constructor;

const methods = {
    callDestroyEvents(notify) {
        if(notify.destroyed) return;
        if(!notify.destroyEvents) return;
        if(notify.destroyEvents.constructor != arrConstructor) return;

        for (let i = 0; i < notify.destroyEvents.length; i++) {
            const event = notify.destroyEvents[i];
            if(typeof event == 'function'){
                try { event(); }
                catch(e) {
                    console.error('Execute onDestroy error:\n' + e);
                }
            }
        }

        notify.destroyed = true;
        notify.destroyEvents.length = 0;
    },

    destroyNotify(notify, manager) {
        try { methods.callDestroyEvents(notify); } catch(e) { console.error(e); }
        
        if(manager.activeNotifications && manager.activeNotifications.constructor == arrConstructor){
            const index = manager.activeNotifications.indexOf(notify);
            if(index > -1){
                manager.activeNotifications.splice(index, 1);
            }
            setTimeout(() => {
                if(manager.activeNotifications.length == 0){
                    manager.win.hide();
                    manager.win.webContents.session.clearCache();
                }
            }, 1000);
        }

        if(manager.onclickEvents && manager.onclickEvents.constructor == arrConstructor){
            const index = manager.onclickEvents.findIndex(x => x.id == notify.id);
            if(index > -1){
                manager.onclickEvents.splice(index, 1);
            }
        }
    }
};

module.exports = methods;