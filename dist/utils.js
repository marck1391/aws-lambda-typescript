"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parsePath(path) {
    var params = {};
    var x = path.split('/');
    x = x.map(function (segment, index) {
        if (segment.startsWith(':')) {
            var paramName = segment.replace(':', '');
            params[paramName] = index;
            return "([^\\/]+)";
        }
        return segment;
    });
    return {
        re: new RegExp('^' + x.join('\\/') + '$', 'i'),
        params: params
    };
}
exports.parsePath = parsePath;
function parseCookies(cookie_header) {
    var cookies = {};
    cookie_header.split(';').forEach(function (cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/) || ['', ''];
        cookies[parts[1].trim()] = decodeURIComponent((parts[2] || '').trim());
    });
    return cookies;
}
exports.parseCookies = parseCookies;
//# sourceMappingURL=utils.js.map