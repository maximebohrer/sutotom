export default class NotificationMessage {
    static initialiser() {
        document.getElementById("notification-close").addEventListener("click", (event) => {
            event.stopPropagation();
            this._notificationArea.style.display = "none";
            if (this._currentTimeout) {
                clearTimeout(this._currentTimeout);
                this._currentTimeout = undefined;
            }
        });
        document.getElementById("notification-ok").addEventListener("click", (event) => {
            event.stopPropagation();
            this._notificationArea.style.display = "none";
            if (this._currentTimeout) {
                clearTimeout(this._currentTimeout);
                this._currentTimeout = undefined;
            }
        });
    }
    static ajouterNotification(message) {
        if (this._currentTimeout) {
            clearTimeout(this._currentTimeout);
            this._currentTimeout = undefined;
        }
        this._notificationText.innerText = message;
        this._notificationArea.style.display = "block";
        this._currentTimeout = setTimeout((() => {
            this._notificationArea.style.display = "none";
            this._notificationText.innerText = "Notification";
            this._currentTimeout = undefined;
        }).bind(this), 5000);
    }
}
NotificationMessage._notificationArea = document.getElementById("notification-window");
NotificationMessage._notificationText = document.getElementById("notification-text");
//# sourceMappingURL=notificationMessage.js.map