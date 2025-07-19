export default class NotificationMessage {
  private static _notificationArea: HTMLElement = document.getElementById("notification-window") as HTMLElement;
  private static _notificationText: HTMLElement = document.getElementById("notification-text") as HTMLElement;
  private static _currentTimeout: NodeJS.Timeout | undefined;

  public static initialiser(): void {
    document.getElementById("notification-close")!.addEventListener("click", (event) => {
      event.stopPropagation();
      this._notificationArea.style.display = "none";
      if (this._currentTimeout) {
        clearTimeout(this._currentTimeout);
        this._currentTimeout = undefined;
      }
    });

    document.getElementById("notification-ok")!.addEventListener("click", (event) => {
      event.stopPropagation();
      this._notificationArea.style.display = "none";
      if (this._currentTimeout) {
        clearTimeout(this._currentTimeout);
        this._currentTimeout = undefined;
      }
    });
  }

  public static ajouterNotification(message: string): void {
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout);
      this._currentTimeout = undefined;
    }
    this._notificationText.innerText = message;
    this._notificationArea.style.display = "block";
    this._currentTimeout = setTimeout(
      (() => {
        this._notificationArea.style.display = "none";
        this._notificationText.innerText = "Notification";
        this._currentTimeout = undefined;
      }).bind(this),
      5000
    );
  }
}
