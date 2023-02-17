export type Options = {
    retry?: number;
    interval?: number;
};
export type Handler = (val: unknown) => void;
export interface Client {
    subscribe(type: string, handler: Handler): void;
    unsubscribe(): void;
}
export default class SSEClient implements Client {
    readonly url: string;
    options: Options;
    retry: number;
    timer: null | number;
    es: EventSource | null;
    constructor(url: string, options?: Options);
    private _onOpen;
    private _onMessage;
    private _onError;
    private _removeAllEvent;
    subscribe(type: string, handler: Handler): void;
    unsubscribe(): void;
}
