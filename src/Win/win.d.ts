import { Component, ComputedOptions, MethodOptions } from "vue"
import { Win } from "./index"

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

