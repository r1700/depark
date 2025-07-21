/// <reference types="react-scripts" />
/// <reference lib="webworker" />

declare global {
  class InstallEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }
}

declare global {
  class FetchEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }
}

declare global {
  class ActivateEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }
}

export {};
