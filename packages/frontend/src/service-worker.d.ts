/// <reference types="react-scripts" />
/// <reference lib="webworker" />
// /// <reference types="workbox-sw" />

declare global {
  interface Event {
    waitUntil(promise: Promise<any>): void;
  }

  interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

// class InstallEvent extends ExtendableEvent {
  //   waitUntil(promise: Promise<any>): void;
  // }
  
  // class ActivateEvent extends ExtendableEvent {
    //   waitUntil(promise: Promise<any>): void;
    // }
  }
  
  // declare module 'workbox-sw' {
    //   export type ActivateEvent = Event;
    // }
    
    export {};