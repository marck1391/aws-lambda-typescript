import 'reflect-metadata'

function ClassInjector(constructor) {
	return ['1', '2']
}

export function Router() {
	return function(constructor:any) {
		let instance = Reflect.getMetadata('instance', constructor)
		if (!instance) {
			let services = ClassInjector(constructor)
			instance = new constructor()
		}
	}
}

export function Post(resource:string) {
	return function post(target, key:any, descriptor:PropertyDescriptor) {
		var types = Reflect.getMetadata('design:paramtypes', target, key)
		console.log('Key', target, key, descriptor)
		types.forEach(type => {
			console.log(type.name)
		})
	}
}

export function Body(target, propertyKey:string, index:number):any {
	console.log('Body', target, propertyKey, index)
}