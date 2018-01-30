"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsondiffpatch = require('jsondiffpatch');
// thanks to https://github.com/jasmine/jasmine/issues/675#issuecomment-127187623
exports.TO_EQUAL_JSON_MATCHERS = {
    toEqualJSON: function (util, customEqualityTesters) {
        return {
            compare: function (actual, expected) {
                actual = JSON.parse(JSON.stringify(actual));
                expected = JSON.parse(JSON.stringify(expected));
                var pass = util.equals(actual, expected, customEqualityTesters);
                return {
                    pass: pass,
                    message: pass ? 'ok' : 'JSON objects not equal. \r\nACTUAL:\r\n' + JSON.stringify(actual, null, "\t") + '\r\nEXPECTED:\r\n:' + JSON.stringify(expected, null, "\t") + '\r\nDIFF:\r\n' + jsondiffpatch.formatters.console.format(jsondiffpatch.diff(expected, actual))
                };
            },
        };
    }
};
//# sourceMappingURL=equal-json.js.map