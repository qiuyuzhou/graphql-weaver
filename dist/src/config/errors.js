"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An error that occurred while weaving an endpoint
 */
var WeavingError = /** @class */ (function (_super) {
    __extends(WeavingError, _super);
    function WeavingError(message, endpoint, originalError) {
        var _this = _super.call(this, message) || this;
        _this.endpoint = endpoint;
        _this.originalError = originalError;
        Object.setPrototypeOf(_this, WeavingError.prototype);
        return _this;
    }
    Object.defineProperty(WeavingError.prototype, "endpointName", {
        /**
         * A human-readable name of the endpoint, as long one can be found
         * @returns {string}
         */
        get: function () {
            if (!this.endpoint) {
                return undefined;
            }
            if (this.endpoint.namespace) {
                return this.endpoint.namespace;
            }
            if (this.endpoint.url) {
                return this.endpoint.url;
            }
            return this.endpoint.identifier;
        },
        enumerable: true,
        configurable: true
    });
    return WeavingError;
}(Error));
exports.WeavingError = WeavingError;
exports.throwingErrorConsumer = function (e) { throw e; };
//# sourceMappingURL=errors.js.map