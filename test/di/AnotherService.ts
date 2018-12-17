import {Service} from '../../lib/index'

@Service
export class AnotherService {
    data: any = {test: 20}
    getUser() {
        return {
            name: 'M4rk',
            email: 'asd@asd.com'
        }
    }
}