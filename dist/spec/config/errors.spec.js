"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../../src/config/errors");
describe('WeavingError', function () {
    it('is instanceof WeavingError', function () {
        expect((new errors_1.WeavingError('a')) instanceof errors_1.WeavingError).toBeTruthy();
    });
    it('is instanceof WeavingError after throwing', function () {
        function fn() {
            try {
                throw new errors_1.WeavingError('a');
            }
            catch (e) {
                return e;
            }
        }
        expect(fn() instanceof errors_1.WeavingError).toBeTruthy();
    });
});
//# sourceMappingURL=errors.spec.js.map