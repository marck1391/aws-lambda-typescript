import { LambdaRouter, Get, Middleware  } from '../../lib/index'

@LambdaRouter({
    headers: {
        'Content-Type': 'application/json'
    }
})
export default class App {
    data:any = {}
    constructor() {
        this.data.test2 = 'Testing'
    }

    @Get('/')
    task(hello:string) {
        return {
            hello: 'world!'
        }
    }

    @Get('/task/:id')
    //id = param, Host = header, res = Response object
    async test(id:string, Host:string, res:any) {
        delete res.headers['Access-Control-Allow-Origin']
        console.log('Test Function', id, Host)
        console.log('Instance data', this.data.test2)
        return { success: true }
    }
}