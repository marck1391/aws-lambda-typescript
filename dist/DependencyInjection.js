"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Dependency injection
function Injector(constructor) {
    var instance = Reflect.getMetadata('instance', constructor);
    if (!instance) {
        var services = Reflect.getMetadata('design:paramtypes', constructor);
        //Return null args for non-constructor class
        //console.log('DI >', constructor.name)
        var args = (services || []).map(function (service) {
            var serviceInstance = Reflect.getMetadata('instance', service);
            return serviceInstance;
        });
        instance = new (constructor.bind.apply(constructor, __spreadArrays([void 0], args)))();
        Reflect.defineMetadata('instance', instance, constructor);
    }
    return instance;
}
exports.Injector = Injector;
//# sourceMappingURL=DependencyInjection.js.map