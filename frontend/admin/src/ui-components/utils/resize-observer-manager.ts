import { createContext, useContext, useEffect, useRef } from "react";

type UseResizeObserverCallback = () => void;

type ResizeObserverType = typeof ResizeObserver;

type Subscription = {
  target: Element;
  cb: UseResizeObserverCallback;
};

class DummyResizeObserver {
  disconnect(): void {
    //ignored
  }

  observe(): void {
    //ignored
  }

  unobserve(): void {
    //ignored
  }
}

const ResizeObserverPolyfill: ResizeObserverType =
  typeof window !== "undefined" &&
  "ResizeObserver" in window &&
  "observe" in window.ResizeObserver.prototype
    ? window.ResizeObserver
    : DummyResizeObserver;

export class ResizeObserverManager {
  private obs: ResizeObserver;
  private subscriptions: Subscription[];

  constructor() {
    this.obs = new ResizeObserverPolyfill(this.handleCallback);
    this.subscriptions = [];
  }

  subscribe(target: Element, cb: UseResizeObserverCallback) {
    const sub = this.subscriptions.find((s) => s.target === target);
    if (sub) {
      sub.cb = cb;
    } else {
      this.obs.observe(target);
      this.subscriptions.push({
        target,
        cb,
      });
    }
  }

  unsubcribe(target: Element) {
    const subIndex = this.subscriptions.findIndex((s) => s.target === target);
    if (subIndex >= 0) {
      this.obs.unobserve(target);
      this.subscriptions.splice(subIndex, 1);
    }
  }

  private handleCallback: ResizeObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const sub = this.subscriptions.find((s) => s.target === entry.target);
      if (sub) {
        sub.cb();
      }
    });
  };
}

export const ResizeObserverManagerContext = createContext<
  ResizeObserverManager | undefined
>(undefined);

export function useResizeObserver<T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  cb: UseResizeObserverCallback
) {
  const context = useContext(ResizeObserverManagerContext);
  const handlerRef = useRef(cb);

  useEffect(() => {
    handlerRef.current = cb;
  }, [cb]);

  useEffect(() => {
    const targetEl = target && "current" in target ? target.current : target;
    if (!targetEl || !context) {
      return () => {};
    }

    if (targetEl instanceof Element) {
      context.subscribe(targetEl, () => handlerRef.current());
      return () => {
        context.unsubcribe(targetEl);
      };
    }

    return () => {};
  }, [context, target]);
}
