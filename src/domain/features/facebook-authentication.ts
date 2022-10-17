import { AccessToken } from '@/domain/models/acces-token'
import { AuthenticationError } from '@/domain/errors/authentication'

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}
export namespace FacebookAuthentication {
  export interface Params {
    token: string
  }

  export interface Result {
    result: AccessToken | AuthenticationError
  }
}
