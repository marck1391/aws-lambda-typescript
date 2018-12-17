"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var DependencyInjection_1 = require("./DependencyInjection");
var GetParamNames_1 = __importDefault(require("./GetParamNames"));
var Router_1 = require("./Router");
var Router_2 = require("./Router");
exports.Router = Router_2.Router;
exports.Response = Router_2.Response;
function LambdaRouter(options) {
    if (options === void 0) { options = {}; }
    return function (constructor) {
        var instance = DependencyInjection_1.Injector(constructor);
        var router = Reflect.getMetadata('router', constructor);
        if (!router) {
            //console.log('Init router')
            router = new Router_1.Router();
            //console.log('Routes>', router.routes)
            Reflect.defineMetadata('router', router, constructor);
        }
        var methods = Reflect.getMetadata('methods', constructor);
        (methods || []).forEach(function (method) {
            //console.log('Call ', method.type, method.route)
            var fnWrapper = function (req, res) {
                return __awaiter(this, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                res.headers = Object.assign(res.headers, options.headers, method.options.headers);
                                return [4 /*yield*/, method.fn.apply(instance, [req, res])];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, res.send(response)];
                        }
                    });
                });
            };
            router.registerMethod(method.type, method.route, fnWrapper);
        });
    };
}
exports.LambdaRouter = LambdaRouter;
function Post(resource, options) {
    if (resource === void 0) { resource = ''; }
    if (options === void 0) { options = {}; }
    return Route('POST', resource, options);
}
exports.Post = Post;
function Get(resource, options) {
    if (resource === void 0) { resource = ''; }
    if (options === void 0) { options = {}; }
    return Route('GET', resource, options);
}
exports.Get = Get;
function Put(resource, options) {
    if (options === void 0) { options = {}; }
    return Route('PUT', resource, options);
}
exports.Put = Put;
function Delete(resource, options) {
    if (options === void 0) { options = {}; }
    return Route('DELETE', resource, options);
}
exports.Delete = Delete;
function Route(type, resource, options) {
    return function (target, key, descriptor) {
        var methods = Reflect.getMetadata('methods', target.constructor);
        if (!methods) {
            methods = [];
            Reflect.defineMetadata('methods', methods, target.constructor);
        }
        methods.push({
            route: (resource || key).replace(/^\/?(.*)/, '/$1'),
            type: type,
            fn: RouteInjector(target, key, descriptor),
            options: options
        });
    };
}
function RouteInjector(target, key, descriptor) {
    var paramNames = GetParamNames_1.default(target[key]);
    var types = Reflect.getMetadata('design:paramtypes', target, key);
    //console.log('Key', target.constructor.name, key)
    var params = types.map(function (type, i) {
        //console.log('TYPE', type.name)
        return { name: paramNames[i], type: type.name };
    });
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = modifyArgs(params, { req: req, res: res });
                        return [4 /*yield*/, target.constructor.prototype[key].apply(this, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
}
//Service decorator
function Service(constructor) {
    DependencyInjection_1.Injector(constructor);
}
exports.Service = Service;
function modifyArgs(params, _a) {
    var req = _a.req, res = _a.res;
    var args = [];
    var objects = {
        'Request': req,
        'Response': res,
        'Headers': req.headers,
        'Params': req.params,
        'Query': req.query,
        'Body': req.body,
        'Session': req.session,
        'Files': req.files
    };
    var paramValues = ['Number', 'String', 'Object', 'Boolean', 'Array'];
    params.forEach(function (param, i) {
        if (objects.hasOwnProperty(param.type)) {
            args.push(objects[param.type]);
        }
        else if (paramValues.indexOf(param.type) > -1) {
            //Search param value
            var val = null;
            //console.log('Search', param.name, param.type)
            if (req.param(param.name)) {
                val = req.param(param.name);
            }
            else if ((req.body || {}).hasOwnProperty(param.name)) {
                val = req.body[param.name];
            }
            else if ((req.query || {}).hasOwnProperty(param.name)) {
                val = req.query[param.name];
            }
            else if ((req.headers || {}).hasOwnProperty(param.name)) {
                val = req.headers[param.name];
            }
            /*
            //Param type validation
            if(param.type == 'Number' && !isNaN(val)) {
                return args.push(parseInt(val))
            } else if(param.type == 'Array' && Array.isArray(val)) {
                return args.push(val)
            } else if(param.type == 'Boolean' && (val == 'false' || val == 'true')) {
                return args.push(val == 'false' ? false : val == 'true' ? true : val)
            } else if(param.type == 'Object') {
                return args.push(val)
            } else if(param.type.toLowerCase() != typeof val) {
                //TODO: HTTP Error Code: 412 Precondition Failed
                throw Error(`Param '${param.name}' is not of type ${param.type}`)
            }*/
            args.push(val);
        }
        else {
            args.push(undefined);
        }
    });
    return args;
}
//# sourceMappingURL=index.js.map