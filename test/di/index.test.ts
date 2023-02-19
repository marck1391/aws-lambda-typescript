import {describe, expect, test} from '@jest/globals';
import { LambdaRouter } from '../../lib/index'
import { MyService } from './MyService'
import {AnotherService} from './AnotherService';

@LambdaRouter()
class App {
	constructor(private other:AnotherService, private service:MyService){
		//console.log('Injected Service>', service.constructor.name)
		let user = this.service.getUser()
		//console.log('MyService.getUser', user)
		//console.log('Injected Service>', other.constructor.name)
		let test = other.data.test
		//console.log('OtherService.data.test', test)
		//console.log('Getting another data', other.data)
		
	}
}

describe('Dependency injection', () => {
  test('AnotherService getUser', () => {
    let app:any = Reflect.getMetadata('instance', App)
    const user = app.other.getUser()
    expect(user.name).toBe('M4rk');
  });
  test('MyService modifies AnotherService', () => {
    let app:any = Reflect.getMetadata('instance', App)
    const data = app.other.data
    expect(data.prop).toBe('Yeah');
  });
});