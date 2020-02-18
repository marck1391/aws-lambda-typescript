import 'reflect-metadata';
export { Router, Response } from './Router';
export declare function LambdaRouter(options?: any): (constructor: any) => void;
export declare function Post(resource?: string, options?: any): (target: any, key: any, descriptor: PropertyDescriptor) => void;
export declare function Get(resource?: string, options?: any): (target: any, key: any, descriptor: PropertyDescriptor) => void;
export declare function Put(resource: string, options?: any): (target: any, key: any, descriptor: PropertyDescriptor) => void;
export declare function Delete(resource: string, options?: any): (target: any, key: any, descriptor: PropertyDescriptor) => void;
export declare function Middleware(...middlewares: any[]): (target: any, key: any, descriptor: PropertyDescriptor) => void;
export declare function Service(constructor: any): void;
