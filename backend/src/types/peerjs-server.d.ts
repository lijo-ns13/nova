declare module "peerjs-server" {
  import { Server } from "http";
  import { RequestHandler } from "express";

  export interface PeerServerOptions {
    debug?: boolean;
    path?: string;
    proxied?: boolean;
  }

  export function ExpressPeerServer(server: Server, options?: PeerServerOptions): RequestHandler;
}
