import {describe, expect, test} from '@jest/globals';
import { LambdaRouter, Post, Get, Router, Response, Middleware } from '../../lib/index'
import { request } from './testdata'

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

    @Get('/')
    task() {
        return 'Welcomes!'
    }

    @Get('/task/:id')
    //id = param, Host = header, res = Response object
    async test(id:string, Host:string, res:Response) {
        delete res.headers['Access-Control-Allow-Origin']
        console.log('Test Function', id, Host)
        console.log('Instance data', this.data.test2)
        return { success: true }
    }
}

let router:Router = Reflect.getMetadata('router', App)

describe('LambdaRouter', () => {
  test('Router Get /', async () => {
    let response = await router.call(request)
    expect(JSON.parse(response.body)).toBe('Welcomes!');
  });
});