import 'reflect-metadata'
import { Injector } from './DependencyInjection'
import getParamNames from './GetParamNames';

//import { Router } from './Router'
//export { Router, Request, Response } from './Router'
import {Request, RequestHandler, Response, Router} from 'express'
export {Router} from 'express'

type Middleware = {
    key:string,
    fn:Function
}

export function LambdaRouter(options:any = {}) {
    return function(constructor:any) {
        let instance:any = Injector(constructor)
        let router:Router = Reflect.getMetadata('router', constructor)
        if (!router) {
            //console.log('Init router')
            router = Router()
            //console.log('Routes>', router.routes)
            Reflect.defineMetadata('router', router, constructor)
        }
        let methods:RouteMethod[] = Reflect.getMetadata('methods', constructor);
        (options.middlewares || []).forEach(mw => {
            router.use(mw)
        });
        //console.log('Methods', methods);
        (methods || []).forEach(method => {
            //console.log('Call ', method.type, method.route)
            let fnWrapper = async function(req:Request, res:Response) {
                const headers:{[index:string]:string} = Object.assign({}, options.headers, method.options.headers)
                res.set(headers)
                //let response = await method.fn.apply(instance, method.args)
                let response:any = await method.fn.apply(instance, [req, res])
                return res.send(response)
            }
            //console.log('Call2', method.type, method.route, fnWrapper)
            const mws:Middleware[] = Reflect.getMetadata('mws', constructor) || []
            const args:any[] = [mws.filter(mw => mw.key === method.key).map(mw => mw.fn), fnWrapper]
            router[method.type.toLowerCase()]( method.route, ...args)
        })
    }
}

export function Post(resource:string = '', options:any = {}) {
    return Route('POST', resource, options)
}

export function Get(resource:string = '', options:any = {}) {
    return Route('GET', resource, options)
}

export function Put(resource:string, options:any = {}) {
    return Route('PUT', resource, options)
}

export function Delete(resource:string, options:any = {}) {
    return Route('DELETE', resource, options)
}

export function Middleware(...middlewares:RequestHandler[]) {
    return function(target, key:any, descriptor:PropertyDescriptor) {
        let mws:Middleware[] = Reflect.getMetadata('mws', target.constructor)
        if (!mws) {
            mws = []
            Reflect.defineMetadata('mws', mws, target.constructor)
        }
        // console.log({target, key})
        // var types = Reflect.getMetadata('design:paramtypes', target, key)
        //     console.log({types})
        mws.push(...middlewares.map(mw=>{
            
            return {key, fn: mw}
        }))
    }
}

type RouteMethod = {
    key: string,
    route: string,
    type: string,//GET,POST,...
    fn: Function,
    options:any
}

function Route(type:string, resource:string, options:any) {
    return function(target:any, key:any, descriptor:PropertyDescriptor) {
        let methods:RouteMethod[] = Reflect.getMetadata('methods', target.constructor)

        if (!methods) {
            methods = []
            Reflect.defineMetadata('methods', methods, target.constructor)
        }

        let route:string = (resource || key).replace(/^\/?(.*)/, '/$1')

        methods.push({
            key,
            route,
            type: type,
            fn: RouteInjector(target, key, descriptor),
            options
        })
    }
}

type Param = {
    name: string,
    type: string
}

export function RouteInjector(target:Function, key:string, descriptor:PropertyDescriptor) {
    let paramNames = getParamNames(target[key])
    var types = Reflect.getMetadata('design:paramtypes', target, key)
    //console.log('Key', target.constructor.name, key)
    //console.log('Types', target, key, types)

    let params:Param[] = types.map((type, i) => {
        //console.log('TYPE', type.name)
        return { name: paramNames[i], type: type.name }
    })

    return async function(req:Request, res:Response) {
        let args = modifyArgs(params, req, res)
        return await target.constructor.prototype[key].apply(this, args)
    }
}

//Service decorator
export function Service(constructor:any) {
    Injector(constructor)
}

function modifyArgs(params:Param[], req:Request, res:Response):any[] {
    var args:any[] = []
    var objects = {
        'Request': req,
        'Response': res,
        'Headers': req.headers,
        'Params': req.params,
        'Query': req.query,
        'Body': req.body,
        //'Session': req.session,
        //'Files': req.files
    }

    var paramValues = ['Number', 'String', 'Object', 'Boolean', 'Array']
    
    params.forEach((param) => {
        let val:any = objects[param.type]||paramValues.includes(param.type)?(
            req.params[param.name]||req.body?.[param.name]||req.query[param.name]||req.headers[param.name]
        ):undefined

        args.push(val)
        /*
        //Param type validation
        if(param.type == 'Number' && !isNaN(val)) {
            return args.push(parseInt(val))
        } else if(param.type == 'Array' && Array.isArray(val)) {
            return args.push(val)
        } else if(param.type == 'Boolean' && (val == 'false' || val == 'true')) {
            return args.push(val == 'false' ? false : val == 'true' ? true : val)
        } else if(param.type == 'Object') {
            return args.push(val)
        } else if(param.type.toLowerCase() != typeof val) {
            //TODO: HTTP Error Code: 412 Precondition Failed
            throw Error(`Param '${param.name}' is not of type ${param.type}`)
        }*/
    })

    return args
}