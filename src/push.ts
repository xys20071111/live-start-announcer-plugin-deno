import { Card, Vibrate, pushNotificationObject } from './INotification.ts';

export async function pushNotification(appid: string, token: string, card: Card, vibrate: boolean | Vibrate) {
    const approxExpire = new Date();
    approxExpire.setUTCMinutes(approxExpire.getUTCMinutes() + 10);
    const notification: pushNotificationObject = {
        appid,
        token,
        expire_on: approxExpire.toISOString(),
        data: {
            notification: {
                card,
                vibrate: vibrate || false,
                sound: true
            }
        }
    }
    const notificationJson = JSON.stringify(notification);
    console.log(notificationJson)
    return await fetch('https://push.ubports.com/notify', {
        headers: new Headers({
            "Content-type": 'application/json',
            "Content-Length": notificationJson.length.toString()
        }),
        method: 'POST',
        body: notificationJson
    })
}