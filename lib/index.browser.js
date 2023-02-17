(function () {
    'use strict';

    var defaultOptions = {
        retry: 5,
        interval: 3 * 1000,
    };
    var SSEClient = /** @class */ (function () {
        function SSEClient(url, options) {
            if (options === void 0) { options = defaultOptions; }
            this.url = url;
            this.es = null;
            this.options = options;
            this.retry = options.retry || defaultOptions.retry;
            this.timer = null;
        }
        SSEClient.prototype._onOpen = function () {
            console.log("server sent event connect created");
        };
        SSEClient.prototype._onMessage = function (handler) {
            var _this = this;
            return function (event) {
                _this.retry = _this.options.retry || defaultOptions.retry;
                var payload;
                try {
                    payload = JSON.parse(event.data);
                    console.log("receiving data...", payload);
                }
                catch (error) {
                    console.error("failed to parse payload from server", error);
                }
                if (typeof handler === "function") {
                    handler(payload);
                }
            };
        };
        SSEClient.prototype._onError = function (type, handler) {
            var _this = this;
            return function () {
                console.error("EventSource connection failed for subscribe.Retry");
                if (_this.es) {
                    _this._removeAllEvent(type, handler);
                    _this.unsubscribe();
                }
                if (_this.retry > 0) {
                    var interval = _this.options.interval;
                    _this.timer = setTimeout(function () {
                        _this === null || _this === void 0 ? void 0 : _this.subscribe(type, handler);
                    }, interval);
                }
                else {
                    _this.retry--;
                }
            };
        };
        SSEClient.prototype._removeAllEvent = function (type, handler) {
            if (this.es) {
                this.es.removeEventListener("open", this._onOpen);
                this.es.removeEventListener(type, this._onMessage(handler));
                this.es.removeEventListener("error", this._onError(type, handler));
            }
        };
        SSEClient.prototype.subscribe = function (type, handler) {
            this.es = new EventSource(this.url);
            this.es.addEventListener("open", this._onOpen);
            this.es.addEventListener(type, this._onMessage(handler));
            this.es.addEventListener("error", this._onError(type, handler));
        };
        SSEClient.prototype.unsubscribe = function () {
            if (this.es) {
                this.es.close();
                this.es = null;
            }
            if (this.timer) {
                clearTimeout(this.timer);
            }
        };
        return SSEClient;
    }());

    return SSEClient;

})();
//# sourceMappingURL=index.browser.js.map
