type InitialData = {
  links: string[];
};

type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface Window {
  __initData__: InitialData;
  __loadingStart__?(): void;
  __loadingStop__?(): void;
  __pageReady__?(): void;
  __toggleViewport__?(): void;
  __showToast__?(message: string, options?: { duration?: number; error?: boolean }): void;
  Turbolinks: {
    visit(url: string, options?: any): void;
    pushState(state: any, title: string, url: string): void;
    replaceState(state: any, title: string, url: string): void;
    __setAbort__(value: boolean): void;
  };
  messaging: {
    getToken: () => Promise<string>;
  };

  MobileBridge:
    | {
        dispatch(payload: string): void;
      }
    | undefined;
}

declare class ComponentUrl {
  readonly pathname: string;
  readonly relative: string;
  constructor(url: string);
}
