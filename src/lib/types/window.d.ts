import { IAppApi } from "@/preload";

declare global {
  interface Window {
    api: IAppApi;
  }
}
