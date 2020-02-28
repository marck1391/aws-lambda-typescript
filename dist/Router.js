"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function parseCookies(cookie_header) {
    var cookies = {};
    cookie_header.split(';').forEach(function (cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/) || ['', ''];
        cookies[parts[1].trim()] = decodeURIComponent((parts[2] || '').trim());
    });
    return cookies;
}
var Router = /** @class */ (function () {
    function Router() {
        this.routes = [];
        this.middlewares = [];
    }
    Router.prototype.use = function (fn) {
        this.middlewares.push(fn);
    };
    Router.prototype.get = function (path, fn) {
        this.registerMethod('GET', path, fn);
    };
    Router.prototype.post = function (path, fn) {
        this.registerMethod('POST', path, fn);
    };
    Router.prototype.delete = function (path, fn) {
        this.registerMethod('DELETE', path, fn);
    };
    Router.prototype.put = function (path, fn) {
        this.registerMethod('PUT', path, fn);
    };
    Router.prototype.options = function (path, fn) {
        this.registerMethod('OPTIONS', path, fn);
    };
    Router.prototype.any = function (path, fn) {
        this.registerMethod('ANY', path, fn);
    };
    Router.prototype.registerMethod = function (type, path, fn, middlewares) {
        if (middlewares === void 0) { middlewares = []; }
        var _a = parsePath(path), re = _a.re, params = _a.params;
        this.routes.push({
            path: path,
            method: type,
            fn: fn,
            params: params,
            regEx: re,
            middlewares: middlewares
        });
    };
    Router.prototype.call = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, req, res, mws, found, _i, _a, mw, error, _b, mws_1, mw, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        request.path = request.path.replace(/(.+)\/$/, '$1') || '/';
                        response = function (req, res) { };
                        req = new Request(request);
                        res = new Response(req);
                        mws = [];
                        found = this.routes.some(function (route) {
                            if (route.regEx.exec(request.path) && (route.method == request.httpMethod || route.method == 'ANY')) {
                                mws = route.middlewares || [];
                                req.params = route.params;
                                response = route.fn;
                                return true;
                            }
                            return false;
                        });
                        if (!!found) return [3 /*break*/, 1];
                        return [2 /*return*/, res.send({ error: 'NOT_FOUND' })];
                    case 1:
                        _i = 0, _a = this.middlewares;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        mw = _a[_i];
                        return [4 /*yield*/, (mw(req, res).catch(function (e) { return e; }))];
                    case 3:
                        error = _c.sent();
                        if (error) {
                            return [2 /*return*/, error];
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _b = 0, mws_1 = mws;
                        _c.label = 6;
                    case 6:
                        if (!(_b < mws_1.length)) return [3 /*break*/, 9];
                        mw = mws_1[_b];
                        return [4 /*yield*/, mw(req, res).catch(function (e) { return e; })];
                    case 7:
                        error = _c.sent();
                        if (error) {
                            return [2 /*return*/, error];
                        }
                        _c.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, response(req, res)];
                }
            });
        });
    };
    return Router;
}());
exports.Router = Router;
var Request = /** @class */ (function () {
    function Request(request) {
        this._request = request;
        this.url = request.path;
        this.headers = request.headers || {};
        this.hostname = this.headers['Host'];
        this.host = this.headers['Host'];
        this.origin = this.headers['Origin'] || this.headers['origin'];
        var body = {};
        try {
            body = JSON.parse(request.body || "{}");
        }
        catch (e) { }
        this.body = body;
        this.query = request.queryStringParameters;
        this.cookies = parseCookies(this.headers['Cookie'] || '');
        this.protocol = request.headers['X-Forwarded-Proto'];
        this.method = request.httpMethod;
    }
    Request.prototype.param = function (name) {
        var x = this.url.split('/');
        if (this._params.hasOwnProperty(name)) {
            var index = this._params[name];
            if (index < 0 || index > this.url.length - 1)
                return null;
            return x[index];
        }
        else {
            return null;
        }
    };
    Object.defineProperty(Request.prototype, "params", {
        set: function (value) {
            this._params = value;
        },
        enumerable: true,
        configurable: true
    });
    return Request;
}());
exports.Request = Request;
var Response = /** @class */ (function () {
    function Response(request) {
        this.request = request;
        this.statusCode = 200;
        this.headers = {
            'Access-Control-Allow-Origin': request.origin,
            'Content-Type': 'application/json'
        };
    }
    Response.prototype.send = function (body) {
        //this.headers['Content-Type'] = 'application/json'
        var response = {
            statusCode: this.statusCode,
            body: JSON.stringify(body || {}),
            headers: this.headers
        };
        //console.log(response)
        return response;
    };
    return Response;
}());
exports.Response = Response;
//# sourceMappingURL=Router.js.map