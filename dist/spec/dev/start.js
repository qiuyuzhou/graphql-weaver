"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../helpers/server");
// to get through firewall
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
server_1.start().catch(function (error) {
    console.error(error.stack);
});
//# sourceMappingURL=start.js.map