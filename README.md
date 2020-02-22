
# aws-lambda-typescript
Typescript Router for AWS API Gateway (+Proxy) > AWS Lambda 

```bash
npm install --save aws-lambda-ts
```
---

### @LambdaRouter
```typescript
import  {
	LambdaRouter,
	Response,
	Middleware,
	Get,
	Post,
	Body
}  from  'aws-lambda-ts'

import SomeService from './SomeService'

@LambdaRouter()
class  Tasks  {
	// Dependency Injection
	constructor(private service:SomeService)  {
	}
	
	@Get('/')//Route for GET /tasks
	...
	
	@Post('/')//Route for POST /tasks
	...
	
	@Get()//Whitout argument
	list(){}//Route for GET /tasks/list
	
	@Get('/')
	index(req:Request, res:Response, body:Body, params:Params, headers:Headers)  {
		console.log('Request object', req)
		console.log('Response object', res)
		...
		return  'Welcome!'
	}
	
	@Get('/task/:id')// GET /tasks/task/:id
	async getTask(id:string, Host:string)  {
		console.log('Request:Param', id)
		console.log('Request:Header', Host)
		return  { success:  true  }
	}

	@Post('/')
	//Destructuring
	addTask(body:Body, {title, description}:Body){
		console.log(title, description)
	}

	//Test Service
	@Get()// GET /tasks/test
	test(){
		return this.service.someMethod('testing')
	}
}
```

### @Service
```typescript
import { Service } from 'aws-lambda-ts'

@Service
export class SomeService{
	constructor(){}
	
	someMethod(message){
		return message
	}
}
```
---
### Parse AWS Gateway {+proxy} event
```typescript
import { Router } from 'aws-lambda-ts'
import { Tasks } from './Tasks'

let tasksRouter:Router = Reflect.getMetadata('router', Tasks)
let routes = [
	{ path: '/tasks', router: tasksRouter },
]

export async function handler(event, context){
	let router = app
	routes.some(route => {
		if(event.path.startsWith(route.path)){
			event.path = event.path.replace(route.path, '')
			router = route.router
			return true
		}
		return false
	})
	
	let response = await router.call(event).catch(e => {
		return {
			statusCode: 400,
			body: JSON.stringify({ success: false, error: e.message }),
		}
	})
	
	return response
}
```