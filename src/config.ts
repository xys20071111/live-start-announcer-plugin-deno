import { UTF8Decorder } from './enconding.ts'

export interface IConfig {
    api_port: number
    api_token: string
    push_token: string
    push_app: string
}

export const config: IConfig = JSON.parse(UTF8Decorder.decode(Deno.readFileSync(Deno.args[0])))