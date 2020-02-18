import 'reflect-metadata'
import { Injector } from './DependencyInjection'
import getParamNames from './GetParamNames';

import { Router } from './Router'
export { Router, Response } from './Router'

export function LambdaRouter(options:any = {}) {
    return function(constructor:any) {
        let instance = Injector(constructor)
        let router:Router = Reflect.getMetadata('router', constructor)
        if (!router) {
            //console.log('Init router')
            router = new Router()
            //console.log('Routes>', router.routes)
            Reflect.defineMetadata('router', router, constructor)
        }
        let methods = Reflect.getMetadata('methods', constructor);
        //console.log('Methods', methods, router)
        (methods || []).forEach(method => {
            //console.log('Call ', method.type, method.route)
            let fnWrapper = async function(req, res) {
                res.headers = Object.assign(res.headers, options.headers, method.options.headers)
                //let response = await method.fn.apply(instance, method.args)
                let response = await method.fn.apply(instance, [req, res])
                return res.send(response)
            }
            //console.log('Call2', method.type, method.route, fnWrapper)
            router.registerMethod(method.type, method.route, fnWrapper)
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

function Route(type:string, resource:string, options:any) {
    return function(target, key:any, descriptor:PropertyDescriptor) {
        let methods = Reflect.getMetadata('methods', target.constructor)

        if (!methods) {
            methods = []
            Reflect.defineMetadata('methods', methods, target.constructor)
        }

        let route = (resource || key).replace(/^\/?(.*)/, '/$1')
        console.log('key', type, resource, key, route)
        methods.push({
            route,
            type: type,
            fn: RouteInjector(target, key, descriptor),
            options
        })


    }
}

function RouteInjector(target, key, descriptor) {
    let paramNames = getParamNames(target[key])
    var types = Reflect.getMetadata('design:paramtypes', target, key)
    //console.log('Key', target.constructor.name, key)

    let params = types.map((type, i) => {
        //console.log('TYPE', type.name)
        return { name: paramNames[i], type: type.name }
    })

    return async function(req, res) {
        let args = modifyArgs(params, { req, res })
        console.log('asd', target.constructor.prototype[key], key)
        return await target.constructor.prototype[key].apply(this, args)
    }
}

//Service decorator
export function Service(constructor:any) {
    Injector(constructor)
}

function modifyArgs(params, { req, res }) {
    var args:any = []
    var objects = {
        'Request': req,
        'Response': res,
        'Headers': req.headers,
        'Params': req.params,
        'Query': req.query,
        'Body': req.body,
        'Session': req.session,
        'Files': req.files
    }

    var paramValues = ['Number', 'String', 'Object', 'Boolean', 'Array']

    params.forEach((param, i) => {
        if (objects.hasOwnProperty(param.type)) {
            args.push(objects[param.type])
        } else if (paramValues.indexOf(param.type) > -1) {
            //Search param value
            let val = null
            //console.log('Search', param.name, param.type)
            if (req.param(param.name)) {
                val = req.param(param.name)
            } else if ((req.body || {}).hasOwnProperty(param.name)) {
                val = req.body[param.name]
            } else if ((req.query || {}).hasOwnProperty(param.name)) {
                val = req.query[param.name]
            } else if ((req.headers || {}).hasOwnProperty(param.name)) {
                val = req.headers[param.name]
            }

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
            args.push(val)
        } else {
            args.push(undefined)
        }
    })

    return args
}