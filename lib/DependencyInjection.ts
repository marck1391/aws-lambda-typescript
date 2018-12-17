//Dependency injection
export function Injector<T>(constructor: any):T {
    let instance = Reflect.getMetadata('instance', constructor)
    if(!instance) {
        let services = Reflect.getMetadata('design:paramtypes', constructor)
        //Return null args for non-constructor class
        //console.log('DI >', constructor.name)
        let args = (services || []).map(service => {
            let serviceInstance = Reflect.getMetadata('instance', service)
            return serviceInstance
        })
        instance = new constructor(...args)
        Reflect.defineMetadata('instance', instance, constructor)
    }
    return instance
}