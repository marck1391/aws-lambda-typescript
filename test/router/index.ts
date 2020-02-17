import { LambdaRouter, Post, Get, Router, Response } from '../../lib/index'

@LambdaRouter({
    headers: {
        'Content-Type': 'application/json'
    }
})
class App {
    data:any = {}
    constructor() {
        this.data.test2 = 'Testing'
    }

    @Get('/task/:id')
    //id = param, Host = header, res = Response object
    async test(id:string, Host:string, res:Response) {
        delete res.headers['Access-Control-Allow-Origin']
        console.log('Test Function', id, Host)
        console.log('Instance data', this.data.test2)
        return { success: true }
    }

    @Get()
    task() {
        return 'Welcome!'
    }
}

let router:Router = Reflect.getMetadata('router', App)

let start = Date.now()
import { request } from './testdata'
let response = router.call(request)
response.then((r:any) => {
    console.log('Response', r, 'ms', Date.now() - start)
})