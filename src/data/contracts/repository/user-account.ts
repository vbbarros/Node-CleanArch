
export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    name?: string
    id: string
    facebookId: string
    email: string
  }
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }
}

export interface UpdateFacebookAccountRepository {
  updateFromFacebook: (params: UpdateFacebookAccountRepository.Params) => Promise<void>
}

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    name: string
    id: string
    facebookId: string
  }
}
