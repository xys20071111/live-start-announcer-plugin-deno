import { EventEmitter } from './deps.ts'
import { config } from './config.ts'
import { pushNotification } from './push.ts'

let ws = new WebSocket(`ws://127.0.0.1:${config.api_port}`)
const APIMsgHandler = new EventEmitter()

interface IMessage {
    cmd: string
    data: any
}

function registerCallback() {
    ws.addEventListener('open', () => {
        ws.send(JSON.stringify({ cmd: "AUTH", data: config.api_token }))
    })
    ws.addEventListener('close', () => {
        ws = new WebSocket(`ws://127.0.0.1:${config.api_port}`)
        registerCallback()
    })
    ws.addEventListener('message', (event) => {
        const msg: IMessage = JSON.parse(event.data)
        APIMsgHandler.emit(msg.cmd, msg.data)
    })
}

registerCallback()

APIMsgHandler.on('AUTH', (result: string) => {
    if (result === 'AUTHED') {
        ws.send(JSON.stringify({ cmd: "ROOMID", data: config.api_token }));
    } else {
        console.log('[开播通知插件] 认证失败');
    }
})

APIMsgHandler.on('ROOMID', (roomId: number) => {
    console.log(`[开播通知插件] 工作在${roomId}`);
    APIMsgHandler.on('LIVE', () => {
        pushNotification(config.push_app, config.push_token, {
            summary: encodeURIComponent("直播开始啦"),
            body: encodeURIComponent(`直播间 ${roomId} 开始直播啦`),
            persist: true,
            popup: true
        }, true)
    });
})

Deno.addSignalListener('SIGTERM', () => {
    Deno.exit()
})

Deno.addSignalListener('SIGINT', () => {
    Deno.exit()
})

globalThis.addEventListener('unload', () => {
    console.log(`[开播通知插件] 插件退出`);
})