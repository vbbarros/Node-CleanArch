import { AccessToken } from '@/domain/models/acces-token'
import { AuthenticationError } from '@/domain/errors/authentication'

export interface FacebookAuthentication {
    perform: (params : FacebookAuthentication.Params ) => Promise<FacebookAuthentication.Result>
}
export namespace FacebookAuthentication {
    export type Params = {
        token: string
    } 

    export type Result = {
        result: AccessToken | AuthenticationError
    }
}


