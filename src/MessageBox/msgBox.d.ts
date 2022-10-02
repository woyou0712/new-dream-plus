export type MsgBoxOption = string | { title?: string; msg: string; cancelName?: string, submitName?: string }
export type MsgBoxMethod = {
  cancel?: () => void
  submit?: () => void
}