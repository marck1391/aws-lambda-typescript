function parsePath(path) {
    let params = {}
    var x = path.split('/')
    x = x.map((segment, index) => {
        if (segment.startsWith(':')) {
            let paramName = segment.replace(':', '')
            params[paramName] = index
            return `([^\\/]+)`
        }
        return segment
    })
    return {
        re: new RegExp('^' + x.join('\\/') + '$', 'i'),
        params
    }
}

function parseCookies(cookie_header) {
    var cookies = {}
    cookie_header.split(';').forEach(function(cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/) || ['', '']
        cookies[parts[1].trim()] = decodeURIComponent((parts[2] || '').trim())
    })
    return cookies
}

export class Router {
    routes:any[]
    middlewares:any[]

    constructor() {
        this.routes = []
        this.middlewares = []
    }

    use(fn) {
        this.middlewares.push(fn)
    }

    get(path, fn) {
        this.registerMethod('GET', path, fn)
    }

    post(path, fn) {
        this.registerMethod('POST', path, fn)
    }

    delete(path, fn) {
        this.registerMethod('DELETE', path, fn)
    }

    put(path, fn) {
        this.registerMethod('PUT', path, fn)
    }

    options(path, fn) {
        this.registerMethod('OPTIONS', path, fn)
    }

    any(path, fn) {
        this.registerMethod('ANY', path, fn)
    }

    registerMethod(type, path, fn, middlewares:any[] = []) {
        let { re, params } = parsePath(path)
        this.routes.push({
            path,
            method: type,
            fn,
            params,
            regEx: re,
            middlewares
        })
    }

    async call(request) {
        request.path = request.path.replace(/(.+)\/$/, '$1') || '/'
        let response = (req, res) => { }
        let req = new Request(request)
        let res = new Response(req)
        let mws:any[] = []
        let found = this.routes.some(route => {
            if (route.regEx.exec(request.path) && (route.method == request.httpMethod || route.method == 'ANY')) {
                mws = route.middlewares || []
                req.params = route.params
                response = route.fn
                return true
            }
            return false
        })
        if (!found) {
            return res.send({ error: 'NOT_FOUND' })
        } else {
            for (let mw of this.middlewares) {
                let error = await (mw(req, res).catch(e => e))
                if (error) {
                    return error
                }
                /*if (!done) {
                    return res.send({ error: 'NOT_ALLOWED' })
                } else if (typeof done !== 'boolean') {
                    return done
                }*/
            }
            for (let mw of mws) {
                let error = await mw(req, res).catch(e => e)
                if (error) {
                    return error
                }
                /*if (!done) {
                    return res.send({ error: 'NOT_ALLOWED' })
                } else if (typeof done !== 'boolean') {
                    return done
                }*/
            }
            return response(req, res)
        }
    }
}

export class Request {
    [prop:string]:any
    url:string
    hostname:string
    protocol:string
    headers:{ [param:string]:string }
    cookies:{ [param:string]:string }
    body:any
    query:any
    method:string
    _request:any

    private _params:any

    constructor(request) {
        this._request = request
        this.url = request.path
        this.headers = request.headers || {}
        this.hostname = this.headers['Host']
        this.host = this.headers['Host']
        this.origin = this.headers['Origin'] || this.headers['origin']
        var body = {}
        try {
            body = JSON.parse(request.body || "{}")
        } catch (e) { }
        this.body = body
        this.query = request.queryStringParameters
        this.cookies = parseCookies(this.headers['Cookie'] || '')
        this.protocol = request.headers['X-Forwarded-Proto']
        this.method = request.httpMethod
    }

    param(name) {
        let x = this.url.split('/')
        if (this._params.hasOwnProperty(name)) {
            let index = this._params[name]
            if (index < 0 || index > this.url.length - 1) return null
            return x[index]
        } else {
            return null
        }
    }

    set params(value) {
        this._params = value
    }
}

export class Response {
    request:Request
    statusCode:number
    headers:{ [param:string]:string }

    constructor(request) {
        this.request = request
        this.statusCode = 200
        this.headers = {
            'Access-Control-Allow-Origin': request.origin,
            'Content-Type': 'application/json'
        }
    }

    send(body) {
        //this.headers['Content-Type'] = 'application/json'
        let response = {
            statusCode: this.statusCode,
            body: JSON.stringify(body || {}),
            headers: this.headers
        }
        //console.log(response)
        return response
    }
}