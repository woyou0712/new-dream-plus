export type LoadingType = "default" | "skip" | "heartbeat"
export interface LoadingConfig {
  text: string;
  type: LoadingType;
  backgroundColor: string;
  color: string;
}

export interface LoadingOption {
  text?: string;
  type?: LoadingType;
  backgroundColor?: string;
  color?: string;
}