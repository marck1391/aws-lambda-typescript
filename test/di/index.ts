import { Router, Post, LambdaRouter } from '../../lib/index'
import { MyService } from './MyService'
import {AnotherService} from './AnotherService';

@LambdaRouter()
class App {
	constructor(private other:AnotherService, private service:MyService){
		console.log('Injected Service>', service.constructor.name)
		let user = service.getUser()
		console.log('MyService.getUser', user)
		console.log('Injected Service>', other.constructor.name)
		let test = other.data.test
		console.log('OtherService.data.test', test)
		console.log('Getting another data', other.data)
		
	}
}