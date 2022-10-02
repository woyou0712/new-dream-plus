export interface MenuItem {
  id:string | number
  icon?: string | HTMLImageElement
  name: string
  method: (id:string | number) => void
}

export type MenuSattus = "block" | "none"