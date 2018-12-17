"use strict";
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
        instance = new (constructor.bind.apply(constructor, [void 0].concat(args)))();
        Reflect.defineMetadata('instance', instance, constructor);
    }
    return instance;
}
exports.Injector = Injector;
//# sourceMappingURL=DependencyInjection.js.map