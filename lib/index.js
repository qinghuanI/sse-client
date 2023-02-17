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
        this.retry = options.retry;
        this.timer = null;
    }
    SSEClient.prototype._onOpen = function () {
        console.log("server sent event connect created");
    };
    SSEClient.prototype._onMessage = function (handler) {
        var _this = this;
        return function (event) {
            _this.retry = _this.options.retry;
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
                _this.timer = setTimeout(function () {
                    _this.subscribe(type, handler);
                }, _this.options.interval);
            }
            else {
                _this.retry--;
            }
        };
    };
    SSEClient.prototype._removeAllEvent = function (type, handler) {
        var _a, _b, _c;
        (_a = this.es) === null || _a === void 0 ? void 0 : _a.removeEventListener("open", this._onOpen);
        (_b = this.es) === null || _b === void 0 ? void 0 : _b.removeEventListener(type, this._onMessage(handler));
        (_c = this.es) === null || _c === void 0 ? void 0 : _c.removeEventListener("error", this._onError(type, handler));
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

module.exports = SSEClient;
//# sourceMappingURL=index.js.map
