export type MsgType = "success" | "error" | "info"
export type MsgOption = string | { msg: string; type?: MsgType, time?: number }