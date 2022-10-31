import { Component, ComputedOptions, MethodOptions } from "vue"
import { Win } from "./index"
type Sandbox = "allow-downloads-without-user-activation" | "allow-downloads" | "allow-forms" | "allow-modals" | "allow-orientation-lock" | "allow-pointer-lock" | "allow-popups" | "allow-popups-to-escape-sandbox" | "allow-presentation" | "allow-same-origin" | "allow-scripts" | "allow-storage-access-by-user-activation" | "allow-top-navigation" | "allow-top-navigation-by-user-activation"

interface BaseConfig {
  parentId?: string
  id?: string
  title?: string,
  width?: string,
  height?: string,
  miniBtn?: boolean,
  maxBtn?: boolean,
  resize?: boolean,
  icon?: string | HTMLImageElement,
  props?: { [key: string]: any }
  sandbox?: Sandbox[]
}
export interface HtmlConfig extends BaseConfig {
  url: string
  component?: never
}



export interface VueConfig extends BaseConfig {
  component: Component<any, any, any, ComputedOptions, MethodOptions>,
  url?: never
}

export type Config = HtmlConfig | VueConfig;

export type Status = "initial" | "max" | "mini" | "close";

export type Callback = (win: Win) => void

export type Callbacks = {
  mounted?: Callback
  mini?: Callback
  max?: Callback
  move?: Callback
  close?: () => void
  top?: Callback
}

