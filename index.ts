const defaultOptions = {
  retry: 5,
  interval: 3 * 1000,
};

export type Options = {
  retry: number;
  interval: number;
};

export type Handler = (val: unknown) => void;

export interface Client {
  subscribe(type: string, handler: Handler): void;
  unsubscribe(): void;
}

export default class SSEClient implements Client {
  public readonly url: string;
  public options: Options;
  public retry: number;
  public timer: number;
  public es: EventSource | null;

  constructor(url: string, options: Options = defaultOptions) {
    this.url = url;
    this.es = null;
    this.options = options;
    this.retry = options.retry;
    this.timer = null;
  }

  private _onOpen() {
    console.log("server sent event connect created");
  }

  private _onMessage(handler: Handler) {
    return (event) => {
      this.retry = this.options.retry;
      let payload;

      try {
        payload = JSON.parse(event.data);
        console.log("receiving data...", payload);
      } catch (error) {
        console.error("failed to parse payload from server", error);
      }

      if (typeof handler === "function") {
        handler(payload);
      }
    };
  }

  private _onError(type: string, handler: Handler) {
    return () => {
      console.error("EventSource connection failed for subscribe.Retry");
      if (this.es) {
        this._removeAllEvent(type, handler);
        this.unsubscribe();
      }

      if (this.retry > 0) {
        this.timer = setTimeout(() => {
          this.subscribe(type, handler);
        }, this.options.interval);
      } else {
        this.retry--;
      }
    };
  }

  private _removeAllEvent(type: string, handler: Handler) {
    this.es.removeEventListener("open", this._onOpen);
    this.es.removeEventListener(type, this._onMessage(handler));
    this.es.removeEventListener("error", this._onError(type, handler));
  }

  subscribe(type: string, handler: Handler) {
    this.es = new EventSource(this.url);

    this.es.addEventListener("open", this._onOpen);
    this.es.addEventListener(type, this._onMessage(handler));
    this.es.addEventListener("error", this._onError(type, handler));
  }

  unsubscribe() {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
