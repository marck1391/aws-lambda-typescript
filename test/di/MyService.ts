import { Service } from '../../lib/index'
import { AnotherService } from './AnotherService'

@Service
export class MyService{
    data:any = {}
    constructor(private other:AnotherService){
        //console.log('Init service')
        this.data.test = 'Testing'
        //console.log('Injected', other.constructor.name)
        //console.log('Getting AnotherService from MyService')
        other.data.prop = 'Yeah'
    }
    getUser(){
        return {
            name: 'M4rk',
            email: 'asd@asd.com'
        }
    }
}