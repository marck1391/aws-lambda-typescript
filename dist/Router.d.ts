export declare class Router {
    routes: any[];
    middlewares: any[];
    constructor();
    use(fn: any): void;
    get(path: any, fn: any): void;
    post(path: any, fn: any): void;
    delete(path: any, fn: any): void;
    put(path: any, fn: any): void;
    options(path: any, fn: any): void;
    any(path: any, fn: any): void;
    registerMethod(type: any, path: any, fn: any): void;
    call(request: any): Promise<any>;
}
declare class Request {
    url: string;
    hostname: string;
    protocol: string;
    headers: {
        [param: string]: string;
    };
    cookies: {
        [param: string]: string;
    };
    body: any;
    query: any;
    private _params;
    constructor(request: any);
    param(name: any): string | null;
    params: any;
}
export declare class Response {
    request: Request;
    statusCode: number;
    headers: {
        [param: string]: string;
    };
    constructor(request: any);
    send(body: any): {
        statusCode: number;
        body: string;
        headers: {
            [param: string]: string;
        };
    };
}
export {};
