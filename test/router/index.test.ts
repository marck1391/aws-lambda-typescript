import {describe, expect, test, beforeAll} from '@jest/globals';
import { LambdaRouter, Post, Get, Router, Middleware } from '../../lib/index'
import { Server } from 'http'
import fetch from 'node-fetch'
import express, {Express} from 'express'
import App from './App';

let server:Server

beforeAll(()=>{
    let router:Router = Reflect.getMetadata('router', App)
    const app:Express = express()
    app.use(router)
    server = app.listen(3000)
}, 108000)


describe('LambdaRouter', () => {
  test('Router Get /', async () => {
    let {hello} = await fetch('http://localhost:3000/').then(res=>res.json())
    
    expect(hello).toBe('world!');
  });
});

afterAll(()=>{
    server.close()
})